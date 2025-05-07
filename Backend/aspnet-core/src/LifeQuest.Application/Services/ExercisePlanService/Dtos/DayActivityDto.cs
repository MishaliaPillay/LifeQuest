using System;
using System.Collections.Generic;

namespace LifeQuest.Services.FitnessService.ExercisePlan.Dtos
{
    public class DayActivityDto
    {
        public string Description { get; set; }
        public List<Guid> ActivityTypeIds { get; set; }  // List of activity type IDs for each day
        public int Duration { get; set; }  // Duration in minutes
        public int Calories { get; set; }  // Calories burned
                                           // Any other fields that define the activity for each day
    }
}


