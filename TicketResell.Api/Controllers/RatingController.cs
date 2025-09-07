using TicketResell.Repositories.Core.Dtos.Rating;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Ratings;

namespace Api.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class RatingController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingController(IServiceProvider serviceProvider)
    {
        _ratingService = serviceProvider.GetRequiredService<IRatingService>();
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateRating([FromBody] RatingCreateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to create a rating."));

        var userId = HttpContext.GetUserId();
        var response = await _ratingService.CreateRatingAsync(dto, userId);
        return ResponseParser.Result(response);
    }

    [HttpGet]
    [Route("read")]
    public async Task<IActionResult> GetRatings()
    {
        var response = await _ratingService.GetRatingsAsync();
        return ResponseParser.Result(response);
    }

    [HttpGet]
    [Route("read/{id}")]
    public async Task<IActionResult> GetRatingById(string id)
    {
        var response = await _ratingService.GetRatingByIdAsync(id);
        return ResponseParser.Result(response);
    }

    [HttpGet]
    [Route("byseller/{sellerId}")]
    public async Task<IActionResult> GetRatingsBySellerId(string sellerId)
    {
        var response = await _ratingService.GetRatingsBySellerIdAsync(sellerId);
        return ResponseParser.Result(response);
    }

    [HttpGet]
    [Route("byuser/{userId}")]
    public async Task<IActionResult> GetRatingsByUserId(string userId)
    {
        var response = await _ratingService.GetRatingsByUserIdAsync(userId);
        return ResponseParser.Result(response);
    }

    [HttpPut]
    [Route("update/{id}")]
    public async Task<IActionResult> UpdateRating(string id, [FromBody] RatingUpdateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to update a rating."));

        var response = await _ratingService.UpdateRatingAsync(id, dto);
        return ResponseParser.Result(response);
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeleteRating(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to delete a rating."));
        var response = await _ratingService.DeleteRatingAsync(id);
        return ResponseParser.Result(response);
    }

    // Uncomment if you have a method in the service to delete ratings by seller ID
    // [HttpDelete]
    // [Route("deletebyseller/{sellerId}")]
    // public async Task<IActionResult> DeleteRatingsBySellerId(string sellerId)
    // {
    //     var response = await _ratingService.DeleteRatingsBySellerIdAsync(sellerId);
    //     return ResponseParser.Result(response);
    // }
}