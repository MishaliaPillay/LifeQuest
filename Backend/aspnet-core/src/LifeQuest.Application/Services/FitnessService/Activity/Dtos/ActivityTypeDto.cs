using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class ActivityTypeDto : EntityDto<Guid>
    {
        public string Category { get; set; }
        public int Calories { get; set; }
        public string Description { get; set; }

        public ActivityTypeDto() { } // Required for model binding / deserialization
        public string Duration { get; set; }
        public ActivityTypeDto(string category, int calories, string description, string duration)
        {
            Category = category;
            Calories = calories;
            Description = description;
            Duration = duration;

        }
    }
}
