namespace Repositories.Core.Dtos.User;

public class UserUpdateDto
{
    public string? Password { get; set; } = null;

    public string? Fullname { get; set; }

    public string? Sex { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Avatar { get; set; }

    public DateTime? Birthday { get; set; }

    public string? Bio { get; set; }
}