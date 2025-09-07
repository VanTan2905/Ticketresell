namespace TicketResell.Repositories.Core.Dtos.Ticket;

public class TicketCategoryRequestDto
{
    public required string CategoryName { get; set; }
    public int Amount { get; set; }
}