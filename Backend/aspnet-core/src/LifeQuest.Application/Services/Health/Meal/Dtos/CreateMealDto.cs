using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Health.Meal.Dtos
{
    public class CreateMealDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Calories { get; set; }
        public bool IsComplete { get; set; }
        public List<Guid> IngredientIds { get; set; }


    }
}
