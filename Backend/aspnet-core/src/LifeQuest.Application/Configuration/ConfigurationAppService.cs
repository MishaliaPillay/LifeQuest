using Abp.Authorization;
using Abp.Runtime.Session;
using LifeQuest.Configuration.Dto;
using System.Threading.Tasks;

namespace LifeQuest.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : LifeQuestAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
