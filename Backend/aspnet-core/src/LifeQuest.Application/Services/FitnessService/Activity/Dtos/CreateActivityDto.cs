using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Domain.Fitness.Activity;

namespace LifeQuest.Services.FitnessService.Activity.Dtos
{
    public class CreateActivityDto
    {
        public int Calories { get; set; }
        public int Duration { get; set; }
        public int Xp { get; set; }
        public int Level { get; set; }
        public List<Guid> ActivityTypeIds { get; set; }
        public bool IsComplete { get; set; }
        public ActivityRating Rating { get; set; }
        public string Description { get; set; }
        //    public Guid PersonId { get; set; }
    }
}
