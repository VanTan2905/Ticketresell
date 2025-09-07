using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class Order
{
    public string OrderId { get; set; } = null!;

    public string? BuyerId { get; set; }

    public double? Total { get; set; }

    public DateTime? Date { get; set; }

    public int? Status { get; set; }

    public string? PaymentMethod { get; set; }

    public string? CaptureId { get; set; }

    public virtual User? Buyer { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
