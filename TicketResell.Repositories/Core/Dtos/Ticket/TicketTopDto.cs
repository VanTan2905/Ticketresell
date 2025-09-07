namespace TicketResell.Repositories.Core.Dtos.Ticket;

public class TicketTopDto
{
    public string TicketId { get; set; } = null!;


    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }

    public DateTime? StartDate { get; set; }

    public string? Image { get; set; }
}