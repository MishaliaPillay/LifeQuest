using System;
using System.Collections.Generic;
using Abp.Domain.Entities;
using LifeQuest.Domain.Paths.FitnessPath;

namespace LifeQuest.Domain.Fitness.ExercisePlan
{
    public class ExercisePlan : Entity<Guid>
    {
        public Guid FitnessPathId { get; set; }

        // ✅ Add this navigation property
        public virtual FitnessPath FitnessPath { get; set; }

        public string Name { get; set; }
        public PlanStatus Status { get; set; }

        // ✅ Use ICollection instead of List
        public virtual ICollection<LifeQuest.Domain.Fitness.Activity.Activity> Activities { get; set; } = new List<LifeQuest.Domain.Fitness.Activity.Activity>();

        public DateTime? CompletedAt { get; set; }
    }
}
