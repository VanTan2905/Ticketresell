using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class SellConfigRepository : GenericRepository<SellConfig>, ISellConfigRepository
{
    public readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public SellConfigRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }
}