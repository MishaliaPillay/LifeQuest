using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using LifeQuest.Authorization.Users;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Domain.Person
{
    public class PersonManager : DomainService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Person, Guid> _personRepository;

        public PersonManager(
            UserManager userManager,
            IRepository<Person, Guid> personRepository)
        {
            _userManager = userManager;
            _personRepository = personRepository;
        }

        public async Task<Person> CreatePersonAsync(
            string username,
            string email,
            string name,
            string surname,
            string password,
            string? avatar = null)
        {
            var user = new User
            {
                UserName = username,
                Name = name,
                Surname = surname,
                EmailAddress = email,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                var errorMessages = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new UserFriendlyException($"User creation failed: {errorMessages}");
            }


            await _userManager.AddToRoleAsync(user, "Default");

            var person = new Person
            {
                UserId = user.Id,
                Xp = 0,
                Level = 1,
                Avatar = avatar
            };

            await _personRepository.InsertAsync(person);
            return person;
        }

        public async Task<Person?> GetPersonByUserIdAsync(long userId)
        {
            return await _personRepository
                .GetAllIncluding(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<Person?> GetPersonWithUserAsync(Guid personId)
        {
            return await _personRepository
                .GetAllIncluding(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == personId);
        }

        public IQueryable<Person> GetAllWithUser()
        {
            return _personRepository
                .GetAllIncluding(p => p.User);
        }

        public async Task<Person> UpdatePersonAsync(
            Guid personId,
            string? avatar = null,
            int? xp = null,
            int? level = null)
        {
            var person = await _personRepository.GetAsync(personId);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            if (!string.IsNullOrEmpty(avatar))
                person.Avatar = avatar;

            if (xp.HasValue)
                person.Xp = xp.Value;

            if (level.HasValue)
                person.Level = level.Value;

            await _personRepository.UpdateAsync(person);
            return person;
        }
        public async Task<bool> DoesPersonHavePathAsync(long personId)
        {
            var person = await _personRepository
                .GetAllIncluding(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == personId);  // Use UserId (long)

            if (person == null)
                throw new UserFriendlyException("Person not found");

            return person.PathId.HasValue;  // Check if PathId is assigned
        }

        public async Task<Person> SelectPathAsync(long personId, Guid pathId)
        {
            var person = await _personRepository.GetAllIncluding(p => p.User)  // Adjusted to use long for personId
                .FirstOrDefaultAsync(p => p.UserId == personId);  // Use UserId as long here

            if (person == null)
                throw new UserFriendlyException("Person not found");

            person.PathId = pathId;  // Assign PathId (Guid)
            await _personRepository.UpdateAsync(person);  // Update the person entity

            return person;
        }

    }

}
