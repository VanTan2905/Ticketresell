namespace Repositories.Core.Dtos.Revenue;

public class RevenueReadDto
{
    public string RevenueId { get; set; } = null!;

    public string? SellerId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public double? Revenue1 { get; set; }

    public string? Type { get; set; }
}