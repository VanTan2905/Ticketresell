using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TicketResell.Services.Services;

public static class ResponseParser
{
    public static IActionResult Result(ResponseModel responseModel)
    {
        return responseModel.StatusCode switch
        {
            StatusCodes.Status200OK => new OkObjectResult(responseModel),
            StatusCodes.Status400BadRequest => new BadRequestObjectResult(responseModel),
            StatusCodes.Status404NotFound => new NotFoundObjectResult(responseModel),
            StatusCodes.Status500InternalServerError
                => new ObjectResult(responseModel)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                },
            _ => new BadRequestObjectResult(responseModel)
        };
    }
}