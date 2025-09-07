namespace Repositories.Core.Dtos.SellConfig;

public class SellConfigCreateDto
{
    public string SellConfigId { get; set; } = null!;

    public double? Commision { get; set; }
}