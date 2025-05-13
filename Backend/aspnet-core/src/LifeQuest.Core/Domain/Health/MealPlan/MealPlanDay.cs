using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Domain.Health.MealPlan
{
    public class MealPlanDay
    {
        public Guid Id { get; set; }
        public int Order { get; set; }
        public string Description { get; set; }
        public List<MealPlanDayMeal> MealPlanDayMeals { get; set; }
    }
}
