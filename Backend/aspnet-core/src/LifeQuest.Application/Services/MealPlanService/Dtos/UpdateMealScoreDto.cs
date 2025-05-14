using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class UpdateMealScoreDto
    {
        public Guid MealId { get; set; }
        public int Score { get; set; }
    }
}
