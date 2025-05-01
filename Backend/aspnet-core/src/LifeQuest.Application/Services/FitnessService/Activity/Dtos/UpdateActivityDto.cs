using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Domain.Fitness.Activity;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class UpdateActivityDto
    {
        public Guid Id { get; set; }
        public int Calories { get; set; }
        public int Duration { get; set; }
        public int Xp { get; set; }
        public int Level { get; set; }
        public List<ActivityTypeDto> Activities { get; set; }
        public bool IsComplete { get; set; }
        public ActivityRating Rating { get; set; }

        public string Description { get; set; }
    }
}
