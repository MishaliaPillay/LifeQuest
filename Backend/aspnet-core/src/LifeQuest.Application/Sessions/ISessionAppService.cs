using Abp.Application.Services;
using LifeQuest.Sessions.Dto;
using System.Threading.Tasks;

namespace LifeQuest.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
