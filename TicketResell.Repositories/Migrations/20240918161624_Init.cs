using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    CategoryId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__19093A0BEBBEB954", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Rolename = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Role__8AFACE1AE4BFB3F2", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "SellConfig",
                columns: table => new
                {
                    SellConfigId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Commision = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SellConf__42545BD905ACD877", x => x.SellConfigId);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    SellConfigId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Username = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Gmail = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Fullname = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Sex = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Phone = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Avatar = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Birthday = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Verify = table.Column<int>(type: "int", nullable: true),
                    Bank = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    BankType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    SellAddress = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Cccd = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__1788CC4CA0A0D49E", x => x.UserId);
                    table.ForeignKey(
                        name: "FK__User__SellConfig__398D8EEE",
                        column: x => x.SellConfigId,
                        principalTable: "SellConfig",
                        principalColumn: "SellConfigId");
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    OrderId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    BuyerId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Total = table.Column<double>(type: "float", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order__C3905BCF6786352F", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK__Order__BuyerId__4222D4EF",
                        column: x => x.BuyerId,
                        principalTable: "User",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Revenue",
                columns: table => new
                {
                    RevenueId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    SellerId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Revenue = table.Column<double>(type: "float", nullable: true),
                    Type = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Revenue__275F16DD1765A79B", x => x.RevenueId);
                    table.ForeignKey(
                        name: "FK__Revenue__SellerI__44FF419A",
                        column: x => x.SellerId,
                        principalTable: "User",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Ticket",
                columns: table => new
                {
                    TicketId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    SellerId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Cost = table.Column<double>(type: "float", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    Image = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Ticket__712CC607A2C872D9", x => x.TicketId);
                    table.ForeignKey(
                        name: "FK__Ticket__SellerId__47DBAE45",
                        column: x => x.SellerId,
                        principalTable: "User",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    RoleId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserRole__AF2760AD6F602E5A", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK__UserRole__RoleId__3F466844",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "RoleId");
                    table.ForeignKey(
                        name: "FK__UserRole__UserId__3E52440B",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "OrderDetail",
                columns: table => new
                {
                    OrderDetailId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    OrderId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    TicketId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Price = table.Column<double>(type: "float", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderDet__D3B9D36C61677EDA", x => x.OrderDetailId);
                    table.ForeignKey(
                        name: "FK__OrderDeta__Order__4AB81AF0",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "OrderId");
                    table.ForeignKey(
                        name: "FK__OrderDeta__Ticke__4BAC3F29",
                        column: x => x.TicketId,
                        principalTable: "Ticket",
                        principalColumn: "TicketId");
                });

            migrationBuilder.CreateTable(
                name: "TicketCategory",
                columns: table => new
                {
                    TicketId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    CategoryId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TicketCa__D0BC55A783CF062B", x => new { x.TicketId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK__TicketCat__Categ__5165187F",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "CategoryId");
                    table.ForeignKey(
                        name: "FK__TicketCat__Ticke__5070F446",
                        column: x => x.TicketId,
                        principalTable: "Ticket",
                        principalColumn: "TicketId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_BuyerId",
                table: "Order",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_OrderId",
                table: "OrderDetail",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_TicketId",
                table: "OrderDetail",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Revenue_SellerId",
                table: "Revenue",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_SellerId",
                table: "Ticket",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketCategory_CategoryId",
                table: "TicketCategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_User_SellConfigId",
                table: "User",
                column: "SellConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_RoleId",
                table: "UserRole",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderDetail");

            migrationBuilder.DropTable(
                name: "Revenue");

            migrationBuilder.DropTable(
                name: "TicketCategory");

            migrationBuilder.DropTable(
                name: "UserRole");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Ticket");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "SellConfig");
        }
    }
}
