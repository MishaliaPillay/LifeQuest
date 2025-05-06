using System.Collections.Generic;
using Abp.Domain.Entities;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Steps;
using LifeQuest.Domain.Weight;

namespace LifeQuest.Domain.Paths.FitnessPath
{
    public class FitnessPath : Path
    {
        public virtual ICollection<StepEntry> StepEntries { get; set; } = new List<StepEntry>();
        public virtual ICollection<WeightEntry> WeightEntries { get; set; } = new List<WeightEntry>();
        public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();
    }
}
