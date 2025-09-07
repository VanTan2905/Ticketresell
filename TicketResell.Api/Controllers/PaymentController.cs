using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Core.Dtos.Payment;
using TicketResell.Repositories.Helper;
using TicketResell.Repositories.Logger;
using TicketResell.Services.Services.Carts;
using TicketResell.Services.Services.Payments;
using TicketResell.Services.Services.Revenues;

namespace Api.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly IMomoService _momoService;
    private readonly IOrderService _orderService;
    private readonly IPaypalService _paypalService;
    private readonly IRevenueService _revenueService;
    private readonly IAppLogger _logger;

    private readonly double _tax = 1.05;
    private readonly IVnpayService _vnpayService;

    public PaymentController(IServiceProvider serviceProvider, IAppLogger logger)
    {
        _logger = logger;
        _momoService = serviceProvider.GetRequiredService<IMomoService>();
        _orderService = serviceProvider.GetRequiredService<IOrderService>();
        _vnpayService = serviceProvider.GetRequiredService<IVnpayService>();
        _paypalService = serviceProvider.GetRequiredService<IPaypalService>();
        _cartService = serviceProvider.GetRequiredService<ICartService>();
        _revenueService = serviceProvider.GetRequiredService<IRevenueService>();
    }

    [HttpPost("momo/payment")]
    public async Task<IActionResult> CreatePaymentMomo([FromBody] PaymentDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to pay"));
        var userId = HttpContext.GetUserId();

        var orderId = "O" + Guid.NewGuid().ToString("N");
        dto.OrderId = orderId;
        var virtualCart = await _cartService.CreateVirtualCartAsync(dto);
        var isCartValid = !virtualCart.Any(item => item.OrderId == null);
        if (!isCartValid)
            return ResponseParser.Result(ResponseModel.Error("Not enought tickets in storage", virtualCart));
        var totalAmount = await _cartService.CalculateVirtualCartTotalAsync(virtualCart);
        var momoResponse = await _momoService.CreatePaymentAsync(dto, totalAmount * _tax);

        var cartResponse =
            await _cartService.CreateOrderFromVirtualDetailsDirectly(dto.OrderId, userId, virtualCart, "momo");
        var response = ResponseList.AggregateResponses(new List<ResponseModel> { momoResponse, cartResponse },
            "Success create momo payment");
        return ResponseParser.Result(response);
    }

    [HttpPost("momo/verify")]
    public async Task<IActionResult> CheckMomoTransaction([FromBody] PaymentDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to pay"));

        if (((Order)(await _orderService.GetOrderById(dto.OrderId)).Data).Status == 0)
            return ResponseParser.Result(ResponseModel.Error("Already payed"));


        var momoService = await _momoService.CheckTransactionStatus(dto.OrderId);
        var message = "Payment Success";
        var orderResponse = new ResponseModel();
        var paypalResponse2 = new ResponseModel();
        var revenueResponse = new ResponseModel();
        var updateTicketQuantity = new ResponseModel();
        if (momoService.Status == "Success")
        {
            orderResponse = await _orderService.SetOrderStatus(dto.OrderId, 0);
            if (orderResponse.Data is OrderDto order) await _cartService.RemoveFromCart(order);
            var orderWithDetails = (Order)(await _orderService.GetTicketDetailsByIdAsync(dto.OrderId)).Data;
            paypalResponse2 = await _paypalService.CreatePayoutAsync(orderWithDetails);
            revenueResponse = await _revenueService.AddRevenueByDateAsync(orderWithDetails);
            updateTicketQuantity = await _cartService.UpdateTicketQuantitiesAsync(dto.OrderId);
            // paypalResponse3 = await _paypalService.CheckPayoutStatusAsync((string)paypalResponse2.Data);
        }
        else
        {
            message = "Payment Failed";
        }

        var response = ResponseList.AggregateResponses(
            new List<ResponseModel>
                { momoService, orderResponse, paypalResponse2, revenueResponse, updateTicketQuantity }, message);
        return ResponseParser.Result(response);
    }

    [HttpPost("vnpay/payment")]
    public async Task<IActionResult> CreatePaymentVnpay([FromBody] PaymentDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to pay"));
        var userId = HttpContext.GetUserId();

        var orderId = "O" + Guid.NewGuid().ToString("N");
        dto.OrderId = orderId;
        var virtualCart = await _cartService.CreateVirtualCartAsync(dto);
        var isCartValid = !virtualCart.Any(item => item.OrderId == null);
        if (!isCartValid)
            return ResponseParser.Result(ResponseModel.Error("Not enought tickets in storage", virtualCart));
        var totalAmount = await _cartService.CalculateVirtualCartTotalAsync(virtualCart);
        var vnpayResponse = await _vnpayService.CreatePaymentAsync(dto, totalAmount * _tax);

        var cartResponse =
            await _cartService.CreateOrderFromVirtualDetailsDirectly(dto.OrderId, userId, virtualCart, "vnpay");
        var response = ResponseList.AggregateResponses(new List<ResponseModel> { vnpayResponse, cartResponse },
            "Success create vnpay payment");
        return ResponseParser.Result(response);
    }

    [HttpPost("vnpay/verify")]
    public async Task<IActionResult> CheckVnpayTransaction([FromBody] PaymentDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to pay"));

        if (((Order)(await _orderService.GetOrderById(dto.OrderId)).Data).Status == 0)
            return ResponseParser.Result(ResponseModel.Error("Already payed"));


        var vnpayResponse = await _vnpayService.CheckTransactionStatus(dto.OrderId);
        var message = "Payment Success";
        var orderResponse = new ResponseModel();
        var paypalResponse2 = new ResponseModel();
        var revenueResponse = new ResponseModel();
        var updateTicketQuantity = new ResponseModel();
        if (vnpayResponse.Status == "Success")
        {
            orderResponse = await _orderService.SetOrderStatus(dto.OrderId, 0);
            if (orderResponse.Data is OrderDto order) await _cartService.RemoveFromCart(order);
            var orderWithDetails = (Order)(await _orderService.GetTicketDetailsByIdAsync(dto.OrderId)).Data;
            paypalResponse2 = await _paypalService.CreatePayoutAsync(orderWithDetails);
            revenueResponse = await _revenueService.AddRevenueByDateAsync(orderWithDetails);
            updateTicketQuantity = await _cartService.UpdateTicketQuantitiesAsync(dto.OrderId);
            // paypalResponse3 = await _paypalService.CheckPayoutStatusAsync((string)paypalResponse2.Data);
        }
        else
        {
            message = "Payment Failed";
        }

        var response = ResponseList.AggregateResponses(
            new List<ResponseModel>
                { vnpayResponse, orderResponse, paypalResponse2, revenueResponse, updateTicketQuantity }, message);
        return ResponseParser.Result(response);
    }

    [HttpPost("paypal/payment")]
    public async Task<IActionResult> CreatePaymentPaypal([FromBody] PaymentDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to pay"));
        var userId = HttpContext.GetUserId();

        var orderId = "O" + Guid.NewGuid().ToString("N");
        dto.OrderId = orderId;
        var virtualCart = await _cartService.CreateVirtualCartAsync(dto);
        var isCartValid = !virtualCart.Any(item => item.OrderId == null);
        if (!isCartValid)
            return ResponseParser.Result(ResponseModel.Error("Not enought tickets in storage", virtualCart));
        var totalAmount = await _cartService.CalculateVirtualCartTotalAsync(virtualCart);
        var paypalResponse = await _paypalService.CreatePaymentAsync(dto, totalAmount * _tax);

        var cartResponse =
            await _cartService.CreateOrderFromVirtualDetailsDirectly(dto.OrderId, userId, virtualCart, "paypal");
        var response = ResponseList.AggregateResponses(new List<ResponseModel> { paypalResponse, cartResponse },
            "Success create paypal payment");
        return ResponseParser.Result(response);
    }

    [HttpPost("paypal/verify")]
    public async Task<IActionResult> CheckPaypalTransaction([FromBody] PaymentDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to pay"));

        if (((Order)(await _orderService.GetOrderById(dto.OrderId)).Data).Status == 0)
            return ResponseParser.Result(ResponseModel.Error("Already payed"));

        var paypalResponse = await _paypalService.CheckTransactionStatus(dto.Token);
        string captureId = (string)paypalResponse.Data;
        // var aa = await _paypalService.GetCaptureDetailsAsync(captureId);
        var message = "Payment Success";
        var orderResponse = new ResponseModel();
        var paypalResponse2 = new ResponseModel();
        var revenueResponse = new ResponseModel();
        var updateTicketQuantity = new ResponseModel();
        if (paypalResponse.Status == "Success")
        {
            orderResponse = await _orderService.SetOrderStatus(dto.OrderId, 0, captureId);
            if (orderResponse.Data is OrderDto order) await _cartService.RemoveFromCart(order);
            var orderWithDetails = (Order)(await _orderService.GetTicketDetailsByIdAsync(dto.OrderId)).Data;
            paypalResponse2 = await _paypalService.CreatePayoutAsync(orderWithDetails);
            revenueResponse = await _revenueService.AddRevenueByDateAsync(orderWithDetails);
            updateTicketQuantity = await _cartService.UpdateTicketQuantitiesAsync(dto.OrderId);
            // paypalResponse3 = await _paypalService.CheckPayoutStatusAsync((string)paypalResponse2.Data);
        }
        else if(paypalResponse.Message == "VOIDED")
        {
            orderResponse = await _orderService.SetOrderStatus(dto.OrderId, 3, captureId);
            message = "Payment Cancel";
        }else{
            message = "Payment Failed";
        }

        var response = ResponseList.AggregateResponses(
            new List<ResponseModel>
                { paypalResponse, orderResponse, paypalResponse2, revenueResponse, updateTicketQuantity }, message);
        return ResponseParser.Result(response);
    }


    // [HttpPost("payout")]
    // public async Task<IActionResult> CreatePayout([FromBody] PayoutDto dto)
    // {
    //     // if (!HttpContext.GetIsAuthenticated())
    //     //     return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create a payout"));

    //     var response = await _paypalService.CreatePayoutAsync(dto);
    //     return ResponseParser.Result(response);
    // }

    // [HttpGet("payout/{payoutBatchId}")]
    // public async Task<IActionResult> CheckPayoutStatus(string payoutBatchId)
    // {
    //     // if (!HttpContext.GetIsAuthenticated())
    //     //     return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to check payout status"));

    //     var response = await _paypalService.CheckPayoutStatusAsync(payoutBatchId);
    //     return ResponseParser.Result(response);
    // }
}