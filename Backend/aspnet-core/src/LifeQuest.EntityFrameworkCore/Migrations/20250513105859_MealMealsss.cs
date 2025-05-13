using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class MealMealsss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanMeals_Ingredients_IngredientId",
                table: "MealPlanMeals");

            migrationBuilder.DropIndex(
                name: "IX_MealPlanMeals_IngredientId",
                table: "MealPlanMeals");

            migrationBuilder.DropColumn(
                name: "IngredientId",
                table: "MealPlanMeals");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IngredientId",
                table: "MealPlanMeals",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanMeals_IngredientId",
                table: "MealPlanMeals",
                column: "IngredientId");

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanMeals_Ingredients_IngredientId",
                table: "MealPlanMeals",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id");
        }
    }
}
