using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BoundfoxStudios.Data.Migrations
{
    public partial class AddYouTubeNotifications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "YouTubeNotifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ChannelId = table.Column<string>(type: "TEXT", nullable: true),
                    VideoId = table.Column<string>(type: "TEXT", nullable: true),
                    Url = table.Column<string>(type: "TEXT", nullable: true),
                    Author = table.Column<string>(type: "TEXT", nullable: true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    PublishDateTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    HasBeenSentToDiscord = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YouTubeNotifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_YouTubeNotifications_HasBeenSentToDiscord",
                table: "YouTubeNotifications",
                column: "HasBeenSentToDiscord");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "YouTubeNotifications");
        }
    }
}
