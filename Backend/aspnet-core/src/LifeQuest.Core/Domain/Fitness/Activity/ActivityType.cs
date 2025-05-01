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
        public int IntensityLevel { get; set; }

        public string Description { get; set; }


        public ActivityType(string category, int intensityLevel, string description)
        {
            Category = category;
            IntensityLevel = intensityLevel;
            Description = description;
        }

        public ActivityType() { }

    }
}
