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
function startTeaserAutoScroll(el, halfCount) {
  // Cancel any previous scroll loop on re-render
  if (_teaserScrollRAF) {
    cancelAnimationFrame(_teaserScrollRAF);
    _teaserScrollRAF = null;
  }

  // Only run on touch / narrow screens
  const isMobile = window.innerWidth <= 768;

if (!isMobile) return;

  const SPEED = 0.5; // px per frame  (~36 px/s at 60 fps)
  let paused = false;

  // ── scroll loop ──────────────────────────────
  function tick() {
    if (!paused) {
      el.scrollLeft += SPEED;

      // When we've scrolled exactly through the first half, snap back silently
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      }
    }
    _teaserScrollRAF = requestAnimationFrame(tick);
  }

setTimeout(() => {
  _teaserScrollRAF = requestAnimationFrame(tick);
}, 300);

  // ── pause on touch start ─────────────────────
  el.addEventListener("touchstart", () => {
    paused = true;
    clearTimeout(_teaserScrollTimer);
  }, { passive: true });

  // ── resume 2 s after touch end ───────────────
  el.addEventListener("touchend", () => {
    clearTimeout(_teaserScrollTimer);
    _teaserScrollTimer = setTimeout(() => {
      paused = false;
    }, 2000);
  }, { passive: true });

  // ── also pause / resume on pointer events (desktop fallback) ──
  el.addEventListener("mouseenter", () => { paused = true; });
  el.addEventListener("mouseleave", () => { paused = false; });
}