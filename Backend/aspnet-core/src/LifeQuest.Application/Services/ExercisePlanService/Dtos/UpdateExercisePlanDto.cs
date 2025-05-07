using System;
using System.Collections.Generic;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Fitness.ExercisePlan;

namespace LifeQuest.Services.FitnessService.ExercisePlan.Dtos
{
    public class UpdateExercisePlanDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public PlanStatus Status { get; set; }
        public List<LifeQuest.Domain.Fitness.Activity.Activity> Activities { get; set; } = new();
    }
}
