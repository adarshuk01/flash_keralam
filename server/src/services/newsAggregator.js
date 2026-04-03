const { fetchAsianetRSS } = require("./rssService");
const {
  fetchManoramaLatest,
  fetchManoramaSports,
} = require("./manoramaService");

const normalizeCategory = require("../utils/categoryMapper");

exports.fetchAllNews = async (options = {}) => {
  const {
    includeFull = true,
    limit = 150,
    category = null,
  } = options;

  try {
    const [asianet, manoramaLatest, manoramaSports] =
      await Promise.all([
        fetchAsianetRSS(),
        fetchManoramaLatest(includeFull),
        fetchManoramaSports(includeFull),
      ]);

    // 🔍 Debug (optional)
    console.log("Asianet:", asianet.length);
    console.log("Manorama Latest:", manoramaLatest.length);
    console.log("Manorama Sports:", manoramaSports.length);

    // ✅ Normalize + add metadata
    const asianetFormatted = asianet.map((n) => ({
      ...n,
      normalizedCategory: normalizeCategory(n.category),
      source: "Asianet",
    }));

    const manoramaLatestFormatted = manoramaLatest.map((n) => ({
      ...n,
      type: "latest",
      normalizedCategory: normalizeCategory(n.category),
      createdAt: n.createdAt || Date.now(),
      source: "Manorama",
    }));

    const manoramaSportsFormatted = manoramaSports.map((n) => ({
      ...n,
      type: "sports",
      normalizedCategory: normalizeCategory(n.category),
      createdAt: n.createdAt || Date.now(),
      source: "Manorama",
    }));

    // 🔥 INTERLEAVE (balanced feed)
    const combined = [];
    let i = 0;

    while (
      combined.length < limit &&
      (i < asianetFormatted.length ||
        i < manoramaLatestFormatted.length ||
        i < manoramaSportsFormatted.length)
    ) {
      if (asianetFormatted[i]) combined.push(asianetFormatted[i]);
      if (manoramaLatestFormatted[i]) combined.push(manoramaLatestFormatted[i]);
      if (manoramaSportsFormatted[i]) combined.push(manoramaSportsFormatted[i]);
      i++;
    }

    // ✅ Remove duplicates
    const seen = new Set();
    let final = combined.filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });

    // ✅ FILTER BY CATEGORY (🔥 MAIN FEATURE)
    if (category) {
      final = final.filter(
        (item) => item.normalizedCategory === category.toLowerCase()
      );
    }

    return final.slice(0, limit);
  } catch (err) {
    console.error("Aggregator Error:", err.message);
    throw err;
  }
};