using Repositories.Core.Helper;

namespace TicketResell.Services.Services;

public interface ITransactionService
{
    public Task<ResponseModel> GetOrderDetailByDate(string sellerId, DateRange dateRange);
    public Task<ResponseModel> CalculatorTotal(string sellerId, DateRange dateRange);
    public Task<ResponseModel> GetTicketOrderDetailsBySeller(string sellerId);

    public Task<ResponseModel> GetAllTransaction();
}