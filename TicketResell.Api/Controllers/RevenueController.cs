using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Constants;
using Repositories.Core.Dtos.Revenue;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Revenues;

namespace TicketResell.Repositories.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RevenueController : ControllerBase
{
    private readonly IRevenueService _revenueService;

    public RevenueController(IServiceProvider serviceProvider)
    {
        _revenueService = serviceProvider.GetRequiredService<IRevenueService>();
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateRevenue([FromBody] RevenueCreateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create revenue"));

        var userId = HttpContext.GetUserId();
        if (string.IsNullOrEmpty(userId))
            return ResponseParser.Result(ResponseModel.Unauthorized("Cannot create revenue with unknown user"));

        if (!HttpContext.HasEnoughtRoleLevel(UserRole.Admin))
            return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));
        
        var response = await _revenueService.CreateRevenueAsync(dto);
        return ResponseParser.Result(response);
    }

    [HttpGet("read")]
    public async Task<IActionResult> GetRevenues()
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to view revenues"));

        var response = await _revenueService.GetRevenuesAsync();
        return ResponseParser.Result(response);
    }

    [HttpGet("readbyid/{id}")]
    public async Task<IActionResult> GetRevenuesById(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to view this revenue"));

            var response = await _revenueService.GetRevenuesByIdAsync(id);
            return ResponseParser.Result(response);
        }

        [HttpGet("readAllRevenues")]
        public async Task<IActionResult> GetAllRevenues()
        {
            // if (!HttpContext.GetIsAuthenticated())
            //     return ResponseParser.Result(
            //         ResponseModel.Unauthorized("You need to be authenticated to view revenues by seller ID"));

            var response = await _revenueService.GetAllRevenues();
            return ResponseParser.Result(response);
        }

        [HttpGet("readbysellerid/{id}")]
        public async Task<IActionResult> GetRevenuesBySellerId(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to view revenues by seller ID"));
            
            var userId = HttpContext.GetUserId();
            //TODO: Check for authenticated UserId is a Seller

        // Optional: You can add logic to check if the user is authorized to view revenues for this seller
        // if (userId != id && !UserHasPermission(userId, "ViewOtherSellerRevenue")) 
        //     return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _revenueService.GetRevenuesBySellerIdAsync(id);
        return ResponseParser.Result(response);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateRevenue(string id, [FromBody] RevenueUpdateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to update revenue"));

        var userId = HttpContext.GetUserId();
        // Optional: Add role checks if necessary
        // if (!UserHasPermission(userId, "UpdateRevenue")) return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _revenueService.UpdateRevenueAsync(id, dto);
        return ResponseParser.Result(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteRevenues(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to delete revenue"));

        var userId = HttpContext.GetUserId();
        // Optional: Add role checks if necessary
        // if (!UserHasPermission(userId, "DeleteRevenue")) return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _revenueService.DeleteRevenuesAsync(id);
        return ResponseParser.Result(response);
    }

    [HttpDelete("deletebysellerid/{id}")]
    public async Task<IActionResult> DeleteRevenuesBySellerId(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to delete revenues by seller ID"));

        var userId = HttpContext.GetUserId();
        // Optional: Add role checks if necessary
        // if (!UserHasPermission(userId, "DeleteRevenueBySellerId")) return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _revenueService.DeleteRevenuesBySellerIdAsync(id);
        return ResponseParser.Result(response);
    }
}