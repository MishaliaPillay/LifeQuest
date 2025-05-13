using System.Collections.Generic;
using Abp.Domain.Entities;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Domain.Steps;
using LifeQuest.Domain.Weight;
using LifeQuest.Domain.Fitness.ExercisePlan;
namespace LifeQuest.Domain.Paths.FitnessPath
{
    public class FitnessPath : Path
    {
        public virtual ICollection<ExercisePlan> ExercisePlans { get; set; } = new List<ExercisePlan>();
        public virtual ICollection<StepEntry> StepEntries { get; set; } = new List<StepEntry>();
        public virtual ICollection<WeightEntry> WeightEntries { get; set; } = new List<WeightEntry>();
    }
}
