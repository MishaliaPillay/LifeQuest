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
using LifeQuest.Domain.Paths.FitnessPath;
using LifeQuest.Domain.Paths;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Domain.Health.Ingredient;
using LifeQuest.Domain.Health;
using LifeQuest.Domain.Health.Meal;

namespace LifeQuest.EntityFrameworkCore;

public class LifeQuestDbContext : AbpZeroDbContext<Tenant, Role, User, LifeQuestDbContext>
{
    public DbSet<Person> Persons { get; set; }
    public DbSet<ActivityType> ActivityTypes { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityActivityType> ActivityActivityTypes { get; set; } // Add join table
    public DbSet<WeightEntry> WeightEntries { get; set; }
    public DbSet<StepEntry> StepEntries { get; set; }
    public DbSet<Path> Paths { get; set; }
    public DbSet<ExercisePlan> ExercisePlans { get; set; }
    public DbSet<FitnessPath> FitnessPaths { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<Meal> Meals { get; set; }
    public DbSet<MealIngredient> MealIngredients { get; set; }


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

        modelBuilder.Entity<MealIngredient>()
    .HasKey(mi => new { mi.MealId, mi.IngredientId });

        modelBuilder.Entity<MealIngredient>()
            .HasOne(mi => mi.Meal)
            .WithMany(m => m.MealIngredients)
            .HasForeignKey(mi => mi.MealId);

        modelBuilder.Entity<MealIngredient>()
            .HasOne(mi => mi.Ingredient)
            .WithMany()
            .HasForeignKey(mi => mi.IngredientId);

        // Configure many-to-many via join entity for ActivityActivityType
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

        // Configure Person's relationship to Path
        modelBuilder.Entity<Person>()
            .HasOne(p => p.SelectedPath)  // Person has one selected path
            .WithMany()  // Path does not need a back reference
            .HasForeignKey(p => p.PathId) // Foreign key in Person to Path
            .OnDelete(DeleteBehavior.SetNull); // Prevent cascading deletes

        // Configure the Path subclasses if needed
        modelBuilder.Entity<FitnessPath>()
            .HasBaseType<Path>(); // Optional if using inheritance for specific path types

        //modelBuilder.Entity<HealthPath>()
        //    .HasBaseType<Path>(); // Optional if using inheritance for specific path types
        modelBuilder.Entity<ExercisePlan>()
    .HasOne(ep => ep.FitnessPath)
    .WithMany(fp => fp.ExercisePlans)
    .HasForeignKey(ep => ep.FitnessPathId)
    .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<ExercisePlan>()
        .HasMany(ep => ep.Activities)
        .WithOne(a => a.ExercisePlan)
        .HasForeignKey(a => a.ExercisePlanId)
        .OnDelete(DeleteBehavior.Cascade);
    }


}

