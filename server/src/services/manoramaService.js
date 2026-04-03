const cheerio = require("cheerio");
const fetchHTML = require("../utils/fetcher");
const { fetchFullArticle } = require("./articleService");

const BASE_URL = "https://www.manoramaonline.com";

// 🔥 Generic scraper
const scrapeManoramaPage = async (url, includeFull = false) => {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);

  const items = [];

  // Step 1: collect basic data
  $("li.cmp-story-list__item").each((_, el) => {
    const title = $(el)
      .find("h2.cmp-story-list__title a")
      .text()
      .trim();

    let link = $(el)
      .find("h2.cmp-story-list__title a")
      .attr("href");

    if (link && !link.startsWith("http")) {
      link = BASE_URL + link;
    }

    const category = $(el)
      .find(".cmp-story-list__pretitle")
      .text()
      .trim();

    const description =
      $(el)
        .find("p.cmp-story-list__dispn a")
        .text()
        .trim() || null;

    const imgTag = $(el).find("img");

    const image =
      imgTag.attr("data-websrc") ||
      imgTag.attr("data-src") ||
      imgTag.attr("src") ||
      null;

    if (title && link) {
      items.push({
        title,
        link,
        description,
        category,
        image,
        createdAt: Date.now(),
        source: "Manorama",
      });
    }
  });

  // 🚀 Step 2: attach full content (if enabled)
  if (includeFull) {
    const newsWithContent = await Promise.all(
      items.map(async (item) => {
        try {
          const full = await fetchFullArticle(item.link);

          return {
            ...item,
            content: full?.contentText || null,
            contentHTML: full?.contentHTML || null,
          };
        } catch (err) {
          return item; // fallback if error
        }
      })
    );

    return newsWithContent;
  }

  return items;
};

// 🔹 Latest
exports.fetchManoramaLatest = (includeFull = false) =>
  scrapeManoramaPage(
    "https://www.manoramaonline.com/news/latest-news.html",
    includeFull
  );

// 🔹 Sports
exports.fetchManoramaSports = (includeFull = false) =>
  scrapeManoramaPage(
    "https://www.manoramaonline.com/sports.html",
    includeFull
  );