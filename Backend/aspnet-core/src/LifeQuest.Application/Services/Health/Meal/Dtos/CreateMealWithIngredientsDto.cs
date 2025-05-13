using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Ingredient.Dtos;

namespace LifeQuest.Services.Health.Meal.Dtos
{
    public class CreateMealWithIngredientsDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Calories { get; set; }
        public List<CreateIngredientDto> Ingredients { get; set; }
    }


}
