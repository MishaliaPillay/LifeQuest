using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;

using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Health.Meal
{
    public class MealManager : DomainService
    {
        private readonly IRepository<Meal, Guid> _mealRepository;
        private readonly IRepository<MealPlan.MealPlan, Guid> _mealPlanRepository;

        public MealManager(
            IRepository<Meal, Guid> mealRepository,
            IRepository<MealPlan.MealPlan, Guid> mealPlanRepository)
        {
            _mealRepository = mealRepository;
            _mealPlanRepository = mealPlanRepository;
        }

        public async Task<Meal> CreateMealAsync(Meal meal)
        {
            return await _mealRepository.InsertAsync(meal);
        }

        public async Task<List<Meal>> GetAllMealsAsync()
        {
            return await _mealRepository
                .GetAllIncluding(m => m.MealIngredients)
                .ToListAsync();
        }

        public async Task<Meal> UpdateMealAsync(Meal meal)
        {
            return await _mealRepository.UpdateAsync(meal);
        }

        public async Task<Meal> GenerateAIMealAsync(string name, string description, int calories, List<Guid> ingredientIds)
        {
            if (ingredientIds == null || !ingredientIds.Any())
                throw new UserFriendlyException("A meal must have at least one ingredient.");

            var meal = new Meal
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = description,
                Calories = calories,
                MealIngredients = ingredientIds.Select(id => new MealIngredient
                {
                    IngredientId = id
                }).ToList()
            };

            return await _mealRepository.InsertAsync(meal); // no autoSave here
        }

        public async Task<List<Meal>> GetByMealPlanIdAsync(Guid mealPlanId)
        {
            // First, get the meal plan with all its related meals
            var mealPlan = await _mealPlanRepository.GetAll()
                .Include(mp => mp.MealPlanDays)
                    .ThenInclude(day => day.MealPlanDayMeals)
                        .ThenInclude(dayMeal => dayMeal.Meal)
                            .ThenInclude(meal => meal.MealIngredients)
                .FirstOrDefaultAsync(mp => mp.Id == mealPlanId);

            if (mealPlan == null)
            {
                throw new UserFriendlyException($"MealPlan with ID {mealPlanId} not found.");
            }

            // Extract the meals from the meal plan
            var meals = mealPlan.MealPlanDays
                .SelectMany(day => day.MealPlanDayMeals)
                .Select(dayMeal => dayMeal.Meal)
                .ToList();

            return meals;
        }

        public async Task DeleteMealAsync(Guid id)
        {
            var meal = await _mealRepository.FirstOrDefaultAsync(id);
            if (meal == null)
                throw new UserFriendlyException("Meal not found.");

            await _mealRepository.DeleteAsync(meal);
        }
    }
}