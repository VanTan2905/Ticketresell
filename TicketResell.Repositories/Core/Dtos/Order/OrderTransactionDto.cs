using Repositories.Core.Dtos.User;

namespace Repositories.Core.Dtos.Order;

public class OrderTransactionDto
{
    public string? OrderId { get; set; }

    public DateTime? Date { get; set; }

    public int? Status { get; set; }


    public virtual SellerTicketReadDto user { get; set; }
}