using Abp.Authorization.Users;
using LifeQuest.Authorization.Users;

public class AppUser : AbpUser<User>
{
    public int Xp { get; set; }
    public int Level { get; set; }

    public AppUser()
    {
        Level = 1;
        Xp = 0;
    }

    public void GainXp(int amount)
    {
        Xp += amount;
        CheckLevelUp();
    }

    private void CheckLevelUp()
    {
        while (Xp >= Level * 100)
        {
            Xp -= Level * 100;
            Level++;
        }
    }
}
