namespace Repositories.Core.Dtos.OrderDetail;

public class VirtualOrderDetailDto
{
    public string? OrderDetailId { get; set; }
    public string? OrderId { get; set; }
    public string? TicketId { get; set; }
    public double Price { get; set; }
    public int Quantity { get; set; }
}