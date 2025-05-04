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
    public class FitnessPathDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public Guid PersonId { get; set; }

        public List<StepEntryResponseDto> StepEntries { get; set; }
        public List<WeightEntryResponseDto> WeightEntries { get; set; }
        public List<ActivityResponseDto> Activities { get; set; }
    }
}
