using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using LifeQuest.Services.PersonService.Dtos;

namespace LifeQuest.Services.PersonService
{
    public interface IPersonAppService :
        IAsyncCrudAppService<PersonResponseDto, Guid, PagedAndSortedResultRequestDto, PersonRequestDto, PersonResponseDto>
    {
        public Task<PersonResponseDto> GetCurrentPersonAsync(long userId);
        public Task<PersonResponseDto> updatePersonAsync(UpdatePersonDto input);
        public Task<PersonResponseDto> GenerateAndSaveAvatarAsync(Guid personId);
        Task<PersonResponseDto> UpdateAvatarDescriptionAsync(UpdateAvatarDescriptionDto input);

    }
}
