using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketResell.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class updateChatTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Chat",
                table: "Chat");

            migrationBuilder.AddColumn<string>(
                name: "ChatId",
                table: "Chat",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chat",
                table: "Chat",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_SenderId",
                table: "Chat",
                column: "SenderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Chat",
                table: "Chat");

            migrationBuilder.DropIndex(
                name: "IX_Chat_SenderId",
                table: "Chat");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "Chat");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chat",
                table: "Chat",
                columns: new[] { "SenderId", "ReceiverId" });
        }
    }
}
