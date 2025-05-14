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
using LifeQuest.Services.Health.Ingredient.Dtos;
using LifeQuest.Services.Health.Meal.Dtos;
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

            // Gather all unique meal IDs from the meal plan days
            var allMealIds = input.MealPlanDays?
                .SelectMany(d => d.Meals)
                .Distinct()
                .ToList() ?? new List<Guid>();

            // Fetch all required meals
            var meals = await _mealRepo.GetAll()
                .Where(m => allMealIds.Contains(m.Id))
                .ToListAsync();

            if (meals.Count != allMealIds.Count)
                throw new UserFriendlyException("Some meals in meal plan days were not found.");

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
                MealPlanDays = new List<MealPlanDay>()
            };

            // Meal Plan Days
            if (input.MealPlanDays != null)
            {
                foreach (var day in input.MealPlanDays.OrderBy(d => d.Order))
                {
                    var mealPlanDay = new MealPlanDay
                    {
                        Id = Guid.NewGuid(),
                        Order = day.Order,
                        Description = day.Description,
                        MealPlanId = plan.Id,
                        MealPlanDayMeals = new List<MealPlanDayMeal>()
                    };

                    foreach (var mealId in day.Meals)
                    {
                        var meal = meals.FirstOrDefault(m => m.Id == mealId);
                        if (meal == null)
                            throw new UserFriendlyException($"Meal with ID {mealId} not found.");

                        mealPlanDay.MealPlanDayMeals.Add(new MealPlanDayMeal
                        {
                            Id = Guid.NewGuid(),
                            MealPlanDayId = mealPlanDay.Id,
                            MealId = meal.Id
                        });
                    }

                    plan.MealPlanDays.Add(mealPlanDay);
                }
            }

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

        public async Task<List<MealPlanDayWithMealsDto>> GetMealPlanDaysWithMealsByPlanIdAsync(Guid mealPlanId)
        {
            var plan = await _planRepo
                .GetAll()
                .Include(p => p.MealPlanDays)
                    .ThenInclude(d => d.MealPlanDayMeals)
                        .ThenInclude(dm => dm.Meal)
                            .ThenInclude(m => m.MealIngredients)
                                .ThenInclude(mi => mi.Ingredient)
                .FirstOrDefaultAsync(p => p.Id == mealPlanId);

            if (plan == null)
                throw new UserFriendlyException("MealPlan not found.");

            var dayDtos = plan.MealPlanDays
                .OrderBy(d => d.Order)
                .Select(d => new MealPlanDayWithMealsDto
                {
                    Order = d.Order,
                    Description = d.Description,
                    Score = d.MealPlanDayMeals.Sum(dm => dm.Meal?.Score ?? 0),
                    Meals = d.MealPlanDayMeals
                        .Select(dm => new MealDto
                        {
                            Id = dm.Meal.Id,
                            Name = dm.Meal.Name,
                            Description = dm.Meal.Description,
                            Calories = dm.Meal.Calories,
                            IsComplete = dm.Meal.IsComplete,
                            Score = dm.Meal.Score,
                            IngredientIds = dm.Meal.MealIngredients.Select(mi => mi.Ingredient.Id).ToList(),
                            Ingredients = dm.Meal.MealIngredients.Select(mi => new IngredientDto
                            {
                                Id = mi.Ingredient.Id,
                                Name = mi.Ingredient.Name,
                                ServingSize = mi.Ingredient.ServingSize,
                                Calories = mi.Ingredient.Calories,
                                Protein = mi.Ingredient.Protein,
                                Carbohydrates = mi.Ingredient.Carbohydrates,
                                Fats = mi.Ingredient.Fats
                            }).ToList()
                        }).ToList()
                }).ToList();

            return dayDtos;
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
