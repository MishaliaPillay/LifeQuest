// ActivityManager.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using Microsoft.EntityFrameworkCore; // Make sure this is included

namespace LifeQuest.Domain.Fitness.Activity
{
    public class ActivityManager : DomainService
    {
        private readonly IRepository<Activity, Guid> _activityRepository;

        public ActivityManager(IRepository<Activity, Guid> activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public async Task<Activity> CreateActivityAsync(
    int calories,
    int duration,
    int xp,
    int level,
    List<ActivityType> activityTypes,
    bool isComplete,
    ActivityRating rating,
    string description
            //Guid personId
            )
        {
            var activity = new Activity(
                calories,
                duration,
                xp,
                level,
                new List<ActivityActivityType>(),
                isComplete,
                rating,
                description
                //personId
                ); // Set personId

            foreach (var activityType in activityTypes)
            {
                activity.ActivityActivityTypes.Add(new ActivityActivityType
                {
                    ActivityId = activity.Id,
                    ActivityTypeId = activityType.Id,
                    ActivityType = activityType
                });
            }

            await _activityRepository.InsertAsync(activity);
            return activity;
        }


        public async Task<List<Activity>> GetAllAsync()
        {
            // Fixed method: Using Include instead of GetAllIncluding
            return await _activityRepository.GetAll()
                .Include(a => a.ActivityActivityTypes)
                .ThenInclude(aat => aat.ActivityType)
                .ToListAsync();
        }

        public async Task<Activity> UpdateActivityAsync(
            Guid id,
            int calories,
            int duration,
            int xp,
            int level,
            List<ActivityType> activityTypes,
            bool isComplete,
            ActivityRating rating,
            string description)
        {
            // Fixed query: Using Include instead of GetAllIncluding
            var activity = await _activityRepository.GetAll()
                .Include(a => a.ActivityActivityTypes)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (activity == null)
                throw new UserFriendlyException("Activity not found.");

            activity.Calories = calories;
            activity.Duration = duration;
            activity.Xp = xp;
            activity.Level = level;
            activity.IsComplete = isComplete;
            activity.Rating = rating;
            activity.Description = description;

            // Update join entities
            activity.ActivityActivityTypes.Clear();

            // Create new ActivityActivityType objects
            foreach (var activityType in activityTypes)
            {
                activity.ActivityActivityTypes.Add(new ActivityActivityType
                {
                    ActivityId = activity.Id,
                    ActivityTypeId = activityType.Id,
                    ActivityType = activityType
                });
            }

            await _activityRepository.UpdateAsync(activity);
            return activity;
        }
        //public async Task<List<Activity>> GetByPersonIdAsync(Guid personId)
        //{
        //    // Get activities where PersonId matches the provided personId
        //    return await _activityRepository.GetAll()
        //        .Where(a => a.PersonId == personId) // Filter by PersonId
        //        .Include(a => a.ActivityActivityTypes)
        //        .ThenInclude(aat => aat.ActivityType)
        //        .ToListAsync();
        //}


        public async Task DeleteActivityAsync(Guid id)
        {
            var activity = await _activityRepository.FirstOrDefaultAsync(id);
            if (activity == null)
                throw new UserFriendlyException("Activity not found.");

            await _activityRepository.DeleteAsync(activity);
        }
    }
}