using Abp.Application.Services;
using Abp.UI;
using LifeQuest.Domain.Health.Ingredient;
using LifeQuest.Services.Health.Ingredient.Dtos;
using LifeQuest.Services.Health.Ingredient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LifeQuest.Services.HealthService.Ingredient
{
    public class IngredientAppService : ApplicationService, IIngredientAppService
    {
        private readonly IngredientManager _ingredientManager;

        public IngredientAppService(IngredientManager ingredientManager)
        {
            _ingredientManager = ingredientManager;
        }

        // Create an ingredient
        public async Task<IngredientResponseDto> CreateIngredientAsync(CreateIngredientDto input)
        {
            var created = await _ingredientManager.CreateIngredientAsync(
                input.Name,
                input.ServingSize,
                input.Calories,
                input.Protein,
                input.Carbohhydrates,
                input.Fats
            );

            return new IngredientResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                ServingSize = created.ServingSize,
                Calories = created.Calories,
                Protein = created.Protein,
                Carbohhydrates = created.Carbohhydrates,
                Fats = created.Fats
            };
        }

        // Get all ingredients
        public async Task<List<IngredientResponseDto>> GetAllIngredientsAsync()
        {
            var items = await _ingredientManager.GetAllAsync();

            return items.Select(i => new IngredientResponseDto
            {
                Id = i.Id,
                Name = i.Name,
                ServingSize = i.ServingSize,
                Calories = i.Calories,
                Protein = i.Protein,
                Carbohhydrates = i.Carbohhydrates,
                Fats = i.Fats
            }).ToList();
        }

        // Update an ingredient
        public async Task<IngredientResponseDto> UpdateIngredientAsync(UpdateIngredientDto input)
        {
            var updated = await _ingredientManager.UpdateIngredientAsync(
                input.Id,
                input.Name,
                input.ServingSize,
                input.Calories,
                input.Protein,
                input.Carbohhydrates,
                input.Fats
            );

            return new IngredientResponseDto
            {
                Id = updated.Id,
                Name = updated.Name,
                ServingSize = updated.ServingSize,
                Calories = updated.Calories,
                Protein = updated.Protein,
                Carbohhydrates = updated.Carbohhydrates,
                Fats = updated.Fats
            };
        }

        // Delete an ingredient
        public async Task DeleteIngredientAsync(Guid id)
        {
            await _ingredientManager.DeleteIngredientAsync(id);
        }
    }
}
