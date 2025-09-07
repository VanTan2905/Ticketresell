using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Dtos.Payment;
using TicketResell.Repositories.Core.Dtos.Cart;

namespace TicketResell.Services.Services.Carts;

public interface ICartService
{
    Task<ResponseModel> GetCart(string userId);
    Task<ResponseModel> GetCartItems(string userId);
    Task<ResponseModel> AddToCart(CartItemDto cartItem);
    Task<ResponseModel> UpdateCartItem(CartItemDto cartItem);
    Task<ResponseModel> RemoveFromCart(string userId, string ticketId, bool saveAll = true);
    Task<ResponseModel> ClearCart(string userId);
    Task<ResponseModel> GetCartTotal(string userId);
    Task<ResponseModel> CreateOrderFromSelectedItems(string userId, List<string> selectedTicketIds);
    Task<ResponseModel> Checkout(string userId);
    Task<ResponseModel> RemoveFromCart(OrderDto order);
    Task<double> CalculateVirtualCartTotalAsync(List<VirtualOrderDetailDto> virtualCart);
    Task<List<VirtualOrderDetailDto>> CreateVirtualCartAsync(PaymentDto paymentDto);

    Task<ResponseModel> CreateOrderFromVirtualDetailsDirectly(string orderId, string userId,
        List<VirtualOrderDetailDto> virtualOrderDetails, string paymentMethod, bool saveAll = true);

    Task<ResponseModel> UpdateTicketQuantitiesAsync(string orderId);
}