using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using LifeQuest.Domain.Fitness.Activity;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public partial class ActivityResponseDto : EntityDto<Guid>
    {
        public int Calories { get; set; }
        public int Duration { get; set; }
        public int Xp { get; set; }
        public int Level { get; set; }
        public List<ActivityTypeDto> Activities { get; set; }
        public bool IsComplete { get; set; }
        public ActivityRating Rating { get; set; }
        public string Description { get; set; }
        public int Order { get; set; } // 👈 Add this

        public ActivityResponseDto(
            Guid id,
            int calories,
            int duration,
            int xp,
            int level,
            List<ActivityTypeDto> activities,
            bool isComplete,
            ActivityRating rating,
            string description,
            int order, 
            Guid personId) : base(id)
        {
            Calories = calories;
            Duration = duration;
            Xp = xp;
            Level = level;
            Activities = activities;
            IsComplete = isComplete;
            Rating = rating;
            Description = description;
            Order = order; 
                           // PersonId = personId;
        }


        // Default constructor (in case you don't want to use the all-args constructor)
        public ActivityResponseDto() { }
    }

}
