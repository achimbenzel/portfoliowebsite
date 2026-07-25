require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.set('trust proxy', true); // Behind NPM reverse proxy — read real host/protocol from X-Forwarded-* headers
const PORT = process.env.PORT || 3000;

/* Server-side SEO/SSR rendering (meta tags, JSON-LD, crawlable content) */
const seo = require('./seo-render.js');

/* ===== Contact Form Config ===== */
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;
const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@achimbenzel.com';

/* Startup check */
if (!TURNSTILE_SITE_KEY) console.warn('[WARN] TURNSTILE_SITE_KEY is not set — check your .env file is in:', path.join(__dirname, '.env'));
if (!TURNSTILE_SECRET) console.warn('[WARN] TURNSTILE_SECRET is not set — check your .env file');

app.use(cors());
app.use(express.json());

/* ===== Canonical host: force non-www (301) =====
   Belt-and-suspenders: the primary www→non-www redirect should be done in
   NPM (Redirection Host), but this guarantees correctness if a request ever
   reaches Node with the www hostname. Requires app.set('trust proxy', true). */
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.startsWith('www.')) {
    return res.redirect(301, `https://achimbenzel.com${req.originalUrl}`);
  }
  next();
});

/* ===== Static assets ===== */
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mjs') || filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
app.use('/Assets', express.static(path.join(__dirname, 'Assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mjs') || filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
  }
}));
app.use('/projects', (req, res, next) => {
  const filePath = path.join(__dirname, 'projects', req.path);
  const exists = require('fs').existsSync(filePath);
  console.log(`[DEBUG /projects] ${req.method} ${req.path}`);
  console.log(`  Full path: ${filePath}`);
  console.log(`  Exists: ${exists}`);
  next();
}, express.static(path.join(__dirname, 'projects')));
app.use('/projects-data.js', express.static(path.join(__dirname, 'projects-data.js')));
app.use('/fonts-data.js', express.static(path.join(__dirname, 'fonts-data.js')));
app.use('/fonts-generated.css', express.static(path.join(__dirname, 'fonts-generated.css')));
app.use('/ownfonts', express.static(path.join(__dirname, 'ownfonts')));
app.use('/tos.json', express.static(path.join(__dirname, 'tos.json')));

/* ===== SEO: robots.txt & sitemap.xml (vor dem Language-Routing!) ===== */
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

/* ===== Language detection middleware ===== */
const SUPPORTED_LANGS = ['en', 'de'];
const DACH_COUNTRIES = ['DE', 'AT', 'CH']; // Germany, Austria, Switzerland

/**
 * Detect preferred language from multiple signals (no cookies needed):
 * 1. URL prefix (/de/... or /en/...) — highest priority
 * 2. ?lang= query parameter — explicit user choice
 * 3. Accept-Language header — browser/OS setting (reflects navigator.language)
 * 4. Default to English
 */
