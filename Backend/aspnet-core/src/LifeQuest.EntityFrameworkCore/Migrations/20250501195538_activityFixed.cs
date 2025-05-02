using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class activityFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityTypes_Activities_ActivityId",
                table: "ActivityTypes");

            migrationBuilder.DropIndex(
                name: "IX_ActivityTypes_ActivityId",
                table: "ActivityTypes");

            migrationBuilder.DropColumn(
                name: "ActivityId",
                table: "ActivityTypes");

            migrationBuilder.CreateTable(
                name: "ActivityActivityTypes",
                columns: table => new
                {
                    ActivityId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActivityTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActivityTypeId1 = table.Column<Guid>(type: "uuid", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityActivityTypes", x => new { x.ActivityId, x.ActivityTypeId });
                    table.ForeignKey(
                        name: "FK_ActivityActivityTypes_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityActivityTypes_ActivityTypes_ActivityTypeId",
                        column: x => x.ActivityTypeId,
                        principalTable: "ActivityTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityActivityTypes_ActivityTypes_ActivityTypeId1",
                        column: x => x.ActivityTypeId1,
                        principalTable: "ActivityTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityActivityTypes_ActivityTypeId",
                table: "ActivityActivityTypes",
                column: "ActivityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityActivityTypes_ActivityTypeId1",
                table: "ActivityActivityTypes",
                column: "ActivityTypeId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityActivityTypes");

            migrationBuilder.AddColumn<Guid>(
                name: "ActivityId",
                table: "ActivityTypes",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityTypes_ActivityId",
                table: "ActivityTypes",
                column: "ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityTypes_Activities_ActivityId",
                table: "ActivityTypes",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id");
        }
    }
}
