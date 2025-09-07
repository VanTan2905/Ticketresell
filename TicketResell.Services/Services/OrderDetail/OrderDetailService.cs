using AutoMapper;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class OrderDetailService : IOrderDetailService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidatorFactory _validatorFactory;

    public OrderDetailService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
    }

    public async Task<ResponseModel> CreateOrderDetail(OrderDetailDto? dto, bool saveAll = true)
    {
        var orderDetail = _mapper.Map<OrderDetail>(dto);

        var validator = _validatorFactory.GetValidator<OrderDetail>();
        var validationResult = await validator.ValidateAsync(orderDetail);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        var order = await _unitOfWork.OrderRepository.HasOrder(dto.OrderId);
        if (order == false) return ResponseModel.NotFound("Not found id");

        await _unitOfWork.OrderDetailRepository.CreateAsync(orderDetail);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully created order detail: {orderDetail.OrderDetailId}", orderDetail);
    }

    public async Task<ResponseModel> GetOrderDetail(string id)
    {
        var orderDetail = await _unitOfWork.OrderDetailRepository.GetByIdAsync(id);
        var data = _mapper.Map<OrderDetailDto>(orderDetail);
        return ResponseModel.Success($"Successfully get order detail: {orderDetail.OrderDetailId}", data);
    }

    public async Task<ResponseModel> GetAllOrderDetails()
    {
        var orderDetails = await _unitOfWork.OrderDetailRepository.GetAllAsync();
        var data = _mapper.Map<IEnumerable<OrderDetailDto>>(orderDetails);
        return ResponseModel.Success("Successfully get all order detail", data);
    }

    public async Task<ResponseModel> GetOrderDetailsByBuyerId(string buyerId)
    {
        var orderDetails = await _unitOfWork.OrderDetailRepository.GetOrderDetailsByBuyerIdAsync(buyerId);
        var data = _mapper.Map<IEnumerable<OrderDetailDto>>(orderDetails);
        return ResponseModel.Success($"Successfully get order detail by buyerId: {buyerId}", data);
    }

    public async Task<ResponseModel> GetOrderDetailsBySellerId(string sellerId)
    {
        var orderDetails = await _unitOfWork.OrderDetailRepository.GetOrderDetailsBySellerIdAsync(sellerId);
        var data = _mapper.Map<IEnumerable<OrderDetailDto>>(orderDetails);
        return ResponseModel.Success($"Successfully get order detail by sellderId: {sellerId}", data);
    }

    public async Task<ResponseModel> UpdateOrderDetail(OrderDetailDto? dto, bool saveAll = true)
    {
        var orderDetail = _mapper.Map<OrderDetail>(dto);

        var validator = _validatorFactory.GetValidator<OrderDetail>();
        var validationResult = await validator.ValidateAsync(orderDetail);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        _unitOfWork.OrderDetailRepository.Update(orderDetail);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully updated order detail: {orderDetail.OrderDetailId}", orderDetail);
    }

    public async Task<ResponseModel> DeleteOrderDetail(string id, bool saveAll = true)
    {
        var orderDetail = await _unitOfWork.OrderDetailRepository.GetByIdAsync(id);
        _unitOfWork.OrderDetailRepository.Delete(orderDetail);
        if (saveAll)
            await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted order detail: {id}");
    }
}