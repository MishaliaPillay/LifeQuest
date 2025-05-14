using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.Health.Ingredient.Dtos
{
    public class IngredientResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int ServingSize { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbohydrates { get; set; }
        public int Fats { get; set; }
        public IngredientResponseDto() { }

        public IngredientResponseDto(Guid id, string name, int servingSize, int calories, int protein, int carbohydrates, int fats)
        {
            Id = id;
            Name = name;
            ServingSize = servingSize;
            Calories = calories;
            Protein = protein;
            Carbohydrates = carbohydrates;
            Fats = fats;
        }
    }
}
