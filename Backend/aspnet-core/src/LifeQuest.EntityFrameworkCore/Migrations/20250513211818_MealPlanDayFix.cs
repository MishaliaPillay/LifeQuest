using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class MealPlanDayFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanDay_MealPlans_MealPlanId",
                table: "MealPlanDay");

            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanDayMeal_MealPlanDay_MealPlanDayId",
                table: "MealPlanDayMeal");

            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanDayMeal_Meals_MealId",
                table: "MealPlanDayMeal");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanDayMeal",
                table: "MealPlanDayMeal");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanDay",
                table: "MealPlanDay");

            migrationBuilder.RenameTable(
                name: "MealPlanDayMeal",
                newName: "MealPlanDayMeals");

            migrationBuilder.RenameTable(
                name: "MealPlanDay",
                newName: "MealPlanDays");

            migrationBuilder.RenameIndex(
                name: "IX_MealPlanDayMeal_MealId",
                table: "MealPlanDayMeals",
                newName: "IX_MealPlanDayMeals_MealId");

            migrationBuilder.RenameIndex(
                name: "IX_MealPlanDay_MealPlanId",
                table: "MealPlanDays",
                newName: "IX_MealPlanDays_MealPlanId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanDayMeals",
                table: "MealPlanDayMeals",
                columns: new[] { "MealPlanDayId", "MealId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanDays",
                table: "MealPlanDays",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanDayMeals_MealPlanDays_MealPlanDayId",
                table: "MealPlanDayMeals",
                column: "MealPlanDayId",
                principalTable: "MealPlanDays",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanDayMeals_Meals_MealId",
                table: "MealPlanDayMeals",
                column: "MealId",
                principalTable: "Meals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanDays_MealPlans_MealPlanId",
                table: "MealPlanDays",
                column: "MealPlanId",
                principalTable: "MealPlans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanDayMeals_MealPlanDays_MealPlanDayId",
                table: "MealPlanDayMeals");

            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanDayMeals_Meals_MealId",
                table: "MealPlanDayMeals");

            migrationBuilder.DropForeignKey(
                name: "FK_MealPlanDays_MealPlans_MealPlanId",
                table: "MealPlanDays");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanDays",
                table: "MealPlanDays");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealPlanDayMeals",
                table: "MealPlanDayMeals");

            migrationBuilder.RenameTable(
                name: "MealPlanDays",
                newName: "MealPlanDay");

            migrationBuilder.RenameTable(
                name: "MealPlanDayMeals",
                newName: "MealPlanDayMeal");

            migrationBuilder.RenameIndex(
                name: "IX_MealPlanDays_MealPlanId",
                table: "MealPlanDay",
                newName: "IX_MealPlanDay_MealPlanId");

            migrationBuilder.RenameIndex(
                name: "IX_MealPlanDayMeals_MealId",
                table: "MealPlanDayMeal",
                newName: "IX_MealPlanDayMeal_MealId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanDay",
                table: "MealPlanDay",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealPlanDayMeal",
                table: "MealPlanDayMeal",
                columns: new[] { "MealPlanDayId", "MealId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanDay_MealPlans_MealPlanId",
                table: "MealPlanDay",
                column: "MealPlanId",
                principalTable: "MealPlans",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanDayMeal_MealPlanDay_MealPlanDayId",
                table: "MealPlanDayMeal",
                column: "MealPlanDayId",
                principalTable: "MealPlanDay",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MealPlanDayMeal_Meals_MealId",
                table: "MealPlanDayMeal",
                column: "MealId",
                principalTable: "Meals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
