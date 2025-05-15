using System;
using Abp.Application.Services.Dto;
using LifeQuest.Domain.Paths;
using LifeQuest.Domain.Paths.FitnessPath;
namespace LifeQuest.Services.PersonService.Dtos
{
    public class PersonResponseDto : EntityDto<Guid>
    {
        public UserResponseDto User { get; set; }
        public int Xp { get; set; }
        public int Level { get; set; }
        public string? Avatar { get; set; }
        public Guid? PathId { get; set; }
        public string? AvatarDescription { get; set; }

    }
}