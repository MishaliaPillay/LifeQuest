using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Health.Ingredient.Dtos
{
    public class UpdateIngredientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int ServingSize { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbohhydrates { get; set; }
        public int Fats { get; set; }
    }
}
