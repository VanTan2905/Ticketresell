using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class Chatbox
{
    public string ChatboxId { get; set; } = null!;

    public int Status { get; set; }

    public DateTime? CreateDate { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Chat> Chats { get; set; } = new List<Chat>();
}
