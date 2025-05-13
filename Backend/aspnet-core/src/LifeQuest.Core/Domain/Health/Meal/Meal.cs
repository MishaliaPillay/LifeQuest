using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Health.MealPlan;
namespace LifeQuest.Domain.Health.Meal
{
    public class Meal : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Calories { get; set; }
        public int Score { get; set; }
        public virtual ICollection<MealPlanMeal> MealPlanMeals { get; set; } = new List<MealPlanMeal>();
        public bool IsComplete { get; set; }
        public ICollection<MealIngredient> MealIngredients { get; set; }
        public Guid? MealPlanId { get; set; }
        public virtual LifeQuest.Domain.Health.MealPlan.MealPlan MealPlan { get; set; }
        public Meal()
        {
            MealIngredients = new List<MealIngredient>();
        }
    }
}
