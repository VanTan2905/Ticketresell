namespace TicketResell.Repositories.Core.Dtos.Rating;

public class RatingUpdateDto
{
    public string RatingId { get; set; } = null!;

    public int? Stars { get; set; }

    public string? Comment { get; set; }
}