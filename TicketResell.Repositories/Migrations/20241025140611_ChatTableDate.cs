using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketResell.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class ChatTableDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Chat",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Chat");
        }
    }
}
