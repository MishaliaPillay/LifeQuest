using LifeQuest.Configuration.Dto;
using System.Threading.Tasks;

namespace LifeQuest.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
