// 🔥 API
const API_URL = "https://flash-keralam-nine.vercel.app/api/news/all?limit=50";

// 🔥 Global fallback image
const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoTABdENqplpwl9s7yrEBYjikqA4u5GWyg_Q&s";

// 🧠 Smart image resolver
function getImage(item) {
  if (!item || !item.image) return FALLBACK_IMAGE;

  const url = item.image;

  // ❌ reject video / invalid sources
  if (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes("video") ||
    url.includes("youtube")
  ) {
    return FALLBACK_IMAGE;
  }

  return url;
}

// ✂️ Short title
function shortTitle(text, len = 80) {
  if (!text) return "";
  return text.length > len ? text.slice(0, len) + "..." : text;
}

// 📡 Load News
async function loadNews() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const news = data?.data || [];

    if (!news.length) return;

     // 🟪 TOP STRIP (first 10)
    renderTopTeasers(news.slice(10, 22));

    // 🟥 HERO
    // renderHero(news[0]);

    // 🟦 Latest Section
    renderBig(news[1]);
    renderSide(news.slice(2, 6));
    renderBottom(news.slice(4, 7));

  } catch (err) {
    console.error("Error loading news:", err);
  }
}

// 🟦 BIG CARD
function renderBig(item) {
  const el = document.getElementById("big-card");

  if (!item) return;

  el.innerHTML = `
    <img 
      src="${getImage(item)}" 
      onerror="this.src='${FALLBACK_IMAGE}'"
      class="w-full h-full object-cover"
    />

    <div class="hero-overlay absolute inset-0"></div>

    <div class="absolute top-3 left-3">
      <span class="cat-tag sec-badge px-2 py-0.5 rounded-sm">
        ${item.normalizedCategory || "news"}
      </span>
    </div>

    <div class="absolute bottom-0 left-0 p-4">
      <h3 class="font-display text-white font-bold text-base leading-snug">
        ${shortTitle(item.title, 100)}
      </h3>
      <p class="text-xs text-white opacity-70 mt-1">
        ${item.source || ""}
      </p>
    </div>
  `;

  el.onclick = () => window.open(item.link, "_blank");
}

// 🟩 SIDE NEWS (2 items)
function renderSide(items) {
  const el = document.getElementById("side-news");

  el.innerHTML = items
    .map(
      (item) => `
    <div class="flex gap-3 items-start card-hover cursor-pointer">
      <div class="flex-1">
        <div class="sec-badge text-accent mb-1">
          ${item.normalizedCategory || "news"}
        </div>
        <h3 class="text-sm font-semibold">
          ${shortTitle(item.title, 70)}
        </h3>
        <p class="text-xs text-muted mt-1">
          ${item.source || ""}
        </p>
      </div>

      <img 
        src="${getImage(item)}" 
        onerror="this.src='${FALLBACK_IMAGE}'"
        class="w-20 h-16 object-cover rounded-sm"
      />
    </div>
    <hr class="hr-thin"/>
  `
    )
    .join("");

  // click handlers
  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

// 🟨 BOTTOM 3
function renderBottom(items) {
  const el = document.getElementById("bottom-news");

  el.innerHTML = items
    .map(
      (item) => `
    <div class="cursor-pointer rounded-sm overflow-hidden">
      <div class="overflow-hidden" style="height:160px;">
        <img 
          src="${getImage(item)}" 
          onerror="this.src='${FALLBACK_IMAGE}'"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="pt-3">
        <h3 class="text-sm font-semibold">
          ${shortTitle(item.title, 80)}
        </h3>

        <p class="text-xs text-muted mt-1.5">
          ${item.normalizedCategory || "news"} — ${item.source || ""}
        </p>
      </div>
    </div>
  `
    )
    .join("");

  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}



function renderHero(item) {
  const el = document.getElementById("hero-news");

  if (!item) return;

  el.innerHTML = `
    <img 
      src="${getImage(item)}" 
      onerror="this.src='${FALLBACK_IMAGE}'"
      class="w-full h-full object-cover"
    />

    <div class="hero-overlay absolute inset-0"></div>

    <!-- Live Badge -->
    <div class="absolute top-4 left-4">
      <span class="pill-live text-xs font-sans font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
      </span>
    </div>

    <!-- Content -->
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <div class="flex gap-2 mb-2">
        <span class="cat-tag sec-badge px-2 py-0.5 rounded-sm">
          ${item.normalizedCategory || "news"}
        </span>
        <span class="cat-tag-outline sec-badge px-2 py-0.5 rounded-sm">
          ${item.source || ""}
        </span>
      </div>

      <h1 class="font-display text-white text-lg md:text-3xl font-bold leading-tight max-w-2xl noto-sans-malayalam">
        ${shortTitle(item.title, 120)}
      </h1>
    </div>

    <!-- Read More -->
    <div class="absolute bottom-4 right-4">
      <span class="font-sans text-xs text-white opacity-80 flex items-center gap-1">
        Read Article →
      </span>
    </div>
  `;

  el.onclick = () => window.open(item.link, "_blank");
}

function renderTopTeasers(items) {
  const el = document.getElementById("top-teasers");

  if (!items || !items.length) return;

  el.innerHTML = items.map(item => `
    <div class="top-teaser-item min-w-[320px] flex gap-3 items-center p-3 border-r-2 border-gray-300 cursor-pointer">
      
      <img 
        src="${getImage(item)}" 
        onerror="this.src='${FALLBACK_IMAGE}'"
        class="w-16 h-12 object-cover flex-shrink-0 rounded-sm"
        loading="lazy"
      />

      <div class="min-w-0">
        <div class="sec-badge text-accent mb-0.5">
          ${item.normalizedCategory || "news"}
        </div>

        <p class=" text-xs text-secondary text-wrap leading-snug line-clamp-3 noto-sans-malayalam">
          ${shortTitle(item.title, 60)}
        </p>
      </div>

    </div>
  `).join("");

  // click handling
  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

async function loadLocalNews() {
  try {
    const res = await fetch(
      "https://flash-keralam-nine.vercel.app/api/news/all?category=kerala"
    );
    const data = await res.json();

    renderLocalNews(data.data);
  } catch (err) {
    console.error("Local news error:", err);
  }
}


function renderLocalNews(items) {
  const el = document.getElementById("local-news");

  if (!items || !items.length) {
    el.innerHTML = "<p>No local news available</p>";
    return;
  }

  el.innerHTML = items.map(item => `
    <div class="card-hover cursor-pointer transition-transform">
      
      <div class="overflow-hidden rounded-sm img-zoom" style="height:130px;">
        <img 
          src="${getImage(item)}"
          onerror="this.src='${FALLBACK_IMAGE}'"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div class="pt-2.5">
        <div class="font-sans text-xs text-muted mb-1">
          ${item.source || "News"}
        </div>

        <h3 class="font-serif text-sm font-semibold text-primary leading-snug noto-sans-malayalam">
          ${shortTitle(item.title, 70)}
        </h3>
      </div>

    </div>
  `).join("");

  // click handling
  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i]?.link, "_blank");
  });
}

// 🚀 Run
loadNews();
loadLocalNews();