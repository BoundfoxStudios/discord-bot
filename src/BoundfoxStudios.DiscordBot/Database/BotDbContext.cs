using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace BoundfoxStudios.DiscordBot.Database
{
  public class BotDbContext : DbContext
  {
    public DbSet<LinkCategoryModel> LinkCategories { get; set; }
    public DbSet<LinkModel> Links { get; set; }
    
    public BotDbContext(DbContextOptions<BotDbContext> options)
      : base(options) { }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      ApplyTimestamps();
      return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    private void ApplyTimestamps()
    {
      var entityEntries = ChangeTracker.Entries()
        .Where(entityEntry => entityEntry.Entity is BaseEntity)
        .Where(entityEntry => entityEntry.State == EntityState.Added || entityEntry.State == EntityState.Modified);

      foreach (var entityEntry in entityEntries)
      {
        var baseEntity = (BaseEntity) entityEntry.Entity;
        
        if (entityEntry.State == EntityState.Added)
        {
          baseEntity.CreatedAt = DateTime.UtcNow;
        }

        baseEntity.UpdatedAt = DateTime.UtcNow;
      }
    }
  }
}
