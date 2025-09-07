namespace TicketResell.Repositories.Core.Dtos.OrderDetail;

public class OrderDetailRequestDto
{
    public string? TicketId { get; set; }
    public int Quantity { get; set; }
}