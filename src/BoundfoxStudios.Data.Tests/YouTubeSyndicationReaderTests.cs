using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Database.Models;
using BoundfoxStudios.Data.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace BoundfoxStudios.Data.Tests
{
  public class YouTubeSyndicationReaderTests
  {
    private const string SampleXml = @"<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns:yt=""http://www.youtube.com/xml/schemas/2015"" xmlns=""http://www.w3.org/2005/Atom""><link rel=""hub"" href=""https://pubsubhubbub.appspot.com""/><link rel=""self"" href=""https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCKo6tYPZhWxgwU3prL2stfg""/><title>YouTube video feed</title><updated>2021-02-01T21:03:45.283250621+00:00</updated><entry>
  <id>yt:video:DVtEeotlw-o</id>
  <yt:videoId>DVtEeotlw-o</yt:videoId>
  <yt:channelId>UCKo6tYPZhWxgwU3prL2stfg</yt:channelId>
  <title>Ein weiterer Test</title>
  <link rel=""alternate"" href=""https://www.youtube.com/watch?v=DVtEeotlw-o""/>
  <author>
   <name>ManusTestAccount</name>
   <uri>https://www.youtube.com/channel/UCKo6tYPZhWxgwU3prL2stfg</uri>
  </author>
  <published>2021-02-01T21:03:26+00:00</published>
  <updated>2021-02-01T21:03:45.283250621+00:00</updated>
 </entry></feed>
";
    
    [Fact]
    public async Task CanReadFromNotificationXml()
    {
      var sut = new YouTubeSyndicationReader(Mock.Of<ILogger<YouTubeSyndicationReader>>());

      await using var stream = new MemoryStream(Encoding.UTF8.GetBytes(SampleXml));

      var result = await sut.FromStreamAsync(stream);

      result.Count.Should().Be(1);

      var item = result.First();

      item.Author.Should().Be("ManusTestAccount");
      item.Title.Should().Be("Ein weiterer Test");
      item.Url.Should().Be("https://www.youtube.com/watch?v=DVtEeotlw-o");
      item.ChannelId.Should().Be("UCKo6tYPZhWxgwU3prL2stfg");
      item.VideoId.Should().Be("DVtEeotlw-o");
      item.HasBeenSentToDiscord.Should().Be(false);
      item.PublishDateTime.Should().Be(DateTime.Parse("2021-02-01T21:03:26+00:00").ToUniversalTime());
    }
  }
}
