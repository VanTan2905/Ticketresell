using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using AutoMapper;
using Microsoft.Extensions.Options;
using Repositories.Config;
using Repositories.Core.Dtos.Payment;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Payments;

public class VnpayService : IVnpayService
{
    private readonly AppConfig _config;
    private readonly string _hashSecret;
    private readonly HttpClient _httpClient;

    private readonly IAppLogger _logger;
    private readonly IMapper _mapper;
    private readonly string _redirectUrl;
    private readonly string _tmnCode;

    private readonly IUnitOfWork _unitOfWork;
    private readonly string _vnpayApiUrl;
    private readonly SortedList<string, string> _requestData = new(new VnPayCompare());

    public VnpayService(IUnitOfWork unitOfWork, IMapper mapper, HttpClient httpClient, IOptions<AppConfig> config,
        IAppLogger logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _httpClient = httpClient;
        _config = config.Value;
        _logger = logger;


        _redirectUrl = $"{_config.BaseUrl}/payment-return?method=vnpay";
        _vnpayApiUrl = _config.VnpayApiUrl;

        // Initialize environment variables
        _tmnCode = _config.TmnCode;
        _hashSecret = _config.HashSecret;
    }

    public async Task<ResponseModel> CheckTransactionStatus(string orderId)
    {
        _requestData.Clear();
        var requestId = DateTime.Now.Ticks.ToString();
        var createDate = DateTime.Now.ToString("yyyyMMddHHmmss");
        var clientIp = GetClientIPAddress();

        AddRequestData("vnp_RequestId", requestId);
        AddRequestData("vnp_Version", "2.1.0");
        AddRequestData("vnp_Command", "querydr");
        AddRequestData("vnp_TmnCode", _tmnCode);
        AddRequestData("vnp_TxnRef", orderId);
        AddRequestData("vnp_OrderInfo", $"Query transaction {orderId}");
        AddRequestData("vnp_TransactionNo", "123456");
        AddRequestData("vnp_TransactionDate", createDate);
        AddRequestData("vnp_CreateDate", createDate);
        AddRequestData("vnp_IpAddr", clientIp);

        // Create checksum
        var data =
            $"{requestId}|2.1.0|querydr|{_tmnCode}|{orderId}|{createDate}|{createDate}|{clientIp}|Query transaction {orderId}";
        var secureHash = HmacSHA512(_hashSecret, data);
        AddRequestData("vnp_SecureHash", secureHash);

        var content = new StringContent(
            JsonSerializer.Serialize(_requestData),
            Encoding.UTF8,
            "application/json"
        );

        var response =
            await _httpClient.PostAsync("https://sandbox.vnpayment.vn/merchant_webapi/api/transaction", content);
        var result = await response.Content.ReadAsStringAsync();

        var jsonDoc = JsonDocument.Parse(result);
        var resultCode = jsonDoc.RootElement.GetProperty("vnp_TransactionStatus").GetString();
        var message = jsonDoc.RootElement.GetProperty("vnp_Message").GetString();
        if (resultCode == "01") return ResponseModel.Success(message);
        return ResponseModel.Error(message);
    }

    public Task<ResponseModel> CreatePaymentAsync(PaymentDto dto, double amount)
    {
        var clientIPAddress = GetClientIPAddress();

        AddRequestData("vnp_Version", "2.1.0");
        AddRequestData("vnp_Command", "pay");
        AddRequestData("vnp_TmnCode", _tmnCode); // Use the environment variable
        AddRequestData("vnp_Amount", DoubleToString(amount));
        AddRequestData("vnp_BankCode", "");
        AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
        AddRequestData("vnp_CurrCode", "VND");
        AddRequestData("vnp_IpAddr", clientIPAddress);
        AddRequestData("vnp_Locale", "vn");
        AddRequestData("vnp_OrderInfo", "Payment for " + dto.OrderId);
        AddRequestData("vnp_OrderType", "other");
        AddRequestData("vnp_ReturnUrl", $"{_redirectUrl}&orderId={dto.OrderId}");
        AddRequestData("vnp_TxnRef", dto.OrderId);

        var paymentUrl = CreateRequestUrl(_vnpayApiUrl, _hashSecret); // Use the environment variable
        return Task.FromResult(ResponseModel.Success("Payment created successfully", paymentUrl));
    }

    private static string DoubleToString(double value)
    {
        // Round the double to the nearest integer
        var roundedValue = (int)Math.Round(value);
        // Multiply by 100
        var multipliedValue = roundedValue * 100;
        // Convert to string
        return multipliedValue.ToString();
    }

    private string GetClientIPAddress()
    {
        try
        {
            var hostName = Dns.GetHostName();
            var addresses = Dns.GetHostAddresses(hostName);
            var ipv4Address = addresses.FirstOrDefault(a => a.AddressFamily == AddressFamily.InterNetwork);
            return ipv4Address?.ToString() ?? "127.0.0.1";
        }
        catch (Exception)
        {
            return "127.0.0.1";
        }
    }

    public void AddRequestData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value)) _requestData.Add(key, value);
    }

    public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
    {
        var data = new StringBuilder();
        foreach (var kv in _requestData)
            if (!string.IsNullOrEmpty(kv.Value))
                data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
        var queryString = data.ToString();

        baseUrl += "?" + queryString;
        var signData = queryString;
        if (signData.Length > 0) signData = signData.Remove(data.Length - 1, 1);
        var vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);
        baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

        return baseUrl;
    }

    public static string HmacSHA512(string key, string inputData)
    {
        var hash = new StringBuilder();
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var inputBytes = Encoding.UTF8.GetBytes(inputData);
        using (var hmac = new HMACSHA512(keyBytes))
        {
            var hashValue = hmac.ComputeHash(inputBytes);
            foreach (var theByte in hashValue) hash.Append(theByte.ToString("x2"));
        }

        return hash.ToString();
    }
}

public class VnPayCompare : IComparer<string>
{
    public int Compare(string x, string y)
    {
        if (x == y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        var vnpCompare = CompareInfo.GetCompareInfo("en-US");
        return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
    }
}