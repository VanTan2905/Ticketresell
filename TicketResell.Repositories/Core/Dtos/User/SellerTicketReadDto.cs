namespace Repositories.Core.Dtos.User;

public class SellerTicketReadDto
{
    public string UserId { get; set; } = null!;
    public string? Username { get; set; }
    public string? Fullname { get; set; }
}