using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.MealPlanService.Dtos
{
    public class CreateMealPlanDto
    {
        public Guid HealthPathId { get; set; }
        public string Name { get; set; }
        public List<Guid> MealIds { get; set; }

    }
}
