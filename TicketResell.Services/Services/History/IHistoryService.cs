namespace TicketResell.Services.Services.History;

public interface IHistoryService
{
    Task<ResponseModel> GetHistoryByUserId(string userID);
}