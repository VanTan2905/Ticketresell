using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketResell.Repositories.Logger;

namespace TicketResell.Api.Middlewares
{
    public class OriginLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IAppLogger _logger;
        public OriginLoggingMiddleware(RequestDelegate next, IAppLogger logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Get the Origin header value
            var origin = context.Request.Headers["Origin"].ToString();

            // Log the origin if it exists
            if (!string.IsNullOrEmpty(origin))
            {
                _logger.LogInformation($"Incoming request from origin: {origin}");
                // Alternatively, you can use any logging framework
                if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
                {
                    if (!string.IsNullOrEmpty(origin))
                    {
                        // Log the blocked origin
                        _logger.LogError($"Blocked CORS request from origin: {origin}");
                    }
                    else
                    {
                        // Log a generic CORS error
                        _logger.LogError("Blocked a CORS request with no Origin header.");
                    }
                }
            }



            // Call the next middleware in the pipeline
            await _next(context);
        }
    }
}