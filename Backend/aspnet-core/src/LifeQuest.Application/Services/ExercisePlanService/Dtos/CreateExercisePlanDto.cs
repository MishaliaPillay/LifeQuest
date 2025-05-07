using System;
using System.Collections.Generic;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Services.FitnessService.Activity.Dtos;

namespace LifeQuest.Services.FitnessService.ExercisePlan.Dtos
{
    public class CreateExercisePlanDto
    {
        public Guid FitnessPathId { get; set; }

        public string Name { get; set; }
        public List<CreateActivityDto> Activities { get; set; } = new();
    }
}
