using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class meals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanDayMeals",
                table: "MealPlanDayMeals");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "MealPlanDayMeals",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanDayMeals",
                table: "MealPlanDayMeals",
                columns: new[] { "MealPlanDayId", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanDayMeals",
                table: "MealPlanDayMeals");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "MealPlanDayMeals");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanDayMeals",
                table: "MealPlanDayMeals",
                columns: new[] { "MealPlanDayId", "MealId" });
        }
    }
}
