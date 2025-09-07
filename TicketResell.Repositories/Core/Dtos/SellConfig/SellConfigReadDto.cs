namespace Repositories.Core.Dtos.SellConfig;

public class SellConfigReadDto
{
    public string SellConfigId { get; set; } = null!;

    public double? Commision { get; set; }
}