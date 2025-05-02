using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LifeQuest.Services.FitnessService.Activity.Dtos;

namespace LifeQuest.Services.FitnessService.Activity
{
    public interface IActivityAppService
    {
        Task<ActivityResponseDto> CreateActivityAsync(CreateActivityDto input);
        Task<List<ActivityResponseDto>> GetAllActivityAsync();
        Task<ActivityResponseDto> UpdateActivityAsync(UpdateActivityDto input);
        Task DeleteActivityAsync(Guid id);
    }
}
