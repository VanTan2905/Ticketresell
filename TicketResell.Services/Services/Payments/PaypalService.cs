using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Repositories.Config;
using Repositories.Core.Dtos.Payment;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace TicketResell.Services.Services.Payments;

public class PaypalService : IPaypalService
{
    private readonly AppConfig _config;
    private readonly HttpClient _httpClient;
    private readonly IAppLogger _logger;
    private readonly IUnitOfWork _unitOfWork;

    public PaypalService(IOptions<AppConfig> config, HttpClient httpClient, IAppLogger logger, IUnitOfWork unitOfWork)
    {
        _config = config.Value;
        _httpClient = httpClient;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseModel> CreatePayoutAsync(Order order)
    {
        try
        {
            var accessToken = await GenerateAccessTokenAsync();
            var payout = await CreatePayPalPayoutAsync(order, accessToken);
            var batchId = (string)payout.Data;
            return ResponseModel.Success("PayPal payout created successfully", batchId);
        }
        catch (Exception ex)
        {
            return ResponseModel.Error($"Error creating PayPal payout: {ex.Message}");
        }
    }

    public async Task<ResponseModel> CheckPayoutStatusAsync(string payoutBatchId)
    {
        try
        {
            var accessToken = await GenerateAccessTokenAsync();
            var status = await GetPayoutStatusAsync(payoutBatchId, accessToken);

            return ResponseModel.Success($"Payout status: {status}", status);
        }
        catch (Exception ex)
        {
            return ResponseModel.Error($"Error checking payout status: {ex.Message}");
        }
    }


    public async Task<ResponseModel> CheckTransactionStatus(string orderId)
    {
        var accessToken = await GenerateAccessTokenAsync();

        var request = new HttpRequestMessage(HttpMethod.Post,
            $"{_config.PayPalApiUrl}/v2/checkout/orders/{orderId}/capture");

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var requestId = Guid.NewGuid().ToString();
        request.Headers.Add("PayPal-Request-Id", requestId);

        request.Content = new StringContent(string.Empty, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

            
        if (response.IsSuccessStatusCode)
        {
            var jsonDoc = JsonDocument.Parse(content);
            var status = jsonDoc.RootElement.GetProperty("status").GetString();
            _logger.LogError("STATUS " + status);
            // Extract the capture ID
            var captureId = jsonDoc.RootElement
                .GetProperty("purchase_units")[0]
                .GetProperty("payments")
                .GetProperty("captures")[0]
                .GetProperty("id")
                .GetString();
            if (status == "COMPLETED")
            {
                return ResponseModel.Success("PayPal order captured successfully", captureId);
            }

            return ResponseModel.Error("Error capturing PayPal order");
        }
        else
        {
            return ResponseModel.Error($"Error capturing PayPal order: {content}");
        }
    }
    public async Task<ResponseModel> GetCaptureDetailsAsync(string captureId)
    {
        try
        {
            var accessToken = await GenerateAccessTokenAsync();

            var request = new HttpRequestMessage(HttpMethod.Get, $"{_config.PayPalApiUrl}/v2/payments/captures/{captureId}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var jsonDoc = JsonDocument.Parse(content);
                var status = jsonDoc.RootElement.GetProperty("status").GetString();

                // You can extract other details if needed
                return ResponseModel.Success("Capture details retrieved successfully", status);
            }
            else
            {
                return ResponseModel.Error($"Error retrieving capture details: {content}");
            }
        }
        catch (Exception ex)
        {
            return ResponseModel.Error($"Exception occurred while retrieving capture details: {ex.Message}");
        }
    }


    public async Task<ResponseModel> CreatePaymentAsync(PaymentDto paymentRequest, double amount)
    {
        try
        {
            var accessToken = await GenerateAccessTokenAsync();
            var rate = await GetConversionRateVndToUsd();
            var order = await CreatePayPalOrderAsync(paymentRequest.OrderId, accessToken, amount * rate);

            return ResponseModel.Success("PayPal order created successfully", order);
        }
        catch (Exception ex)
        {
            return ResponseModel.Error($"Error creating PayPal payment: {ex.Message}");
        }
    }

    private async Task<ResponseModel> CreatePayPalPayoutAsync(Order order, string accessToken)
    {
        try
        {
            var rate = await GetConversionRateVndToUsd();


            if (order == null)
                return ResponseModel.Error("Order not found");

            var payoutItems = new List<dynamic>();

            foreach (var orderDetail in order.OrderDetails)
            {
                var seller = orderDetail.Ticket.Seller;
                var ticketCost = orderDetail.Ticket.Cost ?? -1.0;
                var quantity = orderDetail.Quantity ?? -1;

                var payoutItem = new
                {
                    recipient_type = "EMAIL",
                    amount = new
                    {
                        value = (ticketCost * quantity * rate).ToString("F2"),
                        currency = "USD"
                    },
                    note = "Thanks for your patronage!",
                    sender_item_id = Guid.NewGuid().ToString(),
                    receiver = seller.Gmail
                };

                payoutItems.Add(payoutItem);
            }

            var payoutRequest = new
            {
                sender_batch_header = new
                {
                    sender_batch_id = Guid.NewGuid().ToString(),
                    email_subject = "You have a payout!",
                    email_message = "You have received a payout! Thanks for using our service!"
                },
                items = payoutItems
            };

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v1/payments/payouts");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Content =
                new StringContent(JsonSerializer.Serialize(payoutRequest), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            response.EnsureSuccessStatusCode();

            var jsonDoc = JsonDocument.Parse(content);
            var payoutBatchId = jsonDoc.RootElement.GetProperty("batch_header").GetProperty("payout_batch_id")
                .GetString();

            await _unitOfWork.CompleteAsync();

            return ResponseModel.Success("Success", payoutBatchId);
        }
        catch (Exception ex)
        {
            return ResponseModel.Error($"Error creating PayPal payout: {ex.Message}");
        }
    }

    private async Task<ResponseModel> GetPayoutStatusAsync(string payoutBatchId, string accessToken)
    {
        var request =
            new HttpRequestMessage(HttpMethod.Get, $"{_config.PayPalApiUrl}/v1/payments/payouts/{payoutBatchId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        var status = jsonDoc.RootElement.GetProperty("batch_header").GetProperty("batch_status").GetString();

        return ResponseModel.Success("Success", status);
    }

    private async Task<double> GetConversionRateVndToUsd()
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("x-rapidapi-host", "currency-converter5.p.rapidapi.com");
            client.DefaultRequestHeaders.Add("x-rapidapi-key", _config.RapidapiKey);

            var url =
                "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=VND&to=USD&amount=1&language=en";

            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();

            dynamic data = JsonConvert.DeserializeObject(content);
            double rate = data.rates.USD.rate;

            return rate;
        }
    }


    private async Task<string> GenerateAccessTokenAsync()
    {
        var auth = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_config.PayPalClientId}:{_config.PayPalSecret}"));

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v1/oauth2/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        });

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        var accessToken = jsonDoc.RootElement.GetProperty("access_token").GetString();
        return accessToken;
    }


    private async Task<string> CreatePayPalOrderAsync(string orderId, string accessToken, double amount)
    {
        var orderRequest = new
        {
            intent = "CAPTURE",
            purchase_units = new[]
            {
                new
                {
                    reference_id = Guid.NewGuid().ToString(),
                    amount = new
                    {
                        currency_code = "USD",
                        value = amount.ToString("F2"),
                        breakdown = new
                        {
                            item_total = new
                            {
                                currency_code = "USD",
                                value = amount.ToString("F2")
                            }
                        }
                    }
                }
            },
            application_context = new
            {
                return_url = $"{_config.BaseUrl}/payment-return?method=paypal&orderId={orderId}",
                cancel_url = $"{_config.BaseUrl}/payment-return?method=paypal&orderId={orderId}",
                shipping_preference = "NO_SHIPPING",
                user_action = "PAY_NOW",
                brand_name = "TicketResell"
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v2/checkout/orders");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Content = new StringContent(JsonSerializer.Serialize(orderRequest), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var paymentUrl = await GetApprovalLink(response);

        return paymentUrl;
    }

    public async Task<ResponseModel> CapturePaymentAsync(string token)
    {
        var accessToken = await GenerateAccessTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v2/checkout/orders/{token}/capture");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);

        // Extract the capture ID from the response
        var captureId = jsonDoc.RootElement
            .GetProperty("purchase_units")[0]
            .GetProperty("payments")
            .GetProperty("captures")[0]
            .GetProperty("id")
            .GetString();

        return ResponseModel.Success("Payment captured successfully", captureId);
    }


    public async Task<string> GetApprovalLink(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();

        // Deserialize the JSON content into a JsonDocument
        var jsonDoc = JsonDocument.Parse(content);

        // Find the link with "approve" rel
        var approvalLink = jsonDoc.RootElement
            .GetProperty("links")
            .EnumerateArray()
            .First(link => link.GetProperty("rel").GetString() == "approve")
            .GetProperty("href")
            .GetString();

        return approvalLink;
    }

    public async Task<ResponseModel> RefundPaymentAsync(string transactionId)
    {
        try
        {
            var accessToken = await GenerateAccessTokenAsync();
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v2/payments/captures/{transactionId}/refund");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Content = new StringContent("{}", Encoding.UTF8, "application/json"); // Empty JSON body for refund

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(content);
            var status = jsonDoc.RootElement.GetProperty("status").GetString();

            if (status == "COMPLETED")
                return ResponseModel.Success("Refund completed successfully");

            return ResponseModel.Error("Refund failed");
        }
        catch (Exception ex)
        {
            return ResponseModel.Error($"Error processing refund: {ex.Message}");
        }
    }

}