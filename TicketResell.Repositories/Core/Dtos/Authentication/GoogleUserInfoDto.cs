namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class GoogleUserInfoDto
{
    public string Sub { get; set; }
    public string Name { get; set; }
    public string Given_Name { get; set; }
    public string Family_Name { get; set; }
    public string Picture { get; set; }
    public string Email { get; set; }
    public bool Email_Verified { get; set; }
}