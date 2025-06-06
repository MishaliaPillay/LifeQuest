﻿using LifeQuest.Services.FitnessService.Activity.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static LifeQuest.Services.FitnessService.Activity.Dtos.ActivityResponseDto;

namespace LifeQuest.Services.FitnessService.Activity
{
    public interface IActivityTypeAppService
    {
        Task<ActivityTypeResponseDto> CreateActivityTypeAsync(CreateActivityTypeDto input);
        Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync();
        Task<ActivityTypeResponseDto> UpdateActivityTypeAsync(UpdateActivityTypeDto input);
        Task DeleteActivityTypeAsync(Guid id);
        Task<ActivityTypeResponseDto> GenerateExerciseActivityTypeAsync(ExerciseGenerationRequestDto input);
        Task<GeneratedActivityTypeResultDto> GenerateExerciseActivityTypesAsync(ExerciseGenerationBatchRequestDto input);


    }
}
