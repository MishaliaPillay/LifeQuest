using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Handlers;
using LifeQuest.Domain.Level;
using LifeQuest.Domain.Health.Events;  // Make sure this is the correct namespace
using LifeQuest.Domain.Person;
using Microsoft.EntityFrameworkCore;
using Abp.EntityFrameworkCore.Repositories;

public class MealCompletedEventHandler : IAsyncEventHandler<MealCompletedEvent>, ITransientDependency
{
    private readonly IRepository<Person, Guid> _personRepository;

    public MealCompletedEventHandler(IRepository<Person, Guid> personRepository)
    {
        _personRepository = personRepository;
    }

    public async Task HandleEventAsync(MealCompletedEvent eventData)
    {
        var person = await _personRepository.GetAsync(eventData.PersonId);
        if (person == null) return;


        person.AddXp(eventData.XpGained, await _personRepository.GetDbContext().Set<LevelDefinition>().ToListAsync());

        await _personRepository.UpdateAsync(person);
    }
}