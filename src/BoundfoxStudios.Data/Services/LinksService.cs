using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Database.Models;
using BoundfoxStudios.Data.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BoundfoxStudios.Data.Services
{
  public class LinksService
  {
    private readonly BotDbContext _botDbContext;

    public LinksService(BotDbContext botDbContext)
    {
      _botDbContext = botDbContext;
    }

    public async Task<IEnumerable<string>> ListCategoriesAsync()
    {
      return await _botDbContext.LinkCategories.AsQueryable().Select(p => p.Name).ToListAsync();
    }

    public async Task<IEnumerable<LinkDto>> LinksByCategoryAsync(string categoryName)
    {
      return await _botDbContext.LinkCategories.Include(p => p.Links)
        .Where(p => p.Name == categoryName)
        .SelectMany(p => p.Links)
        .Select(p => new LinkDto()
        {
          Title = p.Title,
          Url = p.Url
        })
        .ToListAsync();
    }

    public async Task<bool> AddLinkAsync(string categoryName, string url, string name = null)
    {
      var dbCategory = await _botDbContext.LinkCategories.AsQueryable()
        .SingleOrDefaultAsync(p => p.Name == categoryName);

      if (dbCategory == null)
      {
        return false;
      }

      var dbLink = new LinkModel()
      {
        Title = name,
        Url = NormalizeUrl(url),
        CategoryId = dbCategory.Id
      };

      await _botDbContext.Links.AddAsync(dbLink);
      await _botDbContext.SaveChangesAsync();

      return true;
    }

    public async Task<bool> RemoveLinkAsync(string url)
    {
      url = NormalizeUrl(url);

      var dbLink = await _botDbContext.Links.AsQueryable().SingleOrDefaultAsync(p => p.Url == url);

      if (dbLink == null)
      {
        return false;
      }

      _botDbContext.Remove(dbLink);

      await _botDbContext.SaveChangesAsync();

      return true;
    }

    private string NormalizeUrl(string url)
    {
      return new Uri(url).ToString();
    }
  }
}
