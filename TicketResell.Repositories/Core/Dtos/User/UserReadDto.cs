using Repositories.Core.Dtos.Role;

namespace Repositories.Core.Dtos.User;

public class UserReadDto
{
    public string UserId { get; set; } = null!;

    public string? SellConfigId { get; set; }

    public string? Username { get; set; }

    public int? Status { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? Gmail { get; set; }

    public string? Fullname { get; set; }

    public string? Sex { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Avatar { get; set; }

    public DateTime? Birthday { get; set; }

    public string? Bio { get; set; }

    public virtual ICollection<RoleReadDto> Roles { get; set; } = new List<RoleReadDto>();
}