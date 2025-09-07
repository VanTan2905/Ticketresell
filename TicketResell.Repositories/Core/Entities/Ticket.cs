using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class Ticket
{
    public string TicketId { get; set; } = null!;

    public string? SellerId { get; set; }

    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? CreateDate { get; set; }

    public DateTime? ModifyDate { get; set; }

    public int? Status { get; set; }

    public string? Image { get; set; }

    public string? Description { get; set; }

    public byte[]? Qr { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual User? Seller { get; set; }

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
}
