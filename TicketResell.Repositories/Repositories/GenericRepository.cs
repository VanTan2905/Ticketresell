using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;

namespace Repositories.Repositories;

public class GenericRepository<T> : IRepository<T> where T : class
{
    private readonly DbSet<T> _dbSet;

    public GenericRepository(TicketResellManagementContext context)
    {
        _dbSet = context.Set<T>();
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(string id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity == null) throw new KeyNotFoundException("Id not found");
        return entity;
    }

    public async Task CreateAsync(T? entity)
    {
        if (entity != null)
            await _dbSet.AddAsync(entity);
    }

        public void Update(T? entity)
        {
            if (entity != null) 
                _dbSet.Update(entity);
        }
        

        public void Delete(T? entity)
        {
            if (entity != null) 
                _dbSet.Remove(entity);
        }

    public async Task DeleteByIdAsync(string id)
    {
        var entity = await GetByIdAsync(id);

        if (entity != null)
            _dbSet.Remove(entity);
    }
}