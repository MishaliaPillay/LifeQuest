using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Domain.Health
{
    public class MealIngredient
    {
        public Guid MealId { get; set; }
        public Domain.Health.Meal.Meal Meal { get; set; }

        public Guid IngredientId { get; set; }
        public Domain.Health.Ingredient.Ingredient Ingredient { get; set; }
    }
}
