using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LifeQuest.Authorization.Users;
using LifeQuest.Domain.Person;
using LifeQuest.Services.PersonService.Dtos;
namespace LifeQuest.Services.PersonService.Mappings
{
    class CustomDtoMappings : Profile
    {
        public CustomDtoMappings()
        {
            CreateMap<Person, PersonDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));

            CreateMap<User, UserResponseDto>();

            CreateMap<CreateUpdatePersonDto, Person>();

            // Updated mapping to map PathId instead of SelectedPath
            CreateMap<Person, PersonResponseDto>()
                .ForMember(dest => dest.PathId, opt => opt.MapFrom(src => src.PathId));
        }
    }
}