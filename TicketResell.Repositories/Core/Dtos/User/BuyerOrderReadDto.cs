using TicketResell.Repositories.Core.Dtos.Order;

namespace Repositories.Core.Dtos.User;

public class BuyerOrderReadDto
{
    public string UserId { get; set; } = null!;
    public string? Username { get; set; }

    public virtual ICollection<OrderBuyerDto> Orders { get; set; }
}