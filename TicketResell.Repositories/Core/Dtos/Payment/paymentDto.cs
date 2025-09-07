using TicketResell.Repositories.Core.Dtos.Order;

namespace Repositories.Core.Dtos.Payment;

public class PaymentDto
{
    public string OrderId { get; set; } = null!;
    public string Token { get; set; } = null!;
    public CreateVirtualOrderDto OrderInfo { get; set; } = null!;
}