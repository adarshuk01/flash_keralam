// ─────────────────────────────────────────────
// 🟪 TOP TEASERS STRIP  (with mobile auto-scroll)
// ─────────────────────────────────────────────

let _teaserScrollRAF   = null;   // requestAnimationFrame handle
let _teaserScrollTimer = null;   // resume-after-drag timer

function renderTopTeasers(items) {
  const el = document.getElementById("top-teasers");
  if (!items || !items.length || !el) return;

  // Duplicate items so infinite scroll feels seamless
  const doubled = [...items, ...items];

  el.innerHTML = doubled.map(item => `
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
        <p class="text-xs text-secondary text-wrap leading-snug line-clamp-3 noto-sans-malayalam">
          ${shortTitle(item.title, 60)}
        </p>
      </div>
    </div>
  `).join("");

  // Click handlers (on doubled list — map index back to original)
  [...el.children].forEach((child, i) => {
    child.onclick = () => window.open(items[i % items.length]?.link, "_blank");
  });

  // Only auto-scroll on mobile / touch devices
  startTeaserAutoScroll(el, items.length);
}

/**
 * Smooth infinite auto-scroll for the teaser strip.
 * Pauses while the user is dragging / swiping.
 * Resumes 2 s after the user lifts their finger.
 *
 * @param {HTMLElement} el        - the scrollable container
 * @param {number}      halfCount - number of *original* items (half the doubled list)
 */
let _teaserInterval = null;
let _resumeTimer = null;

function startTeaserAutoScroll(el) {
  // Stop previous
  if (_teaserInterval) {
    clearInterval(_teaserInterval);
    _teaserInterval = null;
  }

  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return;

  const SPEED = 1; // px per tick
  const INTERVAL = 20; // ms (~50fps)

  let paused = false;

  function start() {
    _teaserInterval = setInterval(() => {
      if (paused) return;

      el.scrollBy({ left: SPEED, behavior: "auto" });

      // infinite loop reset
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
    }, INTERVAL);
  }

  // Start AFTER render (important for mobile)
  setTimeout(start, 300);

  // ───── Touch controls ─────
  el.addEventListener("touchstart", () => {
    paused = true;
    clearTimeout(_resumeTimer);
  }, { passive: true });

  el.addEventListener("touchend", () => {
    clearTimeout(_resumeTimer);
    _resumeTimer = setTimeout(() => {
      paused = false;
    }, 1500);
  }, { passive: true });

  // ───── Visibility fix (VERY IMPORTANT 🔥) ─────
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      paused = true;
    } else {
      paused = false;
    }
  });
}