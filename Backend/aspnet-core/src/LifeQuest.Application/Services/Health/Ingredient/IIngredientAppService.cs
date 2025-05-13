using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Ingredient.Dtos;

namespace LifeQuest.Services.Health.Ingredient
{
    public interface IIngredientAppService
    {
        Task<IngredientResponseDto> CreateIngredientAsync(CreateIngredientDto input);
        Task<List<IngredientResponseDto>> GetAllIngredientsAsync();
        Task<IngredientResponseDto> UpdateIngredientAsync(UpdateIngredientDto input);
        Task DeleteIngredientAsync(Guid id);
    }
}