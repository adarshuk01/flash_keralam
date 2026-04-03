const { fetchManoramaSports, fetchManoramaLatest } = require("../services/manoramaService");
const { fetchAllNews } = require("../services/newsAggregator");
const { fetchAsianetRSS } = require("../services/rssService");

exports.getAsianetNews = async (req, res) => {
  try {
    const news = await fetchAsianetRSS();

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// Sports
exports.getManoramaSports = async (req, res) => {
  try {
    const includeFull = req.query.full === "true";

    const news = await fetchManoramaSports(includeFull);

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getManoramaNews = async (req, res) => {
  try {
    const includeFull = req.query.full === "true";

    const news = await fetchManoramaLatest(includeFull);

    res.json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error("Manorama Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Manorama news",
    });
  }
};


exports.getAllNews = async (req, res) => {
  try {
    const includeFull = req.query.full === "true";
    const limit = parseInt(req.query.limit) || 50;
    const category = req.query.category || null;

    const news = await fetchAllNews({
      includeFull,
      limit,
      category,
    });

    res.json({
      success: true,
      count: news.length,
      category: category || "all",
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};