using System;
using System.Collections.Generic;
using LifeQuest.Domain.Fitness.Activity;

namespace LifeQuest.Services.FitnessService.ExercisePlan.Dtos
{
    public class CreateExercisePlanDto
    {
        public Guid FitnessPathId { get; set; }
        public string Name { get; set; }
        public List<LifeQuest.Domain.Fitness.Activity.Activity> Activities { get; set; } = new();
    }
}
