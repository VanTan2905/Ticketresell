using Repositories.Core.Dtos.Payment;

namespace TicketResell.Services.Services.Payments;

public interface IVnpayService
{
    public Task<ResponseModel> CreatePaymentAsync(PaymentDto paymentRequest, double amount);
    public Task<ResponseModel> CheckTransactionStatus(string orderId);
}