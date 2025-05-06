using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Application.Services;
using LifeQuest.Services.Path.Dtos;

namespace LifeQuest.Services.Path
{
    public interface IPathAppService : IApplicationService
    {
        Task<PathTypeDto> GetAsync(Guid id);
        Task<ListResultDto<PathTypeDto>> GetAllAsync();
    }
}
