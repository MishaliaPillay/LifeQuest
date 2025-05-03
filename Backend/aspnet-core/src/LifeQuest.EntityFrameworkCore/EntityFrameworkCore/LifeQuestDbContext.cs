using System.Linq;
using System;
using Abp.Zero.EntityFrameworkCore;
using LifeQuest.Authorization.Roles;
using LifeQuest.Authorization.Users;
using LifeQuest.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using LifeQuest.Domain.Person;
using LifeQuest.Authorization;
using Abp.Authorization.Users;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Weight;
using LifeQuest.Domain.Steps;

namespace LifeQuest.EntityFrameworkCore;

public class LifeQuestDbContext : AbpZeroDbContext<Tenant, Role, User, LifeQuestDbContext>
{
    public DbSet<Person> Persons { get; set; }
    public DbSet<ActivityType> ActivityTypes { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityActivityType> ActivityActivityTypes { get; set; } // Add join table
    public DbSet<WeightEntry> WeightEntries { get; set; }
    public DbSet<StepEntry> StepEntries { get; set; }


    public LifeQuestDbContext(DbContextOptions<LifeQuestDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure UTC for all DateTime
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties().Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))
            {
                property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                    v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                ));
            }
        }

        // Configure many-to-many via join entity
        modelBuilder.Entity<ActivityActivityType>()
            .HasKey(x => new { x.ActivityId, x.ActivityTypeId });

        modelBuilder.Entity<ActivityActivityType>()
            .HasOne(at => at.Activity)
            .WithMany(a => a.ActivityActivityTypes)
            .HasForeignKey(at => at.ActivityId);

        modelBuilder.Entity<ActivityActivityType>()
            .HasOne(at => at.ActivityType)
            .WithMany()
            .HasForeignKey(at => at.ActivityTypeId);
    }
}

