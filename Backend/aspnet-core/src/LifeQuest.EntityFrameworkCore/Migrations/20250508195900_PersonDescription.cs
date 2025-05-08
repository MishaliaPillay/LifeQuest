using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeQuest.Migrations
{
    /// <inheritdoc />
    public partial class PersonDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PersonDescription",
                table: "Persons",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PersonDescription",
                table: "Persons");
        }
    }
}
