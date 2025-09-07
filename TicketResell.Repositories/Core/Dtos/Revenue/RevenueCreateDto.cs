namespace Repositories.Core.Dtos.Revenue;

public class RevenueCreateDto
{
    public string RevenueId { get; set; } = null!;

    public string? SellerId { get; set; }

    public double? Revenue1 { get; set; }
}