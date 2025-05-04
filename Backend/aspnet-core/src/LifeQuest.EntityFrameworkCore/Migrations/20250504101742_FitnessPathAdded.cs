using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class FitnessPathAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FitnessPathId",
                table: "WeightEntries",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FitnessPathId",
                table: "StepEntries",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FitnessPathId",
                table: "Activities",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FitnessPaths",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    PersonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FitnessPaths", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FitnessPaths_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WeightEntries_FitnessPathId",
                table: "WeightEntries",
                column: "FitnessPathId");

            migrationBuilder.CreateIndex(
                name: "IX_StepEntries_FitnessPathId",
                table: "StepEntries",
                column: "FitnessPathId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_FitnessPathId",
                table: "Activities",
                column: "FitnessPathId");

            migrationBuilder.CreateIndex(
                name: "IX_FitnessPaths_PersonId",
                table: "FitnessPaths",
                column: "PersonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_FitnessPaths_FitnessPathId",
                table: "Activities",
                column: "FitnessPathId",
                principalTable: "FitnessPaths",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StepEntries_FitnessPaths_FitnessPathId",
                table: "StepEntries",
                column: "FitnessPathId",
                principalTable: "FitnessPaths",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WeightEntries_FitnessPaths_FitnessPathId",
                table: "WeightEntries",
                column: "FitnessPathId",
                principalTable: "FitnessPaths",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_FitnessPaths_FitnessPathId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_StepEntries_FitnessPaths_FitnessPathId",
                table: "StepEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_WeightEntries_FitnessPaths_FitnessPathId",
                table: "WeightEntries");

            migrationBuilder.DropTable(
                name: "FitnessPaths");

            migrationBuilder.DropIndex(
                name: "IX_WeightEntries_FitnessPathId",
                table: "WeightEntries");

            migrationBuilder.DropIndex(
                name: "IX_StepEntries_FitnessPathId",
                table: "StepEntries");

            migrationBuilder.DropIndex(
                name: "IX_Activities_FitnessPathId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "FitnessPathId",
                table: "WeightEntries");

            migrationBuilder.DropColumn(
                name: "FitnessPathId",
                table: "StepEntries");

            migrationBuilder.DropColumn(
                name: "FitnessPathId",
                table: "Activities");
        }
    }
}
