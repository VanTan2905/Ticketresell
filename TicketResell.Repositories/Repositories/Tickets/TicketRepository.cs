using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class TicketRepository : GenericRepository<Ticket>, ITicketRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public TicketRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }
    public async Task ActivateTicketsByBaseIdAsync(string baseId)
    {
        var tickets = await _context.Tickets
            .Where(t => t.TicketId.StartsWith(baseId) && t.Status == 0)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
            throw new KeyNotFoundException("No inactive tickets found with the specified base ID");

        foreach (var ticket in tickets)
        {
            ticket.Status = 1;
        }

        await _context.SaveChangesAsync();
    }
    
    public async Task DisableTicketsByBaseIdAsync(string baseId)
    {
        var tickets = await _context.Tickets
            .Where(t => t.TicketId.StartsWith(baseId) && t.Status == 1)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
            throw new KeyNotFoundException("No inactive tickets found with the specified base ID");

        foreach (var ticket in tickets)
        {
            ticket.Status = 0;
        }

        await _context.SaveChangesAsync();
    }

    public new async Task<List<Ticket>> GetAllAsync()
    {
        var tickets = await _context.Tickets
            .Include(x => x.Seller)
            .Include(x => x.Categories)
            .Where(x => x.Status == 1)
            .ToListAsync();

        var groupedTickets = tickets
            .GroupBy(t => t.TicketId.Split('_')[0])
            .Select(g => g.First())
            .ToList();

        if (groupedTickets == null || !groupedTickets.Any()) throw new KeyNotFoundException("No ticket in database");

        return groupedTickets;
    }
    
    public async Task<List<Ticket>> GetRealAllAsync(bool onlyActive = true)
    {
        var query = _context.Tickets
            .Include(x => x.Seller)
            .Include(x => x.Categories)
            .AsQueryable();

        if (onlyActive)
        {
            query = query.Where(x => x.Status == 1);
        }

        var tickets = await query.ToListAsync();

        var groupedTickets = tickets
            .GroupBy(t => t.TicketId.Split('_')[0])
            .Select(g => g.First())
            .ToList();

        if (!groupedTickets.Any()) throw new KeyNotFoundException("No ticket in database");

        return groupedTickets;
    }



    public async Task<List<Ticket>> GetTicketRangeAsync(int start, int count)
    {
        var tickets = await _context.Tickets
            .OrderBy(t => t.CreateDate)
            .Skip(start)
            .Take(count)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
            throw new KeyNotFoundException("No tickets found in the specified range");

        return tickets;
    }

    public async Task<Ticket> GetByIdAsync(string id)
    {
        var ticket = await _context.Tickets.Include(x => x.Seller).Include(x => x.Categories)
            .FirstAsync(x => x.TicketId.StartsWith(id) && x.Status == 1);
        if (ticket == null) throw new KeyNotFoundException("Id is not found");

        return ticket;
    }

    public async Task<List<Ticket>> GetTicketByNameAsync(string name)
    {
        var tickets = await _context.Tickets.Include(x => x.Seller).Where(x => x.Name == name && x.Status == 1)
            .ToListAsync();
        if (tickets == null || tickets.Count == 0) throw new KeyNotFoundException("Name is not found");

        return tickets;
    }

    public async Task<List<Ticket>> GetTicketByDateAsync(DateTime date)
    {
        var tickets = await _context.Tickets.Where(x => x.StartDate == date && x.Status == 1).Include(x => x.Categories)
            .ToListAsync();
        if (tickets == null || tickets.Count == 0) throw new KeyNotFoundException("Don't have ticket in this date");

        return tickets;
    }

    public async Task CreateTicketAsync(Ticket ticket, List<string> categoryList)
    {
        foreach (var x in categoryList)
        {
            var category = await _context.Categories.FindAsync(x);
            if (category != null) ticket.Categories.Add(category);
        }

        await _context.Tickets.AddAsync(ticket);
    }

    public async Task<List<Ticket>> GetTicketsByIds(List<string> ticketIds)
    {
        return await _context.Tickets.Where(t => ticketIds.Contains(t.TicketId) && t.Status == 1).ToListAsync();
    }

    public async Task UpdateTicketAsync(string id, Ticket ticket, List<string> categoryIds)
    {
        var ticketUpdate = await _context.Tickets
            .Include(t => t.Categories)
            .FirstOrDefaultAsync(t => t.TicketId == id && t.Status == 1);
        if (ticketUpdate != null) ticketUpdate.Categories.Clear();


        foreach (var x in categoryIds)
        {
            var category = await _context.Categories.FindAsync(x);
            if (category != null) ticket.Categories.Add(category);
        }

        _context.Tickets.Update(ticket);
    }

    public async Task<bool> CheckExist(string id)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket != null) return true;

        return false;
    }

    public async Task<List<Ticket>> GetTicketBySellerId(string id)
    {
        var tickets = await _context.Tickets.Include(x => x.Seller).Include(x => x.Categories)
            .Where(x => x.SellerId == id && x.Status == 1).ToListAsync();
        if (tickets == null) throw new KeyNotFoundException("Ticket not found");

        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0])
            .Distinct()
            .ToList();
        var filteredTicketsByCategory = tickets
            .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
            .GroupBy(t => t.TicketId.Split('_')[0])
            .Select(g => g.First())
            .ToList();
        return filteredTicketsByCategory;
    }

    public async Task DeleteTicketAsync(string id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Categories)
            .FirstOrDefaultAsync(t => t.TicketId == id);

        if (ticket == null) throw new KeyNotFoundException("Ticket not found");
         ticket.Status = 0;
        await _context.SaveChangesAsync();
    }

    public async Task<ICollection<Category>?> GetTicketCateByIdAsync(string id)
    {
        var categories = await _context.Tickets
            .Where(t => t.TicketId == id && t.Status == 1)
            .Select(t => t.Categories)
            .FirstOrDefaultAsync();
        return categories;
    }

    public async Task DeleteManyTicket(string baseId, List<string> ticketIds)
    {
        var tickets = await _context.Tickets
            .Include(x => x.Seller)
            .Include(x => x.Categories)
            .Where(t => t.TicketId.StartsWith(baseId))
            .ToListAsync();

        if (tickets == null || tickets.Count == 0) throw new KeyNotFoundException("Tickets not found");

        foreach (var ticket in tickets)
            if (ticketIds.Contains(ticket.TicketId))
                ticket.Status = 0;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTicketByBaseId(string baseId)
    {
        var tickets = await _context.Tickets
            .Include(x => x.Seller)
            .Include(x => x.Categories)
            .Where(t => t.TicketId.StartsWith(baseId) && t.Status == 1)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0) throw new KeyNotFoundException("Tickets not found");

        foreach (var ticket in tickets) ticket.Status = 0;

        await _context.SaveChangesAsync();
    }


    public async Task<List<Ticket>> GetTicketsByCategoryAndDateAsync(string categoryName, int amount)
    {
        return await _context.Tickets
            .Where(t => t.Categories.Any(c => c.Name == categoryName) && t.StartDate > DateTime.Now && t.Status == 1)
            .OrderBy(t => t.StartDate)
            .Take(amount)
            .ToListAsync();
    }

    public async Task<List<Ticket>> GetTicketsByOrderIdWithStatusAsync(string userId, int status)
    {
        return await _context.Tickets
            .Where(t => t.OrderDetails.Any(od => od.Order.BuyerId == userId && od.Order.Status == status))
            .ToListAsync();
    }

    public async Task<List<Ticket>> GetTicketsStartingWithinTimeRangeAsync(int ticketAmount, TimeSpan timeRange)
    {
        var now = DateTime.Now;
        var endTime = now.Add(timeRange);

        var tickets = await _context.Tickets
            .Where(t => t.StartDate.HasValue && t.StartDate >= now && t.StartDate <= endTime && t.Status == 1)
            .OrderBy(t => t.StartDate)
            .Take(ticketAmount)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
            throw new KeyNotFoundException("No tickets found in the specified time range.");

        return tickets;
    }


    public async Task<List<Ticket>> GetTopTicketBySoldAmount(int amount)
    {
        // Group by TicketId and calculate total quantity sold
        var topSellingTickets = await _context.OrderDetails
            .GroupBy(od => od.TicketId)
            .Select(g => new
            {
                TicketId = g.Key,
                TotalQuantity = g.Sum(od => od.Quantity)
            })
            .OrderByDescending(t => t.TotalQuantity)
            .Take(amount)
            .ToListAsync();

        // Get the list of TicketIds
        var topSellingTicketIds = topSellingTickets.Select(t => t.TicketId).ToList();

        // Include the seller information when fetching tickets
        var topSellingTicketInfos = await _context.Tickets
            .Include(t => t.Seller) // Include seller information
            .Where(t => topSellingTicketIds.Contains(t.TicketId))
            .ToListAsync();

        // Order the results to match the original order
        var orderedTopSellingTicketInfos = topSellingTicketIds
            .Select(id => topSellingTicketInfos.First(t => t.TicketId == id))
            .ToList();

        return orderedTopSellingTicketInfos;
    }

    public async Task<string> GetQrImageAsBase64Async(string ticketId)
    {
        var ticket = await _context.Tickets
            .Where(t => t.TicketId.StartsWith(ticketId))
            .Select(t => t.Qr)
            .FirstOrDefaultAsync();

        if (ticket == null || ticket.Length == 0) return null;

        return Convert.ToBase64String(ticket);
    }

    public async Task<int> GetTicketRemainingAsync(string ticketId)
    {
        var count = await _context.Tickets
            .Where(ticket => ticket.TicketId.StartsWith(ticketId) && ticket.Status == 1)
            .CountAsync();
        return count;
    }


    public async Task<List<Ticket>> GetTicketsByBaseIdAsync(string baseId)
    {
        var newbaseId = baseId.Split('_')[0];
        var tickets = await _context.Tickets
            .Include(x => x.Seller)
            .Include(x => x.Categories)
            .Where(t => t.TicketId.StartsWith(newbaseId) && t.Status == 1)
            .ToListAsync();
        return tickets;
    }

    public async Task<List<Ticket>> GetTicketByCateIdAsync(string ticketid, string[] categoriesId)
    {
        var tickets = await _context.Tickets
            .Include(t => t.Seller)
            .Include(t => t.Categories) // Include the related categories
            .Where(t => t.Categories.Any(c => categoriesId.Contains(c.CategoryId)) &&
                        !t.TicketId.StartsWith(ticketid) && t.Status == 1) // Filter tickets by category
            .ToListAsync();
        // Filter to keep only the base ticket IDs (e.g., TICKET001)
        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0]) // Get the base ticket ID (split by '_')
            .Distinct() // Ensure distinct base IDs
            .ToList();
        var filteredTicketsByCategory = tickets
            .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
            .GroupBy(t => t.TicketId.Split('_')[0]) // Group by base ticket ID
            .Select(g => g.First()) // Select the first instance of each group
            .ToList();
        return filteredTicketsByCategory;
    }

    public async Task<List<Ticket>> GetTicketNotByCateIdAsync(string[] categoriesId)
    {
        var tickets = await _context.Tickets.Include(t => t.Seller)
            .Where(t => t.Categories.All(c => !categoriesId.Contains(c.CategoryId)) &&
                        t.Status == 1) // Filter tickets by category
            .Include(t => t.Categories) // Include the related categories
            .ToListAsync();
        // Filter to keep only the base ticket IDs (e.g., TICKET001)
        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0]) // Get the base ticket ID (split by '_')
            .Distinct() // Ensure distinct base IDs
            .ToList();
        var filteredTicketsByCategory = tickets
            .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
            .GroupBy(t => t.TicketId.Split('_')[0]) // Group by base ticket ID
            .Select(g => g.First()) // Select the first instance of each group
            .ToList();
        return filteredTicketsByCategory;
    }

    public async Task<List<Ticket>> GetTicketByListCateIdAsync(string[] categoriesId)
    {
        var tickets = await _context.Tickets.Include(t => t.Seller)
            .Where(t => t.Categories.Any(c => categoriesId.Contains(c.CategoryId)) &&
                        t.Status == 1) // Filter tickets by category
            .Include(t => t.Categories) // Include the related categories
            .ToListAsync();
        // Filter to keep only the base ticket IDs (e.g., TICKET001)
        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0]) // Get the base ticket ID (split by '_')
            .Distinct() // Ensure distinct base IDs
            .ToList();
        var filteredTicketsByCategory = tickets
            .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
            .GroupBy(t => t.TicketId.Split('_')[0]) // Group by base ticket ID
            .Select(g => g.First()) // Select the first instance of each group
            .ToList();
        return filteredTicketsByCategory;
    }

    public async Task<List<string>> GetMultiQrImagesAsBase64Async(string ticketId, int quantity)
    {
        var position = int.Parse(ticketId.Split('_')[1]);
        var baseTicketId = ticketId.Split('_')[0];

        var qrCodes = await _context.Tickets
            .Where(t => t.TicketId.StartsWith(baseTicketId) && t.Status == 0)
            .ToListAsync();

        var orderedQrCodes = qrCodes
            .OrderBy(t => int.Parse(t.TicketId.Split('_')[1]))
            .Skip(position - 1)
            .Take(quantity)
            .Select(t => t.Qr)
            .ToList();

        if (orderedQrCodes == null || orderedQrCodes.Count == 0)
            throw new KeyNotFoundException("No QR codes found for the specified criteria.");

        return orderedQrCodes.Select(qr => Convert.ToBase64String(qr)).ToList();
    }
}