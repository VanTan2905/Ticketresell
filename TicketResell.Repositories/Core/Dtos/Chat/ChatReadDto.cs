namespace TicketResell.Repositories.Core.Dtos.Chat;

public class ChatReadDto
{
    public string SenderId { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string ChatId { get; set; } = null!;
    public string? ChatboxId { get; set; }
    public DateTime? Date { get; set; }
}