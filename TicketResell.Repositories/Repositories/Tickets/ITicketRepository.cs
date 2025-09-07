using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface ITicketRepository : IRepository<Ticket>
{
    Task ActivateTicketsByBaseIdAsync(string baseId);
    Task DisableTicketsByBaseIdAsync(string baseId);
    Task<List<Ticket>> GetRealAllAsync(bool onlyActive = true);
    Task<List<Ticket>> GetTicketRangeAsync(int start, int count);
    Task<List<Ticket>> GetTicketsByIds(List<string> ticketIds);
    Task<List<Ticket>> GetTicketByNameAsync(string name);
    Task<List<Ticket>> GetTopTicketBySoldAmount(int amount);
    Task<List<Ticket>> GetTicketByDateAsync(DateTime date);
    Task CreateTicketAsync(Ticket ticket, List<string> categoryIds);
    Task<List<Ticket>> GetTicketsByOrderIdWithStatusAsync(string userId, int status);

    Task UpdateTicketAsync(string id, Ticket ticket, List<string> categoryIds);

    Task<bool> CheckExist(string id);

    Task<List<Ticket>> GetTicketBySellerId(string id);

    Task DeleteTicketAsync(string id);

    Task<ICollection<Category>?> GetTicketCateByIdAsync(string id);

    Task<List<Ticket>> GetTicketsStartingWithinTimeRangeAsync(int ticketAmount, TimeSpan timeRange);

    Task DeleteManyTicket(string baseId, List<string> ticketId);

    Task DeleteTicketByBaseId(string baseId);
    Task<List<Ticket>> GetTicketsByCategoryAndDateAsync(string categoryName, int amount);
    Task<List<Ticket>> GetTicketsByBaseIdAsync(string baseId);

    Task<string> GetQrImageAsBase64Async(string ticketId);
    Task<List<string>> GetMultiQrImagesAsBase64Async(string ticketId, int quantity);

    Task<int> GetTicketRemainingAsync(string ticketId);

    Task<List<Ticket>> GetTicketByCateIdAsync(string ticketid, string[] categoriesId);
    Task<List<Ticket>> GetTicketNotByCateIdAsync(string[] categoriesId);
    Task<List<Ticket>> GetTicketByListCateIdAsync(string[] categoriesId);
}