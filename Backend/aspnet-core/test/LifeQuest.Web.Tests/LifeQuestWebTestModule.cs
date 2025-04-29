using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using LifeQuest.EntityFrameworkCore;
using LifeQuest.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace LifeQuest.Web.Tests;

[DependsOn(
    typeof(LifeQuestWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class LifeQuestWebTestModule : AbpModule
{
    public LifeQuestWebTestModule(LifeQuestEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(LifeQuestWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(LifeQuestWebMvcModule).Assembly);
    }
}