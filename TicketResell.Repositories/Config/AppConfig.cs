namespace Repositories.Config;

public class AppConfig
{
    //Momo
    public string SQLServer { get; set; } = null!;
    public string BaseUrl { get; set; } = null!;
    public string MomoPartnerCode { get; set; } = null!;
    public string MomoAccessKey { get; set; } = null!;
    public string MomoSecretKey { get; set; } = null!;
    public string MomoApiUrl { get; set; } = null!;

    //Vnpay
    public string TmnCode { get; set; } = null!;
    public string HashSecret { get; set; } = null!;
    public string VnpayApiUrl { get; set; } = null!;


    //Paypal
    public string PayPalClientId { get; set; } = null!;
    public string PayPalSecret { get; set; } = null!;
    public string PayPalApiUrl { get; set; } = null!;

    //Rapidapi
    public string RapidapiKey { get; set; } = null!;


    //Email
    public string SmtpHost { get; set; } = null!;
    public string SmtpPort { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FromEmail { get; set; } = null!;
    public string FromDisplayName { get; set; } = null!;
}