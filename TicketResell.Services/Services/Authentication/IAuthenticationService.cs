using TicketResell.Repositories.Core.Dtos.Authentication;

namespace TicketResell.Services.Services;

public interface IAuthenticationService
{
    Task<ResponseModel> RegisterAsync(RegisterDto registerDto);
    Task<ResponseModel> PutOtpAsync(string data);
    Task<ResponseModel> SetPasswordAsync(string userId, string password, string passwordSetupToken);
    Task<ResponseModel> LoginAsync(LoginDto loginDto);
    Task<ResponseModel> LogoutAsync(string userId);

    Task<ResponseModel> LoginWithAccessKeyAsync(string userId, string accessKey);
    Task<ResponseModel> LoginWithAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto);
    Task<string> CreatePasswordKeyAsync(string userId);
    Task<ResponseModel> CheckPassswordKeyAsync(string passwordKey, string userId, string newPassword);


    Task<ResponseModel> LoginWithGoogleAsync(GoogleUserInfoDto googleUser);

    Task<bool> ValidateAccessKeyAsync(string userId, string accessKey);
    Task<bool> ValidateAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto);

    Task<ResponseModel> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
}