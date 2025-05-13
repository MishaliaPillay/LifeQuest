using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class MealMeals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MealId1",
                table: "MealPlanMeals",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanMeals_MealId1",
                table: "MealPlanMeals",
                column: "MealId1");

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanMeals_Meals_MealId1",
                table: "MealPlanMeals",
                column: "MealId1",
                principalTable: "Meals",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanMeals_Meals_MealId1",
                table: "MealPlanMeals");

            migrationBuilder.DropIndex(
                name: "IX_MealPlanMeals_MealId1",
                table: "MealPlanMeals");

            migrationBuilder.DropColumn(
                name: "MealId1",
                table: "MealPlanMeals");
        }
    }
}
