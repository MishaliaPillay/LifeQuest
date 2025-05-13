using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Domain.Health.MealPlan
{
    public class MealPlanDayMeal
    {
        public Guid Id { get; set; }
        public Guid MealPlanDayId { get; set; }
        public Guid MealId { get; set; }

        public MealPlanDay MealPlanDay { get; set; }
        public LifeQuest.Domain.Health.Meal.Meal Meal { get; set; }
    }
}
