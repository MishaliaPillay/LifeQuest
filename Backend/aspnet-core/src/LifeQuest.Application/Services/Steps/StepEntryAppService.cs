using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper.Internal.Mappers;
using LifeQuest.Domain.Steps;
using Microsoft.EntityFrameworkCore;
using LifeQuest.Services.Steps.Dtos;

namespace LifeQuest.Services.Steps
{
    public class StepEntryAppService : ApplicationService, IStepEntryAppService
    {
        private readonly IRepository<StepEntry, Guid> _stepEntryRepository;

        public StepEntryAppService(IRepository<StepEntry, Guid> stepEntryRepository)
        {
            _stepEntryRepository = stepEntryRepository;
        }

        private int CalculateCalories(int steps, float weightKg)
        {
            return (int)(steps * weightKg * 0.0005);
        }

        public async Task<StepEntryResponseDto> CreateAsync(CreateStepEntryDto input)
        {
            // For demo purposes, assuming fixed weight of 70kg; replace with actual Person lookup
            float weightKg = 70f;
            var entry = ObjectMapper.Map<StepEntry>(input);
            entry.CaloriesBurned = CalculateCalories(input.Steps, weightKg);
            await _stepEntryRepository.InsertAsync(entry);
            return ObjectMapper.Map<StepEntryResponseDto>(entry);
        }

        public async Task<StepEntryResponseDto> GetAsync(Guid id)
        {
            var entry = await _stepEntryRepository.FirstOrDefaultAsync(id);
            if (entry == null)
                throw new UserFriendlyException("Step entry not found");
            return ObjectMapper.Map<StepEntryResponseDto>(entry);
        }

        public async Task<List<StepEntryResponseDto>> GetAllForPersonAsync(Guid personId)
        {
            var entries = await _stepEntryRepository.GetAll()
                .Where(e => e.PersonId == personId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
            return ObjectMapper.Map<List<StepEntryResponseDto>>(entries);
        }

        public async Task<StepEntryResponseDto> UpdateAsync(UpdateStepEntryDto input)
        {
            var entry = await _stepEntryRepository.FirstOrDefaultAsync(input.Id);
            if (entry == null)
                throw new UserFriendlyException("Step entry not found");

            // Fixed weight, or replace with person weight retrieval
            float weightKg = 70f;

            ObjectMapper.Map(input, entry);
            entry.CaloriesBurned = CalculateCalories(input.Steps, weightKg);
            await _stepEntryRepository.UpdateAsync(entry);
            return ObjectMapper.Map<StepEntryResponseDto>(entry);
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
