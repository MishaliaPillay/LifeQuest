using Abp.Application.Services;
using LifeQuest.MultiTenancy.Dto;

namespace LifeQuest.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

