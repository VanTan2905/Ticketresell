using AutoMapper;
using Repositories.Core.Dtos.SellConfig;
using TicketResell.Repositories.Helper;

namespace Api.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class SellConfigController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly ISellConfigService _sellConfigService;

    public SellConfigController(IServiceProvider serviceProvider, IMapper mapper)
    {
        _sellConfigService = serviceProvider.GetRequiredService<ISellConfigService>();
        _mapper = mapper;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateSellConfig([FromBody] SellConfigCreateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to create a sell configuration"));

        var response = await _sellConfigService.CreateSellConfigAsync(dto);
        return ResponseParser.Result(response);
    }

    [HttpGet("read")]
    public async Task<IActionResult> ReadSellConfig()
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to read sell configurations"));

        var response = await _sellConfigService.GetAllSellConfigAsync();
        return ResponseParser.Result(response);
    }

    [HttpPut("update/{sellConfigId}")]
    public async Task<IActionResult> UpdateSellConfig(string sellConfigId, [FromBody] SellConfigUpdateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to update sell configurations"));

        var response = await _sellConfigService.UpdateSellConfigAsync(sellConfigId, dto);
        return ResponseParser.Result(response);
    }

    [HttpDelete("delete/{sellConfigId}")]
    public async Task<IActionResult> DeleteSellConfig(string sellConfigId)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to delete sell configurations"));

        var response = await _sellConfigService.DeleteSellConfigAsync(sellConfigId);
        return ResponseParser.Result(response);
    }
}