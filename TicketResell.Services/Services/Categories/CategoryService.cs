using AutoMapper;
using Repositories.Core.Dtos.Category;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Categories;

public class CategoryService : ICategoryService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidatorFactory _validatorFactory;


    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
    }


    public async Task<ResponseModel> GetCategoriesAsync()
    {
        var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
        var categoryDto = _mapper.Map<IEnumerable<CategoryReadDto>>(categories);
        return ResponseModel.Success("Successfully get categories", categoryDto);
    }

    public async Task<ResponseModel> GetCategoriesByNameAsync(string name)
    {
        var categories = await _unitOfWork.CategoryRepository.GetCategoriesByNameAsync(name);
        if (categories.Count == 0)
            return ResponseModel.NotFound("No categories found.");
        return ResponseModel.Success("Successfully get categories by name", categories);
    }

    public async Task<ResponseModel> GetCategoryByIdAsync(string id)
    {
        var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);

        var categoryDto = _mapper.Map<CategoryReadDto>(category);
        return ResponseModel.Success("Successfully get categories", categoryDto);
    }

    public async Task<ResponseModel> CreateCategoryAsync(CategoryCreateDto dto, bool saveAll)
    {
        var validator = _validatorFactory.GetValidator<Category>();
        var newCate = _mapper.Map<Category>(dto);
        var validationResult = validator.Validate(newCate);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        await _unitOfWork.CategoryRepository.CreateAsync(newCate);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully created Category");
    }

    public async Task<ResponseModel> UpdateCategoryAsync(string id, CategoryUpdateDto? dto, bool saveAll)
    {
        var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);

        var validator = _validatorFactory.GetValidator<Category>();
        var validationResult = validator.Validate(category);
        if (!validationResult.IsValid) return ResponseModel.BadRequest("Validation error", validationResult.Errors);
        _mapper.Map(dto, category);
        _unitOfWork.CategoryRepository.Update(category);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully updated Category: {category.CategoryId}");
    }

    public async Task<ResponseModel> DeleteCategoryAsync(string id, bool saveAll)
    {
        await _unitOfWork.CategoryRepository.DeleteCategoryAsync(id);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted Category with id: {id}");
    }
}