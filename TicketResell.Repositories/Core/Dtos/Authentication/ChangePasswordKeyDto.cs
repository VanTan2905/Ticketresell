namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class ChangePasswordKeyDto
{
    public string UserId { get; set; }
    public string PasswordKey { get; set; }
    public string NewPassword { get; set; }
}