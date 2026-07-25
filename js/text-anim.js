/* ============================================================
   NOIR — Webflow-Style Text Animations (designbyrobin.be inspired)
   ============================================================
   Vanilla JS · Intersection Observer · requestAnimationFrame
   No dependencies. Drop-in module for the Noir SPA.

   USAGE — Add data attributes to your HTML elements:

   1. SPLIT-CHAR REVEAL (hero titles, big headings)
      <h1 data-anim="chars">Design as strategy</h1>
      Options: data-anim-delay="0"  data-anim-stagger="30"  data-anim-duration="600"

   2. SPLIT-WORD REVEAL (subtitles, descriptions)
      <p data-anim="words">I transform business complexity into visual clarity.</p>

   3. LINE-BY-LINE REVEAL (paragraphs, body text)
      <p data-anim="lines">Long paragraph text…</p>

   4. FADE-UP (simple fade, for labels/buttons — replaces your CSS .reveal)
      <div data-anim="fade">…</div>

   5. MASK REVEAL (text slides out from behind a clip-mask)
      <h2 data-anim="mask">Selected projects</h2>

   6. COUNTER (animated number counting)
      <span data-anim="counter" data-anim-to="140">0</span>

   All animations are scroll-triggered via IntersectionObserver.
   On mobile (<768px), complex char animations degrade to word animations
   for performance. Set data-anim-mobile="off" to disable on mobile entirely.
   ============================================================ */

