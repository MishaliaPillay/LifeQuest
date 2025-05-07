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
            CreateMap<CreateActivityDto, Activity>()
                .ForMember(dest => dest.ActivityActivityTypes,
                    opt => opt.MapFrom(src =>
                        src.ActivityTypeIds.Select(id => new ActivityActivityType
                        {
                            ActivityTypeId = id
                        }).ToList()))
                .ForMember(dest => dest.IsComplete, opt => opt.MapFrom(_ => false))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(_ => 0));

            CreateMap<ExercisePlan, ExercisePlanDto>()
    .ForMember(dest => dest.Activities, opt => opt.MapFrom(src => src.Activities)) // if needed
    .ReverseMap(); // optional, if you need two-way mapping

        }
    }
}
