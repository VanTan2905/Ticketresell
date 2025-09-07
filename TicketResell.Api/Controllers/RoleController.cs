using AutoMapper;
using Repositories.Core.Dtos.Role;
using TicketResell.Repositories.Helper;

namespace Api.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IRoleService _roleService;

    public RoleController(IServiceProvider serviceProvider, IMapper mapper)
    {
        _roleService = serviceProvider.GetRequiredService<IRoleService>();
        _mapper = mapper;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateRole([FromBody] RoleCreateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create a role"));

        var userId = HttpContext.GetUserId();
        // Optional: Add role checks if necessary
        // if (!UserHasPermission(userId, "CreateRole")) return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _roleService.CreateRoleAsync(dto);
        return ResponseParser.Result(response);
    }

    [HttpGet("read")]
    public async Task<IActionResult> ReadRole()
    {
        var response = await _roleService.GetAllRoleAsync();
        return ResponseParser.Result(response);
    }

    [HttpPut("update/{roleId}")]
    public async Task<IActionResult> UpdateRole(string roleId, [FromBody] RoleUpdateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to update roles"));

        var userId = HttpContext.GetUserId();
        // Optional: Add role checks if necessary
        // if (!UserHasPermission(userId, "UpdateRole")) return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _roleService.UpdateRoleAsync(roleId, dto);
        return ResponseParser.Result(response);
    }

    [HttpDelete("delete/{roleId}")]
    public async Task<IActionResult> DeleteRole(string roleId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to delete roles"));

        var userId = HttpContext.GetUserId();
        // Optional: Add role checks if necessary
        // if (!UserHasPermission(userId, "DeleteRole")) return ResponseParser.Result(ResponseModel.Forbidden("Access denied"));

        var response = await _roleService.DeleteRoleAsync(roleId);
        return ResponseParser.Result(response);
    }
}