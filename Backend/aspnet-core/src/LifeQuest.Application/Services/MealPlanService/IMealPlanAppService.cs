using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.MealPlanService.Dtos;

namespace LifeQuest.Services.MealPlanService
{
    public interface IMealPlanAppService
    {
        Task<MealPlanDto> CreateAsync(CreateMealPlanDto input);
        Task<MealPlanDto> GetAsync(Guid id);
        Task<List<MealPlanDto>> GetHistoryAsync(Guid healthPathId);
        Task CompletePlanAsync(Guid planId);
        Task<List<MealPlanDayWithMealsDto>> GetMealPlanDaysWithMealsByPlanIdAsync(Guid mealPlanId);

    }
}
