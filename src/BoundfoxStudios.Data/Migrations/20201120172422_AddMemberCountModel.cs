using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BoundfoxStudios.Data.Migrations
{
    public partial class AddMemberCountModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MemberCounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StatisticTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MemberCount = table.Column<int>(type: "INTEGER", nullable: false),
                    GuildId = table.Column<ulong>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberCounts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MemberCounts_StatisticTime",
                table: "MemberCounts",
                column: "StatisticTime");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MemberCounts");
        }
    }
}
