using System;
using LifeQuest.Domain.Health.Meal;

namespace LifeQuest.Domain.Health.MealPlan
{
    public class MealPlanMeal
    {
        public Guid MealPlanId { get; set; }
        public MealPlan MealPlan { get; set; }

        public Guid MealId { get; set; }
        public LifeQuest.Domain.Health.Meal.Meal Meal { get; set; }
    }
}