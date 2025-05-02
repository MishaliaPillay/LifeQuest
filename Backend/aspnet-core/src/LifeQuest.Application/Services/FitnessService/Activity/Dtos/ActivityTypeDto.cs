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
        public int IntensityLevel { get; set; }
        public string Description { get; set; }

        public ActivityTypeDto() { } // Required for model binding / deserialization

        public ActivityTypeDto(string category, int intensityLevel, string description)
        {
            Category = category;
            IntensityLevel = intensityLevel;
            Description = description;
        }
    }
}
