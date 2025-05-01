using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LifeQuest.Domain.Fitness.Activity
{
    public class ActivityTypeManager : DomainService
    {
        private readonly IRepository<ActivityType, Guid> _activityTypeRepository;

        public ActivityTypeManager(IRepository<ActivityType, Guid> activityTypeRepository)
        {
            _activityTypeRepository = activityTypeRepository;
        }

        public async Task<ActivityType> CreateActivityTypeAsync(string category, int intensityLevel, string description)
        {
            var activityType = new ActivityType(category, intensityLevel, description);
            await _activityTypeRepository.InsertAsync(activityType);
            return activityType;
        }

        public async Task<List<ActivityType>> GetAllAsync()
        {
            return await _activityTypeRepository.GetAllListAsync();
        }

        public async Task<ActivityType> UpdateActivityTypeAsync(Guid id, string category, int intensityLevel, string description)
        {
            var activityType = await _activityTypeRepository.FirstOrDefaultAsync(id);
            if (activityType == null)
                throw new UserFriendlyException("Activity Type not found.");

            activityType.Category = category;
            activityType.IntensityLevel = intensityLevel;
            activityType.Description = description;

            await _activityTypeRepository.UpdateAsync(activityType);
            return activityType;
        }

        public async Task DeleteActivityTypeAsync(Guid id)
        {
            var activityType = await _activityTypeRepository.FirstOrDefaultAsync(id);
            if (activityType == null)
                throw new UserFriendlyException("Activity Type not found.");

            await _activityTypeRepository.DeleteAsync(activityType);
        }
    }
}
