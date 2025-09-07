using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketResell.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTicketTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Ticket",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Qr",
                table: "Ticket",
                type: "image",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "Qr",
                table: "Ticket");
        }
    }
}
