using System.Transactions;
using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository
{
    public readonly TicketResellManagementContext _context;
    public readonly IAppLogger _logger;

    public TransactionRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<OrderDetail>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange)
    {
        return (await _context.OrderDetails.Include(od => od.Ticket)
            .Include(od => od.Order)
            .ThenInclude(o => o.Buyer).Where(od => od != null &&
                                                   od.Ticket != null &&
                                                   od.Ticket.SellerId == sellerId &&
                                                   od.Order != null &&
                                                   od.Order.Date >= dateRange.StartDate &&
                                                   od.Order.Date <= dateRange.EndDate).ToListAsync())!;
    }

    public async Task<double?> CalculatorTotal(string sellerId, DateRange dateRange)
    {
        return await _context.OrderDetails.Where(od => od != null &&
                                                       od.Ticket != null &&
                                                       od.Ticket.SellerId == sellerId &&
                                                       od.Order != null &&
                                                       od.Order.Date >= dateRange.StartDate &&
                                                       od.Order.Date <= dateRange.EndDate)
            .SumAsync(od => od.Price * od.Quantity);
    }

    public async Task<List<OrderDetail>> GetTicketOrderDetailsBySeller(string sellerId)
    {
        var result = await _context.OrderDetails
            .Include(od => od.Ticket)
            .Include(od => od.Order)
            .ThenInclude(o => o.Buyer)
            .Where(od => od.Ticket.SellerId == sellerId && od.Order.Status == 0)
            .OrderByDescending(od => od.Order != null ? od.Order.Date : DateTime.MinValue)
            .ToListAsync();

        return result;
    }

    public async Task<List<string>> GetBuyerSellerId(string sellerId)
    {
        var buyerIds = await _context.OrderDetails
            .Where(od => od.Ticket.SellerId == sellerId && od.Order.Status == 0)
            .Select(od => od.Order.BuyerId)
            .Distinct()
            .ToListAsync();

        return buyerIds;
    }
    
    public async Task<List<string>> GetAllBuyer()
    {
        var buyerIds = await _context.OrderDetails
            .Where(od => od.Order.Status == 0)
            .Select(od => od.Order.BuyerId)
            .Distinct()
            .ToListAsync();

        return buyerIds;
    }
    
    public async Task<List<OrderDetail>> GetAllTransaction()
    {
        var result = await _context.OrderDetails
            .Include(od => od.Ticket)
            .Include(od => od.Order)
            .ThenInclude(o => o.Buyer)
            .Where(od => od.Order.Status == 0)
            .OrderByDescending(od => od.Order != null ? od.Order.Date : DateTime.MinValue)
            .ToListAsync();
        return result;
    }
}