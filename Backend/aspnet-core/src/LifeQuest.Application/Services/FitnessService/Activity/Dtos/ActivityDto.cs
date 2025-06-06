﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using LifeQuest.Domain.Fitness.Activity;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class ActivityDto : EntityDto<Guid>
    {
        public int Calories { get; set; }
        public int Duration { get; set; }
        public int Xp { get; set; }
        public int Level { get; set; }
        public List<ActivityTypeDto> Activities { get; set; }
        public bool IsComplete { get; set; }
        public ActivityRating Rating { get; set; }
        public string Description { get; set; }
        public Guid PersonId { get; set; }

        public ActivityDto() { }

        public ActivityDto(Guid id, int calories, int duration, int xp, int level, List<ActivityTypeDto> activities, bool isComplete, ActivityRating rating, string description)
        {
            Id = id;
            Calories = calories;
            Duration = duration;
            Xp = xp;
            Level = level;
            Activities = activities;
            IsComplete = isComplete;
            Rating = rating;
            Description = description;
        }

    }
}
