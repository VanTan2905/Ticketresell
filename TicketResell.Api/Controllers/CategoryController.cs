using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Constants;
using Repositories.Core.Dtos.Category;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Categories;

namespace TicketResell.Repositories.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IServiceProvider _serviceProvider;

    public CategoryController(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _categoryService = serviceProvider.GetRequiredService<ICategoryService>();
    }

    [HttpGet]
    [Route("read")]
    public async Task<IActionResult> GetCategories()
    {
        var response = await _categoryService.GetCategoriesAsync();
        return ResponseParser.Result(response);
    }

    [HttpGet]
    [Route("readbyname/{name}")]
    public async Task<IActionResult> SearchCategoriesByName(string name)
    {
        var response = await _categoryService.GetCategoriesByNameAsync(name);
        return ResponseParser.Result(response);
    }


    [HttpGet("read/{id}")]
    public async Task<IActionResult> GetCategoryById(string id)
    {
        var response = await _categoryService.GetCategoryByIdAsync(id);
        return ResponseParser.Result(response);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to create category"));

        if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(
                ResponseModel.Forbidden("You don't have permission to create categories"));
        dto.CategoryId = "CAT" + Guid.NewGuid();
        return ResponseParser.Result(await _categoryService.CreateCategoryAsync(dto));
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryUpdateDto dto)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to update category"));

        if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(
                ResponseModel.Forbidden("You don't have permission to update categories"));

        return ResponseParser.Result(await _categoryService.UpdateCategoryAsync(id, dto));
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        if (!HttpContext.GetIsAuthenticated())
            return ResponseParser.Result(
                ResponseModel.Unauthorized("You need to be authenticated to delete category"));

        if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
            return ResponseParser.Result(
                ResponseModel.Forbidden("You don't have permission to delete categories"));

        return ResponseParser.Result(await _categoryService.DeleteCategoryAsync(id));
    }
}