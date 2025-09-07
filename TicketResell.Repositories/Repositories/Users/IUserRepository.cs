using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface IUserRepository : IRepository<User>
{
    public Task<User?> GetUserByEmailAsync(string email);

    public Task<bool> CheckRoleSell(string id);

    public Task RegisterSeller(User user);

        public Task RemoveSeller(User? user);
        Task<bool> HasRoleAsync(string userId, string roleId);
        public Task UpdateRole (User user, List<Role> role);

    public Task ChangeStatus(User user);
}