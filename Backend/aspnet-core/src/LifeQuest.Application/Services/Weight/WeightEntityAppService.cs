using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper.Internal.Mappers;
using LifeQuest.Domain.Weight;
using LifeQuest.Services.Weight.Dtos;
using LifeQuest.Services.Weight.LifeQuest.Services.Health;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Services.Weight
{
    public class WeightEntryAppService : ApplicationService, IWeightEntryAppService
    {
        private readonly IRepository<WeightEntry, Guid> _weightEntryRepository;

        public WeightEntryAppService(IRepository<WeightEntry, Guid> weightEntryRepository)
        {
            _weightEntryRepository = weightEntryRepository;
        }

        public async Task<WeightEntryResponseDto> CreateAsync(CreateWeightEntryDto input)
        {
            var weightEntry = ObjectMapper.Map<WeightEntry>(input);
            await _weightEntryRepository.InsertAsync(weightEntry);
            return ObjectMapper.Map<WeightEntryResponseDto>(weightEntry);
        }

        public async Task<WeightEntryResponseDto> GetAsync(Guid id)
        {
            var entry = await _weightEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Weight entry not found");
            return ObjectMapper.Map<WeightEntryResponseDto>(entry);
        }

        public async Task<List<WeightEntryResponseDto>> GetAllForPersonAsync(Guid personId)
        {
            var entries = await _weightEntryRepository.GetAll()
                .Where(e => e.PersonId == personId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
            return ObjectMapper.Map<List<WeightEntryResponseDto>>(entries);
        }

        public async Task<WeightEntryResponseDto> UpdateAsync(UpdateWeightEntryDto input)
        {
            var entry = await _weightEntryRepository.FirstOrDefaultAsync(input.Id);
            if (entry == null)
                throw new UserFriendlyException("Weight entry not found");
            ObjectMapper.Map(input, entry);
            await _weightEntryRepository.UpdateAsync(entry);
            return ObjectMapper.Map<WeightEntryResponseDto>(entry);
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