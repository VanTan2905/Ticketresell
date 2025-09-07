using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class RoleRepository : GenericRepository<Role>, IRoleRepository
{
    public readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public RoleRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }
}