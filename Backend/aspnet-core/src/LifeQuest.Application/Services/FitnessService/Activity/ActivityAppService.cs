using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Services.FitnessService.Activity.Dtos;
// Add EntityFrameworkCore for Include/ThenInclude extension methods
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Services.FitnessService.Activity
{
    public class ActivityAppService : ApplicationService, IActivityAppService
    {
        private readonly ActivityManager _activityManager;
        private readonly ActivityTypeManager _activityTypeManager;

        public ActivityAppService(ActivityManager activityManager, ActivityTypeManager activityTypeManager)
        {
            _activityManager = activityManager;
            _activityTypeManager = activityTypeManager;
        }

        public async Task<ActivityResponseDto> CreateActivityAsync(CreateActivityDto input)
        {
            var activityTypes = await _activityTypeManager.GetAllAsync();
            var selectedActivityTypes = activityTypes.Where(at => input.ActivityTypeIds.Contains(at.Id)).ToList();

            var activity = await _activityManager.CreateActivityAsync(
                input.Calories,
                input.Duration,
                input.Xp,
                input.Level,
                selectedActivityTypes,  // Now passing List<ActivityType>
                input.IsComplete,
                input.Rating,
                input.Description
            );

            return new ActivityResponseDto
            {
                Calories = activity.Calories,
                Duration = activity.Duration,
                Xp = activity.Xp,
                Level = activity.Level,
                IsComplete = activity.IsComplete,
                Rating = activity.Rating,
                Description = activity.Description,
                Activities = activity.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    IntensityLevel = aat.ActivityType.IntensityLevel,
                    Description = aat.ActivityType.Description
                }).ToList()
            };
        }

        public async Task DeleteActivityAsync(Guid id)
        {
            await _activityManager.DeleteActivityAsync(id);
        }

        public async Task<List<ActivityResponseDto>> GetAllActivityAsync()
        {
            var activities = await _activityManager.GetAllAsync();

            return activities.Select(a => new ActivityResponseDto
            {
                Calories = a.Calories,
                Duration = a.Duration,
                Xp = a.Xp,
                Level = a.Level,
                IsComplete = a.IsComplete,
                Rating = a.Rating,
                Description = a.Description,
                Activities = a.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    IntensityLevel = aat.ActivityType.IntensityLevel,
                    Description = aat.ActivityType.Description
                }).ToList()
            }).ToList();
        }

        public async Task<ActivityResponseDto> UpdateActivityAsync(UpdateActivityDto input)
        {
            var activityTypes = await _activityTypeManager.GetAllAsync();
            var updatedActivityTypes = activityTypes
                .Where(at => input.Activities.Select(a => a.Id).Contains(at.Id))
                .ToList();

            var updated = await _activityManager.UpdateActivityAsync(
                input.Id,
                input.Calories,
                input.Duration,
                input.Xp,
                input.Level,
                updatedActivityTypes,  // Now passing List<ActivityType>
                input.IsComplete,
                input.Rating,
                input.Description
            );

            return new ActivityResponseDto
            {
                Calories = updated.Calories,
                Duration = updated.Duration,
                Xp = updated.Xp,
                Level = updated.Level,
                IsComplete = updated.IsComplete,
                Rating = updated.Rating,
                Description = updated.Description,
                Activities = updated.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    IntensityLevel = aat.ActivityType.IntensityLevel,
                    Description = aat.ActivityType.Description
                }).ToList()
            };
        }
    }
}