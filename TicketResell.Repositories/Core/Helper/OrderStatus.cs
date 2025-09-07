namespace Repositories.Core.Helper;

public enum OrderStatus
{
    Completed = 0,
    Carting = 1,
    Refund = 2,
    Cancel = 3,
    Processing = -1
}