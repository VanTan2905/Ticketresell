namespace TicketResell.Repositories.Core.Dtos.Rating;

public class RatingCreateDto
{
    public string? SellerId { get; set; }

    public int? Stars { get; set; }

    public string? Comment { get; set; }
    
    public string? OrderDetailId { get; set; }

}