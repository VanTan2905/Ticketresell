using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class Chat
{
    public string SenderId { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string ChatId { get; set; } = null!;

    public DateTime? Date { get; set; }

    public string? ChatboxId { get; set; }

    public virtual Chatbox? Chatbox { get; set; }

    public virtual User Receiver { get; set; } = null!;

    public virtual User Sender { get; set; } = null!;
}
