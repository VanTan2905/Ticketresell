using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Chatbox
{
    public class ChatboxUpdateStatusDto
    {
        [Required]
        [Range(0, 1)]
        public int Status { get; set; }
    }
}