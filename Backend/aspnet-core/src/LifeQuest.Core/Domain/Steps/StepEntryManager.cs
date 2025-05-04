using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using LifeQuest.Domain.Weight;

namespace LifeQuest.Domain.Steps
{
    public class StepEntryManager : DomainService
    {
        private readonly IRepository<StepEntry, Guid> _stepEntryRepository;

        public StepEntryManager(IRepository<StepEntry, Guid> stepEntryRepository)
        {
            _stepEntryRepository = stepEntryRepository;
        }

        public async Task<StepEntry> CreateAsync(Guid personId, int steps, DateTime date, string note, int caloriesBurned)
        {
            var entry = new StepEntry
            {
                PersonId = personId,
                Steps = steps,
                Date = date,
                Note = note,
                CaloriesBurned = caloriesBurned
            };
            await _stepEntryRepository.InsertAsync(entry);
            return entry;
        }

        public async Task<StepEntry> UpdateAsync(Guid id, int steps, DateTime date, string note, int caloriesBurned)
        {
            var entry = await _stepEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Weight entry not found");

            entry.Steps = steps;
            entry.Date = date;
            entry.Note = note;
            entry.CaloriesBurned = caloriesBurned;

            await _stepEntryRepository.UpdateAsync(entry);
            return entry;
        }

        public async Task DeleteAsync(Guid id)
        {
            var entry = await _stepEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Weight entry not found");

            await _stepEntryRepository.DeleteAsync(entry);
        }
    }
}
