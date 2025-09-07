using Repositories.Constants;
using Repositories.Core.Dtos.OrderDetail;
using TicketResell.Repositories.Helper;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderDetailController : ControllerBase
{
    private readonly IOrderDetailService _orderDetailService;
    private readonly IServiceProvider _serviceProvider;

    public OrderDetailController(IOrderDetailService orderDetailService, IServiceProvider serviceProvider)
    {
        _orderDetailService = orderDetailService;
        _serviceProvider = serviceProvider;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateOrderDetail([FromBody] OrderDetailDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to create order details"));

        return ResponseParser.Result(await _orderDetailService.CreateOrderDetail(dto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderDetail(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to view order details"));

        var orderDetail = await _orderDetailService.GetOrderDetail(id);

        if (orderDetail.Data is not OrderDetailDto detailDto)
            return ResponseParser.Result(ResponseModel.NotFound("Order detail not found"));

        return ResponseParser.Result(orderDetail);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrderDetails()
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to view order details"));

        if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(
                ResponseModel.Forbidden("Access denied: You don't have permission to view all order details"));

        return ResponseParser.Result(await _orderDetailService.GetAllOrderDetails());
    }

    [HttpGet("buyer/{buyerId}")]
    public async Task<IActionResult> GetOrderDetailsByBuyerId(string buyerId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to view order details"));

        if (!HttpContext.IsUserIdAuthenticated(buyerId) &&
            !HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(
                ResponseModel.Forbidden("Access denied: You cannot access order details for this buyer"));

        return ResponseParser.Result(await _orderDetailService.GetOrderDetailsByBuyerId(buyerId));
    }

    [HttpGet("seller/{sellerId}")]
    public async Task<IActionResult> GetOrderDetailsBySellerId(string sellerId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to view order details"));

        if (!HttpContext.IsUserIdAuthenticated(sellerId) &&
            !HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(
                ResponseModel.Forbidden("Access denied: You cannot access order details for this seller"));

        return ResponseParser.Result(await _orderDetailService.GetOrderDetailsBySellerId(sellerId));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateOrderDetail([FromBody] OrderDetailDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to update order details"));

        var orderDetail = await _orderDetailService.GetOrderDetail(dto.OrderDetailId);
        if (orderDetail.Data is not OrderDetailDto detailDto)
            return ResponseParser.Result(ResponseModel.NotFound("Order detail not found"));

        return ResponseParser.Result(await _orderDetailService.UpdateOrderDetail(dto));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrderDetail(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to delete order details"));

        var orderDetail = await _orderDetailService.GetOrderDetail(id);
        if (orderDetail.Data is not OrderDetailDto detailDto)
            return ResponseParser.Result(ResponseModel.NotFound("Order detail not found"));

        return ResponseParser.Result(await _orderDetailService.DeleteOrderDetail(id));
    }
}