using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using LifeQuest.Domain.Paths.HealthPath;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Health.MealPlan
{
    public class MealPlanManager : DomainService
    {
        private readonly IRepository<MealPlan, Guid> _planRepo;
        private readonly IRepository<HealthPath, Guid> _pathRepo;

        public MealPlanManager(IRepository<MealPlan, Guid> planRepo, IRepository<HealthPath, Guid> pathRepo)
        {
            _planRepo = planRepo;
            _pathRepo = pathRepo;
        }

        public async Task<MealPlan> CreatePlanAsync(Guid healthPathId, string name, List<LifeQuest.Domain.Health.Meal.Meal> meals)
        {
            if (meals == null || meals.Count == 0)
                throw new UserFriendlyException("MealPlan must contain at least one meal.");

            var path = await _pathRepo.GetAll()
                .Include(p => p.MealPlans)
                .FirstOrDefaultAsync(p => p.Id == healthPathId);

            if (path == null)
                throw new UserFriendlyException("Health path not found.");

            if (path.MealPlans.Any(p => p.Status == MealPlanStatus.Active))
                throw new UserFriendlyException("An active MealPlan already exists.");

            var plan = new MealPlan
            {
                Id = Guid.NewGuid(),
                HealthPathId = healthPathId,
                Name = name,
                Status = MealPlanStatus.Active,
            };

            await _planRepo.InsertAsync(plan);
            return plan;
        }

        public async Task CompletePlanAsync(Guid planId)
        {
            var plan = await _planRepo.GetAsync(planId);

            if (plan == null)
                throw new UserFriendlyException("MealPlan not found.");

            if (plan.Status == MealPlanStatus.Completed)
                throw new UserFriendlyException("MealPlan already completed.");

            plan.Status = MealPlanStatus.Completed;
            plan.CompletedAt = DateTime.UtcNow;

            await _planRepo.UpdateAsync(plan);
        }
    }
}
