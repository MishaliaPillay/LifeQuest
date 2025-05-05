using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Weight
{
    public class WeightEntryManager : DomainService
    {
        private readonly IRepository<WeightEntry, Guid> _weightEntryRepository;

        public WeightEntryManager(IRepository<WeightEntry, Guid> weightEntryRepository)
        {
            _weightEntryRepository = weightEntryRepository;
        }

        public async Task<WeightEntry> CreateAsync(Guid personId, float weight, DateTime date, string? note)
        {
            var startOfDay = date.Date;
            var endOfDay = startOfDay.AddDays(1);

            var existingEntry = await _weightEntryRepository
                .GetAll()
                .Where(e => e.PersonId == personId && e.Date >= startOfDay && e.Date < endOfDay)
                .FirstOrDefaultAsync();

            if (existingEntry != null)
                throw new UserFriendlyException("A weight entry for this day already exists.");

            var entry = new WeightEntry
            {
                PersonId = personId,
                Weight = weight,
                Date = date,
                Note = note
            };

            await _weightEntryRepository.InsertAsync(entry);
            return entry;
        }



        public async Task<WeightEntry> UpdateAsync(Guid id, float weight, DateTime date, string? note)
        {
            var entry = await _weightEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Weight entry not found");

            entry.Weight = weight;
            entry.Date = date;
            entry.Note = note;

            await _weightEntryRepository.UpdateAsync(entry);
            return entry;
        }

        public async Task DeleteAsync(Guid id)
        {
            var entry = await _weightEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Weight entry not found");

            await _weightEntryRepository.DeleteAsync(entry);
        }
    }
}
