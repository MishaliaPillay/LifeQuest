using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Health.MealPlan;

namespace LifeQuest.Domain.Health.Ingredient
{
    public class Ingredient : Entity<Guid>
    {
        public string Name { get; set; }
        public int ServingSize { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbohhydrates { get; set; }
        public int Fats { get; set; }


        public Ingredient() { }
        public Ingredient(string name, int servingSize, int calories, int protein, int carbohhydrates, int fats)
        {
            Name = name;
            ServingSize = servingSize;
            Calories = calories;
            Protein = protein;
            Carbohhydrates = carbohhydrates;
            Fats = fats;
        }
    }
}
