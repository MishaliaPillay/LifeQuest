using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Meal.Dtos;

namespace LifeQuest.Services.Health.Meal
{
    public interface IMealAppService
    {
        Task<MealDto> CreateMealAsync(CreateMealDto input);
        Task<List<MealDto>> GetAllMealsAsync();
        Task<MealDto> UpdateMealAsync(UpdateMealDto input);
        Task DeleteMealAsync(Guid id);
        Task<MealDto> GenerateAIMealAsync(GenerateAIMealInputDto input);
        Task<List<MealDto>> GetByMealPlanIdAsync(Guid mealPlanId);
        Task<GeneratedMealBatchResultDto> GenerateAIMealBatchAsync(GenerateAIMealBatchInputDto input);

    }
}
