using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper;
using LifeQuest.Domain.Person;
using LifeQuest.Services.PersonService.Dtos;
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
          input.UserName,
          input.EmailAddress,
          input.Name,
          input.Surname,
          input.Password,
          input.Avatar
      );


            return _mapper.Map<PersonResponseDto>(person);
        }

        public override async Task<PersonResponseDto> GetAsync(EntityDto<Guid> input)
        {
            var person = await _personManager.GetPersonWithUserAsync(input.Id);
            if (person == null)
                throw new UserFriendlyException("Person not found");

            return _mapper.Map<PersonResponseDto>(person);
        }

        public override async Task<PagedResultDto<PersonResponseDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _personManager.GetAllWithUser(); // IQueryable<Person>
            var totalCount = await query.CountAsync();

            var persons = await query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            return new PagedResultDto<PersonResponseDto>(
                totalCount,
                _mapper.Map<List<PersonResponseDto>>(persons)
            );
        }

        public async Task<PersonResponseDto> GetCurrentPersonAsync(long userId)
        {
            var person = await _personManager.GetPersonByUserIdAsync(userId);
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
        input.Level
    );


            return _mapper.Map<PersonResponseDto>(updated);
        }
    }
}
