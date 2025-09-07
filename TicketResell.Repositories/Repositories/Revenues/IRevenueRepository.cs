using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface IRevenueRepository : IRepository<Revenue>
{
    Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string id, string type);


    Task<List<Revenue>> GetAllRevenues();
    
    Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id);

    Task AddRevenueByDateAsync(DateTime date, double amount, string sellerId);
}