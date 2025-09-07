using System.Threading.Tasks;
using TicketResell.Services.Services.History;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyRepository;

    public HistoryController(IHistoryService historyRepository)
    {
        _historyRepository = historyRepository;
    }

    [HttpGet("get/{userId}")]
    public async Task<IActionResult> GetHistoryByUserId(string userId)
    {
        // if (!HttpContext.IsUserIdAuthenticated(userId))
        //     return ResponseParser.Result(
        //         ResponseModel.Unauthorized("You are not authorized to access this history"));

        return ResponseParser.Result(await _historyRepository.GetHistoryByUserId(userId));
    }
}