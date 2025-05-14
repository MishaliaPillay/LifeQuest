using System;
using System.Linq;
using Abp.Zero.EntityFrameworkCore;
using LifeQuest.Authorization.Roles;
using LifeQuest.Authorization.Users;
using LifeQuest.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using LifeQuest.Domain.Person;
using LifeQuest.Domain.Fitness.Activity;
using LifeQuest.Domain.Weight;
using LifeQuest.Domain.Steps;
using LifeQuest.Domain.Paths.FitnessPath;
using LifeQuest.Domain.Paths.HealthPath;
using LifeQuest.Domain.Paths;
using LifeQuest.Domain.Fitness.ExercisePlan;
using LifeQuest.Domain.Health.Ingredient;
using LifeQuest.Domain.Health.Meal;
using LifeQuest.Domain.Health.MealPlan;
using LifeQuest.Domain.Health;
using LifeQuest.Domain.Level;

namespace LifeQuest.EntityFrameworkCore
{
    public class LifeQuestDbContext : AbpZeroDbContext<Tenant, Role, User, LifeQuestDbContext>
    {
        public DbSet<Person> Persons { get; set; }
        public DbSet<ActivityType> ActivityTypes { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityActivityType> ActivityActivityTypes { get; set; }
        public DbSet<WeightEntry> WeightEntries { get; set; }
        public DbSet<StepEntry> StepEntries { get; set; }
        public DbSet<Path> Paths { get; set; }
        public DbSet<FitnessPath> FitnessPaths { get; set; }
        public DbSet<ExercisePlan> ExercisePlans { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<MealIngredient> MealIngredients { get; set; }

        public DbSet<MealPlan> MealPlans { get; set; }
        public DbSet<MealPlanDay> MealPlanDays { get; set; }
        public DbSet<MealPlanMeal> MealPlanMeals { get; set; }
        public DbSet<HealthPath> HealthPaths { get; set; }
        public DbSet<MealPlanDayMeal> MealPlanDayMeals { get; set; }

        public DbSet<LevelDefinition> LevelDefinitions { get; set; }
        public LifeQuestDbContext(DbContextOptions<LifeQuestDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔁 Force all DateTimes to UTC
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


            modelBuilder.Entity<MealIngredient>()
                .HasKey(mi => new { mi.MealId, mi.IngredientId });

            modelBuilder.Entity<MealIngredient>()
                .HasOne(mi => mi.Meal)
                .WithMany(m => m.MealIngredients)
                .HasForeignKey(mi => mi.MealId);

            modelBuilder.Entity<MealPlanDayMeal>().HasKey(m => new { m.MealPlanDayId, m.Id });



            modelBuilder.Entity<MealIngredient>()
                .HasOne(mi => mi.Ingredient)
                .WithMany()
                .HasForeignKey(mi => mi.IngredientId);

            // 🏋 Activity ↔ ActivityType many-to-many
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

            // 👤 Person ↔ Path (nullable FK)
            modelBuilder.Entity<Person>()
                .HasOne(p => p.SelectedPath)
                .WithMany()
                .HasForeignKey(p => p.PathId)
                .OnDelete(DeleteBehavior.SetNull);

            // 🏃 FitnessPath inheritance
            modelBuilder.Entity<FitnessPath>()
                .HasBaseType<Path>();

            // 🍎 HealthPath inheritance
            modelBuilder.Entity<HealthPath>()
                .HasBaseType<Path>();

            // 🧠 ExercisePlan ↔ FitnessPath
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

            // 🍴 MealPlan ↔ Meal many-to-many
            modelBuilder.Entity<MealPlanMeal>()
                .HasKey(mpm => new { mpm.MealPlanId, mpm.MealId });

            modelBuilder.Entity<MealPlanMeal>()
                .HasOne(mpm => mpm.MealPlan)
                .WithMany(mp => mp.MealPlanMeals)
                .HasForeignKey(mpm => mpm.MealPlanId);

            modelBuilder.Entity<MealPlanMeal>()
                .HasOne(mpm => mpm.Meal)
                .WithMany()
                .HasForeignKey(mpm => mpm.MealId);

            // 🧠 HealthPath ↔ MealPlans and WeightEntries
            modelBuilder.Entity<MealPlan>()
                .HasOne(mp => mp.HealthPath)
                .WithMany(hp => hp.MealPlans)
                .HasForeignKey(mp => mp.HealthPathId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
