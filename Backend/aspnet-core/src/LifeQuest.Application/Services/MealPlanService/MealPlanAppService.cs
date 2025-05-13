using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using LifeQuest.Domain.Health.Meal;
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Domain.Paths.HealthPath;
using LifeQuest.Services.MealPlanService.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeQuest.Services.MealPlanService
{
    public class MealPlanAppService : ApplicationService, IMealPlanAppService
    {
        private readonly MealPlanManager _mealPlanManager;
        private readonly IRepository<MealPlan, Guid> _planRepo;
        private readonly IRepository<Domain.Paths.HealthPath.HealthPath, Guid> _pathRepo;
        private readonly IRepository<Meal, Guid> _mealRepo;
        private readonly ILogger<MealPlanAppService> _logger;

        public MealPlanAppService(
            MealPlanManager mealPlanManager,
            IRepository<MealPlan, Guid> planRepo,
            IRepository<Domain.Paths.HealthPath.HealthPath, Guid> pathRepo,
            IRepository<Meal, Guid> mealRepo,
            ILogger<MealPlanAppService> logger)
        {
            _mealPlanManager = mealPlanManager;
            _planRepo = planRepo;
            _pathRepo = pathRepo;
            _mealRepo = mealRepo;
            _logger = logger;
        }

        public async Task<MealPlanDto> CreateAsync(CreateMealPlanDto input)
        {
            _logger.LogInformation("Creating MealPlan for HealthPath: {HealthPathId}", input.HealthPathId);

            var meals = await _mealRepo.GetAll()
                .Where(m => input.MealIds.Contains(m.Id))
                .ToListAsync();

            if (meals.Count != input.MealIds.Count)
                throw new UserFriendlyException("Some meals not found.");

            var plan = await _mealPlanManager.CreatePlanAsync(input.HealthPathId, input.Name, meals);

            return ObjectMapper.Map<MealPlanDto>(plan);
        }



        public async Task<MealPlanDto> GetAsync(Guid id)
        {
            var plan = await _planRepo
                .GetAll()
                .Include(p => p.MealPlanMeals)
                    .ThenInclude(mpm => mpm.Meal)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                throw new UserFriendlyException("MealPlan not found.");

            return ObjectMapper.Map<MealPlanDto>(plan);
        }


        public async Task CompletePlanAsync(Guid planId)
        {
            await _mealPlanManager.CompletePlanAsync(planId);
        }

        public async Task<List<MealPlanDto>> GetHistoryAsync(Guid healthPathId)
        {
            var plans = await _planRepo
                .GetAll()
                .Where(p => p.HealthPathId == healthPathId && p.Status == MealPlanStatus.Completed)
                .Include(p => p.MealPlanMeals)
                    .ThenInclude(mpm => mpm.Meal)
                .ToListAsync();

            return ObjectMapper.Map<List<MealPlanDto>>(plans);
        }

    }
}
