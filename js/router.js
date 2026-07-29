/* Stop the browser restoring the previous scroll offset on pushState /
   popState navigation. Without this it can re-apply the old offset AFTER
   our scrollTo(0), which lands you mid-page on a freshly opened route. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* html{scroll-behavior:smooth} would animate a jump to the top; force an
   instant jump so route changes land at the top with no smooth scrolling. */
function scrollTopNow() {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  root.style.scrollBehavior = prev;
}

/* ===== Language & Theme State ===== */
let lang = window.__LANG__ || 'en';
/* The user's dark|light choice — the only theme state that is stored. `theme`
   is what is actually painted and may be a project variant of it. */
let baseTheme = 'dark';
let theme = 'dark';
let mob = false;
let isFirstRender = true;

function t(p) { return p.split('.').reduce((o, k) => o?.[k], L[lang]); }

function vg(w, h, txt, bg = '#222') {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgba(58,111,255,.1)"/><stop offset="100%" style="stop-color:rgba(58,111,255,.02)"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><text x="${w/2}" y="${h/2}" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,.12)" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="3">${txt}</text></svg>`)}`;
}

/* ===== URL Helpers ===== */
function langPrefix() { return '/' + lang; }

// Convert internal route key (e.g. 'services') to a real URL path
function routeToPath(r) {
  if (!r || r === 'home') return langPrefix() + '/';
  return langPrefix() + '/' + r;
}

// Extract the route key from the current URL path
function routeFromPath() {
  const p = window.location.pathname;
  // Remove /:lang/ prefix
  const match = p.match(/^\/(en|de)\/?(.*)$/);
  if (!match) return '404';
  const rest = match[2].replace(/\/$/, ''); // trim trailing slash
  return rest || 'home';
}

/* ===== Routing ===== */
function go(r, push = true) {
  if (push) history.pushState({ r }, '', routeToPath(r));
  if (mob) {
    mob = false;
    const ham = document.getElementById('hamBtn');
    const island = document.getElementById('navIsland');
    if (ham) ham.classList.remove('open');
    if (island) island.classList.remove('island-open');
  }
  scrollTopNow();
  render(r);
  scrollTopNow();
  requestAnimationFrame(scrollTopNow);
}

window.addEventListener('popstate', e => {
  const r = e.state?.r || routeFromPath();
  render(r);
  scrollTopNow();
  requestAnimationFrame(scrollTopNow);
});

function hr() { return routeFromPath(); }

function updateMob() { /* no-op: island nav is rendered inline by navH */ }

/* Toggle language: navigate to the other language version of the current page */
function tL() {
  const otherLang = lang === 'en' ? 'de' : 'en';
  const currentRoute = routeFromPath();
  const newPath = '/' + otherLang + '/' + (currentRoute === 'home' ? '' : currentRoute);
  // Full page navigation to let the server set the new lang context
  window.location.href = newPath;
}

function tM() {
  mob = !mob;
  const ham = document.getElementById('hamBtn');
  const island = document.getElementById('navIsland');
  if (!ham || !island) return;
  ham.classList.toggle('open', mob);
  if (mob) {
    island.classList.add('island-open');
    /* Measure actual content height instead of guessing with constants */
    lbMeasureIsland(island);
  } else {
    island.classList.remove('island-open');
  }
}

/* `adjust` accounts for a child that is about to animate to a different height
   (the services submenu): its current box is still the old value, so the caller
   passes the pixel delta and both transitions land together. */
function lbMeasureIsland(island, adjust = 0) {
  /* Sum the natural heights of the flex children rather than reading
     scrollHeight: scrollHeight never reports less than the element's current
     box, so a drawer that has to SHRINK (services submenu collapsing) would
     keep measuring its old, taller self. The children are never height-
     constrained, so their boxes are the real content height. */
  const cs = getComputedStyle(island);
  let content = 0;
  for (const child of island.children) content += child.getBoundingClientRect().height;
  /* .nav is border-box, so padding is inside the height but borders are not */
  const h = Math.ceil(content + adjust
    + (parseFloat(cs.paddingTop) || 0)
    + (parseFloat(cs.paddingBottom) || 0)
    + (parseFloat(cs.borderTopWidth) || 0)
    + (parseFloat(cs.borderBottomWidth) || 0));
  /* Set the exact pixel value for the CSS transition to work */
  island.style.setProperty('--island-h', h + 'px');
}

/* Recalculate island height on resize (font sizes change with viewport) */
window.addEventListener('resize', () => {
  if (!mob) return;
  const island = document.getElementById('navIsland');
  if (island && island.classList.contains('island-open')) lbMeasureIsland(island);
});

