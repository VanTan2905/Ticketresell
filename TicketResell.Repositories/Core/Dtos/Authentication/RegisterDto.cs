namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class RegisterDto
{
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Gmail { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string OTP { get; set; } = string.Empty;
}