using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper;
using LifeQuest.Domain.Person;
using LifeQuest.Services.PersonService.Dtos;
using LifeQuest.Services.PersonService.Dtos.LifeQuest.Services.PersonService.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.Services.PersonService
{
    public class PersonAppService :
        AsyncCrudAppService<Person, PersonResponseDto, Guid, PagedAndSortedResultRequestDto, PersonRequestDto, PersonResponseDto>,
        IPersonAppService
    {
        private readonly PersonManager _personManager;
        private readonly IRepository<Person, Guid> _repository;
        private readonly IMapper _mapper;

        public PersonAppService(
            IRepository<Person, Guid> repository,
            PersonManager personManager,
            IMapper mapper
        ) : base(repository)
        {
            _repository = repository;
            _personManager = personManager;
            _mapper = mapper;
        }

        public override async Task<PersonResponseDto> CreateAsync(PersonRequestDto input)
        {
            var person = await _personManager.CreatePersonAsync(
                input.User.UserName,
                input.User.EmailAddress,
                input.User.Name,
                input.User.Surname,
                input.User.Password,
                input.Avatar,
                input.PersonDescription // ADD THIS
            );


            return _mapper.Map<PersonResponseDto>(person);
        }

        public override async Task<PersonResponseDto> GetAsync(EntityDto<Guid> input)
        {
            var person = await _repository.GetAsync(input.Id);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(person);
        }

        public override async Task<PagedResultDto<PersonResponseDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _personManager.GetAllWithUser();
            var totalCount = await query.CountAsync();

            var persons = await query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            // Use AutoMapper to map each Person to PersonResponseDto with PathId
            return new PagedResultDto<PersonResponseDto>(
                totalCount,
                _mapper.Map<List<PersonResponseDto>>(persons)
            );
        }

        public async Task<PersonResponseDto> GetCurrentPersonAsync(long userId)
        {
            var person = await _personManager.GetPersonByUserIdAsync(userId);
            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(person);
        }
        public async Task<PersonResponseDto> SetDescriptionAsync(SetPersonDescriptionDto input)
        {
            var person = await _personManager.SetPersonDescriptionAsync(input.PersonId, input.PersonDescription);
            return _mapper.Map<PersonResponseDto>(person);
        }

        public async Task<PersonResponseDto> updatePersonAsync(UpdatePersonDto input)
        {
            var person = await _repository.GetAsync(input.Id);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            var updated = await _personManager.UpdatePersonAsync(
                input.Id,
                input.Avatar,
                input.Xp,
                input.Level,
                input.PersonDescription // ADD THIS
            );


            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(updated);
        }

        public async Task<PersonResponseDto> SelectPath([FromBody] SelectPathDto input)
        {
            var hasPath = await _personManager.DoesPersonHavePathAsync(input.PersonId);

            if (hasPath)
            {
                throw new UserFriendlyException("Person already has a path assigned.");
            }

            var updatedPerson = await _personManager.SelectPathAsync(input.PersonId, input.PathId);

            // Use AutoMapper to map Person to PersonResponseDto with PathId
            return _mapper.Map<PersonResponseDto>(updatedPerson);
        }
    }
}