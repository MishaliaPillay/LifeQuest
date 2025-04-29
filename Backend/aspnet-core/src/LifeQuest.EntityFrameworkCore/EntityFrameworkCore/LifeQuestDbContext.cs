using Abp.Zero.EntityFrameworkCore;
using LifeQuest.Authorization.Roles;
using LifeQuest.Authorization.Users;
using LifeQuest.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace LifeQuest.EntityFrameworkCore;

public class LifeQuestDbContext : AbpZeroDbContext<Tenant, Role, User, LifeQuestDbContext>
{
    /* Define a DbSet for each entity of the application */

    public LifeQuestDbContext(DbContextOptions<LifeQuestDbContext> options)
        : base(options)
    {
    }
}
