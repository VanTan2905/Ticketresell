namespace TicketResell.Repositories.Core.Dtos.Rating;

public class RatingReadDto
{
    public string RatingId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string? SellerId { get; set; }

    public int? Stars { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreateDate { get; set; }
}