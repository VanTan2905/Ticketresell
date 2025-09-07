namespace Repositories.Repositories;

public interface IRepository<T> where T : class
{
    Task<List<T>> GetAllAsync();
    Task<T?> GetByIdAsync(string id);
    Task CreateAsync(T? entity);
    void Update(T? entity);
    void Delete(T? entity);
    Task DeleteByIdAsync(string id);
}