using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LifeQuest.Services.Path.Dtos;

namespace LifeQuest.Services.Path.Mappings
{
    public class PathMappings : Profile
    {
        public PathMappings()
        {
            CreateMap<LifeQuest.Domain.Paths.Path, PathTypeDto>()
        .ForMember(dest => dest.PathType, opt => opt.MapFrom(src => src.GetType().Name));
        }
    }
}
