namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class ChangePasswordDto
{
    public string UserId { get; set; }
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}