using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Domain.Fitness.Activity; // renamed from Activity
using LifeQuest.Domain.Paths.FitnessPath;

namespace LifeQuest.Domain.Managers
{
    public class ExercisePlanManager : DomainService
    {
        private readonly IRepository<ExercisePlan, Guid> _planRepository;
        private readonly IRepository<FitnessPath, Guid> _fitnessPathRepository;

        public ExercisePlanManager(
            IRepository<ExercisePlan, Guid> planRepository,
            IRepository<FitnessPath, Guid> fitnessPathRepository)
        {
            _planRepository = planRepository;
            _fitnessPathRepository = fitnessPathRepository;
        }

        public async Task<ExercisePlan> CreatePlanAsync(Guid fitnessPathId, string name, List<Activity> activities)
        {
            if (activities == null || activities.Count == 0)
                throw new UserFriendlyException("The exercise plan must have at least one activity.");

            var path = await _fitnessPathRepository
                .GetAll()
                .Include(p => p.ExercisePlans)
                .FirstOrDefaultAsync(p => p.Id == fitnessPathId);

            if (path == null)
                throw new UserFriendlyException("Fitness path not found.");

            if (path.ExercisePlans.Any(p => p.Status == PlanStatus.Active))
                throw new UserFriendlyException("An active plan already exists.");

            var plan = new ExercisePlan
            {
                Id = Guid.NewGuid(),
                FitnessPathId = fitnessPathId,
                Name = name,
                Status = PlanStatus.Active,
                Activities = activities,
            };

            await _planRepository.InsertAsync(plan);
            return plan;
        }

        public async Task<ExercisePlan> GetActivePlanAsync(Guid fitnessPathId)
        {
            return await _planRepository.GetAll()
                .Where(p => p.FitnessPathId == fitnessPathId && p.Status == PlanStatus.Active)
                .Include(p => p.Activities)
                .FirstOrDefaultAsync();
        }

        public async Task<List<ExercisePlan>> GetPlanHistoryAsync(Guid fitnessPathId)
        {
            return await _planRepository.GetAll()
                .Where(p => p.FitnessPathId == fitnessPathId && p.Status == PlanStatus.Completed)
                .Include(p => p.Activities)
                .OrderByDescending(p => p.CompletedAt)
                .ToListAsync();
        }

        public async Task CompletePlanAsync(Guid planId)
        {
            var plan = await _planRepository.GetAsync(planId);

            if (plan == null)
                throw new UserFriendlyException("Plan not found.");

            if (plan.Status == PlanStatus.Completed)
                throw new UserFriendlyException("Plan is already completed.");

            plan.Status = PlanStatus.Completed;
            plan.CompletedAt = DateTime.UtcNow;

            await _planRepository.UpdateAsync(plan);
        }
    }
}