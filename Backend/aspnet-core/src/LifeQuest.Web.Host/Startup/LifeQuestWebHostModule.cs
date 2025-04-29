using Abp.Modules;
using Abp.Reflection.Extensions;
using LifeQuest.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace LifeQuest.Web.Host.Startup
{
    [DependsOn(
       typeof(LifeQuestWebCoreModule))]
    public class LifeQuestWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public LifeQuestWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(LifeQuestWebHostModule).GetAssembly());
        }
    }
}
