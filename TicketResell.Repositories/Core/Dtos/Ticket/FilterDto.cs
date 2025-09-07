namespace Repositories.Core.Dtos.Ticket;

public class FilterDto
{
    public double? Cost { get; set; }

    public string? Location { get; set; }

    public DateTime? StartDate { get; set; }

    public virtual List<string>? Categories { get; set; } = new();
}