using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LifeQuest.Services.FitnessService.ExercisePlan.Dtos;

namespace LifeQuest.Services.FitnessService.ExercisePlan
{
    public interface IExercisePlanAppService
    {
        Task<ExercisePlanDto> CreateAsync(CreateExercisePlanDto input);
        Task<ExercisePlanResponseDto> GetAsync(Guid id);
        Task<List<ExercisePlanResponseDto>> GetHistoryAsync(Guid fitnessPathId);
        Task<ExercisePlanDto> UpdateAsync(UpdateExercisePlanDto input);
        Task CompletePlanAsync(Guid planId);
    }
}
