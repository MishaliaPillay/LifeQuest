using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LifeQuest.Domain.Weight;
using LifeQuest.Services.Weight.Dtos;

namespace LifeQuest.Services.Weight.Mappings
{
    public class WeightEntryMappings : Profile
    {
        public WeightEntryMappings()
        {
            CreateMap<WeightEntry, WeightEntryResponseDto>();
            CreateMap<CreateWeightEntryDto, WeightEntry>();
            CreateMap<UpdateWeightEntryDto, WeightEntry>();
        }
    }
}