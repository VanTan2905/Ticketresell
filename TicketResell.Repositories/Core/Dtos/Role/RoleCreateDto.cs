namespace Repositories.Core.Dtos.Role;

public class RoleCreateDto
{
    public string RoleId { get; set; } = null!;

    public string? Rolename { get; set; }

    public string? Description { get; set; }
}