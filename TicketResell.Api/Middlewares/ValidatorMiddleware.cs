using TicketResell.Repositories.Helper;

namespace Api.Middlewares;

public class ValidatorMiddleware
{
    private readonly RequestDelegate _next;

    public ValidatorMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        await context.CheckAuthenTicatedDataAsync(serviceProvider);

        await _next(context);
    }
}