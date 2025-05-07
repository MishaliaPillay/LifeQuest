using System;
using System.Collections.Generic;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Services.FitnessService.Activity.Dtos;

namespace LifeQuest.Services.FitnessService.ExercisePlan.Dtos
{
    public class ExercisePlanDto
    {
        public Guid Id { get; set; }
        public Guid FitnessPathId { get; set; }
        public string Name { get; set; }
        public PlanStatus Status { get; set; }
        public List<ActivityResponseDto> Activities { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
