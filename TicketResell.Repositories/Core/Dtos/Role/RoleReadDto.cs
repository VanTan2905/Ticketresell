namespace Repositories.Core.Dtos.Role;

public class RoleReadDto
{
    public string RoleId { get; set; } = null!;

    public string? Rolename { get; set; }

    public string? Description { get; set; }
}