module.exports = function normalizeCategory(category = "") {
  const c = category.toLowerCase();

  // 🟡 Kerala
  if (
    c.includes("kerala") ||
    c.includes("kozhikode") ||
    c.includes("kannur") ||
    c.includes("malappuram") ||
    c.includes("thrissur") ||
    c.includes("ernakulam") ||
    c.includes("kollam") ||
    c.includes("wayanad") ||
    c.includes("kottayam") ||
    c.includes("pathanamthitta") ||
    c.includes("thiruvananthapuram")
  ) return "kerala";

  // 🟡 India
  if (c.includes("india")) return "india";

  // 🌍 World
  if (c.includes("international") || c.includes("world"))
    return "world";

  // 🏏 Sports
  if (c.includes("sports") || c.includes("cricket"))
    return "sports";

  // 🎬 Entertainment
  if (c.includes("entertainment") || c.includes("box-office"))
    return "entertainment";

  // 💰 Business
  if (
    c.includes("business") ||
    c.includes("stock") ||
    c.includes("economy") ||
    c.includes("commodity")
  ) return "business";

  // 🧪 Science
  if (c.includes("science")) return "science";

  // ❤️ Health
  if (c.includes("health")) return "health";

  return "other";
};