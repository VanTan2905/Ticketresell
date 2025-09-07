namespace TicketResell.Repositories.Core.Dtos.Order;

public class OrderBuyerDto
{
    public string OrderId { get; set; } = null!;

    public string? BuyerId { get; set; }

    public double? Total { get; set; }
}