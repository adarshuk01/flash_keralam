const cheerio = require("cheerio");
const fetchHTML = require("../utils/fetcher");

exports.fetchFullArticle = async (url) => {
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    // ✅ Get full content HTML
    const contentHTML = $("div.rtearticle.text").html();

    // ✅ Get clean text
    const contentText = $("div.rtearticle.text")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // ✅ Optional: get main image
    const image =
      $("div.rtearticle.text img").first().attr("src") ||
      null;

    return {
      contentHTML,
      contentText,
      image,
    };
  } catch (err) {
    console.error("Article Fetch Error:", err.message);
    return null;
  }
};