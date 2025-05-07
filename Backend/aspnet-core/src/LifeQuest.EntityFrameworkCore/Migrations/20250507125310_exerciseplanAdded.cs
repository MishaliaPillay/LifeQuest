using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class exerciseplanAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Paths_FitnessPathId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Persons_PersonId",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "FitnessPathId",
                table: "Activities",
                newName: "ExercisePlanId");

            migrationBuilder.RenameIndex(
                name: "IX_Activities_FitnessPathId",
                table: "Activities",
                newName: "IX_Activities_ExercisePlanId");

            migrationBuilder.AlterColumn<Guid>(
                name: "PersonId",
                table: "Activities",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateTable(
                name: "ExercisePlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FitnessPathId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExercisePlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExercisePlans_Paths_FitnessPathId",
                        column: x => x.FitnessPathId,
                        principalTable: "Paths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExercisePlans_FitnessPathId",
                table: "ExercisePlans",
                column: "FitnessPathId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_ExercisePlans_ExercisePlanId",
                table: "Activities",
                column: "ExercisePlanId",
                principalTable: "ExercisePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Persons_PersonId",
                table: "Activities",
                column: "PersonId",
                principalTable: "Persons",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_ExercisePlans_ExercisePlanId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Persons_PersonId",
                table: "Activities");

            migrationBuilder.DropTable(
                name: "ExercisePlans");

            migrationBuilder.RenameColumn(
                name: "ExercisePlanId",
                table: "Activities",
                newName: "FitnessPathId");

            migrationBuilder.RenameIndex(
                name: "IX_Activities_ExercisePlanId",
                table: "Activities",
                newName: "IX_Activities_FitnessPathId");

            migrationBuilder.AlterColumn<Guid>(
                name: "PersonId",
                table: "Activities",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Paths_FitnessPathId",
                table: "Activities",
                column: "FitnessPathId",
                principalTable: "Paths",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Persons_PersonId",
                table: "Activities",
                column: "PersonId",
                principalTable: "Persons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
