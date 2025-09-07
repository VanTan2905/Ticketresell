using Repositories.Core.Entities;

namespace Repositories.Core.Validators;

public class OrderDetailValidator : Validators<OrderDetail>
{
    public OrderDetailValidator()
    {
        AddRequired(od => od.OrderDetailId);
        AddRequired(od => od.OrderId);
        AddRequired(od => od.TicketId);
        AddEqualOrGreaterThan(od => od.Price, 0);
        AddEqualOrGreaterThan(od => od.Quantity, 0);
    }
}