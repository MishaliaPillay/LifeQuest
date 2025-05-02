using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using LifeQuest.Services.Weight.Dtos;

namespace LifeQuest.Services.Weight
{
    namespace LifeQuest.Services.Health
    {
        public interface IWeightEntryAppService : IApplicationService
        {
            Task<WeightEntryResponseDto> CreateAsync(CreateWeightEntryDto input);
            Task<WeightEntryResponseDto> GetAsync(Guid id);
            Task<List<WeightEntryResponseDto>> GetAllForPersonAsync(Guid personId);
            Task<WeightEntryResponseDto> UpdateAsync(UpdateWeightEntryDto input);
            Task DeleteAsync(Guid id);
        }
    }
}
