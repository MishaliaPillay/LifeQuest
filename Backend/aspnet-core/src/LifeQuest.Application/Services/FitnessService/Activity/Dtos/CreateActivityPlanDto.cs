using System;
using System.Collections.Generic;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public partial class ActivityResponseDto
    {
        public class CreateActivityPlanDto
        {
            public Guid PersonId { get; set; }
            public List<DailyActivityDto> Days { get; set; } = new();
        }

    }

}
