using System;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class CreateActivityTypeDto
    {
        public string Category { get; set; }
        public int IntensityLevel { get; set; }
        public string Description { get; set; }
    }
}