/* ===== Render ===== */
function render(r, trigger) {
  destroyHeroCanvas();
  destroyFaq3D();
  const wasOpen = mob;
  const a = document.getElementById('app');
  let h = '';
  if (r.startsWith('work/')) h = projPg(r.slice(5));
  else if (r.startsWith('shop/')) h = logoPg(r.slice(5));
  else if (r.startsWith('my-fonts/')) h = fontTesterPg(r.slice(9));
  else if (SVC_CATS.includes(r)) h = svcCatPg(r);
  else switch (r) {
    case 'work': h = wrkPg(); break;
    case 'shop': h = logosPg(); break;
    case 'my-fonts': h = fontsPg(); break;
    case 'about': h = abtPg(); break;
    case 'imprint': h = legPg('imp'); break;
    case 'privacy': h = legPg('prv'); break;
    case 'tos': h = tosPg(); break;
    case 'contact': h = contactPg(); break;
    default: {
      const knownRoutes=['home','work','shop','my-fonts','about','imprint','privacy','tos','contact'].concat(SVC_CATS);
      h = (r==='home'||knownRoutes.includes(r)) ? homePg() : notFoundPg();
      break;
    }
  }
  a.innerHTML = navH(r) + `<main class="page">${h}</main>` + ftrH(r);

  /* Restore island state if toggle was theme/lang */
  if (wasOpen && (trigger === 'theme' || trigger === 'lang')) {
    const ham = document.getElementById('hamBtn');
    const island = document.getElementById('navIsland');
    if (ham && island) {
      ham.classList.add('open');
      island.classList.add('island-open');
      lbMeasureIsland(island);
    }
  }

  requestAnimationFrame(() => {
    const pg = a.querySelector('.page'); if (pg) pg.classList.add('enter');
    if (r === 'home' || r === '') {
      initHeroCanvas();
      initHeroScroll();
      initFaq3D();
    }
    if (r.startsWith('my-fonts/')) initFontTester();
    if (r.startsWith('shop/')) initLogoTester();
    if (r === 'contact') initTurnstile();
    requestAnimationFrame(() => { observe(); });
  });
  ckU();

  /* Dynamic title tag */
  const titleMap = {
    home: 'Home',
    work: lang === 'en' ? 'Work' : 'Projekte',
    'my-fonts': 'My Fonts',
    shop: 'Shop',
    about: lang === 'en' ? 'About' : 'Über mich',
    contact: lang === 'en' ? 'Contact' : 'Kontakt',
    imprint: lang === 'en' ? 'Imprint' : 'Impressum',
    privacy: lang === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung',
    tos: lang === 'en' ? 'Terms of Service' : 'Allgemeine Geschäftsbedingungen'
  };
  /* Service categories take their title from the same i18n entry the page uses.
     Those labels are authored as HTML ("Brand &amp; Logo Design"), so decode
     them — document.title is plain text and would show the entity verbatim. */
  const plain = s => { const d = document.createElement('textarea'); d.innerHTML = String(s || ''); return d.value; };
  SVC_CATS.forEach(k => { const c = (t('svcCat') || {})[k]; if (c) titleMap[k] = plain(c.label); });

  let pageTitle = 'Achim Benzel';
  if (r.startsWith('work/')) {
    const slug = r.slice(5);
    const proj = P[slug];
    pageTitle = proj ? proj[lang].title : 'Project';
  } else if (r.startsWith('shop/')) {
    const lo = (typeof LG !== 'undefined') && LG[r.slice(5)];
    pageTitle = lo ? (lo[lang] || lo.en || {}).name || 'Logo' : 'Logo';
  } else if (r.startsWith('my-fonts/')) {
    const fn = r.slice(9);
    const fd = FONTS.find(f => f.slug === fn);
    pageTitle = fd ? fd.name + ' — Font Tester' : 'Font Tester';
  } else {
    pageTitle = titleMap[r] || (lang === 'en' ? '404 — Page Not Found' : '404 — Seite nicht gefunden');
  }
  document.title = pageTitle + ' — Achim Benzel, Brand, Motion & 3D Designer';
}

/* ===== FAQ 3D — bridge to ES module ===== */
function initFaq3D() { if (window._startFaq3D) window._startFaq3D(); }
function destroyFaq3D() { if (window._destroyFaq3D) window._destroyFaq3D(); }

/* ===== Cloudflare Turnstile ===== */
function initTurnstile(){
  const el=document.getElementById('cfTurnstile');
  if(!el||typeof turnstile==='undefined'||!window.__TURNSTILE_SITE_KEY__)return;
  turnstile.render('#cfTurnstile',{
    sitekey:window.__TURNSTILE_SITE_KEY__,
    theme:(theme==='dark'||theme==='darkproject')?'dark':'light',
    language:lang==='de'?'de':'en'
  });
}
