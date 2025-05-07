using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using LifeQuest.Services.FitnessService.FitnessPath.Dtos;

namespace LifeQuest.Services.FitnessService.FitnessPath
{
    public interface IFitnessPathAppService : IApplicationService
    {
        Task<FitnessPathDto> CreateAsync(CreateFitnessPathDto input);
        Task<FitnessPathDto> GetAsync(Guid id);
        Task<List<FitnessPathDto>> GetAllAsync();
        Task<FitnessPathDto> UpdateAsync(UpdateFitnessPathDto input);
        Task DeleteAsync(Guid id);
        Task<FitnessPathDto> GetByPersonIdAsync(Guid personId);

    }
}
