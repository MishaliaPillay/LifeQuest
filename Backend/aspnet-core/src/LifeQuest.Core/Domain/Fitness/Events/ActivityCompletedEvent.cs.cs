using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Events.Bus;
namespace LifeQuest.Domain.Fitness.Events
{
    public class ActivityCompletedEvent : EventData
    {
        public Guid ActivityId { get; set; }
        public int XpGained { get; set; }
        public Guid ExercisePlanId { get; set; }
    }
}