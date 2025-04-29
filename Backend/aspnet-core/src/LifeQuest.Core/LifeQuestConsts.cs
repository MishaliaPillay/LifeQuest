using LifeQuest.Debugging;

namespace LifeQuest;

public class LifeQuestConsts
{
    public const string LocalizationSourceName = "LifeQuest";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "94f74e780cc040d6a9c26e2f9b6a552d";
}
