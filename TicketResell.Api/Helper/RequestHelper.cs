using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Constants;
using TicketResell.Repositories.Core.Dtos.Authentication;

namespace TicketResell.Repositories.Helper;

public static class RequestHelper
{
    private const string IsAuthenticatedKey = "isAuthenticated";
    private const string UserIdKey = "userId";
    private const string AccessKeyKey = "accessKey";
    private const string RoleKey = "roleKey";

    #region UserId

    public static string GetUserId(this HttpContext? context)
    {
        if (context is not null)
        {
            var userId = context.Session.GetString(UserIdKey);

            if (!string.IsNullOrEmpty(userId)) return userId;
        }

        return string.Empty;
    }

    #endregion

    #region AccessKey

    public static string GetAccessKey(this HttpContext? context)
    {
        if (context is not null)
        {
            var accessKey = context.Session.GetString(AccessKeyKey);

            if (!string.IsNullOrEmpty(accessKey)) return accessKey;
        }

        return string.Empty;
    }

    #endregion

    #region AuthenTicated

    public static async Task<RequestAuthenData> CheckAuthenTicatedDataAsync(this HttpContext? context,
        IServiceProvider serviceProvider)
    {
        var result = new RequestAuthenData();

        if (context == null)
            return result;

        var highestRole = UserRole.Buyer;

        result.UserId = context.Session.GetString("userId") ?? string.Empty;
        result.AccessKey = context.Session.GetString("accessKey") ?? string.Empty;

        if (!string.IsNullOrEmpty(result.UserId) && !string.IsNullOrEmpty(result.AccessKey))
        {
            var authenticationService = serviceProvider.GetRequiredService<IAuthenticationService>();
            var tryLogin = await authenticationService.LoginWithAccessKeyAsync(result.UserId, result.AccessKey);
            if (tryLogin.StatusCode == 200)
            {
                if (tryLogin.Data != null && tryLogin.Data is LoginInfoDto { User: not null } loginInfo)
                    foreach (var role in loginInfo.User.Roles)
                    {
                        var userRole = RoleHelper.GetUserRole(role.RoleId);
                        if (userRole > highestRole) highestRole = userRole;
                    }

                result.IsAuthenticated = true;
            }
        }

        result.Role = highestRole.ToString();

        context.SetIsAuthenticated(result.IsAuthenticated);
        context.SetRole(result.Role);

        return result;
    }

    public static RequestAuthenData GetAuthenData(this HttpContext? context)
    {
        var result = new RequestAuthenData();
        if (context is not null)
        {
            var isAuthenticated = context.Session.GetString(IsAuthenticatedKey);

            if (!string.IsNullOrEmpty(isAuthenticated)) result.IsAuthenticated = bool.Parse(isAuthenticated);

            result.UserId = context.Session.GetString(UserIdKey) ?? string.Empty;
            result.AccessKey = context.Session.GetString(AccessKeyKey) ?? string.Empty;
            result.Role = context.Session.GetString(RoleKey) ?? UserRole.Buyer.ToString();
        }

        return result;
    }

    public static bool GetIsAuthenticated(this HttpContext? context)
    {
        if (context is not null)
        {
            var isAuthenticated = context.Session.GetString(IsAuthenticatedKey);

            if (!string.IsNullOrEmpty(isAuthenticated)) return bool.Parse(isAuthenticated);
        }

        return false;
    }

    public static bool IsUserIdAuthenticated(this HttpContext? context, string? userId)
    {
        if (context is null) return false;
        if (string.IsNullOrEmpty(userId)) return false;

        var isAuthenticated = context.Session.GetString(IsAuthenticatedKey);
        if (string.IsNullOrEmpty(isAuthenticated)) return false;

        var contextUserId = context.GetUserId();
        if (string.IsNullOrEmpty(contextUserId)) return false;

        return string.Equals(contextUserId, userId) && bool.Parse(isAuthenticated);
    }

    #endregion

    #region Role

    public static string GetRole(this HttpContext? context)
    {
        if (context is not null)
        {
            var role = context.Session.GetString(RoleKey);

            if (!string.IsNullOrEmpty(role)) return role;
        }

        return string.Empty;
    }

    public static bool HasEnoughtRoleLevel(this HttpContext? context, UserRole roleNeed = UserRole.Buyer)
    {
        return RoleHelper.HasEnoughRoleLevel(RoleHelper.ConvertToRole(context.GetRole()), roleNeed);
    }

    public static bool HasEqualRoleLevel(this HttpContext? context, UserRole roleNeed = UserRole.Buyer)
    {
        return RoleHelper.ConvertToRole(context.GetRole()) == roleNeed;
    }

    #endregion

    #region SetData

    public static void SetIsAuthenticated(this HttpContext? context, bool value = false)
    {
        if (context is not null) context.Session.SetString(IsAuthenticatedKey, value.ToString());
    }

    public static void SetUserId(this HttpContext? context, string value = "")
    {
        if (context is not null)
        {
            if (value != string.Empty)
                context.Session.SetString(UserIdKey, value);
            else
                context.Session.Remove(UserIdKey);
        }
    }

    public static void SetAccessKey(this HttpContext? context, string? value = "")
    {
        if (context is not null)
        {
            if (value != string.Empty)
                context.Session.SetString(AccessKeyKey, value ?? "");
            else
                context.Session.Remove(AccessKeyKey);
        }
    }

    public static void SetRole(this HttpContext? context, string? value = "")
    {
        if (context is not null)
        {
            if (value != string.Empty)
                context.Session.SetString(RoleKey, value ?? "");
            else
                context.Session.Remove(RoleKey);
        }
    }

    #endregion
}

public class RequestAuthenData
{
    public bool IsAuthenticated { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}