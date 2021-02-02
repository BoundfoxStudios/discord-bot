using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.ServiceModel.Syndication;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using BoundfoxStudios.Data.Database.Models;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.Data.Services
{
  public class YouTubeSyndicationReader
  {
    private readonly ILogger<YouTubeSyndicationReader> _logger;

    public YouTubeSyndicationReader(ILogger<YouTubeSyndicationReader> logger)
    {
      _logger = logger;
    }

    public async Task<ICollection<YouTubeNotification>> FromStreamAsync(Stream stream)
    {
      // Copy stream first so Kestrel does not throw due to synchronous IO read
      await using var memoryStream = new MemoryStream();
      await stream.CopyToAsync(memoryStream);

      memoryStream.Seek(0, SeekOrigin.Begin);
      
      using var xmlReader = XmlReader.Create(memoryStream);

      try
      {
        var syndicationFeed = SyndicationFeed.Load(xmlReader);

        return syndicationFeed.Items.Select(item => new YouTubeNotification()
        {
          Author = item.Authors.First().Name,
          Url = item.Links.First().Uri.ToString(),
          Title = item.Title.Text,
          HasBeenSentToDiscord = false,
          PublishDateTime = item.PublishDate.UtcDateTime,
          ChannelId = ReadExtension(item, "channelId"),
          VideoId = ReadExtension(item, "videoId")
        }).ToArray();
      }
      catch (Exception exception)
      {
        _logger.LogError(exception, "Could not read XML feed, {Xml}", xmlReader.ToString());
        return new List<YouTubeNotification>();
      }
    }

    private string ReadExtension(SyndicationItem item, string name) => item.ElementExtensions.First(p => p.OuterName == name).GetObject<XElement>().Value;
  }
}
