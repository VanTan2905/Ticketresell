using Repositories.Constants;
using Repositories.Core.Dtos.User;
using TicketResell.Repositories.Helper;

namespace Api.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IServiceProvider _serviceProvider;

    public OrderController(IOrderService orderService, IServiceProvider serviceProvider)
    {
        _orderService = orderService;
        _serviceProvider = serviceProvider;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
    {
        var response = ResponseModel.Unauthorized("Cannot create order with unknown user");

        var userId = HttpContext.GetUserId();
        if (string.IsNullOrEmpty(userId) || !userId.Equals(dto.BuyerId)) return ResponseParser.Result(response);

        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to create order"));

        return ResponseParser.Result(await _orderService.CreateOrder(dto));
    }

    [HttpGet("read")]
    public async Task<IActionResult> GetAllOrders()
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to view orders"));

        var orders = await _orderService.GetAllOrders();

        return ResponseParser.Result(HttpContext.HasEnoughtRoleLevel(UserRole.Staff)
            ? orders
            : ResponseModel.Forbidden("Access denied: You cannot access this order"));
    }

    [HttpGet("read/{orderId}")]
    public async Task<IActionResult> GetOrderById(string orderId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to view orders"));

        var order = await _orderService.GetOrderById(orderId);

        if (order.Data is not Order orderDto)
            return ResponseParser.Result(ResponseModel.Forbidden("Access denied: You cannot access this order"));

        return ResponseParser.Result(HttpContext.IsUserIdAuthenticated(orderDto.BuyerId) ||
                                     HttpContext.HasEnoughtRoleLevel(UserRole.Staff)
            ? order
            : ResponseModel.Forbidden("Access denied: You cannot access this order"));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateOrder([FromBody] Order order)
    {
        var response = ResponseModel.Unauthorized("Cannot update order with unknown user");

        var userId = HttpContext.GetUserId();
        if (string.IsNullOrEmpty(userId)) return ResponseParser.Result(response);

        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to view orders"));

        if (HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(await _orderService.UpdateOrder(order));

        return ResponseParser.Result(
            ResponseModel.Forbidden("You don't have permission to update the order"));
    }

    [HttpDelete("{orderId}")]
    public async Task<IActionResult> DeleteOrder(string orderId)
    {
        var response = ResponseModel.Unauthorized("Cannot delete order with unknown user");

        var userId = HttpContext.GetUserId();
        if (string.IsNullOrEmpty(userId)) return ResponseParser.Result(response);

        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to delete an order"));

        if (HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(await _orderService.DeleteOrder(orderId));

        return ResponseParser.Result(
            ResponseModel.Forbidden("You don't have permission to delete the order"));
    }

    [HttpGet("totalprice/{orderId}")]
    public async Task<IActionResult> CalculateTotalPriceForOrder(string orderId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to view order prices"));

        if (HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(await _orderService.CalculateTotalPriceForOrder(orderId));

        var userId = HttpContext.GetUserId();
        var order = await _orderService.GetOrderById(orderId);

        if (order.Data is not Order orderDto || orderDto.BuyerId != userId)
            return ResponseParser.Result(ResponseModel.Forbidden("Access denied: You cannot access this order"));

        var userService = _serviceProvider.GetRequiredService<IUserService>();
        var user = await userService.GetUserByIdAsync(userId);

        if (user.Data is not UserReadDto userReadDto)
            return ResponseParser.Result(ResponseModel.NotFound("User not found in server"));

        return ResponseParser.Result(await _orderService.CalculateTotalPriceForOrder(orderId));
    }
}