const NoirTextAnim = (() => {
  'use strict';

  /* ---- Configuration ---- */
  const DEFAULTS = {
    stagger:    30,     // ms between each char/word
    duration:   600,    // ms per element animation
    delay:      0,      // ms before animation starts
    easing:     'cubic-bezier(.23, 1, .32, 1)',  // smooth out-expo
    threshold:  0.15,   // IntersectionObserver threshold
    rootMargin: '0px 0px -12% 0px',
    mobileBreakpoint: 768,
  };

  /* ---- State ---- */
  let observer = null;
  let initialized = false;
  const animated = new WeakSet();

  /* ---- Utility: parse data attributes with fallbacks ---- */
  function opt(el, key, fallback) {
    const v = el.dataset[`anim${key.charAt(0).toUpperCase() + key.slice(1)}`];
    return v !== undefined ? Number(v) : (fallback !== undefined ? fallback : DEFAULTS[key]);
  }

  /* ---- Utility: wrap element content for animation ---- */
  function wrapChars(el) {
    const html = el.innerHTML;
    // Preserve <em>, <strong>, <br> — split only the text nodes
    const frag = document.createElement('div');
    frag.innerHTML = html;
    const result = [];

    function charsFromWord(word) {
      // Wrap each character but keep them inside a nowrap group
      let out = '<span class="na-word-group">';
      for (let i = 0; i < word.length; i++) {
        out += `<span class="na-char"><span class="na-char-inner">${word[i]}</span></span>`;
      }
      out += '</span>';
      return out;
    }

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        // Split into words and spaces, preserving both
        const tokens = text.split(/( +)/);
        tokens.forEach(token => {
          if (/^ +$/.test(token)) {
            // Spaces between words — use regular spaces so browser handles line-breaking naturally
            result.push(' ');
          } else if (token.length > 0) {
            // If token starts with punctuation (e.g. comma after </em>),
            // append into the previous word group so they don't line-break apart
            if (/^[.,;:!?'")\]\-–—]/.test(token) && result.length > 0) {
              // Search backwards past inline closing tags (</em>, </strong>, etc.)
              let targetIdx = -1;
              for (let i = result.length - 1; i >= 0; i--) {
                if (result[i].includes('na-word-group')) {
                  targetIdx = i;
                  break;
                }
                // Only skip past closing tags — stop if we hit anything else
                if (!/^<\/(em|strong|span|b|i|mark)>$/.test(result[i].trim())) break;
              }
              if (targetIdx !== -1) {
                let chars = '';
                for (let i = 0; i < token.length; i++) {
                  chars += `<span class="na-char"><span class="na-char-inner">${token[i]}</span></span>`;
                }
                // Insert chars before the closing </span> of the word group
                const wg = result[targetIdx];
                result[targetIdx] = wg.slice(0, -7) + chars + '</span>';
                return;
              }
            }
            result.push(charsFromWord(token));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'br') {
          result.push('<br>');
        } else {
          // Preserve inline elements like <em>, <strong>
          const attrs = Array.from(node.attributes).map(a => ` ${a.name}="${a.value}"`).join('');
          result.push(`<${tag}${attrs}>`);
          node.childNodes.forEach(walk);
          result.push(`</${tag}>`);
        }
      }
    }

    frag.childNodes.forEach(walk);
    el.innerHTML = result.join('');
    return el.querySelectorAll('.na-char-inner');
  }

  function wrapWords(el) {
    const html = el.innerHTML;
    const frag = document.createElement('div');
    frag.innerHTML = html;
    const result = [];

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(w => {
          if (/^\s+$/.test(w)) {
            result.push(' ');
          } else if (w.length > 0) {
            result.push(`<span class="na-word"><span class="na-word-inner">${w}</span></span>`);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'br') {
          result.push('<br>');
        } else {
          const attrs = Array.from(node.attributes).map(a => ` ${a.name}="${a.value}"`).join('');
          result.push(`<${tag}${attrs}>`);
          node.childNodes.forEach(walk);
          result.push(`</${tag}>`);
        }
      }
    }

    frag.childNodes.forEach(walk);
    el.innerHTML = result.join('');
    return el.querySelectorAll('.na-word-inner');
  }

  function wrapLines(el) {
    // Use words first, then detect line breaks by offsetTop
    const words = wrapWords(el);
    // Group words into lines after layout
    requestAnimationFrame(() => {
      const wordEls = el.querySelectorAll('.na-word');
      let currentTop = null;
      let lineIndex = 0;

      wordEls.forEach(w => {
        const top = w.getBoundingClientRect().top;
        if (currentTop === null || Math.abs(top - currentTop) > 4) {
          currentTop = top;
          lineIndex++;
        }
        w.dataset.line = lineIndex;
        w.querySelector('.na-word-inner').style.transitionDelay =
          `${(lineIndex - 1) * 120}ms`;
      });
    });
    return words;
  }

  /* ---- Mask Reveal: clip-path based ---- */
  function setupMask(el) {
    el.classList.add('na-mask');
  }

  /* ---- Counter animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.animTo || el.textContent, 10);
    const suffix = el.dataset.animSuffix || '';
    const dur = opt(el, 'duration', 1500);
    const start = performance.now();
    el.textContent = '0' + suffix;

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ---- Core: prepare element for animation ---- */
  function prepare(el) {
    const type = el.dataset.anim;
    const isMobile = window.innerWidth < DEFAULTS.mobileBreakpoint;
    const mobileMode = el.dataset.animMobile;

    if (mobileMode === 'off' && isMobile) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    // On mobile, degrade chars → words for performance
    const effectiveType = (type === 'chars' && isMobile) ? 'words' : type;
    el._noirAnimType = effectiveType;

    switch (effectiveType) {
      case 'chars': {
        const inners = wrapChars(el);
        el._noirTargets = inners;
        el.classList.add('na-prepared');
        break;
      }
      case 'words': {
        const inners = wrapWords(el);
        el._noirTargets = inners;
        el.classList.add('na-prepared');
        break;
      }
      case 'lines': {
        const inners = wrapLines(el);
        el._noirTargets = inners;
        el.classList.add('na-prepared');
        break;
      }
      case 'mask': {
        setupMask(el);
        el.classList.add('na-prepared');
        break;
      }
      case 'fade': {
        el.classList.add('na-fade', 'na-prepared');
        break;
      }
      case 'counter': {
        el.classList.add('na-prepared');
        break;
      }
    }
  }

  /* ---- Core: trigger the animation ---- */
  function animate(el) {
    if (animated.has(el)) return;
    animated.add(el);

    const type = el._noirAnimType || el.dataset.anim;
    const delay = opt(el, 'delay', 0);
    const stagger = opt(el, 'stagger');
    const duration = opt(el, 'duration');

    switch (type) {
      case 'chars':
      case 'words': {
        const targets = el._noirTargets;
        if (!targets) break;
        targets.forEach((t, i) => {
          t.style.transition = `transform ${duration}ms ${DEFAULTS.easing} ${delay + i * stagger}ms, opacity ${duration}ms ${DEFAULTS.easing} ${delay + i * stagger}ms`;
          t.style.transform = 'translateY(0)';
          t.style.opacity = '1';
        });
        el.classList.add('na-visible');
        // Trigger highlight rectangles after text animation completes
        const totalTime = delay + (targets.length - 1) * stagger + duration * 0.5;
        setTimeout(() => {
          el.classList.add('na-highlights-ready');
          // Also add to parent .reveal container if present
          const reveal = el.closest('.reveal');
          if (reveal) reveal.classList.add('na-highlights-ready');
        }, totalTime);
        break;
      }
      case 'lines': {
        const targets = el._noirTargets;
        if (!targets) break;
        let maxLineDelay = 0;
        // Lines use group delay set in wrapLines
        targets.forEach(t => {
          const d = parseInt(t.style.transitionDelay || '0', 10);
          if (d > maxLineDelay) maxLineDelay = d;
          t.style.transition = `transform ${duration}ms ${DEFAULTS.easing} ${delay + d}ms, opacity ${duration}ms ${DEFAULTS.easing} ${delay + d}ms`;
          t.style.transform = 'translateY(0)';
          t.style.opacity = '1';
        });
        el.classList.add('na-visible');
        // Trigger highlight rectangles after text animation completes
        const totalTime = delay + maxLineDelay + duration * 0.5;
        setTimeout(() => {
          el.classList.add('na-highlights-ready');
          const reveal = el.closest('.reveal');
          if (reveal) reveal.classList.add('na-highlights-ready');
        }, totalTime);
        break;
      }
      case 'mask': {
        setTimeout(() => {
          el.classList.add('na-visible');
          el.classList.add('na-highlights-ready');
          const reveal = el.closest('.reveal');
          if (reveal) reveal.classList.add('na-highlights-ready');
        }, delay);
        break;
      }
      case 'fade': {
        setTimeout(() => {
          el.classList.add('na-visible');
          el.classList.add('na-highlights-ready');
          const reveal = el.closest('.reveal');
          if (reveal) reveal.classList.add('na-highlights-ready');
        }, delay);
        break;
      }
      case 'counter': {
        setTimeout(() => animateCounter(el), delay);
        break;
      }
    }
  }

  /* ---- Observer setup ---- */
  function createObserver() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: DEFAULTS.threshold,
      rootMargin: DEFAULTS.rootMargin,
    });
  }

  /* ---- Public: scan and set up all [data-anim] elements ---- */
  function init() {
    if (!observer) createObserver();

    const els = document.querySelectorAll('[data-anim]:not(.na-prepared)');
    els.forEach(el => {
      prepare(el);

      // If element is already in view (e.g. hero on page load), animate immediately
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        // Small RAF delay so CSS has time to paint the initial state
        requestAnimationFrame(() => requestAnimationFrame(() => animate(el)));
      } else {
        observer.observe(el);
      }
    });

    initialized = true;
  }

  /* ---- Public: clean up (call on SPA page transitions) ---- */
  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    initialized = false;
  }

  /* ---- Public: re-init (call after SPA render) ---- */
  function refresh() {
    // Don't destroy the observer — just scan for new elements
    init();
  }

  return { init, destroy, refresh, DEFAULTS };
})();

/* ---- Auto-init on DOMContentLoaded ---- */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => NoirTextAnim.init());
}
