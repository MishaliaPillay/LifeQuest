using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

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
            // Calculate the start and end of the day (to ensure one entry per day)
            var startOfDay = date.Date;
            var endOfDay = startOfDay.AddDays(1);

            // Check if an entry already exists for the same person on the same day
            var existingEntry = await _stepEntryRepository
                .GetAll()
                .Where(e => e.PersonId == personId && e.Date >= startOfDay && e.Date < endOfDay)
                .FirstOrDefaultAsync();

            if (existingEntry != null)
                throw new UserFriendlyException("A step entry for this day already exists.");

            // Create a new step entry
            var entry = new StepEntry
            {
                PersonId = personId,
                Steps = steps,
                Date = date,
                Note = note,
                CaloriesBurned = caloriesBurned
            };

            // Insert the new step entry
            await _stepEntryRepository.InsertAsync(entry);
            return entry;
        }

        public async Task<StepEntry> UpdateAsync(Guid id, int steps, DateTime date, string note, int caloriesBurned)
        {
            var entry = await _stepEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Step entry not found");

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
                throw new UserFriendlyException("Step entry not found");

            await _stepEntryRepository.DeleteAsync(entry);
        }
    }
}
