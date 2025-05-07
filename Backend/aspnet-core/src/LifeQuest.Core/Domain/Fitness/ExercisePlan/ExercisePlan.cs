using System;
using System.Collections.Generic;
using Abp.Domain.Entities;

namespace LifeQuest.Domain.Fitness.ExercisePlan
{
    public class ExercisePlan : Entity<Guid>
    {
        public Guid FitnessPathId { get; set; }
        public string Name { get; set; }
        public PlanStatus Status { get; set; }
        public List<LifeQuest.Domain.Fitness.Activity.Activity> Activities { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

}
