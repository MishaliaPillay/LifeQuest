using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using Microsoft.EntityFrameworkCore;
using static LifeQuest.Services.FitnessService.Activity.Dtos.ActivityResponseDto;

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
                selectedActivityTypes,
                input.IsComplete,
                input.Rating,
                input.Description,
                input.PersonId
            );

            return new ActivityResponseDto
            {
                Id = activity.Id, // ✅ Added
                Calories = activity.Calories,
                Duration = activity.Duration,
                Xp = activity.Xp,
                Level = activity.Level,
                IsComplete = activity.IsComplete,
                Rating = activity.Rating,
                Description = activity.Description,
                PersonId = activity.PersonId,
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
                Id = a.Id,
                Calories = a.Calories,
                Duration = a.Duration,
                Xp = a.Xp,
                Level = a.Level,
                IsComplete = a.IsComplete,
                Rating = a.Rating,
                Description = a.Description,
                PersonId = a.PersonId, // ✅ Include PersonId here
                Activities = a.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    IntensityLevel = aat.ActivityType.IntensityLevel,
                    Description = aat.ActivityType.Description
                }).ToList()
            }).ToList();
        }

        public async Task<List<ActivityResponseDto>> GetByPersonIdAsync(Guid personId)
        {
            // Get the activities for the specified personId
            var activities = await _activityManager.GetByPersonIdAsync(personId);

            return activities.Select(a => new ActivityResponseDto
            {
                Id = a.Id,
                Calories = a.Calories,
                Duration = a.Duration,
                Xp = a.Xp,
                Level = a.Level,
                IsComplete = a.IsComplete,
                Rating = a.Rating,
                Description = a.Description,
                PersonId = a.PersonId, // Include PersonId here
                Activities = a.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    IntensityLevel = aat.ActivityType.IntensityLevel,
                    Description = aat.ActivityType.Description
                }).ToList()
            }).ToList();
        }

        public async Task<List<ActivityResponseDto>> CreateActivityPlanAsync(CreateActivityPlanDto input)
        {
            var createdActivities = new List<ActivityResponseDto>();

            foreach (var day in input.Days)
            {
                var activity = await CreateActivityAsync(new CreateActivityDto
                {
                    ActivityTypeIds = day.ActivityTypeIds,
                    Calories = 0, // You may compute or default
                    Duration = 0,
                    Xp = 0,
                    Level = 1,
                    IsComplete = false,
                    Rating = 0,
                    Description = day.Description,
                    PersonId = input.PersonId
                });

                createdActivities.Add(activity);
            }

            return createdActivities;
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
                updatedActivityTypes,
                input.IsComplete,
                input.Rating,
                input.Description
            );

            return new ActivityResponseDto
            {
                Id = updated.Id, // ✅ Added
                Calories = updated.Calories,
                Duration = updated.Duration,
                Xp = updated.Xp,
                Level = updated.Level,
                IsComplete = updated.IsComplete,
                Rating = updated.Rating,
                Description = updated.Description,
                PersonId = updated.PersonId,
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
