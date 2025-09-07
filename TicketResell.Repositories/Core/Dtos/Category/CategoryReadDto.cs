namespace Repositories.Core.Dtos.Category;

public class CategoryReadDto
{
    public string CategoryId { get; set; } = null!;
    public string? Name { get; set; }
    public string? Description { get; set; }
}