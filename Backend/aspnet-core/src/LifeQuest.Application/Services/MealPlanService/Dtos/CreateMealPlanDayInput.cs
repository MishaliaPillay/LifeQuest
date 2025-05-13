using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class CreateMealPlanDayInput
    {
        public string Description { get; set; }
        public List<Guid> MealIds { get; set; }
    }
}
