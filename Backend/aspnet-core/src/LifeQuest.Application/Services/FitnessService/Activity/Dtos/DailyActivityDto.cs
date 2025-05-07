using System;
using System.Collections.Generic;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public partial class ActivityResponseDto
    {
        public class DailyActivityDto
        {
            public List<Guid> ActivityTypeIds { get; set; } = new();
            public string Description { get; set; }
        }

    }

}
