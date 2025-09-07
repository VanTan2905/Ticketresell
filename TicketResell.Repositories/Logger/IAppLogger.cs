namespace TicketResell.Repositories.Logger;

public interface IAppLogger
{
    void LogInformation(string message);
    void LogError(string message);
}