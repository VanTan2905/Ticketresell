using System;
using System.Collections.Generic;

namespace Repositories.Core.Entities;

public partial class Revenue
{
    public string RevenueId { get; set; } = null!;

    public string? SellerId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public double? Revenue1 { get; set; }

    public string? Type { get; set; }

    public virtual User? Seller { get; set; }
}
