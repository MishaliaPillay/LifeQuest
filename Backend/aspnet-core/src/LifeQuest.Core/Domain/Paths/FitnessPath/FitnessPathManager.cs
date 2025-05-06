using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Paths.FitnessPath
{
    public class FitnessPathManager : DomainService
    {
        private readonly IRepository<FitnessPath, Guid> _fitnessPathRepository;

        public FitnessPathManager(IRepository<FitnessPath, Guid> fitnessPathRepository)
        {
            _fitnessPathRepository = fitnessPathRepository;
        }

        public async Task<FitnessPath> GetWithDetailsAsync(Guid id)
        {
            var path = await _fitnessPathRepository
                .GetAllIncluding(p => p.StepEntries, p => p.WeightEntries, p => p.Activities)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (path == null)
                throw new UserFriendlyException("FitnessPath not found");

            return path;
        }

        public async Task<List<FitnessPath>> GetAllWithDetailsAsync()
        {
            return await _fitnessPathRepository
                .GetAllIncluding(p => p.StepEntries, p => p.WeightEntries, p => p.Activities)
                .ToListAsync();
        }

        public async Task<FitnessPath> CreateAsync(FitnessPath path)
        {
            return await _fitnessPathRepository.InsertAsync(path);
        }

        public async Task<FitnessPath> UpdateAsync(FitnessPath path)
        {
            return await _fitnessPathRepository.UpdateAsync(path);
        }

        public async Task DeleteAsync(Guid id)
        {
            var path = await _fitnessPathRepository.FirstOrDefaultAsync(id);
            if (path == null)
                throw new UserFriendlyException("FitnessPath not found");

            await _fitnessPathRepository.DeleteAsync(path);
        }

    }
}
