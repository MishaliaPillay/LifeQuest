using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using LifeQuest.Services.HealthPath.Dtos;

namespace LifeQuest.Services.HealthPath
{
    public interface IHealthPathAppService : IApplicationService
    {
        Task<HealthPathDto> CreateAsync(CreateHealthPathDto input);
        Task<HealthPathDto> UpdateAsync(UpdateHealthPathDto input);
        Task<HealthPathDto> GetAsync(Guid id);
        Task<List<HealthPathDto>> GetAllAsync();
        Task DeleteAsync(Guid id);
        Task<HealthPathDto> GetByPersonIdAsync(Guid personId);
    }

}
