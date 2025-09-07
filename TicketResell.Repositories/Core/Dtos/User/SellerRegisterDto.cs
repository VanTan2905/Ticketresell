namespace Repositories.Core.Dtos.User;

public class SellerRegisterDto
{
    public string? Gmail { get; set; }

    public string? Fullname { get; set; }

    public string? Sex { get; set; }

    public string? Phone { get; set; }

    public bool Verify { get; set; }

    public DateTime CodeExpiry { get; set; }

    public string? VerificationCode { get; set; }

    public string? Address { get; set; }

    public DateTime? Birthday { get; set; }
}