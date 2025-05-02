using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;

namespace LifeQuest.Domain.Fitness.Activity
{
    public class Activity : Entity<Guid>
    {
        public int Calories { get; set; }
        public int Duration { get; set; }
        public int Xp { get; set; }
        public int Level { get; set; }
        public virtual ICollection<ActivityActivityType> ActivityActivityTypes { get; set; } = new List<ActivityActivityType>();

        public bool IsComplete { get; set; }
        public ActivityRating Rating { get; set; }

        public string Description { get; set; }

        public Activity() { }

        // Activity.cs constructor
        public Activity(
            int calories,
            int duration,
            int xp,
            int level,
            List<ActivityActivityType> activityActivityTypes,
            bool isComplete,
            ActivityRating rating,
            string description)
        {
            Id = Guid.NewGuid();
            Calories = calories;
            Duration = duration;
            Xp = xp;
            Level = level;
            ActivityActivityTypes = activityActivityTypes ?? new List<ActivityActivityType>();
            IsComplete = isComplete;
            Rating = rating;
            Description = description;
        }
    }
}
