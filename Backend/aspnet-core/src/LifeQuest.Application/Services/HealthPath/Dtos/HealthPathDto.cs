using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.MealPlanService.Dtos;
using LifeQuest.Services.Weight.Dtos;

namespace LifeQuest.Services.HealthPath.Dtos
{
    public class HealthPathDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<MealPlanDto> MealPlans { get; set; }
        public List<WeightEntryDto> WeightEntries { get; set; }
        public Guid PersonId { get; set; }
    }
}
