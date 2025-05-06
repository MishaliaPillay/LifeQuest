using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePersonWithFitnessPath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FitnessPathId",
                table: "Persons",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Persons_FitnessPathId",
                table: "Persons",
                column: "FitnessPathId");

            migrationBuilder.AddForeignKey(
                name: "FK_Persons_Paths_FitnessPathId",
                table: "Persons",
                column: "FitnessPathId",
                principalTable: "Paths",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persons_Paths_FitnessPathId",
                table: "Persons");

            migrationBuilder.DropIndex(
                name: "IX_Persons_FitnessPathId",
                table: "Persons");

            migrationBuilder.DropColumn(
                name: "FitnessPathId",
                table: "Persons");
        }
    }
}
