using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace LifeQuest.Domain.Health.Meal
{
    public class Meal : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Calories { get; set; }

        public ICollection<MealIngredient> MealIngredients { get; set; }

        public Meal()
        {
            MealIngredients = new List<MealIngredient>();
        }
    }
}
