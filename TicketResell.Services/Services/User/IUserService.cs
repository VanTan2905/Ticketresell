using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;

namespace TicketResell.Services.Services;

public interface IUserService
{
    public Task<ResponseModel> CreateUserAsync(UserCreateDto dto, bool saveAll = true);

    public Task<ResponseModel> GetAllUser();
    public Task<ResponseModel> CheckUserRole(string userId, string roleId);
    public Task<ResponseModel> GetUserByIdAsync(string id);
    public Task<ResponseModel> GetUserByEmailAsync(string email);
    public Task<ResponseModel> GetAllBuyer();

    public Task<ResponseModel> GetBuyerSeller(string id);

    public Task<ResponseModel> UpdateUserByIdAsync(string id, UserUpdateDto dto, bool saveAll = true);
    public Task<ResponseModel> UpdateUserAdminByIdAsync(string id, UserUpdateByAdminDto dto, bool saveAll = true);
    public Task<ResponseModel> UpdateRoleAsync(string id, List<Role> roles);

    public Task<ResponseModel> RegisterSeller(string id, SellerRegisterDto dto, bool saveAll = true);

    public Task<ResponseModel> CheckSeller(string id);

    public Task<ResponseModel> DeleteUserByIdAsync(string id, bool saveAll = true);

    public Task<ResponseModel> RemoveSeller(string id, bool saveAll = true);
    public Task<ResponseModel> AddSeller(string id, bool saveAll = true);
    public Task<ResponseModel> ChangeUserStatusAsync(string id, bool saveAll = true);
}