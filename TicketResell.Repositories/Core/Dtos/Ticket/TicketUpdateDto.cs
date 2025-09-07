namespace Repositories.Core.Dtos.Ticket;

public class TicketUpdateDto
{
    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }

    public int? Status { get; set; }

    public string? Image { get; set; }


    public string? StartDate { get; set; }

    public string? Description { get; set; }

    public List<string> CategoriesId { get; set; }
}