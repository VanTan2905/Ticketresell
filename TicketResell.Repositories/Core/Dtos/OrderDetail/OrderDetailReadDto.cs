using Repositories.Core.Dtos.Ticket;

namespace Repositories.Core.Dtos.OrderDetail;

public class OrderDetailDto
{
    public string? OrderDetailId { get; set; }
    public string? OrderId { get; set; }
    public string? TicketId { get; set; }
    public double? Price { get; set; }
    public int? Quantity { get; set; }
    public int? Rated { get; set; }
    public virtual TicketReadDto? Ticket { get; set; }
}