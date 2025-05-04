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

namespace LifeQuest.Services.FitnessService.FitnessPath
{
    public class FitnessPathAppService : ApplicationService, IFitnessPathAppService
    {
        private readonly FitnessPathManager _fitnessPathManager;
        private readonly ILogger<FitnessPathAppService> _logger;
        private readonly IRepository<StepEntry, Guid> _stepEntryRepo;
        private readonly IRepository<WeightEntry, Guid> _weightEntryRepo;
        private readonly IRepository<Domain.Fitness.Activity.Activity, Guid> _activityRepo;

        public FitnessPathAppService(
            FitnessPathManager fitnessPathManager,
            ILogger<FitnessPathAppService> logger,
            IRepository<StepEntry, Guid> stepEntryRepo,
            IRepository<WeightEntry, Guid> weightEntryRepo,
            IRepository<Domain.Fitness.Activity.Activity, Guid> activityRepo)
        {
            _fitnessPathManager = fitnessPathManager;
            _logger = logger;
            _stepEntryRepo = stepEntryRepo;
            _weightEntryRepo = weightEntryRepo;
            _activityRepo = activityRepo;
        }


        public async Task<FitnessPathDto> CreateAsync(CreateFitnessPathDto input)
        {
            try
            {
                _logger.LogInformation("Creating a new FitnessPath with title: {Title}", input.Title);
                var path = ObjectMapper.Map<Domain.Paths.FitnessPath.FitnessPath>(input);
                await _fitnessPathManager.CreateAsync(path);
                _logger.LogInformation("Successfully created FitnessPath with ID: {Id}", path.Id);
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

                path.Title = input.Title;
                path.Description = input.Description;

                // Reassign collections based on IDs
                path.StepEntries = await _stepEntryRepo.GetAllListAsync(se => input.StepEntryIds.Contains(se.Id));
                path.WeightEntries = await _weightEntryRepo.GetAllListAsync(we => input.WeightEntryIds.Contains(we.Id));
                path.Activities = await _activityRepo.GetAllListAsync(act => input.ActivityIds.Contains(act.Id));

                await _fitnessPathManager.UpdateAsync(path);
                return ObjectMapper.Map<FitnessPathDto>(path);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating FitnessPath with ID: {Id}", input.Id);
                throw new UserFriendlyException("Could not update FitnessPath");
            }
        }


        public async Task DeleteAsync(Guid id)
        {
            _logger.LogInformation("Deleting FitnessPath with ID: {Id}", id);
            await _fitnessPathManager.DeleteAsync(id);
        }
    }
}
