using LifeQuest.Services.FitnessService.Activity.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LifeQuest.Services.FitnessService.Activity
{
    public interface IActivityTypeAppService
    {
        Task<ActivityTypeResponseDto> CreateActivityTypeAsync(CreateActivityTypeDto input);
        Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync();
        Task<ActivityTypeResponseDto> UpdateActivityTypeAsync(UpdateActivityTypeDto input);
        Task DeleteActivityTypeAsync(Guid id);
    }
}
