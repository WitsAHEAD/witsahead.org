<?xml version="1.0" encoding="UTF-8"?>
<!-- Makes the feeds readable in a browser. Podcast and reader apps ignore this and read the XML directly. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" exclude-result-prefixes="atom itunes">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html>
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title><xsl:value-of select="/rss/channel/title | /atom:feed/atom:title"/> · feed</title>
<style>
body{margin:0;font-family:'Open Sans',system-ui,Arial,sans-serif;background:#F1F5FB;color:#1F2933}
.top{background:linear-gradient(135deg,#003B5C,#001B29);color:#fff;padding:34px 20px}
.wrap{max-width:760px;margin:0 auto}
.over{font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#D8C6A0;font-weight:700}
h1{margin:6px 0 8px;font-size:28px}.desc{color:#D6E2EC;margin:0 0 18px;line-height:1.55}
.how{background:#fff;border-radius:12px;padding:18px 20px;margin:-26px auto 20px;box-shadow:0 12px 40px rgba(0,27,41,.12)}
.how b{color:#003B5C}.url{display:block;margin:10px 0 6px;padding:10px 12px;background:#F3F6F9;border:1px solid #E1E6EB;border-radius:8px;font-family:ui-monospace,Menlo,monospace;font-size:13px;word-break:break-all;color:#003B5C}
.how small{color:#5b6b7a;line-height:1.5;display:block}
.item{background:#fff;border:1px solid #E1E6EB;border-radius:12px;padding:16px 20px;margin:0 0 12px}
.item h2{margin:0 0 6px;font-size:17px}.item h2 a{color:#003B5C;text-decoration:none}.item h2 a:hover{text-decoration:underline}
.item .meta{font-size:12.5px;color:#85714D;font-weight:700;margin-bottom:6px}.item p{margin:0;font-size:14px;line-height:1.55;color:#3a4450}
audio{width:100%;margin-top:10px}
.foot{text-align:center;font-size:12.5px;color:#5b6b7a;padding:24px 20px}.foot a{color:#003B5C;font-weight:700}
</style>
</head>
<body>
<div class="top"><div class="wrap">
  <div class="over">Wits AHEAD Research Group · <xsl:choose><xsl:when test="/rss">Podcast feed</xsl:when><xsl:otherwise>Web feed</xsl:otherwise></xsl:choose></div>
  <h1><xsl:value-of select="/rss/channel/title | /atom:feed/atom:title"/></h1>
  <p class="desc"><xsl:value-of select="/rss/channel/description | /atom:feed/atom:subtitle"/></p>
</div></div>
<div class="wrap">
  <div class="how">
    <xsl:choose>
      <xsl:when test="/rss">
        <b>This is a podcast feed.</b> Copy the address below into Apple Podcasts (Library, then "Follow a show by URL"), Overcast, Pocket Casts or any podcast app, and each morning's edition arrives by itself. You can also play the episodes right here.
      </xsl:when>
      <xsl:otherwise>
        <b>This is a web feed.</b> Copy the address below into Feedly, Inoreader, NetNewsWire, Outlook or any RSS reader, and new items arrive by themselves. Nothing to install; nothing tracked.
      </xsl:otherwise>
    </xsl:choose>
    <span class="url"><xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href | /atom:feed/atom:link[@rel='self']/@href"/></span>
    <small>Or return to <a href="https://witsahead.org/follow/">witsahead.org/follow</a> for the other ways to follow the group.</small>
  </div>
  <xsl:for-each select="/rss/channel/item">
    <div class="item"><div class="meta"><xsl:value-of select="substring(pubDate,1,16)"/> · <xsl:value-of select="floor(itunes:duration div 60)"/> min</div>
      <h2><a href="{link}"><xsl:value-of select="title"/></a></h2><p><xsl:value-of select="description"/></p>
      <audio controls="controls" preload="none" src="{enclosure/@url}"></audio></div>
  </xsl:for-each>
  <xsl:for-each select="/atom:feed/atom:entry">
    <div class="item"><div class="meta"><xsl:value-of select="substring(atom:updated,1,10)"/></div>
      <h2><a href="{atom:link/@href}" rel="noopener"><xsl:value-of select="atom:title"/></a></h2><p><xsl:value-of select="atom:summary" disable-output-escaping="yes"/></p></div>
  </xsl:for-each>
  <p class="foot">Wits AHEAD Research Group · Wits School of Education · University of the Witwatersrand · <a href="https://witsahead.org/">witsahead.org</a></p>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
