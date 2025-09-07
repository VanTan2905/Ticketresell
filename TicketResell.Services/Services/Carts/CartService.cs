using System.Text.RegularExpressions;
using AutoMapper;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Dtos.Payment;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Repositories.Core.Validators;
using TicketResell.Repositories.Core.Dtos.Cart;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Carts;

namespace TicketResell.Services.Services;

public class CartService : ICartService
{
    private readonly IAppLogger _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidatorFactory _validatorFactory;


    public CartService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory, IAppLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
        _logger = logger;
    }

    public async Task<ResponseModel> GetCart(string userId)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {userId}");

        var cartDto = _mapper.Map<CartDto>(cart);
        return ResponseModel.Success($"Successfully retrieved cart for user: {userId}", cartDto);
    }

    public async Task<ResponseModel> AddToCart(CartItemDto cartItemDto)
    {
        var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(cartItemDto.TicketId);
        if (ticket == null) return ResponseModel.NotFound("Ticket not found");

        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(cartItemDto.UserId);
        if (cart == null) cart = await _unitOfWork.CartRepository.CreateCartAsync(cartItemDto.UserId);

        var cartItem = new OrderDetail
        {
            OrderDetailId = "OD" + Guid.NewGuid(),
            OrderId = cart.OrderId,
            TicketId = ticket.TicketId,
            Price = ticket.Cost,
            Quantity = cartItemDto.Quantity
        };

        var validator = _validatorFactory.GetValidator<OrderDetail>();
        var validationResult = await validator.ValidateAsync(cartItem);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        await _unitOfWork.CartRepository.AddToCartAsync(cart, cartItem);

        return ResponseModel.Success($"Successfully added item to cart for user: {cartItemDto.UserId}");
    }

    public async Task<ResponseModel> UpdateCartItem(CartItemDto cartItemDto)
    {
        var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(cartItemDto.TicketId);
        if (ticket == null) return ResponseModel.NotFound("Ticket not found");

        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(cartItemDto.UserId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {cartItemDto.UserId}");

        var cartItem = new OrderDetail
        {
            OrderDetailId = "OD" + Guid.NewGuid(),
            OrderId = cart.OrderId,
            TicketId = ticket.TicketId,
            Price = ticket.Cost,
            Quantity = cartItemDto.Quantity
        };

        var validator = _validatorFactory.GetValidator<OrderDetail>();
        var validationResult = await validator.ValidateAsync(cartItem);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        try
        {
            await _unitOfWork.CartRepository.UpdateCartItemAsync(cart, cartItem);
            return ResponseModel.Success($"Successfully updated cart item: {cartItemDto.TicketId}", cartItem);
        }
        catch (Exception ex)
        {
            return ResponseModel.Error(ex.Message);
        }
    }

    public async Task<ResponseModel> RemoveFromCart(string userId, string ticketId, bool saveAll = true)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {userId}");

        try
        {
            await _unitOfWork.CartRepository.RemoveFromCartAsync(cart, ticketId);

            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully removed item from cart: {ticketId}");
        }
        catch (Exception ex)
        {
            return ResponseModel.Error(ex.Message);
        }
    }

    public async Task<ResponseModel> RemoveFromCart(OrderDto order)
    {
        var userId = order.BuyerId;
        List<string> ticketIds = order.OrderDetails.Select(od => od.TicketId).ToList();
        var responses = new List<ResponseModel>();
        foreach (var ticketId in ticketIds)
        {
            var response = await RemoveFromCart(userId, ticketId, false);
            responses.Add(response);
        }

        return ResponseList.AggregateResponses(responses, "success");
    }

    public async Task<ResponseModel> ClearCart(string userId)
    {
        try
        {
            await _unitOfWork.CartRepository.ClearCartAsync(userId);
            return ResponseModel.Success($"Successfully cleared cart for user: {userId}");
        }
        catch (Exception ex)
        {
            return ResponseModel.Error(ex.Message);
        }
    }

    public async Task<ResponseModel> GetCartTotal(string userId)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {userId}");

        var total = cart.OrderDetails.Sum(item => item.Price * item.Quantity);

        return ResponseModel.Success($"Successfully calculated cart total for user: {userId}", total);
    }

    public async Task<ResponseModel> GetCartItems(string userId)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {userId}");

        var cartItems = _mapper.Map<IEnumerable<OrderDetailDto>>(cart.OrderDetails);
        return ResponseModel.Success($"Successfully retrieved cart items for user: {userId}", cartItems);
    }

    public async Task<ResponseModel> CreateOrderFromVirtualDetailsDirectly(string orderId, string userId,
        List<VirtualOrderDetailDto> virtualOrderDetails, string paymentMethod, bool saveAll = true)
    {
        if (virtualOrderDetails == null || !virtualOrderDetails.Any())
            return ResponseModel.BadRequest("No order details provided");

        var orderDetails = _mapper.Map<List<OrderDetail>>(virtualOrderDetails);

        var order = new Order
        {
            OrderId = orderId,
            BuyerId = userId,
            Date = DateTime.UtcNow,
            OrderDetails = orderDetails,
            Total = orderDetails.Sum(od => od.Price * od.Quantity),
            Status = (int)OrderStatus.Processing,
            PaymentMethod = paymentMethod
        };

        var validator = _validatorFactory.GetValidator<Order>();
        var validationResult = await validator.ValidateAsync(order);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        await _unitOfWork.OrderRepository.CreateAsync(order);

        if (saveAll)
            await _unitOfWork.CompleteAsync();

        var orderDto = _mapper.Map<OrderDto>(order);
        return ResponseModel.Success("Order created successfully", orderDto);
    }

    public async Task<ResponseModel> CreateOrderFromSelectedItems(string userId, List<string> selectedTicketIds)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {userId}");

        var selectedItems = cart.OrderDetails.Where(od => selectedTicketIds.Contains(od.TicketId)).ToList();
        if (!selectedItems.Any()) return ResponseModel.BadRequest("No selected items found in the cart");

        var order = new Order
        {
            OrderId = "O" + Guid.NewGuid(),
            BuyerId = userId,
            Date = DateTime.UtcNow,
            OrderDetails = selectedItems
        };

        var validator = _validatorFactory.GetValidator<Order>();
        var validationResult = await validator.ValidateAsync(order);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        await _unitOfWork.OrderRepository.CreateAsync(order);
        foreach (var ticketId in selectedTicketIds)
            await _unitOfWork.CartRepository.RemoveFromCartAsync(cart, ticketId);

        var orderDto = _mapper.Map<OrderDto>(order);
        return ResponseModel.Success("Order created successfully", orderDto);
    }

    public async Task<double> CalculateVirtualCartTotalAsync(List<VirtualOrderDetailDto> virtualCart)
    {
        return await Task.FromResult(virtualCart.Sum(item => item.Price * item.Quantity));
    }

    public async Task<List<VirtualOrderDetailDto>> CreateVirtualCartAsync(PaymentDto paymentDto)
    {
        var ticketIds = paymentDto.OrderInfo.SelectedTicketIds.Select(t => t.TicketId).ToList();

        var tickets = await _unitOfWork.TicketRepository.GetTicketsByIds(ticketIds);

        // Fetch all base tickets data first
        var baseTicketsDict = new Dictionary<string, int>();
        foreach (var ticket in tickets)
        {
            var baseTickets = await _unitOfWork.TicketRepository.GetTicketsByBaseIdAsync(ticket.TicketId);
            baseTicketsDict[ticket.TicketId] = baseTickets.Count;
        }

        var result = paymentDto.OrderInfo.SelectedTicketIds
            .Join(tickets,
                selected => selected.TicketId,
                ticket => ticket.TicketId,
                (selected, ticket) =>
                {
                    var baseTicketCount = baseTicketsDict[ticket.TicketId];
                    if (baseTicketCount < selected.Quantity)
                    {
                        _logger.LogInformation(
                            $"Insufficient tickets for TicketId: {ticket.TicketId}, Required: {selected.Quantity}, Available: {baseTicketCount}");
                        var dtot = new VirtualOrderDetailDto
                        {
                            OrderDetailId = null,
                            OrderId = paymentDto.OrderId,
                            TicketId = selected.TicketId,
                            Quantity = selected.Quantity,
                            Price = ticket.Cost ?? -1
                        };
                        return dtot;
                    }

                    var dto = new VirtualOrderDetailDto
                    {
                        OrderDetailId = "OD" + Guid.NewGuid(),
                        OrderId = paymentDto.OrderId,
                        TicketId = selected.TicketId,
                        Quantity = selected.Quantity,
                        Price = ticket.Cost ?? -1
                    };
                    _logger.LogInformation(
                        $"Created detail - TicketId: {dto.TicketId}, Quantity: {dto.Quantity}, Price: {dto.Price}");
                    return dto;
                }).ToList();

        return result;
    }

    public async Task<ResponseModel> UpdateTicketQuantitiesAsync(string orderId)
    {
        var order = await _unitOfWork.OrderRepository.GetDetailsByIdAsync(orderId);
        if (order?.OrderDetails == null) return ResponseModel.Error("No order found");

        foreach (var detail in order.OrderDetails)
        {
            var baseTickets = await _unitOfWork.TicketRepository.GetTicketsByBaseIdAsync(detail.TicketId);

            var ticketsToRemove = baseTickets
                .Take(detail.Quantity ?? 0)
                .Select(t => t.TicketId)
                .ToList();
            await _unitOfWork.TicketRepository.DeleteManyTicket(RemoveSuffix(detail.TicketId), ticketsToRemove);

            _logger.LogInformation($"Removed {ticketsToRemove.Count} tickets for TicketId: {detail.TicketId}");
        }

        return ResponseModel.Success("Success delete ticket");
    }

    public async Task<ResponseModel> Checkout(string userId)
    {
        var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
        if (cart == null) return ResponseModel.NotFound($"Cart not found for user: {userId}");

        if (!cart.OrderDetails.Any()) return ResponseModel.BadRequest("Cart is empty");

        var order = new Order
        {
            OrderId = "O" + Guid.NewGuid(),
            BuyerId = userId,
            Date = DateTime.UtcNow,
            Status = (int)OrderStatus.Completed,
            OrderDetails = cart.OrderDetails.ToList()
        };

        var validator = _validatorFactory.GetValidator<Order>();
        var validationResult = await validator.ValidateAsync(order);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);

        await _unitOfWork.OrderRepository.CreateAsync(order);
        await _unitOfWork.CartRepository.ClearCartAsync(userId);

        var orderDto = _mapper.Map<OrderDto>(order);
        return ResponseModel.Success("Checkout completed successfully", orderDto);
    }

    public string RemoveSuffix(string ticketId)
    {
        return Regex.Replace(ticketId, @"_\d+$", "");
    }
}