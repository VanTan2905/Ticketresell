using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class OrderDetail
{
    public string OrderDetailId { get; set; } = null!;

    public string? OrderId { get; set; }

    public string? TicketId { get; set; }

    public double? Price { get; set; }

    public int? Quantity { get; set; }

    public virtual Order? Order { get; set; }

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual Ticket? Ticket { get; set; }
}
