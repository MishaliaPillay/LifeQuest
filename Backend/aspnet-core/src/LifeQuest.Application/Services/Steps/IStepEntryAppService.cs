using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using LifeQuest.Services.Steps.Dtos;

namespace LifeQuest.Services.Steps
{
    public interface IStepEntryAppService : IApplicationService
    {
        Task<StepEntryResponseDto> CreateAsync(CreateStepEntryDto input);
        Task<StepEntryResponseDto> GetAsync(Guid id);
        Task<List<StepEntryResponseDto>> GetAllForPersonAsync(Guid personId);
        Task<StepEntryResponseDto> UpdateAsync(UpdateStepEntryDto input);
        Task DeleteAsync(Guid id);
    }
}
