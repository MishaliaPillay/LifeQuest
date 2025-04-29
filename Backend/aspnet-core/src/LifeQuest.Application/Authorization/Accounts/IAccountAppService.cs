using Abp.Application.Services;
using LifeQuest.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace LifeQuest.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
