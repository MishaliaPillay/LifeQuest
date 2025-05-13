using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Domain.Steps;
using LifeQuest.Domain.Weight;

namespace LifeQuest.Domain.Paths.HealthPath
{
    public class HealthPath : Path
    {
        public virtual ICollection<MealPlan> MealPlans { get; set; } = new List<MealPlan>();

        public virtual ICollection<WeightEntry> WeightEntries { get; set; } = new List<WeightEntry>();
    }
}
