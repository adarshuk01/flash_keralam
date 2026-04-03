const cheerio = require("cheerio");
const fetchXML = require("../utils/fetcher");

const RSS_URL = "https://www.asianetnews.com/rss";

exports.fetchAsianetRSS = async () => {
  const xml = await fetchXML(RSS_URL);

  const $ = cheerio.load(xml, {
    xmlMode: true,
  });

  const news = [];

  $("item").each((_, el) => {
    const title = $(el).find("title").text().trim();

    const link = $(el).find("link").text().trim();

    const pubDate = $(el).find("pubDate").text().trim();

    const description = $(el)
      .find("description")
      .text()
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .trim();

    const image =
      $(el).find("media\\:content").attr("url") ||
      null;

    const content = $(el)
      .find("content\\:encoded")
      .text()
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .trim();

    const category = $(el).find("category").text().trim();

    if (title && link) {
      news.push({
        title,
        link,
        pubDate,
        description,
        image,
        content,
        category,
        source: "Asianet",
      });
    }
  });

  return news;
};