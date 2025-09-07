using Repositories.Core.Dtos.Payment;
using Repositories.Core.Entities;

namespace TicketResell.Services.Services.Payments;

public interface IPaypalService
{
    public Task<ResponseModel> CreatePaymentAsync(PaymentDto paymentRequest, double amount);
    public Task<ResponseModel> CheckTransactionStatus(string orderId);
    public Task<ResponseModel> CapturePaymentAsync(string token) ;
    public Task<ResponseModel> GetCaptureDetailsAsync(string captureId);
    public Task<ResponseModel> CheckPayoutStatusAsync(string payoutBatchId);
    public Task<ResponseModel> CreatePayoutAsync(Order order);
}