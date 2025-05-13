using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.Extensions.Logging;
using LifeQuest.Domain.Paths.HealthPath; // Ensure you're importing the correct namespace for the HealthPath class
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Domain.Weight;
using LifeQuest.Domain.Person;
using LifeQuest.Services.HealthPath.Dtos;

namespace LifeQuest.Services.HealthPath
{
    public class HealthPathAppService : ApplicationService, IHealthPathAppService
    {
        private readonly HealthPathManager _healthPathManager;
        private readonly IRepository<Domain.Paths.HealthPath.HealthPath, Guid> _healthPathRepo; // Inject HealthPath repository
        private readonly IRepository<MealPlan, Guid> _mealPlanRepo;
        private readonly IRepository<WeightEntry, Guid> _weightEntryRepo;
        private readonly IRepository<Person, Guid> _personRepo;
        private readonly ILogger<HealthPathAppService> _logger;

        public HealthPathAppService(
            HealthPathManager healthPathManager,
            IRepository<Domain.Paths.HealthPath.HealthPath, Guid> healthPathRepo, // Inject HealthPath repository
            IRepository<MealPlan, Guid> mealPlanRepo,
            IRepository<WeightEntry, Guid> weightEntryRepo,
            IRepository<Person, Guid> personRepo,
            ILogger<HealthPathAppService> logger)
        {
            _healthPathManager = healthPathManager;
            _healthPathRepo = healthPathRepo; // Assign it here
            _mealPlanRepo = mealPlanRepo;
            _weightEntryRepo = weightEntryRepo;
            _personRepo = personRepo;
            _logger = logger;
        }

        public async Task<HealthPathDto> CreateAsync(CreateHealthPathDto input)
        {
            _logger.LogInformation("Creating HealthPath for Person ID: {PersonId}", input.PersonId);

            var path = ObjectMapper.Map<Domain.Paths.HealthPath.HealthPath>(input);
            await _healthPathManager.CreateAsync(path);

            var person = await _personRepo.GetAsync(input.PersonId);
            person.PathId = path.Id;
            await _personRepo.UpdateAsync(person);

            return ObjectMapper.Map<HealthPathDto>(path);
        }

        public async Task<HealthPathDto> GetByPersonIdAsync(Guid personId)
        {
            var person = await _personRepo.GetAsync(personId);
            if (person.PathId == null)
            {
                throw new UserFriendlyException("This person does not have a HealthPath assigned.");
            }

            var path = await _healthPathRepo.FirstOrDefaultAsync(p => p.Id == person.PathId.Value);
            if (path == null)
            {
                throw new UserFriendlyException("No HealthPath found for the provided PathId.");
            }

            return ObjectMapper.Map<HealthPathDto>(path);
        }

        public async Task<HealthPathDto> GetAsync(Guid id)
        {
            var path = await _healthPathManager.GetWithDetailsAsync(id);
            return ObjectMapper.Map<HealthPathDto>(path);
        }

        public async Task<List<HealthPathDto>> GetAllAsync()
        {
            var paths = await _healthPathManager.GetAllWithDetailsAsync();
            return ObjectMapper.Map<List<HealthPathDto>>(paths);
        }

        public async Task<HealthPathDto> UpdateAsync(UpdateHealthPathDto input)
        {
            var path = await _healthPathManager.GetWithDetailsAsync(input.Id);

            path.Title = input.Title;
            path.Description = input.Description;

            path.MealPlans.Clear();
            path.WeightEntries.Clear();

            var newMealPlans = await _mealPlanRepo.GetAllListAsync(mp => input.MealPlanIds.Contains(mp.Id));
            var newWeightEntries = await _weightEntryRepo.GetAllListAsync(we => input.WeightEntryIds.Contains(we.Id));

            foreach (var mp in newMealPlans) path.MealPlans.Add(mp);
            foreach (var we in newWeightEntries) path.WeightEntries.Add(we);

            await _healthPathManager.UpdateAsync(path);

            return ObjectMapper.Map<HealthPathDto>(path);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _healthPathManager.DeleteAsync(id);
        }
    }
}
