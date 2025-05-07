using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LifeQuest.Services.FitnessService.FitnessPath.Dtos;
using LifeQuest.Domain.Paths.FitnessPath;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using LifeQuest.Services.Steps.Dtos;
using LifeQuest.Services.Weight.Dtos;
using LifeQuest.Domain.Steps;
using LifeQuest.Domain.Weight;
using LifeQuest.Services.FitnessService.ExercisePlan.Dtos;

namespace LifeQuest.Services.FitnessService.FitnessPath.Mappings
{
    public class FitnessPathMappings : Profile
    {
        public FitnessPathMappings()
        {
            CreateMap<Domain.Paths.FitnessPath.FitnessPath, FitnessPathDto>();
            CreateMap<CreateFitnessPathDto, Domain.Paths.FitnessPath.FitnessPath>();
            CreateMap<UpdateFitnessPathDto, Domain.Paths.FitnessPath.FitnessPath>();

            // Add these mappings for nested collections
            CreateMap<StepEntry, StepEntryResponseDto>();
            CreateMap<WeightEntry, WeightEntryResponseDto>();
            CreateMap<Domain.Fitness.Activity.Activity, ActivityResponseDto>();
            CreateMap<Domain.Fitness.ExercisePlan.ExercisePlan, ExercisePlanResponseDto>()
     // and any nested properties on the plan, e.g. Activities:
     .ForMember(dest => dest.Activities,
                opt => opt.MapFrom(src => src.Activities));

        }
    }
}