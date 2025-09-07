using AutoMapper;
using Repositories.Core.Entities;
using TicketResell.Repositories.Core.Dtos.Rating;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Ratings;

public class RatingService : IRatingService
{
    private readonly IAppLogger _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public RatingService(IUnitOfWork unitOfWork, IMapper mapper, IAppLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ResponseModel> CreateRatingAsync(RatingCreateDto dto, string userId, bool saveAll = true)
    {
        bool exists = await _unitOfWork.RatingRepository.RatingExistsAsync(userId, dto.SellerId, dto.OrderDetailId);
    
        if (exists)
        {
            return ResponseModel.Error("A rating for this order detail, seller, and user already exists.");
        }

        var newRating = _mapper.Map<Rating>(dto);
        newRating.RatingId = "RAT" + Guid.NewGuid();
        newRating.CreateDate = DateTime.UtcNow;
        newRating.UserId = userId;
        await _unitOfWork.RatingRepository.CreateAsync(newRating);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully created Rating");
    }

    public async Task<ResponseModel> GetRatingsAsync()
    {
        var ratings = await _unitOfWork.RatingRepository.GetAllAsync();
        var ratingDtos = _mapper.Map<IEnumerable<RatingReadDto>>(ratings);
        return ResponseModel.Success("Successfully retrieved ratings", ratingDtos);
    }

    public async Task<ResponseModel> GetRatingByIdAsync(string id)
    {
        var rating = await _unitOfWork.RatingRepository.GetByIdAsync(id);
        var ratingDto = _mapper.Map<RatingReadDto>(rating);
        return ResponseModel.Success("Successfully retrieved rating by ID", ratingDto);
    }

    public async Task<ResponseModel> GetRatingsBySellerIdAsync(string sellerId)
    {
        var ratings = await _unitOfWork.RatingRepository.GetRatingsBySellerIdAsync(sellerId);
        var ratingDtos = _mapper.Map<IEnumerable<RatingReadDto>>(ratings);
        return ResponseModel.Success("Successfully retrieved ratings for seller", ratingDtos);
    }

    public async Task<ResponseModel> GetRatingsByUserIdAsync(string userId)
    {
        var ratings = await _unitOfWork.RatingRepository.GetRatingsByUserIdAsync(userId);
        var ratingDtos = _mapper.Map<IEnumerable<RatingReadDto>>(ratings);
        return ResponseModel.Success("Successfully retrieved ratings for seller", ratingDtos);
    }

    public async Task<ResponseModel> UpdateRatingAsync(string id, RatingUpdateDto dto, bool saveAll = true)
    {
        var rating = await _unitOfWork.RatingRepository.GetByIdAsync(id);
        _mapper.Map(dto, rating);
        _unitOfWork.RatingRepository.Update(rating);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully updated rating with ID: {id}");
    }

    public async Task<ResponseModel> DeleteRatingAsync(string id, bool saveAll = true)
    {
        await _unitOfWork.RatingRepository.DeleteByIdAsync(id);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted rating with ID: {id}");
    }

    // public async Task<ResponseModel> DeleteRatingsBySellerIdAsync(string sellerId, bool saveAll)
    // {
    //     var ratings = await _unitOfWork.RatingRepository.GetRatingsBySellerIdAsync(sellerId);
    //     foreach (var rating in ratings)
    //     {
    //         _unitOfWork.RatingRepository.Delete(rating);
    //     }
    //     if (saveAll) await _unitOfWork.CompleteAsync();
    //     return ResponseModel.Success($"Successfully deleted ratings for seller with ID: {sellerId}");
    // }
}