using System.Security.Cryptography;
using AutoMapper;
using Newtonsoft.Json;
using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using StackExchange.Redis;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Crypto;

namespace TicketResell.Services.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly IAppLogger _logger;
    private readonly IMapper _mapper;
    private readonly IConnectionMultiplexer _redis;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidatorFactory _validatorFactory;

    public AuthenticationService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidatorFactory validatorFactory,
        IConnectionMultiplexer redis,
        IServiceProvider serviceProvider, IAppLogger logger)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
        _redis = redis;
    }


    public async Task<ResponseModel> RegisterAsync(RegisterDto registerDto)
    {
        if (string.IsNullOrEmpty(registerDto.OTP))
            return ResponseModel.BadRequest("Registration failed", "No OTP provided");

        _logger.LogError(registerDto.OTP);
        _logger.LogError(registerDto.UserId);
        var cacheOtp = await GetCachedAccessKeyAsync("email_verification", registerDto.UserId);
        _logger.LogError(cacheOtp);
        if (!cacheOtp.HasValue)
        {
            _logger.LogError("test");
            return ResponseModel.BadRequest("Registration failed", "Otp not found for user");
        }

        if (cacheOtp != registerDto.OTP)
        {
            _logger.LogError("test2");
            return ResponseModel.BadRequest("Registration failed", "OTP provided is invalid");
        }

        var user = _mapper.Map<User>(registerDto);
        user.UserId = registerDto.UserId;
        user.Fullname = registerDto.Username;
        var validator = _validatorFactory.GetValidator<User>();
        var validationResult = await validator.ValidateAsync(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        if (await _unitOfWork.UserRepository.GetByIdAsync(user.UserId ?? string.Empty) != null)
        {
            _logger.LogError("Email exist");
            return ResponseModel.BadRequest("Registration failed", "Email already exists");
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        user.CreateDate = DateTime.UtcNow;
        user.Status = 1;

        await _unitOfWork.UserRepository.CreateAsync(user);
        await _unitOfWork.CompleteAsync();

        return ResponseModel.Success("User registered successfully", registerDto);
    }


    public async Task<ResponseModel> PutOtpAsync(string data)
    {
        try
        {
            var decryptedData = new CryptoService().Decrypt(data);
            var splitedData = decryptedData.Split("|");
            if (await _unitOfWork.UserRepository.GetByIdAsync(splitedData[0]) != null)
            {
                await CacheAccessKeyAsync("email_verification", splitedData[0], splitedData[1],
                    TimeSpan.FromMinutes(5));
                return ResponseModel.Success("Cached", "OTP cache done");
            }
        }
        catch (Exception ex)
        {
            return ResponseModel.BadRequest("Decryption failed");
        }

        return ResponseModel.Error("Something failed");
        ;
    }

    public async Task<ResponseModel> LoginAsync(LoginDto loginDto)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(loginDto.Gmail);
        if (user == null) return ResponseModel.BadRequest("Login failed", "Invalid email or password");

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            return ResponseModel.BadRequest("Login failed", "Password wrong");

        if(user.Status == 0)
            return ResponseModel.BadRequest("Login failed", "Account is locked");

        var cachedAccessKey = await GetCachedAccessKeyAsync(user.UserId);

        if (cachedAccessKey.IsNullOrEmpty) cachedAccessKey = GenerateAccessKey();

        if (cachedAccessKey.HasValue) await CacheAccessKeyAsync(user.UserId, cachedAccessKey!);

        var response = new LoginInfoDto
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = cachedAccessKey!
        };

        return ResponseModel.Success("Login successful", response);
    }

    public async Task<ResponseModel> LogoutAsync(string userId)
    {
        await RemoveCachedAccessKeyAsync(userId);
        return ResponseModel.Success("Logout successful");
    }

    public async Task<ResponseModel> LoginWithAccessKeyAsync(string userId, string accessKey)
    {
        if (!await ValidateAccessKeyAsync(userId, accessKey)) return ResponseModel.BadRequest("Access key failed.");

        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null) return ResponseModel.NotFound("User not found.");

        var cachedAccessKey = await GetCachedAccessKeyAsync(user.UserId);

        if (cachedAccessKey.IsNullOrEmpty) cachedAccessKey = GenerateAccessKey();

        if (cachedAccessKey.HasValue) await CacheAccessKeyAsync(user.UserId, cachedAccessKey!);

        var response = new LoginInfoDto
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = cachedAccessKey!
        };

        return ResponseModel.Success("Login successful", response);
    }

    public async Task<ResponseModel> LoginWithAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto)
    {
        return await LoginWithAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
    }

  public async Task<ResponseModel> LoginWithGoogleAsync(GoogleUserInfoDto googleUser)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(googleUser.Email);
        if (user == null)
        {
            user = new User
            {
                UserId = googleUser.Email,
                Username = googleUser.Given_Name,
                Fullname = googleUser.Name,
                Password = null,
                Gmail = googleUser.Email,
                CreateDate = DateTime.UtcNow,
                Status = 1,
                Verify = 1
            };

            await _unitOfWork.UserRepository.CreateAsync(user);
            await _unitOfWork.CompleteAsync();
        }
        
        if (string.IsNullOrEmpty(user.Password))
        {
            var accessKey = await GetCachedAccessKeyAsync("password_setup", user.UserId);
            if (!accessKey.HasValue || accessKey.IsNullOrEmpty)
            {
                accessKey = GenerateAccessKey();
                await CacheAccessKeyAsync("password_setup", user.UserId, accessKey!, TimeSpan.FromHours(1));
                await CacheAccessKeyAsync(user.UserId, accessKey!);
            }

            var response = new PasswordSetupDto
            {
                UserId = user.UserId,
                PasswordSetupToken = accessKey!
            };

            return ResponseModel.NeedsPasswordSetup("False", response);
        }

        var cachedAccessKey = await GetCachedAccessKeyAsync(user.UserId);
        if (cachedAccessKey.IsNullOrEmpty)
        {
            cachedAccessKey = GenerateAccessKey();
            await CacheAccessKeyAsync(user.UserId, cachedAccessKey!);
        }

        var loginResponse = new LoginInfoDto
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = cachedAccessKey!
        };

        return ResponseModel.Success("Login successful", loginResponse);
    }

    public async Task<bool> ValidateAccessKeyAsync(string userId, string accessKey)
    {
        var cachedAccessKey = await GetCachedAccessKeyAsync(userId);

        if (cachedAccessKey.IsNullOrEmpty || !cachedAccessKey.HasValue)
            return false;

        return cachedAccessKey == accessKey;
    }

    public async Task<bool> ValidateAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto)
    {
        return await ValidateAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
    }

    public async Task<ResponseModel> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null) return ResponseModel.NotFound("User not found");

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
            return ResponseModel.BadRequest("Password change failed", "Current password is incorrect");

        user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.CompleteAsync();

        return ResponseModel.Success("Password changed successfully");
    }


    public async Task<string> CreatePasswordKeyAsync(string userId)
    {
        // Check if the user ID is valid
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));

        // Fetch the user by ID
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null)
        {
            // Optionally log this event
            Console.WriteLine($"User with ID {userId} not found.");
            return null; // or throw an exception if you want to enforce existence
        }

        // Generate and hash the access key
        var key = GenerateAccessKey();
        var hashedKey = BCrypt.Net.BCrypt.HashPassword(key);

        // Return the plain access key to send in the email
        return key; // This key can be sent via email
    }

    public async Task<ResponseModel> CheckPassswordKeyAsync(string passwordKey, string userId, string newPassword)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null) return ResponseModel.NotFound("User not found");
        var key = await GetCachedAccessKeyAsync("forgot_password", userId);
        if (key == passwordKey)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _unitOfWork.UserRepository.Update(user);
            await _unitOfWork.CompleteAsync();
            return ResponseModel.Success("Password changed successfully");
        }

        return ResponseModel.Error("Key is not found or expired");
    }

    public async Task<ResponseModel> ConfirmEmailAsync(string userId, string token)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null) return ResponseModel.NotFound("User not found");

        if (user.Verify == 1) return ResponseModel.BadRequest("Email already verified");

        var db = _redis.GetDatabase();
        var storedTokenJson = await db.StringGetAsync($"email_verification:{userId}");

        if (!storedTokenJson.HasValue) return ResponseModel.BadRequest("Invalid or expired token");

        var storedToken =
            JsonConvert.DeserializeAnonymousType(storedTokenJson, new { Token = "", Expiration = DateTime.UtcNow });

        if (storedToken.Token != token || storedToken.Expiration < DateTime.UtcNow)
            return ResponseModel.BadRequest("Invalid or expired token");

        user.Verify = 1;
        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.CompleteAsync();

        await db.KeyDeleteAsync($"email_verification:{userId}");

        return ResponseModel.Success("Email verified successfully");
    }

    private string GenerateAccessKey()
    {
        var key = new byte[32];
        using (var generator = RandomNumberGenerator.Create())
        {
            generator.GetBytes(key);
        }

        return Convert.ToBase64String(key);
    }


    private async Task CacheAccessKeyAsync(string cacheName, string userId, string cacheKey, TimeSpan timeSpan)
    {
        var db = _redis.GetDatabase();
        await db.StringSetAsync($"{cacheName}:{userId}", cacheKey, timeSpan);
    }

    private async Task CacheAccessKeyAsync(string userId, string accessKey)
    {
        await CacheAccessKeyAsync("access_key", userId, accessKey, TimeSpan.FromHours(24));
    }


    private async Task<RedisValue> GetCachedAccessKeyAsync(string cacheName, string userId)
    {
        var db = _redis.GetDatabase();
        return await db.StringGetAsync($"{cacheName}:{userId}");
    }

    private async Task<RedisValue> GetCachedAccessKeyAsync(string userId)
    {
        return await GetCachedAccessKeyAsync("access_key", userId);
    }

    private async Task RemoveCachedAccessKeyAsync(string cacheName, string userId)
    {
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync($"{cacheName}:{userId}");
    }

    private async Task RemoveCachedAccessKeyAsync(string userId)
    {
        await RemoveCachedAccessKeyAsync("access_key", userId);
    }

    public async Task<ResponseModel> SetPasswordAsync(string userId, string password, string passwordSetupToken)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null)
            return ResponseModel.NotFound("User not found");

        var cachedToken = await GetCachedAccessKeyAsync("password_setup", userId);
        if (cachedToken != passwordSetupToken)
            return ResponseModel.BadRequest("Invalid or expired password setup token");

        user.Password = BCrypt.Net.BCrypt.HashPassword(password);
        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.CompleteAsync();
        await RemoveCachedAccessKeyAsync("password_setup", userId);
        return ResponseModel.Success("Password set successfully.");
    }
}