using AutoMapper;
using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;
using IValidatorFactory = Repositories.Core.Validators.IValidatorFactory;

namespace TicketResell.Services.Services;

public class UserService : IUserService
{
    private readonly IAppLogger _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    private readonly IValidatorFactory _validatorFactory;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory, IAppLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _validatorFactory = validatorFactory;
    }

    public async Task<ResponseModel> CreateUserAsync(UserCreateDto dto, bool saveAll)
    {
        IValidator<User?> validator = _validatorFactory.GetValidator<User>();
        User? newUser = _mapper.Map<User>(dto);
        var validationResult = validator.Validate(newUser);
        if (!validationResult.IsValid)
        {
            return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        }
        newUser.CreateDate = DateTime.UtcNow;
        await _unitOfWork.UserRepository.CreateAsync(newUser);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully created user: {dto.Username}");
    }
    public async Task<ResponseModel> CheckUserRole(string userId, string roleId)
    {
        bool hasRole = await _unitOfWork.UserRepository.HasRoleAsync(userId, roleId);
        if (hasRole)
        {
            ResponseModel.Success("User has role!", hasRole);
        }

        return ResponseModel.NotFound("User dont have role", hasRole);
    }
    public async Task<ResponseModel> GetAllUser()
    {
        var user = await _unitOfWork.UserRepository.GetAllAsync();

        var users = _mapper.Map<IEnumerable<UserReadDto>>(user);
        return ResponseModel.Success($"Successfully get all user", users);
    }

    public async Task<ResponseModel> GetAllBuyer()
    {
        var userIds = await _unitOfWork.TransactionRepository.GetAllBuyer();
        if (userIds.IsNullOrEmpty())
        {
            return ResponseModel.BadRequest("Not found");
        }

        var userDtos = new List<BuyerOrderReadDto>();

        foreach (var userId in userIds)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
            if (user != null)
            {
                var userDto = _mapper.Map<BuyerOrderReadDto>(user);
                userDtos.Add(userDto);
            }
        }
        return ResponseModel.Success($"Successfully retrieved users", userDtos);
    }

    public async Task<ResponseModel> GetUserByIdAsync(string id)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        var userDto = _mapper.Map<UserReadDto>(user);
        return ResponseModel.Success($"Successfully get user: {userDto.Username}", userDto);
    }

    public async Task<ResponseModel> GetUserByEmailAsync(string email)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
        if (user == null) return ResponseModel.NotFound($"User with email {email} not found");
        var userDto = _mapper.Map<UserReadDto>(user);
        return ResponseModel.Success($"Successfully get user: {userDto.Username}", userDto);
    }

    public async Task<ResponseModel> UpdateUserByIdAsync(string id, UserUpdateDto dto, bool saveAll)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        if (string.IsNullOrEmpty(dto.Password)) dto.Password = user.Password;

        _mapper.Map(dto, user);

        var validator = _validatorFactory.GetValidator<User>();

        var validationResult = validator.Validate(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation error", validationResult.Errors);

        _unitOfWork.UserRepository.Update(user);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully updated user: {user.Username}", _mapper.Map<UserReadDto>(user));
    }

    public async Task<ResponseModel> UpdateUserAdminByIdAsync(string id, UserUpdateByAdminDto dto, bool saveAll)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        var roles = user.Roles;
        _mapper.Map(dto, user);
        user.Roles = roles;

        var validator = _validatorFactory.GetValidator<User>();

        var validationResult = validator.Validate(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation error", validationResult.Errors);

        _unitOfWork.UserRepository.Update(user);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully updated user: {user.Username}",
            _mapper.Map<UserReadDto>(user));
    }

    public async Task<ResponseModel> RegisterSeller(string id, SellerRegisterDto dto, bool saveAll)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
        _mapper.Map(dto, user);
        var validator = _validatorFactory.GetValidator<User>();
        var validationResult = validator.Validate(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        await _unitOfWork.UserRepository.RegisterSeller(user);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully register seller");
    }

    public async Task<ResponseModel> CheckSeller(string id)
    {
        var check = await _unitOfWork.UserRepository.CheckRoleSell(id);
        if (!check) return ResponseModel.BadRequest("User is not seller");
        return ResponseModel.Success("Successfully check seller");
    }

    public async Task<ResponseModel> DeleteUserByIdAsync(string id, bool saveAll)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
        _unitOfWork.UserRepository.Delete(user);

        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted user: {user.Username}");
    }

    public async Task<ResponseModel> UpdateRoleAsync(string id, List<Role> roles)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        if (user == null) throw new KeyNotFoundException("User not found.");


        _unitOfWork.UserRepository.UpdateRole(user, roles);
        await _unitOfWork.CompleteAsync(); // Save changes to the database

        return ResponseModel.Success("Successfully update role");
    }

    public async Task<ResponseModel> RemoveSeller(string id, bool saveAll = true)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
        var validator = _validatorFactory.GetValidator<User>();
        var validationResult = validator.Validate(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        await _unitOfWork.UserRepository.RemoveSeller(user);
        var tickets = await _unitOfWork.TicketRepository.GetTicketBySellerId(id);
        foreach (var ticket in tickets)
        {
            var newbaseId = ticket.TicketId.Split('_')[0];
           await _unitOfWork.TicketRepository.DeleteTicketByBaseId(newbaseId);
        }
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully remove seller");
    }

    public async Task<ResponseModel> AddSeller(string id, bool saveAll = true)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
        var validator = _validatorFactory.GetValidator<User>();
        var validationResult = validator.Validate(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        await _unitOfWork.UserRepository.RegisterSeller(user);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully register seller");
    }

    public async Task<ResponseModel> ChangeUserStatusAsync(string id, bool saveAll = true)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
        var validator = _validatorFactory.GetValidator<User>();
        var validationResult = validator.Validate(user);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        await _unitOfWork.UserRepository.ChangeStatus(user);
        await _unitOfWork.CompleteAsync(); // Assuming you have a SaveChanges method to save changes to the database
        return ResponseModel.Success("Successfully change status");
    }

    public async Task<ResponseModel> GetBuyerSeller(string id)
    {
        var userIds = await _unitOfWork.TransactionRepository.GetBuyerSellerId(id);
        if (userIds.IsNullOrEmpty()) return ResponseModel.BadRequest("Not found");

        var userDtos = new List<BuyerOrderReadDto>();

        foreach (var userId in userIds)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
            if (user != null)
            {
                var userDto = _mapper.Map<BuyerOrderReadDto>(user);
                userDtos.Add(userDto);
            }
        }

        return ResponseModel.Success("Successfully retrieved users", userDtos);
    }
}