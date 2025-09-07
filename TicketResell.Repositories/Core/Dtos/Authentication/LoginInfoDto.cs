using Repositories.Core.Dtos.User;

namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class LoginInfoDto
{
    public UserReadDto? User { get; set; }
    public string AccessKey { get; set; } = string.Empty;
}