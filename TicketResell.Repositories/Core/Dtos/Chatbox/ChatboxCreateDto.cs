using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Chatbox
{
    public class ChatboxCreateDto
    {
        [Required]
        public string ChatboxId { get; set; } = null!;

        [Required]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }
        public int Status { get; set; }
        
    }
}