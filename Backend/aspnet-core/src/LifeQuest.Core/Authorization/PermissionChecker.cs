using Abp.Authorization;
using LifeQuest.Authorization.Roles;
using LifeQuest.Authorization.Users;

namespace LifeQuest.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
