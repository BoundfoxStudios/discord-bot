using Microsoft.EntityFrameworkCore.Migrations;

namespace BoundfoxStudios.Data.Migrations
{
    public partial class AddYouTubeNotificationsVideoIdIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_YouTubeNotifications_VideoId",
                table: "YouTubeNotifications",
                column: "VideoId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_YouTubeNotifications_VideoId",
                table: "YouTubeNotifications");
        }
    }
}
