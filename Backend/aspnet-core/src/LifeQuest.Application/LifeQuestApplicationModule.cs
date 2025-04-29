using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using LifeQuest.Authorization;

namespace LifeQuest;

[DependsOn(
    typeof(LifeQuestCoreModule),
    typeof(AbpAutoMapperModule))]
public class LifeQuestApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<LifeQuestAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(LifeQuestApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
