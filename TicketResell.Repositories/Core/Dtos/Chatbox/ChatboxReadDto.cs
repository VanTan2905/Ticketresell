using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Chatbox
{
    public class ChatboxReadDto
    {
        public string ChatboxId { get; set; } = null!;
        public int Status { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
    }
}