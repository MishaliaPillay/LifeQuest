using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class personIDonActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PersonId",
                table: "Activities",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Activities_PersonId",
                table: "Activities",
                column: "PersonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Persons_PersonId",
                table: "Activities",
                column: "PersonId",
                principalTable: "Persons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Persons_PersonId",
                table: "Activities");

            migrationBuilder.DropIndex(
                name: "IX_Activities_PersonId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "PersonId",
                table: "Activities");
        }
    }
}
