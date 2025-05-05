using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LifeQuest.Domain.Steps;
using LifeQuest.Services.Steps.Dtos;

namespace LifeQuest.Services.Steps.Mappings
{
    public class StepEntryMappings : Profile
    {
        public StepEntryMappings()
        {
            CreateMap<StepEntry, StepEntryResponseDto>();
            CreateMap<CreateStepEntryDto, StepEntry>();
            CreateMap<UpdateStepEntryDto, StepEntry>();
        }
    }
}
