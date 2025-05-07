using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.UI;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Services.FitnessService.ExercisePlan.Dtos;
using LifeQuest.Domain.Managers;
using Microsoft.Extensions.Logging;
using Abp.Domain.Repositories;
using LifeQuest.Services.FitnessService.ExercisePlan;
using LifeQuest.Domain.Paths.FitnessPath;
using LifeQuest.Domain.Fitness.Activity;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LifeQuest.Services.ExercisePlanService
{
    public class ExercisePlanAppService : ApplicationService, IExercisePlanAppService
    {
        private readonly ExercisePlanManager _exercisePlanManager;
        private readonly ILogger<ExercisePlanAppService> _logger;
        private readonly IRepository<ExercisePlan, Guid> _exercisePlanRepo;
        private readonly IRepository<FitnessPath, Guid> _fitnessPathRepo;
        private readonly IRepository<ActivityType, Guid> _activityTypeRepo;



        public ExercisePlanAppService(IRepository<ActivityType, Guid> activityTypeRepo,
            ExercisePlanManager exercisePlanManager,
            ILogger<ExercisePlanAppService> logger,
            IRepository<ExercisePlan, Guid> exercisePlanRepo,
            IRepository<FitnessPath, Guid> fitnessPathRepo)
        {
            _activityTypeRepo = activityTypeRepo;
            _exercisePlanManager = exercisePlanManager;
            _logger = logger;
            _exercisePlanRepo = exercisePlanRepo;
            _fitnessPathRepo = fitnessPathRepo;
        }

        public async Task<ExercisePlanDto> CreateAsync(CreateExercisePlanDto input)
        {
            try
            {
                _logger.LogInformation("Creating a new ExercisePlan for FitnessPath ID: {FitnessPathId}", input.FitnessPathId);

                var fitnessPath = await _fitnessPathRepo.FirstOrDefaultAsync(input.FitnessPathId);
                if (fitnessPath == null)
                {
                    throw new UserFriendlyException("Fitness Path not found.");
                }

                var mappedActivities = new List<Activity>();

                foreach (var day in input.Days)
                {
                    foreach (var activityTypeId in day.ActivityTypeIds)
                    {
                        var activityType = await _activityTypeRepo.FirstOrDefaultAsync(activityTypeId);
                        if (activityType == null)
                        {
                            throw new UserFriendlyException($"ActivityType with ID {activityTypeId} not found.");
                        }

                        var activityActivityTypes = new List<ActivityActivityType>
                {
                    new ActivityActivityType { ActivityTypeId = activityType.Id }
                };

                        var activity = new Activity(
                            calories: day.Calories,
                            duration: day.Duration,
                            xp: 0,
                            level: 1,
                            activityActivityTypes: activityActivityTypes,
                            isComplete: false,
                            rating: ActivityRating.Neutral,
                            description: day.Description
                        );

                        mappedActivities.Add(activity);
                    }
                }

                ExercisePlan plan;
                try
                {
                    _logger.LogDebug("Mapped {Count} activities for plan creation", mappedActivities.Count);
                    foreach (var act in mappedActivities)
                    {
                        _logger.LogDebug("Activity: {Description}, Duration: {Duration}, Calories: {Calories}, Types: {TypeCount}",
                            act.Description, act.Duration, act.Calories, act.ActivityActivityTypes.Count);
                    }

                    plan = await _exercisePlanManager.CreatePlanAsync(input.FitnessPathId, input.Name, mappedActivities);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed during CreatePlanAsync");
                    throw;
                }

                _logger.LogInformation("Successfully created ExercisePlan with ID: {PlanId}", plan.Id);
                return ObjectMapper.Map<ExercisePlanDto>(plan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating ExercisePlan");
                throw new UserFriendlyException("Could not create ExercisePlan", ex);
            }
        }


        public async Task<ExercisePlanResponseDto> GetAsync(Guid id)
        {
            var plan = await _exercisePlanRepo
                .GetAll()
                .Include(p => p.Activities)
                    .ThenInclude(a => a.ActivityActivityTypes)
                        .ThenInclude(aat => aat.ActivityType)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                throw new UserFriendlyException("ExercisePlan not found");

            return ObjectMapper.Map<ExercisePlanResponseDto>(plan);
        }

        public async Task<List<ExercisePlanResponseDto>> GetHistoryAsync(Guid fitnessPathId)
        {
            try
            {
                _logger.LogInformation("Fetching exercise plan history for FitnessPath ID: {FitnessPathId}", fitnessPathId);

                var plans = await _exercisePlanRepo
                    .GetAll() // This gives you IQueryable<ExercisePlan>
                    .Where(p => p.FitnessPathId == fitnessPathId && p.Status == PlanStatus.Completed) // Now you can use Where
                    .Include(p => p.Activities)
                        .ThenInclude(a => a.ActivityActivityTypes)
                            .ThenInclude(aat => aat.ActivityType)
                    .Include(p => p.Activities)
                        .ThenInclude(a => a.Person) // Minimal needed info
                    .ToListAsync(); // Executes the query

                return ObjectMapper.Map<List<ExercisePlanResponseDto>>(plans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching ExercisePlan history for FitnessPath ID: {FitnessPathId}", fitnessPathId);
                throw new UserFriendlyException("Could not fetch ExercisePlan history");
            }
        }




        public async Task<ExercisePlanDto> UpdateAsync(UpdateExercisePlanDto input)
        {
            try
            {
                _logger.LogInformation("Updating ExercisePlan with ID: {Id}", input.Id);

                // Fetch the existing plan
                var plan = await _exercisePlanRepo.GetAsync(input.Id);
                if (plan == null)
                {
                    throw new UserFriendlyException("ExercisePlan not found.");
                }

                // Update plan details
                plan.Name = input.Name;
                plan.Activities = input.Activities; // Assuming Activities are provided in the DTO
                plan.Status = input.Status; // You can add more fields to update as needed

                // Save the updated plan
                await _exercisePlanRepo.UpdateAsync(plan);

                return ObjectMapper.Map<ExercisePlanDto>(plan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ExercisePlan with ID: {Id}", input.Id);
                throw new UserFriendlyException("Could not update ExercisePlan");
            }
        }

        public async Task CompletePlanAsync(Guid planId)
        {
            try
            {
                _logger.LogInformation("Completing ExercisePlan with ID: {Id}", planId);

                // Mark the plan as completed
                await _exercisePlanManager.CompletePlanAsync(planId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing ExercisePlan with ID: {Id}", planId);
                throw new UserFriendlyException("Could not complete ExercisePlan");
            }
        }
    }
}
