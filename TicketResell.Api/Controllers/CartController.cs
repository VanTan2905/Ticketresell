using System.Threading.Tasks;
using TicketResell.Repositories.Core.Dtos.Cart;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Carts;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(string userId)
    {
        return !HttpContext.IsUserIdAuthenticated(userId)
            ? ResponseParser.Result(
                ResponseModel.Unauthorized("You are not authorized to get this cart"))
            : ResponseParser.Result(await _cartService.GetCart(userId));
    }

    [HttpGet("items/{userId}")]
    public async Task<IActionResult> GetCartItems(string userId)
    {
        return !HttpContext.IsUserIdAuthenticated(userId)
            ? ResponseParser.Result(
                ResponseModel.Unauthorized("You are not authorized to get this cart item"))
            : ResponseParser.Result(await _cartService.GetCartItems(userId));
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] CartItemDto cartItem)
    {
        return !HttpContext.IsUserIdAuthenticated(cartItem.UserId)
            ? ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to add item to this cart"))
            : ResponseParser.Result(await _cartService.AddToCart(cartItem));
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateCartItem([FromBody] CartItemDto cartItem)
    {
        return !HttpContext.IsUserIdAuthenticated(cartItem.UserId)
            ? ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to update this cart"))
            : ResponseParser.Result(await _cartService.UpdateCartItem(cartItem));
    }

    [HttpDelete("remove/{userId}/{ticketId}")]
    public async Task<IActionResult> RemoveFromCart(string userId, string ticketId)
    {
        return !HttpContext.IsUserIdAuthenticated(userId)
            ? ResponseParser.Result(
                ResponseModel.Unauthorized("You are not authorized to remove item from this cart"))
            : ResponseParser.Result(await _cartService.RemoveFromCart(userId, ticketId));
    }

    [HttpDelete("clear/{userId}")]
    public async Task<IActionResult> ClearCart(string userId)
    {
        return !HttpContext.IsUserIdAuthenticated(userId)
            ? ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to clear this cart"))
            : ResponseParser.Result(await _cartService.ClearCart(userId));
    }

    [HttpGet("total/{userId}")]
    public async Task<IActionResult> GetCartTotal(string userId)
    {
        return !HttpContext.IsUserIdAuthenticated(userId)
            ? ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to get this cart total"))
            : ResponseParser.Result(await _cartService.GetCartTotal(userId));
    }

    [HttpPost("createOrder")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        return !HttpContext.IsUserIdAuthenticated(createOrderDto.UserId)
            ? ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to create this order"))
            : ResponseParser.Result(
                await _cartService.CreateOrderFromSelectedItems(createOrderDto.UserId,
                    createOrderDto.SelectedTicketIds));
    }
}