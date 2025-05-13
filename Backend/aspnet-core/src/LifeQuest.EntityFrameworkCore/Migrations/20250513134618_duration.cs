using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class duration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "ActivityTypes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "ActivityTypes");
        }
    }
}
