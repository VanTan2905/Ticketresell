using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    Task<List<Category>> GetCategoriesByNameAsync(string name);
    Task DeleteCategoryAsync(string id);
}