using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Services.HealthPath.Dtos
{
    public class UpdateHealthPathDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<Guid> MealPlanIds { get; set; }
        public List<Guid> WeightEntryIds { get; set; }
    }
}
