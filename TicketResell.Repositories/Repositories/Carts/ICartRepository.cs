using Repositories.Core.Entities;

namespace Repositories.Repositories.Carts;

public interface ICartRepository
{
    Task<Order?> GetCartByUserIdAsync(string userId);
    Task<bool> UserHasCartAsync(string userId);
    Task<IEnumerable<Order>> GetAllActiveCartsAsync();
    Task<int> GetCartItemCountAsync(string userId);
    Task<Order> CreateCartAsync(string userId);
    Task AddToCartAsync(Order cart, OrderDetail item);
    Task UpdateCartItemAsync(Order cart, OrderDetail item);
    Task RemoveFromCartAsync(Order cart, string ticketId);
    Task ClearCartAsync(string userId);
}