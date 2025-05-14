using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Meal.Dtos;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class MealPlanDayWithMealsDto
    {
        public int Order { get; set; }
        public string Description { get; set; }
        public int Score { get; set; }
        public List<MealDto> Meals { get; set; } = new();
    }
}
