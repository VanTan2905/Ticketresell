using System.Threading.Tasks;
using TicketResell.Repositories.Helper;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost("orderdetails/{sellerId}")]
    public async Task<IActionResult> GetOrderDetailByDate(string sellerId, [FromBody] DateRange dateRange)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to access order details."));

        return ResponseParser.Result(await _transactionService.GetOrderDetailByDate(sellerId, dateRange));
    }

    [HttpPost("total/{sellerId}")]
    public async Task<IActionResult> CalculatorTotal(string sellerId, [FromBody] DateRange dateRange)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to calculate totals."));

        return ResponseParser.Result(await _transactionService.CalculatorTotal(sellerId, dateRange));
    }

    [HttpGet("buyers/{sellerId}")]
    public async Task<IActionResult> GetBuyer(string sellerId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to get buyer information."));

        return ResponseParser.Result(await _transactionService.GetTicketOrderDetailsBySeller(sellerId));
    }

    [HttpGet("allBuyers")]
    public async Task<IActionResult> GetAllBuyer()
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to get buyer information."));

        return ResponseParser.Result(await _transactionService.GetAllTransaction());
    }
}