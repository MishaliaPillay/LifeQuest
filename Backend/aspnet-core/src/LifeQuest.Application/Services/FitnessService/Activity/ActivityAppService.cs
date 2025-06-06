﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Events.Bus;
using Abp.UI;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Fitness.Events;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using Microsoft.EntityFrameworkCore;
using LifeQuest.Domain.Fitness.ExercisePlan;
using Abp.Domain.Repositories;
using Abp.Events.Bus;

using static LifeQuest.Services.FitnessService.Activity.Dtos.ActivityResponseDto;
using ExercisePlanEntity = LifeQuest.Domain.Fitness.ExercisePlan.ExercisePlan;

namespace LifeQuest.Services.FitnessService.Activity
{
    public class ActivityAppService : ApplicationService
    {
        private readonly ActivityManager _activityManager;
        private readonly ActivityTypeManager _activityTypeManager;
        private readonly IRepository<ExercisePlanEntity, Guid> _exercisePlanRepo;
        private readonly IEventBus _eventBus;
        public ActivityAppService(
            ActivityManager activityManager,
            ActivityTypeManager activityTypeManager,
            IRepository<ExercisePlanEntity, Guid> exercisePlanRepo, IEventBus eventBus)
        {
            _activityManager = activityManager;
            _activityTypeManager = activityTypeManager;
            _exercisePlanRepo = exercisePlanRepo;
            _eventBus = eventBus;
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
                input.Order
            // input.PersonId
            );

            return new ActivityResponseDto
            {
                Id = activity.Id,
                Calories = activity.Calories,
                Duration = activity.Duration,
                Xp = activity.Xp,
                Level = activity.Level,
                IsComplete = activity.IsComplete,
                Rating = activity.Rating,
                Description = activity.Description,
                //PersonId = activity.PersonId,
                Activities = activity.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    Calories = aat.ActivityType.Calories,
                    Description = aat.ActivityType.Description,
                    Duration = aat.ActivityType.Duration,
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

                // PersonId = a.PersonId,
                Activities = a.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    Calories = aat.ActivityType.Calories,
                    Description = aat.ActivityType.Description,
                    Duration = aat.ActivityType.Duration,
                }).ToList()
            }).ToList();
        }


        public async Task<List<ActivityResponseDto>> CreateActivityPlanAsync(CreateActivityPlanDto input)
        {
            var createdActivities = new List<ActivityResponseDto>();

            try
            {
                foreach (var day in input.Days)
                {
                    try
                    {
                        var activity = await CreateActivityAsync(new CreateActivityDto
                        {
                            ActivityTypeIds = day.ActivityTypeIds,
                            Calories = 0,
                            Duration = 0,
                            Xp = 0,
                            Level = 1,
                            IsComplete = false,
                            Rating = 0,
                            Description = day.Description,
                            // PersonId = input.PersonId
                        });

                        createdActivities.Add(activity);
                    }
                    catch (Exception ex)
                    {
                        Logger.Error($"Failed to create activity for day: {day.Description}", ex);
                        throw new UserFriendlyException($"Could not create activity for day '{day.Description}'. Please try again.");
                    }
                }

                return createdActivities;
            }
            catch (Exception ex)
            {
                Logger.Error("Error occurred while creating activity plan", ex);
                throw new UserFriendlyException("An error occurred while creating the activity plan.");
            }
        }

        public async Task<List<ActivityResponseDto>> GetByExercisePlanIdAsync(Guid exercisePlanId)
        {
            var activities = await _activityManager.GetByExercisePlanIdAsync(exercisePlanId);

            return activities
                .OrderBy(a => a.Order)
                .Select(a => new ActivityResponseDto
                {
                    Id = a.Id,
                    Calories = a.Calories,
                    Duration = a.Duration,
                    Xp = a.Xp,
                    Level = a.Level,
                    IsComplete = a.IsComplete,
                    Rating = a.Rating,
                    Description = a.Description,
                    Order = a.Order,
                    Activities = a.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                    {
                        Id = aat.ActivityType.Id,
                        Category = aat.ActivityType.Category,
                        Calories = aat.ActivityType.Calories,
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
                updatedActivityTypes,
                input.IsComplete,
                input.Rating,
                input.Description
            );

            return new ActivityResponseDto
            {
                Id = updated.Id,
                Calories = updated.Calories,
                Duration = updated.Duration,
                Xp = updated.Xp,
                Level = updated.Level,
                IsComplete = updated.IsComplete,
                Rating = updated.Rating,
                Description = updated.Description,
                // PersonId = updated.PersonId,
                Activities = updated.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    Calories = aat.ActivityType.Calories,
                    Description = aat.ActivityType.Description
                }).ToList()
            };
        }



        public async Task<ActivityResponseDto> MarkActivityAsCompleteAsync(Guid activityId)
        {
            var activity = await _activityManager.MarkAsCompleteAsync(activityId);

            // Find the related ExercisePlan and FitnessPath
            var exercisePlan = await _exercisePlanRepo.FirstOrDefaultAsync(ep => ep.Activities.Any(a => a.Id == activityId));
            if (exercisePlan != null)
            {
                _eventBus.Trigger(new ActivityCompletedEvent
                {
                    ActivityId = activityId,
                    XpGained = activity.Xp,
                    ExercisePlanId = exercisePlan.Id
                });


            }

            return new ActivityResponseDto
            {
                Id = activity.Id,
                Calories = activity.Calories,
                Duration = activity.Duration,
                Xp = activity.Xp,
                Level = activity.Level,
                IsComplete = activity.IsComplete,
                Rating = activity.Rating,
                Description = activity.Description,
                Order = activity.Order,
                Activities = activity.ActivityActivityTypes.Select(aat => new ActivityTypeDto
                {
                    Id = aat.ActivityType.Id,
                    Category = aat.ActivityType.Category,
                    Calories = aat.ActivityType.Calories,
                    Description = aat.ActivityType.Description
                }).ToList()
            };
        }

    }
}
