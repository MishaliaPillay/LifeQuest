
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Paths.HealthPath
{
    public class HealthPathManager : DomainService
    {
        private readonly IRepository<HealthPath, Guid> _healthPathRepo;

        public HealthPathManager(IRepository<HealthPath, Guid> healthPathRepo)
        {
            _healthPathRepo = healthPathRepo;
        }

        public async Task<HealthPath> GetWithDetailsAsync(Guid id)
        {
            var path = await _healthPathRepo
                .GetAll()
                .Include(p => p.MealPlans)
                .Include(p => p.WeightEntries)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (path == null)
                throw new UserFriendlyException("HealthPath not found");

            return path;
        }

        public async Task<List<HealthPath>> GetAllWithDetailsAsync()
        {
            return await _healthPathRepo
                .GetAll()
                .Include(p => p.MealPlans)
                .Include(p => p.WeightEntries)
                .ToListAsync();
        }

        public Task<HealthPath> CreateAsync(HealthPath path) => _healthPathRepo.InsertAsync(path);

        public Task<HealthPath> UpdateAsync(HealthPath path) => _healthPathRepo.UpdateAsync(path);

        public async Task DeleteAsync(Guid id)
        {
            var path = await _healthPathRepo.FirstOrDefaultAsync(id);
            if (path == null)
                throw new UserFriendlyException("HealthPath not found");

            await _healthPathRepo.DeleteAsync(path);
        }
    }

}
