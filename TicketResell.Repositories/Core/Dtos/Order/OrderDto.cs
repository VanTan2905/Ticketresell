using Repositories.Core.Dtos.OrderDetail;

namespace Repositories.Core.Dtos.Order;

public class OrderDto
{
    public string? OrderId { get; set; } = "";
    public string? BuyerId { get; set; } = "";
    public int? Status { get; set; } = 1;
    public DateTime? Date { get; set; }
    public virtual ICollection<OrderDetailDto> OrderDetails { get; set; } = new List<OrderDetailDto>();
}