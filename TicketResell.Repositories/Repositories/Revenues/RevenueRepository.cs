using Microsoft.EntityFrameworkCore;
using Repositories.Constants;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class RevenueRepository : GenericRepository<Revenue>, IRevenueRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public RevenueRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }


    public async Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string sellerId, string month)
    {
        var revenues = await _context.Revenues
            .Include(x => x.Seller)
            .Where(r => r.SellerId == sellerId && r.Type == month)
            .ToListAsync();
        if (revenues == null) throw new KeyNotFoundException("id is not existed");
        return revenues;
    }

    public async Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id)
    {
        var revenues = await _context.Revenues
            .Include(x => x.Seller)
            .Where(x => x.SellerId == id)
            .OrderByDescending(x => x.StartDate)
            .ToListAsync();
        if (revenues == null) throw new KeyNotFoundException("id is not existed");

        return revenues;
    }

    public async Task<List<Revenue>> GetAllRevenues()
    {
        var revenues = await _context.Revenues
            .Include(x=>x.Seller)
            .OrderByDescending(x => x.StartDate)
            .ToListAsync();
        if (revenues == null)
        {
            throw new KeyNotFoundException("id is not existed");
        }

        return revenues;
    }
    
    public async Task AddRevenueByDateAsync(DateTime date, double amount, string sellerId)
    {
        // Normalize the input date to the start of the day (12 AM) and end of the day (11:59 PM)
        var startDate = date.Date; // 12 AM of the input date
        var endDate = startDate.AddDays(1).AddTicks(-1); // 11:59 PM of the same day

        // Find existing revenue item within the date range
        var existingRevenue = await _context.Revenues
            .FirstOrDefaultAsync(r => r.StartDate <= startDate && r.EndDate >= endDate && r.SellerId == sellerId);

        if (existingRevenue != null)
        {
            // If an existing revenue item is found, update the Revenue1 value
            existingRevenue.Revenue1 = (existingRevenue.Revenue1 ?? 0) + amount;
            _context.Revenues.Update(existingRevenue); // Mark the entity as modified
        }
        else
        {
            var newRevenue = new Revenue
            {
                RevenueId = "RE" + Guid.NewGuid(),
                SellerId = sellerId,
                StartDate = startDate,
                EndDate = endDate,
                Revenue1 = amount,
                Type = RevenueConstant.DAY_TYPE
            };

            await _context.Revenues.AddAsync(newRevenue);
        }
    }
}