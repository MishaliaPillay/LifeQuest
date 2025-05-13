using System;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class UpdateActivityTypeDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; }
        public int Calories { get; set; }
        public string Description { get; set; }
        public string Duration { get; set; }
    }
}
