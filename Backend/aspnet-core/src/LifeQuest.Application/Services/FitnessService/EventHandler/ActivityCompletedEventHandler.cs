using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Handlers;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Domain.Paths.FitnessPath;
using LifeQuest.Domain.Person;
using System.Linq;
using System.Threading.Tasks;
using ExercisePlanEntity = LifeQuest.Domain.Fitness.ExercisePlan.ExercisePlan;
using FitnessPathEntity = LifeQuest.Domain.Paths.FitnessPath.FitnessPath;

using LifeQuest.Domain.Fitness.Events;
using LifeQuest.Domain.Level;
using Abp.EntityFrameworkCore.Repositories;
using Microsoft.EntityFrameworkCore;
namespace LifeQuest.Services.FitnessService.EventHandler
{

    public class ActivityCompletedEventHandler : IAsyncEventHandler<ActivityCompletedEvent>, ITransientDependency
    {
        private readonly IRepository<ExercisePlanEntity, Guid> _exercisePlanRepo;
        private readonly IRepository<FitnessPathEntity, Guid> _fitnessPathRepo;
        private readonly IRepository<Person, Guid> _personRepo;

        public ActivityCompletedEventHandler(
            IRepository<ExercisePlanEntity, Guid> exercisePlanRepo,
            IRepository<FitnessPathEntity, Guid> fitnessPathRepo,
            IRepository<Person, Guid> personRepo)
        {
            _exercisePlanRepo = exercisePlanRepo;
            _fitnessPathRepo = fitnessPathRepo; 
            _personRepo = personRepo;
        }

        public async Task HandleEventAsync(ActivityCompletedEvent eventData)
        {
            var exercisePlan = await _exercisePlanRepo.GetAsync(eventData.ExercisePlanId);
            if (exercisePlan == null) return;

            var fitnessPath = await _fitnessPathRepo.GetAsync(exercisePlan.FitnessPathId);
            if (fitnessPath == null) return;

            var person = await _personRepo.GetAsync(fitnessPath.PersonId);
            if (person == null) return;

            person.AddXp(eventData.XpGained, await _personRepo.GetDbContext().Set<LevelDefinition>().ToListAsync());

            await _personRepo.UpdateAsync(person);
        }
    }
}
