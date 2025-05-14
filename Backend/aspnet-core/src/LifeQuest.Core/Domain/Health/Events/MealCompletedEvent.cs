using System;
using Abp.Events.Bus;

namespace LifeQuest.Domain.Health.Events
{
    public class MealCompletedEvent : EventData
    {
        public Guid MealId { get; set; }
        public Guid PersonId { get; set; }
        public int XpGained { get; set; }

        public MealCompletedEvent(Guid mealId, Guid personId, int xpGained)
        {
            MealId = mealId;
            PersonId = personId;
            XpGained = xpGained;
        }
    }

}
