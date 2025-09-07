using TicketResell.Repositories.Core.Dtos.OrderDetail;

namespace TicketResell.Repositories.Core.Dtos.Order;

public class CreateVirtualOrderDto
{
    public string UserId { get; set; }
    public List<OrderDetailRequestDto> SelectedTicketIds { get; set; }
}