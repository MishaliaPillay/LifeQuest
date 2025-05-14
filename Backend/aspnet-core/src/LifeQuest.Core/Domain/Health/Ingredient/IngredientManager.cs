using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LifeQuest.Domain.Health.Ingredient
{
    public class IngredientManager : DomainService
    {
        private readonly IRepository<Ingredient, Guid> _ingredientRepository;

        public IngredientManager(IRepository<Ingredient, Guid> ingredientRepository)
        {
            _ingredientRepository = ingredientRepository;
        }

        // Create a new ingredient
        public async Task<Ingredient> CreateIngredientAsync(string name, int servingSize, int calories, int protein, int carbohhydrates, int fats)
        {
            var ingredient = new Ingredient(name, servingSize, calories, protein, carbohhydrates, fats);
            await _ingredientRepository.InsertAsync(ingredient);
            return ingredient;
        }

        // Get all ingredients
        public async Task<List<Ingredient>> GetAllAsync()
        {
            return await _ingredientRepository.GetAllListAsync();
        }

        // Update an existing ingredient
        public async Task<Ingredient> UpdateIngredientAsync(Guid id, string name, int servingSize, int calories, int protein, int carbohydrates, int fats)
        {
            var ingredient = await _ingredientRepository.FirstOrDefaultAsync(id);
            if (ingredient == null)
                throw new UserFriendlyException("Ingredient not found.");

            ingredient.Name = name;
            ingredient.ServingSize = servingSize;
            ingredient.Calories = calories;
            ingredient.Protein = protein;
            ingredient.Carbohydrates = carbohydrates;
            ingredient.Fats = fats;

            await _ingredientRepository.UpdateAsync(ingredient);
            return ingredient;
        }

        // Delete an ingredient
        public async Task DeleteIngredientAsync(Guid id)
        {
            var ingredient = await _ingredientRepository.FirstOrDefaultAsync(id);
            if (ingredient == null)
                throw new UserFriendlyException("Ingredient not found.");

            await _ingredientRepository.DeleteAsync(ingredient);
        }
    }
}