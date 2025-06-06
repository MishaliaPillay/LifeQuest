﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Ingredient.Dtos;

namespace LifeQuest.Services.Health.Meal.Dtos
{
    public class MealDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Calories { get; set; }
        public List<Guid> IngredientIds { get; set; }
        public bool IsComplete { get; set; }
        public List<IngredientDto> Ingredients { get; set; } = new List<IngredientDto>();
        public int Score { get; set; }
    }
}
