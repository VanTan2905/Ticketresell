using TicketResell.Repositories.Core.Dtos.Mail;
using TicketResell.Services.Services.Mail;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MailController : ControllerBase
{
    private readonly IMailService _mailService;

    public MailController(IServiceProvider serviceProvider)
    {
        _mailService = serviceProvider.GetRequiredService<IMailService>();
    }

    [HttpPost("sendPasswordKey")]
    public async Task<IActionResult> SendPasswordKey([FromBody] MailRequest request)
    {
        var result = await _mailService.SendPasswordKeyAsync(request.To);
        return ResponseParser.Result(result);
    }

    // Send a simple email
    [HttpPost("sendopt")]
    public async Task<IActionResult> SendOtp([FromBody] MailRequest request)
    {
        var result = await _mailService.SendOtpAsync(request.To);

        return ResponseParser.Result(result);
    }

    // Send email with attachment
    // [HttpPost("send-with-attachment")]
    // public async Task<IActionResult> SendEmailWithAttachment([FromBody] EmailWithAttachmentRequest request)
    // {
    //     var result = await _mailService.SendEmailWithAttachmentAsync(request.To, request.Subject, request.Body, request.AttachmentPath);

    //     return ResponseParser.Result(result);
    // }
}

// Request models

public class EmailRequest
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}

public class EmailWithAttachmentRequest
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
    public string AttachmentPath { get; set; }
}