function detectLang(req) {
  // 1. Check Accept-Language header (sent automatically by every browser)
  const acceptLang = req.headers['accept-language'] || '';
  // Parse the header: e.g. "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7"
  const preferred = acceptLang
    .split(',')
    .map(part => {
      const [tag, q] = part.trim().split(';q=');
      return { lang: tag.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    if (SUPPORTED_LANGS.includes(lang)) return lang;
  }

  return 'en'; // fallback
}

/* ===== Route: Root — auto-redirect based on language detection ===== */
app.get('/', (req, res) => {
  // Language toggle: keep 302 so the browser doesn't permanently cache the choice
  if (req.query.lang && SUPPORTED_LANGS.includes(req.query.lang)) {
    return res.redirect(302, `/${req.query.lang}/`);
  }
  // Bare root → default language: permanent
  const lang = detectLang(req);
  res.redirect(301, `/${lang}/`);
});

/* ===== All page routes under /:lang/ ===== */
const PAGE_ROUTES = [
  '',              // home
  'services',
  'work',
  'my-fonts',
  'my-fonts/:fontSlug',
  'about',
  'contact',
  'imprint',
  'privacy',
  'tos',
  'work/:projectSlug',
];

// Build the HTML shell for each page — the client JS handles rendering
function renderPage(lang, route, req) {
  const otherLang = lang === 'en' ? 'de' : 'en';
  // Build the equivalent URL in the other language
  const pathAfterLang = req.path.replace(`/${lang}`, '') || '/';
  const switchUrl = `/${otherLang}${pathAfterLang}`;

  // Map route to page title (will also be set client-side, but good for SEO)
  const titles = {
    en: { home: 'Home', services: 'Services', work: 'Work', 'my-fonts': 'My Fonts', about: 'About', contact: 'Contact', imprint: 'Imprint', privacy: 'Privacy Policy', tos: 'Terms of Service', '404': '404 — Page Not Found' },
    de: { home: 'Home', services: 'Leistungen', work: 'Projekte', 'my-fonts': 'My Fonts', about: 'Über mich', contact: 'Kontakt', imprint: 'Impressum', privacy: 'Datenschutzerklärung', tos: 'Nutzungsbedingungen', '404': '404 — Seite nicht gefunden' }
  };
  const pageKey = route || 'home';

  // For nested routes (work/:slug, my-fonts/:slug) extract the slug from the URL
  // so the SEO renderer can build project-specific meta/content.
  let slug = null;
  const nested = pathAfterLang.match(/^\/(work|my-fonts)\/([^\/]+)/);
  if (nested) slug = decodeURIComponent(nested[2]);

  // x-default normally falls back to English, but project detail pages
  // (work/:slug) are for German clients, so default unsure visitors to German.
  const xDefaultLang = (pageKey === 'work' && slug) ? 'de' : 'en';

  const pageTitle = (titles[lang] && titles[lang][pageKey]) || 'Achim Benzel';

  // Server-rendered SEO: meta tags + JSON-LD for the <head>, crawlable copy for #app
  const metaBlock = seo.metaTags(lang, pageKey, pageTitle, pathAfterLang, slug);
  const jsonLdBlock = seo.jsonLd(lang, pageKey, slug);
  const appContent = seo.appContent(lang, pageKey, slug);

  // Project pages get the project name as the title (matches client router)
  let docTitle = pageTitle;
  if (slug && pageKey === 'work') {
    docTitle = seo.projectTitle(lang, slug) || pageTitle;
  }

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${docTitle} — Achim Benzel, Brand, Motion &amp; 3D Designer</title>
${metaBlock}
<link rel="icon" type="image/svg+xml" href="/Assets/logo.svg"/>
<link rel="alternate" hreflang="en" href="https://achimbenzel.com/en${pathAfterLang}"/>
<link rel="alternate" hreflang="de" href="https://achimbenzel.com/de${pathAfterLang}"/>
<link rel="alternate" hreflang="x-default" href="https://achimbenzel.com/${xDefaultLang}${pathAfterLang}"/>
${jsonLdBlock}
<style>
/* Server-rendered content stays in the DOM for crawlers/AI but is visually
   hidden for human visitors. The client router replaces #app on first render,
   removing this shell entirely — so no flash of unstyled content (FOUC). */
#app[data-ssr] .ssr-shell{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;}
</style>
<link rel="stylesheet" href="/css/fonts.css"/>
<link rel="stylesheet" href="/fonts-generated.css"/>
<link rel="stylesheet" href="/css/style.css"/>
<link rel="stylesheet" href="/css/text-anim.css"/>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"><\/script>
<script src="/projects-data.js"><\/script>
<script src="/fonts-data.js"><\/script>
<script type="importmap">{"imports":{"three":"/Assets/vendor/three/three.module.js","three/addons/":"/Assets/vendor/three/addons/"}}<\/script>
</head>
<body data-theme="dark">

<div class="cursor" id="cur"></div>
<div class="cdot" id="dot"></div>
<div class="clbl" id="lbl"></div>

<div class="lightbox" id="lightbox" onclick="lbClick(event)">
  <button class="lightbox-close" onclick="lbClose()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
  <button class="lightbox-nav lightbox-prev" onclick="event.stopPropagation();lbNav(-1)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
  <div class="lightbox-img-wrap"><img id="lbImg" src="" alt=""/></div>
  <button class="lightbox-nav lightbox-next" onclick="event.stopPropagation();lbNav(1)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
  <div class="lightbox-counter" id="lbCounter"></div>
  <div class="lightbox-zoom-controls" onclick="event.stopPropagation()">
    <button class="lightbox-zoom-btn" onclick="lbZoom(-1)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg></button>
    <input type="range" class="lightbox-zoom-slider" id="lbZoomSlider" min="100" max="300" value="100" oninput="lbZoomTo(this.value)"/>
    <button class="lightbox-zoom-btn" onclick="lbZoom(1)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></button>
    <span class="lightbox-zoom-pct" id="lbZoomPct">100%</span>
  </div>
</div>

<div class="ext-overlay" id="extOverlay" onclick="closeExt(event)">
  <div class="ext-modal">
    <h4 id="extTitle"></h4>
    <p id="extText"></p>
    <span class="ext-url" id="extUrl"></span>
    <div class="ext-btns">
      <button class="ext-btn" id="extCancel" onclick="hideExt()"></button>
      <button class="ext-btn go" id="extGo" onclick="goExt()"></button>
    </div>
  </div>
</div>

<div class="ckb" id="ckb">
  <div class="ckt" id="ckt"></div>
  <div class="ckbtns">
    <button class="ckbtn" id="ckd" onclick="hideCk()"></button>
    <button class="ckbtn acc" id="cka" onclick="hideCk()"></button>
  </div>
</div>

<button class="scroll-top" id="stt" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>

<div class="mmenu" id="mobMenu"></div>
<div id="app" data-ssr><div class="ssr-shell">${appContent}</div></div>

<!-- Inject the language & switch URL for client-side JS -->
<script>
  var __LANG__ = '${lang}';
  var __SWITCH_URL__ = '${switchUrl}';
  var __TURNSTILE_SITE_KEY__ = '${TURNSTILE_SITE_KEY}';
<\/script>

<!-- Application Scripts -->
<script src="/js/cursor.js"><\/script>
<script src="/js/hero.js"><\/script>
<script src="/js/hero-shader.js"><\/script>
<script src="/js/i18n.js"><\/script>
<script src="/js/pages.js"><\/script>
<script src="/js/text-anim.js"><\/script>
<script src="/js/router.js"><\/script>

<!-- Three.js 3D Models (ES Module) -->
<script type="module" src="/js/3d-models.mjs"><\/script>
</body>
</html>`;
}

// Register all routes for both languages
/* ===== Contact Form API ===== */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, brand, phone, email, hear, timeline, budget, message } = req.body;
    const turnstileToken = req.body['cf-turnstile-response'];

    /* Validate required fields */
    if (!name || !brand || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    /* Verify Turnstile token */
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: turnstileToken })
    });
    const tsData = await tsRes.json();
    if (!tsData.success) {
      return res.status(403).json({ error: 'Turnstile verification failed.' });
    }

    /* Send email via nodemailer */
        const nodemailer = require('nodemailer');
        const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.strato.de',
          port: smtpPort,
          secure: smtpPort === 465, // True bei 465, false bei allem anderen
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
          }
        });

    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${name}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Brand</td><td style="padding:6px 12px">${brand}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Phone</td><td style="padding:6px 12px">${phone || '—'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Heard via</td><td style="padding:6px 12px">${hear || '—'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Timeline</td><td style="padding:6px 12px">${timeline || '—'}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold">Budget</td><td style="padding:6px 12px">${budget || '—'}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;font-family:sans-serif;font-size:14px">${message}</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Achim Benzel Portfolio Website" <info@achimbenzel.com>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New Inquiry from ${name} — ${brand}`,
      html: htmlBody
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('[Contact Form Error]', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/* ===== Page Routes ===== */
// Register all routes for both languages
SUPPORTED_LANGS.forEach(lang => {
  PAGE_ROUTES.forEach(route => {
    const fullPath = route ? `/${lang}/${route}` : `/${lang}`;
    app.get(fullPath, (req, res) => {
      const routeKey = route.split('/')[0] || 'home';
      res.send(renderPage(lang, routeKey, req));
    });
  });

  // Catch-all for /:lang/* (unknown sub-routes → 404)
  app.get(`/${lang}/*`, (req, res) => {
    res.status(404).send(renderPage(lang, '404', req));
  });
});

/* ===== Fallback: unknown routes → 404 ===== */
app.get('*', (req, res, next) => {
  if (req.path.match(/\.(js|mjs|css|wasm|woff2|glb|gltf|png|jpg|svg|webp)$/)) {
    console.error('[MISS] Static file not found:', req.path);
    return res.status(404).send('File not found: ' + req.path);
  }
  const lang = detectLang(req);
  res.status(404).send(renderPage(lang, '404', req));
});

app.listen(PORT, () => {
  console.log(`Achim Benzel Portfolio running at http://localhost:${PORT}`);
});
