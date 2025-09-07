using Repositories.Core.Entities;

namespace Repositories.Core.Validators;

public class OrderValidator : Validators<Order>
{
    public OrderValidator()
    {
        AddRequired(o => o.OrderId);
        AddRequired(o => o.BuyerId);
        AddEqualOrGreaterThan(o => o.Total, 0);
        AddRequired(o => o.Date);
        AddRequired(o => o.Status);
    }
}