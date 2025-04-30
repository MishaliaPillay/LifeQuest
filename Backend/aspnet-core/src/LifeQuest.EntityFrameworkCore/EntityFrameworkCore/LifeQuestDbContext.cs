using System.Linq;
using System;
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
    protected override void OnModelCreating(ModelBuilder modelBuilder)

    {

        base.OnModelCreating(modelBuilder);

        // Force all DateTime and DateTime? to be treated as UTC

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())

        {

            foreach (var property in entityType.GetProperties()

                .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))

            {

                property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(

                    v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),

                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)

                ));

            }

        }

    }

}
