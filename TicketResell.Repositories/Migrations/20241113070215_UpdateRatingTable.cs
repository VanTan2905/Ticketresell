using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketResell.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRatingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add OrderDetailId column
            migrationBuilder.AddColumn<string>(
                name: "OrderDetailId",
                table: "Rating",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            // Create index for OrderDetailId column
            migrationBuilder.CreateIndex(
                name: "IX_Rating_OrderDetailId",
                table: "Rating",
                column: "OrderDetailId");

            // Add foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_Rating_OrderDetail",
                table: "Rating",
                column: "OrderDetailId",
                principalTable: "OrderDetail",
                principalColumn: "OrderDetailId",
                onDelete: ReferentialAction.Cascade); // Adjust as needed
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_Rating_OrderDetail",
                table: "Rating");

            // Drop the index
            migrationBuilder.DropIndex(
                name: "IX_Rating_OrderDetailId",
                table: "Rating");

            // Drop the column
            migrationBuilder.DropColumn(
                name: "OrderDetailId",
                table: "Rating");
        }
    }
}
