using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using LifeQuest.Configuration;
using LifeQuest.EntityFrameworkCore;
using LifeQuest.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Dependency;
namespace LifeQuest.Migrator;

[DependsOn(typeof(LifeQuestEntityFrameworkModule))]
public class LifeQuestMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public LifeQuestMigratorModule(LifeQuestEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(LifeQuestMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        IocManager.RegisterIfNot<ITransientDependency, LifeQuestDbSeedContributor>();
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            LifeQuestConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {

        IocManager.RegisterAssemblyByConvention(typeof(LifeQuestMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
