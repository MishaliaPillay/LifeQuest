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
            CreateMap<Person, PersonResponseDto>();
            CreateMap<User, UserResponseDto>(); // 👈 Add this if it doesn't exist

            CreateMap<CreateUpdatePersonDto, Person>();
        }
    }
}
