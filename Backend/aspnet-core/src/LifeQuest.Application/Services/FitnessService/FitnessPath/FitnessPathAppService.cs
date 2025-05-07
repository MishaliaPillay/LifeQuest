using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.UI;
using LifeQuest.Domain.Paths.FitnessPath;
using LifeQuest.Services.FitnessService.FitnessPath.Dtos;
using LifeQuest.Domain.Steps;
using LifeQuest.Domain.Weight;
using Microsoft.Extensions.Logging;
using Abp.Domain.Repositories;
using LifeQuest.Domain.Person;
using ExercisePlanEntity = LifeQuest.Domain.Fitness.ExercisePlan.ExercisePlan;



namespace LifeQuest.Services.FitnessService.FitnessPath
{
    public class FitnessPathAppService : ApplicationService, IFitnessPathAppService
    {
        private readonly FitnessPathManager _fitnessPathManager;
        private readonly ILogger<FitnessPathAppService> _logger;
        private readonly IRepository<StepEntry, Guid> _stepEntryRepo;
        private readonly IRepository<WeightEntry, Guid> _weightEntryRepo;
        private readonly IRepository<ExercisePlanEntity, Guid> _exercisePlanRepo;

        private readonly IRepository<Person, Guid> _personRepo;

        public FitnessPathAppService(
            FitnessPathManager fitnessPathManager,
            ILogger<FitnessPathAppService> logger,
            IRepository<StepEntry, Guid> stepEntryRepo,
            IRepository<WeightEntry, Guid> weightEntryRepo,
            IRepository<ExercisePlanEntity, Guid> exercisePlanRepo, // Use ExercisePlan repo
            IRepository<Person, Guid> personRepo)
        {
            _fitnessPathManager = fitnessPathManager;
            _logger = logger;
            _stepEntryRepo = stepEntryRepo;
            _weightEntryRepo = weightEntryRepo;
            _exercisePlanRepo = exercisePlanRepo; // Initialize ExercisePlan repo
            _personRepo = personRepo;
        }

        public async Task<FitnessPathDto> CreateAsync(CreateFitnessPathDto input)
        {
            try
            {
                _logger.LogInformation("Creating a new FitnessPath with title: {Title}", input.Title);
                var path = ObjectMapper.Map<Domain.Paths.FitnessPath.FitnessPath>(input);
                await _fitnessPathManager.CreateAsync(path);

                // Link this path to the person (using PathId, not SelectedPathId)
                var person = await _personRepo.GetAsync(input.PersonId);
                person.PathId = path.Id;  // Correct property to link the selected path
                await _personRepo.UpdateAsync(person);

                _logger.LogInformation("Successfully created FitnessPath and linked it to Person ID: {PersonId}", input.PersonId);
                return ObjectMapper.Map<FitnessPathDto>(path);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating FitnessPath");
                throw new UserFriendlyException("Could not create FitnessPath");
            }
        }

        public async Task<FitnessPathDto> GetAsync(Guid id)
        {
            _logger.LogInformation("Fetching FitnessPath with ID: {Id}", id);
            var path = await _fitnessPathManager.GetWithDetailsAsync(id);
            return ObjectMapper.Map<FitnessPathDto>(path);
        }

        public async Task<List<FitnessPathDto>> GetAllAsync()
        {
            _logger.LogInformation("Fetching all FitnessPaths");
            var paths = await _fitnessPathManager.GetAllWithDetailsAsync();
            return ObjectMapper.Map<List<FitnessPathDto>>(paths);
        }

        public async Task<FitnessPathDto> UpdateAsync(UpdateFitnessPathDto input)
        {
            try
            {
                _logger.LogInformation("Updating FitnessPath with ID: {Id}", input.Id);
                var path = await _fitnessPathManager.GetWithDetailsAsync(input.Id);

                // Update scalar values
                path.Title = input.Title;
                path.Description = input.Description;

                // Clear and reassign collections
                path.StepEntries.Clear();
                path.WeightEntries.Clear();
                path.ExercisePlans.Clear(); // Clear previous exercise plans instead of activities

                // Re-fetch and assign based on new IDs
                var newStepEntries = await _stepEntryRepo.GetAllListAsync(se => input.StepEntryIds.Contains(se.Id));
                var newWeightEntries = await _weightEntryRepo.GetAllListAsync(we => input.WeightEntryIds.Contains(we.Id));
                var newExercisePlans = await _exercisePlanRepo.GetAllListAsync(ep => input.ExercisePlanIds.Contains(ep.Id));

                foreach (var entry in newStepEntries)
                    path.StepEntries.Add(entry);

                foreach (var entry in newWeightEntries)
                    path.WeightEntries.Add(entry);

                foreach (var plan in newExercisePlans) // Add exercise plans instead of activities
                    path.ExercisePlans.Add(plan);

                // Now update
                await _fitnessPathManager.UpdateAsync(path);
                return ObjectMapper.Map<FitnessPathDto>(path);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating FitnessPath with ID: {Id}", input.Id);
                throw new UserFriendlyException("Could not update FitnessPath");
            }
        }

        public async Task<FitnessPathDto> GetByPersonIdAsync(Guid personId)
        {
            _logger.LogInformation("Fetching FitnessPath for Person ID: {PersonId}", personId);

            try
            {
                var person = await _personRepo.GetAsync(personId);
                if (person.PathId == null)
                {
                    throw new UserFriendlyException("This person does not have a FitnessPath assigned.");
                }

                var path = await _fitnessPathManager.GetWithDetailsAsync(person.PathId.Value);
                if (path == null)
                {
                    throw new UserFriendlyException("No FitnessPath found for the provided PathId.");
                }

                var dto = ObjectMapper.Map<FitnessPathDto>(path);
                dto.PersonId = person.Id; // ensure PersonId is filled in the DTO

                return dto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching FitnessPath for Person ID: {PersonId}", personId);
                throw new UserFriendlyException("Could not retrieve FitnessPath for the specified person.");
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            _logger.LogInformation("Deleting FitnessPath with ID: {Id}", id);
            await _fitnessPathManager.DeleteAsync(id);
        }
    }
}
