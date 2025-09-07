using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketResell.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class AddChatBox : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChatboxId",
                table: "Chat",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Chatbox",
                columns: table => new
                {
                    ChatboxId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Chatbox__FC2C542683201E28", x => x.ChatboxId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chat_ChatboxId",
                table: "Chat",
                column: "ChatboxId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chat_Chatbox",
                table: "Chat",
                column: "ChatboxId",
                principalTable: "Chatbox",
                principalColumn: "ChatboxId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chat_Chatbox",
                table: "Chat");

            migrationBuilder.DropTable(
                name: "Chatbox");

            migrationBuilder.DropIndex(
                name: "IX_Chat_ChatboxId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "ChatboxId",
                table: "Chat");
        }
    }
}
