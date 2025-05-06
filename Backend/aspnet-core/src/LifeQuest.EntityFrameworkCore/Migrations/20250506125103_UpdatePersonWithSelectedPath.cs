using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePersonWithSelectedPath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persons_Paths_FitnessPathId",
                table: "Persons");

            migrationBuilder.RenameColumn(
                name: "FitnessPathId",
                table: "Persons",
                newName: "PathId");

            migrationBuilder.RenameIndex(
                name: "IX_Persons_FitnessPathId",
                table: "Persons",
                newName: "IX_Persons_PathId");

            migrationBuilder.AddForeignKey(
                name: "FK_Persons_Paths_PathId",
                table: "Persons",
                column: "PathId",
                principalTable: "Paths",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persons_Paths_PathId",
                table: "Persons");

            migrationBuilder.RenameColumn(
                name: "PathId",
                table: "Persons",
                newName: "FitnessPathId");

            migrationBuilder.RenameIndex(
                name: "IX_Persons_PathId",
                table: "Persons",
                newName: "IX_Persons_FitnessPathId");

            migrationBuilder.AddForeignKey(
                name: "FK_Persons_Paths_FitnessPathId",
                table: "Persons",
                column: "FitnessPathId",
                principalTable: "Paths",
                principalColumn: "Id");
        }
    }
}
