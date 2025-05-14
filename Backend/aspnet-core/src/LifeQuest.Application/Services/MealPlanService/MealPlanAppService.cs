using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using LifeQuest.Domain.Health.Meal;
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Domain.Paths.HealthPath;
using LifeQuest.Services.MealPlanService.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeQuest.Services.MealPlanService
{
    public class MealPlanAppService : ApplicationService, IMealPlanAppService
    {
        private readonly MealPlanManager _mealPlanManager;
        private readonly IRepository<MealPlan, Guid> _planRepo;
        private readonly IRepository<Domain.Paths.HealthPath.HealthPath, Guid> _pathRepo;
        private readonly IRepository<Meal, Guid> _mealRepo;
        private readonly ILogger<MealPlanAppService> _logger;

        public MealPlanAppService(
            MealPlanManager mealPlanManager,
            IRepository<MealPlan, Guid> planRepo,
            IRepository<Domain.Paths.HealthPath.HealthPath, Guid> pathRepo,
            IRepository<Meal, Guid> mealRepo,
            ILogger<MealPlanAppService> logger)
        {
            _mealPlanManager = mealPlanManager;
            _planRepo = planRepo;
            _pathRepo = pathRepo;
            _mealRepo = mealRepo;
            _logger = logger;
        }

        public async Task<MealPlanDto> CreateAsync(CreateMealPlanDto input)
        {
            _logger.LogInformation("Creating MealPlan for HealthPath: {HealthPathId}", input.HealthPathId);

            // Fetch meals based on meal IDs (this is valid with the current DTO)
            var meals = await _mealRepo.GetAll()
                .Where(m => input.MealIds.Contains(m.Id))
                .ToListAsync();

            if (meals.Count != input.MealIds.Count)
                throw new UserFriendlyException("Some meals not found.");

            // Fetch HealthPath
            var path = await _pathRepo.GetAll()
                .Include(p => p.MealPlans)
                .FirstOrDefaultAsync(p => p.Id == input.HealthPathId);

            if (path == null)
                throw new UserFriendlyException("Health Path not found.");

            // Ensure no active meal plan already exists for this health path
            if (path.MealPlans.Any(mp => mp.Status == MealPlanStatus.Active))
                throw new UserFriendlyException("An active meal plan already exists for this HealthPath.");

            // Create the new MealPlan
            var plan = new MealPlan
            {
                Id = Guid.NewGuid(),
                HealthPathId = input.HealthPathId,
                Name = input.Name,
                Status = MealPlanStatus.Active,
                MealPlanDays = new List<MealPlanDay>() // Initialize the list
            };

            // Meal Plan Days
            if (input.MealPlanDays != null)
            {
                foreach (var day in input.MealPlanDays.OrderBy(d => d.Order))  // Order meal plan days by 'Order'
                {
                    var mealPlanDay = new MealPlanDay
                    {
                        Id = Guid.NewGuid(),
                        Order = day.Order,
                        Description = day.Description,
                        MealPlanDayMeals = new List<MealPlanDayMeal>()
                    };

                    // Map meals to this day (we assume meals are assigned based on the day structure)
                    // Assuming day.Meals contains only meal IDs (Guid)
                    foreach (var mealId in day.Meals)
                    {
                        var meal = meals.FirstOrDefault(m => m.Id == mealId); // Get the full Meal entity

                        if (meal == null)
                            throw new UserFriendlyException($"Meal with ID {mealId} not found.");

                        var mealPlanDayMeal = new MealPlanDayMeal
                        {
                            Id = Guid.NewGuid(),
                            MealPlanDayId = mealPlanDay.Id,
                            MealId = meal.Id
                        };

                        mealPlanDay.MealPlanDayMeals.Add(mealPlanDayMeal);
                    }


                    plan.MealPlanDays.Add(mealPlanDay);
                }
            }

            // Save the plan to the repository
            await _planRepo.InsertAsync(plan);

            return ObjectMapper.Map<MealPlanDto>(plan);
        }


        public async Task<MealPlanDto> GetAsync(Guid id)
        {
            var plan = await _planRepo
                .GetAll()
                .Include(p => p.MealPlanDays)
                    .ThenInclude(day => day.MealPlanDayMeals)
                        .ThenInclude(dayMeal => dayMeal.Meal)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                throw new UserFriendlyException("MealPlan not found.");

            return ObjectMapper.Map<MealPlanDto>(plan);
        }

        public async Task CompletePlanAsync(Guid planId)
        {
            await _mealPlanManager.CompletePlanAsync(planId);
        }

        public async Task<List<MealPlanDto>> GetHistoryAsync(Guid healthPathId)
        {
            var plans = await _planRepo
                .GetAll()
                .Where(p => p.HealthPathId == healthPathId && p.Status == MealPlanStatus.Completed)
                .Include(p => p.MealPlanDays)
                    .ThenInclude(day => day.MealPlanDayMeals)
                        .ThenInclude(dayMeal => dayMeal.Meal)
                .ToListAsync();

            return ObjectMapper.Map<List<MealPlanDto>>(plans);
        }
    }
}
