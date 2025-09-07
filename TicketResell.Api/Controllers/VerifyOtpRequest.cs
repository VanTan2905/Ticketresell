namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class VerifyOtpRequest
{
    public string Email { get; set; }
    public string Otp { get; set; }
}