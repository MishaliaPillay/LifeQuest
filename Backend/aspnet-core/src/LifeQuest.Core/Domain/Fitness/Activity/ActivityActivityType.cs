using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;

namespace LifeQuest.Domain.Fitness.Activity
{
    public class ActivityActivityType : Entity<Guid>
    {
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }

        public Guid ActivityTypeId { get; set; }
        public virtual ActivityType ActivityType { get; set; }
    }

}
