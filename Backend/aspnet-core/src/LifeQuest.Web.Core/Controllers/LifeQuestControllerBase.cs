using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace LifeQuest.Controllers
{
    public abstract class LifeQuestControllerBase : AbpController
    {
        protected LifeQuestControllerBase()
        {
            LocalizationSourceName = LifeQuestConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
