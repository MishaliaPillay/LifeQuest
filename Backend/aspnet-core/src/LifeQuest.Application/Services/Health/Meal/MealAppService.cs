using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using LifeQuest.Domain.Health.Meal;
using LifeQuest.Domain.Health;
using LifeQuest.Services.Health.Meal.Dtos;

namespace LifeQuest.Services.Health.Meal
{
    public class MealAppService : ApplicationService, IMealAppService
    {
        private readonly MealManager _mealManager;
        private readonly IRepository<Domain.Health.Ingredient.Ingredient, Guid> _ingredientRepository;

        public MealAppService(MealManager mealManager, IRepository<Domain.Health.Ingredient.Ingredient, Guid> ingredientRepository)
        {
            _mealManager = mealManager;
            _ingredientRepository = ingredientRepository;
        }

        public async Task<MealDto> CreateMealAsync(CreateMealDto input)
        {
            var meal = new Domain.Health.Meal.Meal
            {
                Name = input.Name,
                Description = input.Description,
                Calories = input.Calories,
                MealIngredients = input.IngredientIds.Select(id => new MealIngredient { IngredientId = id }).ToList()
            };

            var created = await _mealManager.CreateMealAsync(meal);

            return new MealDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Calories = created.Calories,
                IngredientIds = created.MealIngredients.Select(mi => mi.IngredientId).ToList()
            };
        }

        public async Task<List<MealDto>> GetAllMealsAsync()
        {
            var meals = await _mealManager.GetAllMealsAsync();

            return meals.Select(m => new MealDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Calories = m.Calories,
                IngredientIds = m.MealIngredients.Select(mi => mi.IngredientId).ToList()
            }).ToList();
        }

        public async Task<MealDto> UpdateMealAsync(UpdateMealDto input)
        {
            var meal = await _mealManager.GetAllMealsAsync()
                .ContinueWith(t => t.Result.FirstOrDefault(m => m.Id == input.Id));

            if (meal == null)
                throw new UserFriendlyException("Meal not found.");

            meal.Name = input.Name;
            meal.Description = input.Description;
            meal.Calories = input.Calories;

            meal.MealIngredients = input.IngredientIds.Select(id => new MealIngredient { IngredientId = id, MealId = meal.Id }).ToList();

            var updated = await _mealManager.UpdateMealAsync(meal);

            return new MealDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                Calories = updated.Calories,
                IngredientIds = updated.MealIngredients.Select(mi => mi.IngredientId).ToList()
            };
        }

        public async Task DeleteMealAsync(Guid id)
        {
            await _mealManager.DeleteMealAsync(id);
        }
    }
}
