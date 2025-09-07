using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class OrderDetailRepository : GenericRepository<OrderDetail>, IOrderDetailRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public OrderDetailRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }


    public async Task<IEnumerable<OrderDetail?>> GetOrderDetailsByUsernameAsync(string username)
    {
        return await _context.OrderDetails.Where(od =>
                od.Order != null && od.Order.Buyer != null && od.Order.Buyer.Username == username)
            .Include(od => od.Ticket)
            .ThenInclude(t => t.Seller)
            .ToListAsync();
    }

    public async Task<IEnumerable<OrderDetail?>> GetOrderDetailsByBuyerIdAsync(string userId)
    {
        return await _context.OrderDetails.Where(od => od.Order != null && od.Order.BuyerId == userId)
            .Include(od => od.Ticket)
            .ThenInclude(t => t.Seller)
            .Include(od => od.Ticket)
            .ThenInclude(t => t.Categories)
            .ToListAsync();
    }

    public async Task<IEnumerable<OrderDetail?>> GetOrderDetailsBySellerIdAsync(string sellerId)
    {
        return await _context.OrderDetails.Where(od => od.Ticket != null && od.Ticket.SellerId == sellerId)
            .Include(od => od.Ticket)
            .ThenInclude(t => t.Seller)
            .ToListAsync();
    }
}