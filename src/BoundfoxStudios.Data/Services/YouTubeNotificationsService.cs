using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.ServiceModel.Syndication;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.Data.Services
{
  public class YouTubeNotificationsService
  {
    private const string SubscribeUrl = "https://pubsubhubbub.appspot.com/subscribe";
    private readonly DateTime _wed32021 = new DateTime(2021, 2, 3, 0, 0, 0);

    private readonly ILogger<YouTubeNotificationsService> _logger;
    private readonly HttpClient _httpClient;
    private readonly BotDbContext _context;
    private readonly YouTubeSyndicationReader _youTubeSyndicationReader;

    public YouTubeNotificationsService(ILogger<YouTubeNotificationsService> logger, HttpClient httpClient, BotDbContext context, YouTubeSyndicationReader youTubeSyndicationReader)
    {
      _logger = logger;
      _httpClient = httpClient;
      _context = context;
      _youTubeSyndicationReader = youTubeSyndicationReader;
    }

    public async Task SubscribeAsync(string channelId, string callbackUrl)
    {
      var topicUrl = CreateTopicUrl(channelId);

      var postData = CreatePostData(callbackUrl, topicUrl);
      postData.Add("hub.verify", "async");

      _logger.LogInformation("Subscribing to {ChannelId}", channelId);

      var result = await _httpClient.PostAsync(SubscribeUrl, new FormUrlEncodedContent(postData));

      if (result.IsSuccessStatusCode)
      {
        _logger.LogInformation("Successfully send subscription request for channel {ChannelId}", channelId);
        return;
      }

      var content = await result.Content.ReadAsStringAsync();

      _logger.LogWarning("Did not get a success status code while subscribing to channel {ChannelId}, {Content}", channelId, content);
    }

    private static string CreateTopicUrl(string channelId)
    {
      return $"https://www.youtube.com/xml/feeds/videos.xml?channel_id={channelId}";
    }

    private static Dictionary<string, string> CreatePostData(string callbackUrl, string topicUrl, string mode = "subscribe")
    {
      var postData = new Dictionary<string, string>
      {
        { "hub.mode", mode },
        { "hub.callback", callbackUrl },
        { "hub.topic", topicUrl }
      };
      return postData;
    }

    public async Task UnsubscribeAsync(string channelId, string callbackUrl)
    {
      var topicUrl = CreateTopicUrl(channelId);

      var postData = CreatePostData(callbackUrl, topicUrl, "unsubscribe");

      _logger.LogInformation("Unsubscribing to {ChannelId}", channelId);

      var result = await _httpClient.PostAsync(SubscribeUrl, new FormUrlEncodedContent(postData));

      if (result.IsSuccessStatusCode)
      {
        _logger.LogInformation("Successfully send unsubscribe request for channel {ChannelId}", channelId);
        return;
      }

      var content = await result.Content.ReadAsStringAsync();

      _logger.LogWarning("Did not get a success status code while unsubscribing to channel {ChannelId}, {Content}", channelId, content);
    }

    public async Task ReadNotificationFromStreamAsync(Stream stream)
    {
      var items = await _youTubeSyndicationReader.FromStreamAsync(stream);

      foreach (var item in items)
      {
        if (item.PublishDateTime < _wed32021) // not post old videos again if we change something
        {
          continue;
        }
        
        try
        {
          await _context.YouTubeNotifications.AddAsync(item);
          await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
          // silently catch since the item may already be in the database
        }
      }
    }

    public async Task<IEnumerable<YouTubeNotification>> GetUnsentNotifications() => await _context.YouTubeNotifications
      .AsNoTracking()
      .Where(p => !p.HasBeenSentToDiscord)
      .ToArrayAsync();

    public async Task UpdateStatusToSent(YouTubeNotification notification)
    {
      var item = await _context.YouTubeNotifications.SingleAsync(p => p.Id == notification.Id);

      item.HasBeenSentToDiscord = true;

      await _context.SaveChangesAsync();
    }
  }
}
