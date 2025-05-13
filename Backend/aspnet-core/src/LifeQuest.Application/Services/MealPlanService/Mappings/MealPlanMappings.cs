using AutoMapper;
using LifeQuest.Domain.Health.Meal;
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Services.Health.Ingredient.Dtos;
using LifeQuest.Services.Health.Meal.Dtos;
using LifeQuest.Services.MealPlanService.Dtos;
using System.Linq;

namespace LifeQuest.Services.HealthService.MealPlan.Mappings
{
    public class MealPlanMappings : Profile
    {
        public MealPlanMappings()
        {
            // Basic MealPlan mappings
            CreateMap<Domain.Health.MealPlan.MealPlan, MealPlanDto>()
                .ForMember(dest => dest.Meals, opt => opt.Ignore()); // populate manually if needed

            CreateMap<Domain.Health.MealPlan.MealPlan, MealPlanResponseDto>()
                .ForMember(dest => dest.Meals, opt => opt.Ignore()); // populate manually if needed

            // Meal mapping
            CreateMap<Meal, MealDto>()
                .ForMember(dest => dest.Ingredients,
                    opt => opt.MapFrom(src =>
                        src.MealIngredients.Select(mi => mi.Ingredient).ToList()));

            // Ingredient mapping
            CreateMap<LifeQuest.Domain.Health.Ingredient.Ingredient, IngredientDto>();
        }
    }
}
