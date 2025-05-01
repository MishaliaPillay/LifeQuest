using Abp.Application.Services;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LifeQuest.Services.FitnessService.Activity
{
    public class ActivityTypeAppService : ApplicationService, IActivityTypeAppService
    {
        private readonly ActivityTypeManager _activityTypeManager;

        public ActivityTypeAppService(ActivityTypeManager activityTypeManager)
        {
            _activityTypeManager = activityTypeManager;
        }

        public async Task<ActivityTypeResponseDto> CreateActivityTypeAsync(CreateActivityTypeDto input)
        {
            var created = await _activityTypeManager.CreateActivityTypeAsync(
                input.Category,
                input.IntensityLevel,
                input.Description
            );

            return new ActivityTypeResponseDto
            {
                Id = created.Id,
                Category = created.Category,
                IntensityLevel = created.IntensityLevel,
                Description = created.Description
            };
        }

        public async Task<List<ActivityTypeResponseDto>> GetAllActivityTypesAsync()
        {
            var items = await _activityTypeManager.GetAllAsync();

            return items.Select(a => new ActivityTypeResponseDto
            {
                Id = a.Id,
                Category = a.Category,
                IntensityLevel = a.IntensityLevel,
                Description = a.Description
            }).ToList();
        }

        public async Task<ActivityTypeResponseDto> UpdateActivityTypeAsync(UpdateActivityTypeDto input)
        {
            var updated = await _activityTypeManager.UpdateActivityTypeAsync(
                input.Id,
                input.Category,
                input.IntensityLevel,
                input.Description
            );

            return new ActivityTypeResponseDto
            {
                Id = updated.Id,
                Category = updated.Category,
                IntensityLevel = updated.IntensityLevel,
                Description = updated.Description
            };
        }

        public async Task DeleteActivityTypeAsync(Guid id)
        {
            await _activityTypeManager.DeleteActivityTypeAsync(id);
        }
    }
}
