using Repositories.Core.Dtos.Order;
using TicketResell.Repositories.Core.Dtos.Ticket;

namespace Repositories.Core.Dtos.OrderDetail;

public class OrderDetailTransactionDto
{
    public string? OrderDetailId { get; set; }

    public string? OrderId { get; set; }

    public double? Price { get; set; }

    public int? Quantity { get; set; }

    public virtual TicketTransactionDto Ticket { get; set; }

    public virtual OrderTransactionDto order { get; set; }
}