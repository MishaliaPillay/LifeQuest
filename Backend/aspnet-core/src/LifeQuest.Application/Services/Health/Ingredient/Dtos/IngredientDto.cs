using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Health.Ingredient.Dtos
{
    public class IngredientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double ServingSize { get; set; }
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbohhydrates { get; set; }
        public double Fats { get; set; }
    }
}
