namespace TicketResell.Repositories.Core.Dtos.Ticket;

public class TicketTimeRangeRequestDto
{
    public int TicketAmount { get; set; } // Number of tickets to retrieve
    public TimeSpan TimeRange { get; set; } // Time range to check for tickets (e.g., 1 day, 1 hour)
}