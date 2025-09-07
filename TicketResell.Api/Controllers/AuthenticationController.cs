using System;
using System.Net.Http;
using System.Threading.Tasks;
using Api.Controllers.Models;
using Newtonsoft.Json;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Repositories.Helper;
using TicketResell.Repositories.Logger;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IAppLogger _logger;

    public AuthenticationController(IAuthenticationService authService, IAppLogger logger)
    {
        _logger = logger;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);
        return ResponseParser.Result(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        if (result is { StatusCode: 200, Data: not null })
        {
            var loginInfo = result.Data as LoginInfoDto;

            if (loginInfo != null)
            {
                if (loginInfo.User != null)
                    HttpContext.SetUserId(loginInfo.User.UserId);

                HttpContext.SetAccessKey(loginInfo.AccessKey);
                HttpContext.SetIsAuthenticated(true);
            }
        }

        return ResponseParser.Result(result);
    }

    [HttpPost("login-key")]
    public async Task<IActionResult> Login([FromBody] AccessKeyLoginDto accessKeyLoginDto)
    {
        var result = await _authService.LoginWithAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
        if (result.Data != null)
            if (result.Data is LoginInfoDto loginInfo)
            {
                if (loginInfo.User != null)
                    HttpContext.SetUserId(loginInfo.User.UserId);

                HttpContext.SetAccessKey(loginInfo.AccessKey);
                HttpContext.SetIsAuthenticated(true);
            }

        return ResponseParser.Result(result);
    }

  [HttpGet("login-google")]
    public async Task<IActionResult> LoginWithGoogle([FromQuery] string accessToken)
    {
        var client = new HttpClient();
        var googleUserInfoUrl = $"https://www.googleapis.com/oauth2/v3/userinfo?access_token={accessToken}";
        var response = await client.GetAsync(googleUserInfoUrl);

        if (!response.IsSuccessStatusCode)
            return ResponseParser.Result(ResponseModel.Unauthorized("Invalid Google access token"));

        var jsonString = await response.Content.ReadAsStringAsync();

        var googleUser = JsonConvert.DeserializeObject<GoogleUserInfoDto>(jsonString);

        if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
            return ResponseParser.Result(ResponseModel.Unauthorized("Unable to retrieve user info from Google"));

        var result = await _authService.LoginWithGoogleAsync(googleUser);
        if (result.Data == null) return ResponseParser.Result(result);
        if (result.Data is LoginInfoDto loginInfo)
        {
            if (loginInfo.User != null)
                HttpContext.SetUserId(loginInfo.User.UserId);

            HttpContext.SetAccessKey(loginInfo.AccessKey);
            HttpContext.SetIsAuthenticated(true);
        }

        if (result.Data is not PasswordSetupDto passwordSetupDto) return ResponseParser.Result(result);
        HttpContext.SetUserId(passwordSetupDto.UserId);
        HttpContext.SetAccessKey(passwordSetupDto.PasswordSetupToken);
        HttpContext.SetIsAuthenticated(true);

        return ResponseParser.Result(result);
    }

    [HttpPost("set-password")]
    public async Task<IActionResult> SetPassword([FromBody] PasswordSetupDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid request payload.");
        }

        var response = await _authService.SetPasswordAsync(
            request.UserId,
            request.Password,
            request.PasswordSetupToken
        );

        return ResponseParser.Result(response);
    }


    [HttpPost("islogged")]
    public async Task<IActionResult> IsLogged()
    {
        return ResponseParser.Result(ResponseModel.Success(HttpContext.GetIsAuthenticated().ToString()));
    }

    [HttpPost("isRolelogged")]
    public async Task<IActionResult> IsRoleLogged(string roleId)
    {
        _logger.LogInformation("Is check role");
        if (!HttpContext.GetIsAuthenticated())
        {
            _logger.LogInformation("role check False");
            return ResponseParser.Result(ResponseModel.Unauthorized("False"));
        }

        _logger.LogInformation("role not");
        return ResponseParser.Result(
            ResponseModel.Success(HttpContext.HasEnoughtRoleLevel(RoleHelper.GetUserRole(roleId)).ToString()));
    }


    [HttpPost("logout/{userId}")]
    public async Task<IActionResult> Logout(string userId)
    {
        if (!HttpContext.IsUserIdAuthenticated(userId))
            return ResponseParser.Result(ResponseModel.Unauthorized("You are not logged in"));

        var result = await _authService.LogoutAsync(userId);
        HttpContext.SetIsAuthenticated();
        HttpContext.SetAccessKey();
        HttpContext.SetUserId();
        HttpContext.SetRole("Buyer");

        return ResponseParser.Result(result);
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        if (!HttpContext.IsUserIdAuthenticated(changePasswordDto.UserId))
            return ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to change this password"));

        var result = await _authService.ChangePasswordAsync(changePasswordDto.UserId, changePasswordDto.CurrentPassword,
            changePasswordDto.NewPassword);
        return ResponseParser.Result(result);
    }

    [HttpPost("change-passwordKey")]
    public async Task<IActionResult> ChangePasswordByKey([FromBody] ChangePasswordKeyDto changePasswordDto)
    {
        var result = await _authService.CheckPassswordKeyAsync(changePasswordDto.PasswordKey, changePasswordDto.UserId,
            changePasswordDto.NewPassword);
        return ResponseParser.Result(result);
    }

    [HttpPost("putOTP")]
    public async Task<IActionResult> SendVerificationEmail([FromBody] SendOtpRequest request)
    {
        if (string.IsNullOrEmpty(request.EncryptedData)) return BadRequest("Encrypted data is required");

        try
        {
            var result = await _authService.PutOtpAsync(request.EncryptedData);
            return ResponseParser.Result(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in PutOtpAsync: {ex.Message}"); // Log error
            return StatusCode(500, "Internal server error");
        }
    }
}