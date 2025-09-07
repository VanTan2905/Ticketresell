using Repositories.Core.Entities;

namespace Repositories.Core.Validators;

public class TicketValidator : Validators<Ticket>
{
    public TicketValidator()
    {
        AddRequired(ticket => ticket.TicketId);
        AddRequired(ticket => ticket.SellerId);
        AddRequired(ticket => ticket.Name);
        AddEqualOrGreaterThan(ticket => ticket.Cost, 0);
        AddRequired(ticket => ticket.Location);
        AddEqualOrGreaterThan(ticket => ticket.StartDate, DateTime.UtcNow);
    }
}