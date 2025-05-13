using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Meal.Dtos;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class MealPlanDayDto
    {
        public int Order { get; set; }  // The order of the day in the meal plan
        public string Description { get; set; }  // Description of the meal plan day
        public List<Guid> Meals { get; set; }  // List of meal IDs (no meal details)
        public int Score { get; set; }  // Score associated with the meal plan day
    }

}
