using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using LifeQuest.Domain.Paths.HealthPath;

namespace LifeQuest.Domain.Health.MealPlan
{
    public class MealPlan : Entity<Guid>
    {
        public Guid HealthPathId { get; set; }

        public virtual HealthPath HealthPath { get; set; }

        public string Name { get; set; }
        public MealPlanStatus Status { get; set; }
        public ICollection<MealPlanMeal> MealPlanMeals { get; set; } = new List<MealPlanMeal>();

        public DateTime? CompletedAt { get; set; }
    }
}
