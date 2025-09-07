using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Repositories.Repositories.Carts;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class CartRepository : ICartRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public CartRepository(IAppLogger logger, TicketResellManagementContext context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Order?> GetCartByUserIdAsync(string userId)
    {
        return await _context.Orders
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.Ticket).ThenInclude(t => t.Seller)
            .FirstOrDefaultAsync(o => o.BuyerId == userId && o.Status == (int)OrderStatus.Carting);
    }

    public async Task<bool> UserHasCartAsync(string userId)
    {
        return await _context.Orders
            .AnyAsync(o => o.BuyerId == userId && o.Status == (int)OrderStatus.Carting);
    }

    public async Task<IEnumerable<Order>> GetAllActiveCartsAsync()
    {
        return await _context.Orders
            .Include(o => o.OrderDetails)
            .Where(o => o.Status == (int)OrderStatus.Carting)
            .ToListAsync();
    }

    public async Task<int> GetCartItemCountAsync(string userId)
    {
        var cart = await GetCartByUserIdAsync(userId);
        return cart?.OrderDetails.Sum(od => od.Quantity) ?? 0;
    }

    public async Task<Order> CreateCartAsync(string userId)
    {
        var newCart = new Order
        {
            OrderId = "ORD" + Guid.NewGuid(),
            BuyerId = userId,
            Total = 0,
            Date = DateTime.UtcNow,
            Status = (int)OrderStatus.Carting
        };

        await _context.Orders.AddAsync(newCart);
        await _context.SaveChangesAsync();
        return newCart;
    }

    public async Task AddToCartAsync(Order cart, OrderDetail item)
    {
        var existingItem = cart.OrderDetails.FirstOrDefault(od => od.TicketId == item.TicketId);
        if (existingItem != null)
        {
            existingItem.Quantity += item.Quantity;
            existingItem.Price = item.Price;

            item.OrderDetailId = existingItem.OrderDetailId;
            item.Quantity = existingItem.Quantity;
            item.Price = existingItem.Price;
        }
        else
        {
            item.OrderId = cart.OrderId;
            cart.OrderDetails.Add(item);
        }

        await _context.SaveChangesAsync();
    }

    public async Task UpdateCartItemAsync(Order cart, OrderDetail item)
    {
        if (cart == null) throw new Exception("Cart not found");

        var existingItem = cart.OrderDetails.FirstOrDefault(od => od.TicketId == item.TicketId);
        if (existingItem == null) throw new Exception("Item not found in cart");

        existingItem.Quantity = item.Quantity;
        existingItem.Price = item.Price;

        item.OrderDetailId = existingItem.OrderDetailId;
        item.Quantity = existingItem.Quantity;
        item.Price = existingItem.Price;

        await _context.SaveChangesAsync();
    }

    public async Task RemoveFromCartAsync(Order cart, string ticketId)
    {
        if (cart == null) throw new Exception("Cart not found");

        var itemToRemove = cart.OrderDetails.FirstOrDefault(od => od.TicketId == ticketId);
        if (itemToRemove == null) throw new Exception("Item not found in cart");

        cart.OrderDetails.Remove(itemToRemove);
    }

    public async Task ClearCartAsync(string userId)
    {
        var cart = await GetCartByUserIdAsync(userId);
        if (cart == null) throw new Exception("Cart not found");

        cart.OrderDetails.Clear();
        await _context.SaveChangesAsync();
    }
}