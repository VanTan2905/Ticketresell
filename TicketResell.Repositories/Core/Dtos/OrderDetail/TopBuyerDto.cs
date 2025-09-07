namespace TicketResell.Repositories.Core.Dtos.OrderDetail;

public class TopBuyerDto
{
    public string UserId { get; set; }
    public string UserName { get; set; }
    public decimal Total { get; set; }
}