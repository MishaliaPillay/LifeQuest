using System;
using Abp.Application.Services.Dto;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class ActivityTypeResponseDto : EntityDto<Guid>
    {
        public string Category { get; set; }
        public int Calories { get; set; }
        public string Duration { get; set; }
        public string Description { get; set; }
    }
}
