using AutoMapper;
using LifeQuest.Domain.Paths.HealthPath;
using LifeQuest.Services.Weight.Dtos;
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Domain.Weight;
using LifeQuest.Services.HealthPath.Dtos;
using LifeQuest.Services.MealPlanService.Dtos;

namespace LifeQuest.Services.HealthService.HealthPath.Mappings
{
    public class HealthPathMappings : Profile
    {
        public HealthPathMappings()
        {
            CreateMap<LifeQuest.Domain.Paths.HealthPath.HealthPath, HealthPathDto>();
            CreateMap<CreateHealthPathDto, LifeQuest.Domain.Paths.HealthPath.HealthPath>();
            CreateMap<UpdateHealthPathDto, LifeQuest.Domain.Paths.HealthPath.HealthPath>();

            CreateMap<LifeQuest.Domain.Paths.HealthPath.HealthPath, MealPlanDto>();
            CreateMap<WeightEntry, WeightEntryDto>();
        }
    }
}
