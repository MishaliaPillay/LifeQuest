using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class MealPlanDays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "MealPlans",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "MealPlanDay",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    MealPlanId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MealPlanDay", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MealPlanDay_MealPlans_MealPlanId",
                        column: x => x.MealPlanId,
                        principalTable: "MealPlans",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MealPlanDayMeal",
                columns: table => new
                {
                    MealPlanDayId = table.Column<Guid>(type: "uuid", nullable: false),
                    MealId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MealPlanDayMeal", x => new { x.MealPlanDayId, x.MealId });
                    table.ForeignKey(
                        name: "FK_MealPlanDayMeal_MealPlanDay_MealPlanDayId",
                        column: x => x.MealPlanDayId,
                        principalTable: "MealPlanDay",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MealPlanDayMeal_Meals_MealId",
                        column: x => x.MealId,
                        principalTable: "Meals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanDay_MealPlanId",
                table: "MealPlanDay",
                column: "MealPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanDayMeal_MealId",
                table: "MealPlanDayMeal",
                column: "MealId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MealPlanDayMeal");

            migrationBuilder.DropTable(
                name: "MealPlanDay");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "MealPlans");
        }
    }
}
