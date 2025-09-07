using Repositories.Constants;

namespace TicketResell.Repositories.Helper;

public static class RoleHelper
{
    public static Dictionary<string, UserRole> RolesTable = new()
    {
        { "RO1", UserRole.Buyer },
        { "RO2", UserRole.Seller },
        { "RO3", UserRole.Staff },
        { "RO4", UserRole.Admin }
    };

    public static UserRole ConvertToRole(string role)
    {
        if (Enum.TryParse(role, true, out UserRole roleValue)) return roleValue;

        return 0;
    }

    public static UserRole GetUserRole(string roleId)
    {
        if (RolesTable.TryGetValue(roleId, out var role))
            return role;

        return 0;
    }

    public static bool HasEnoughRoleLevel(string userRoleId, UserRole requiredRole)
    {
        var userRole = GetUserRole(userRoleId);

        return userRole >= requiredRole;
    }

    public static bool HasEnoughRoleLevel(UserRole userRole, UserRole requiredRole)
    {
        return userRole >= requiredRole;
    }
}