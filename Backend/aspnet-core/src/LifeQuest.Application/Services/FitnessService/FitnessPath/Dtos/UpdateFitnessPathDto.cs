using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using LifeQuest.Services.Steps.Dtos;
using LifeQuest.Services.Weight.Dtos;

namespace LifeQuest.Services.FitnessService.FitnessPath.Dtos
{
    public class UpdateFitnessPathDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<Guid> StepEntryIds { get; set; }
        public List<Guid> WeightEntryIds { get; set; }
        public List<Guid> ExercisePlanIds { get; set; } = new List<Guid>();
        // public List<Guid> ActivityIds { get; set; }
    }
}
