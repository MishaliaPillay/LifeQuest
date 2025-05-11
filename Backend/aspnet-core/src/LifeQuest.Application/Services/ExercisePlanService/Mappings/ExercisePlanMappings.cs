using AutoMapper;
using LifeQuest.Services.FitnessService.Activity.Dtos;
using LifeQuest.Domain.Fitness.Activity;
using System.Linq;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Services.FitnessService.ExercisePlan.Dtos;

namespace LifeQuest.Services.ExercisePlanService.Mappings
{
    public class ExercisePlanMappings : Profile
    {
        public ExercisePlanMappings()
        {
            // Mapping for ExercisePlanDto (you were missing this)
            CreateMap<ExercisePlan, ExercisePlanDto>()
                .ForMember(dest => dest.Activities, opt => opt.Ignore());

            // Existing mapping for ExercisePlanResponseDto
            CreateMap<ExercisePlan, ExercisePlanResponseDto>()
                .ForMember(dest => dest.Activities, opt => opt.Ignore());

            // Mapping for ActivityResponseDto
            CreateMap<LifeQuest.Domain.Fitness.Activity.Activity, ActivityResponseDto>()
                .ForMember(dest => dest.Activities,
                    opt => opt.MapFrom(src =>
                        src.ActivityActivityTypes.Select(aat => aat.ActivityType).ToList()));

            // Mapping for ActivityTypeDto
            CreateMap<ActivityType, ActivityTypeDto>();
        }
    }
}
