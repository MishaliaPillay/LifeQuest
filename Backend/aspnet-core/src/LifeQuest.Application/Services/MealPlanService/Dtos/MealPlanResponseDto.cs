using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.Health.Meal.Dtos;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class MealPlanResponseDto
    {
        public Guid Id { get; set; }
        public Guid HealthPathId { get; set; }
        public string Name { get; set; }
        public LifeQuest.Domain.Health.MealPlan.MealPlanStatus MealPlanStatus { get; set; }
        public List<MealDto> Meals { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
