using AutoMapper;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.History;

public class HistoryService : IHistoryService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidatorFactory _validatorFactory;

    public HistoryService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
    }

    public async Task<ResponseModel> GetHistoryByUserId(string userID)
    {
        if (string.IsNullOrEmpty(userID))
            return ResponseModel.BadRequest("UserID cannot be null or empty.");

        var orders = await _unitOfWork.OrderRepository.GetOrdersByBuyerIdAsync(userID);
        if (orders == null)
            return ResponseModel.NotFound($"No history found for user {userID}.");

        var orderDtos = new List<OrderDto>();

        foreach (var order in orders)
        {
            var orderDto = _mapper.Map<OrderDto>(order);

            foreach (var orderDetailDto in orderDto.OrderDetails)
            {
                bool isRated = await _unitOfWork.RatingRepository.OrderDetailHasRatingAsync(orderDetailDto.OrderDetailId);
                orderDetailDto.Rated = isRated ? 1 : 0; 
            }

            orderDtos.Add(orderDto);
        }

        return ResponseModel.Success("Get history successful", orderDtos);
    }

}