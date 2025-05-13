using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Meal.Dtos;
using LifeQuest.Domain.Health.MealPlan;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class MealPlanDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public MealPlanStatus Status { get; set; }
        public List<MealDto> Meals { get; set; }
    }
}
