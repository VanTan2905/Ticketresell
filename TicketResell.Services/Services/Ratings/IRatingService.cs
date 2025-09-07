using TicketResell.Repositories.Core.Dtos.Rating;

namespace TicketResell.Services.Services.Ratings;

public interface IRatingService
{
    Task<ResponseModel> GetRatingByIdAsync(string id);
    Task<ResponseModel> GetRatingsAsync();
    Task<ResponseModel> CreateRatingAsync(RatingCreateDto dto, string userId, bool saveAll = true);
    Task<ResponseModel> UpdateRatingAsync(string id, RatingUpdateDto dto, bool saveAll = true);
    Task<ResponseModel> DeleteRatingAsync(string id, bool saveAll = true);
    Task<ResponseModel> GetRatingsByUserIdAsync(string userId);
    Task<ResponseModel> GetRatingsBySellerIdAsync(string sellerId);
}