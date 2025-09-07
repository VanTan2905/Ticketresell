using Microsoft.EntityFrameworkCore;
using Repositories.Constants;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly TicketResellManagementContext _context;
    public readonly IAppLogger _logger;

    public UserRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

        public async Task<bool> HasRoleAsync(string userId, string roleId)
        {
            return await _context.Users
                .AnyAsync(u => u.UserId == userId && u.Roles.Any(r => r.RoleId == roleId));
        }
        public new async Task CreateAsync(User? user)
        {
            var roleId = RoleConstant.roleBuyer;
            var role = await _context.Roles.FindAsync(roleId);
            if (role != null)
            {
                user?.Roles.Add(role);
            }

        if (user != null)
            await _context.Users.AddAsync(user);
    }

    public new async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.Include(x => x.Roles).ToListAsync();
    }

        public new async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users
                .Where(u => u.UserId == id)
                .Include(x => x.Roles)
                .Include(x => x.Orders)
                .FirstOrDefaultAsync();
        }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Gmail == email);
    }

    public async Task<bool> CheckRoleSell(string id)
    {
        var roleId = RoleConstant.roleSeller;

        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(x => x.Users)
            .FirstOrDefaultAsync(u => u.UserId == id);

        if (user != null && user.Roles.Any(ur => ur.RoleId == roleId)) return true;

        return false;
    }

    public async Task RegisterSeller(User? user)
    {
        var roleId = RoleConstant.roleSeller;
        var role = await _context.Roles.FindAsync(roleId);
        if (role != null) user?.Roles.Add(role);

        if (user != null)
            _context.Users.Update(user);
    }

        public async Task RemoveSeller(User? user)
        {
            var roleId = RoleConstant.roleSeller;
            var role = await _context.Roles.FindAsync(roleId);
            if (role != null)
            {
                user?.Roles.Remove(role);
            }
            if (user != null)
            {
                _context.Users.Update(user);  
            }
        }

    public async Task UpdateRole(User user, List<Role> roles)
    {
        if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

        user.Roles.Clear();

        foreach (var existingRole in roles.Select(role => _context.Roles.Find(role.RoleId)).OfType<Role>())
        {
            user.Roles.Add(existingRole);
        }

        _context.Users.Update(user);
    }

    public async Task ChangeStatus(User user)
    {
        if (user != null)
        {
            if (user.Status == 1)
                user.Status = 0;
            else
                user.Status = 1;
            _context.Users.Update(user);
        }
    }
}