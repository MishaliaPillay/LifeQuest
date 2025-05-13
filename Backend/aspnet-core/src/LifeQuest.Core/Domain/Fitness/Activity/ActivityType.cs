using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;

namespace LifeQuest.Domain.Fitness.Activity
{
    public class ActivityType : Entity<Guid>
    {
        public string Category { get; set; }
        public int Calories { get; set; }
        public string Description { get; set; }
        public string Duration { get; set; }
        public virtual ICollection<ActivityActivityType> Activities { get; set; } = new List<ActivityActivityType>();

        public ActivityType(string category, int calories, string description, string duration)
        {
            Category = category;
            Calories = calories;
            Description = description;
            Duration = duration;

        }

        public ActivityType() { }

    }

}
