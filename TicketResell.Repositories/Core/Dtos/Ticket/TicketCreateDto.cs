namespace Repositories.Core.Dtos.Ticket;

public class TicketCreateDto
{
    public string? TicketId { get; set; }

    public string? SellerId { get; set; }

    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }

    public DateTime? StartDate { get; set; }

    public int? Status { get; set; }

    public string? Image { get; set; }

    public string? Qrcode { get; set; }

    public string? Description { get; set; }

    public List<string> CategoriesId { get; set; }
}