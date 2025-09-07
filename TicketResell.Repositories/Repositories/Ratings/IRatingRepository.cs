using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface IRatingRepository : IRepository<Rating>
{
    Task<bool> OrderDetailHasRatingAsync(string orderDetailId);
    Task<List<Rating>> GetRatingsBySellerIdAsync(string id);
    Task<List<Rating>> GetRatingsByUserIdAsync(string userId);
    Task<bool> RatingExistsAsync(string userId, string sellerId, string orderDetailId);
}