namespace TicketResell.Repositories.Core.Dtos.Cart;

public class CartItemDto
{
    public string UserId { get; set; }
    public string TicketId { get; set; }
    public int Quantity { get; set; }
}