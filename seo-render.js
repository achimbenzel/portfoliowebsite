/* ============================================================
   seo-render.js — Server-side SEO content + meta generation
   ------------------------------------------------------------
   Produces, per route + language:
     - <head> meta tags (description, Open Graph, Twitter, canonical)
     - JSON-LD structured data (Person / WebSite / WebPage)
     - a real text payload injected into #app so crawlers and AI
       see the actual content before client JS hydrates.

   This reuses the SAME translation data as the browser (js/i18n.js),
   so there is a single source of truth — no duplicated copy.
   ============================================================ */

const { L } = require('./js/i18n.js');

/* Project data (same source the browser uses) — for SSR of /work/:slug pages */
let P = {};
try { P = require('./projects-data.js').P || {}; } catch (e) { P = {}; }

const SITE = 'https://achimbenzel.com';
const BRAND = 'Achim Benzel';

/* Strip HTML tags for use inside meta attributes */
function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
/* Escape for safe insertion into an HTML attribute */
function attr(s) {
  return stripTags(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/* ---- Project helpers ---- */
function projectData(lang, slug) {
  const proj = P[slug];
  if (!proj) return null;
  return { proj, p: proj[lang] || proj.en };
}
function projectTitle(lang, slug) {
  const d = projectData(lang, slug);
  return d ? stripTags(d.p.title) : null;
}

/* Translated labels for the canonical category ids (see build-projects.js) */
function categoryLabels(lang, proj) {
  const d = L[lang] || L.en;
  const map = (d && d.cats) || {};
  return (proj.cats || []).map(id => map[id] || id);
}

/* The testimonial now lives as a block inside proj.content */
function projectTestimonial(lang, proj) {
  const block = (proj.content || []).find(b => b.type === 'testimonial');
  if (!block) return null;
  const td = block[lang] || block.en || {};
  return { name: block.name || '', role: td.role || '', quote: td.quote || '' };
}

/* ---- Per-route meta description (falls back to hero sub) ---- */
function metaDescription(lang, routeKey, slug) {
  const d = L[lang] || L.en;
  if (routeKey === 'work' && slug) {
    const pd = projectData(lang, slug);
    if (pd) {
      // Build from project title + scope/industry + description (real, visible text)
      const loc = pd.proj.location ? ` ${stripTags(pd.proj.location)}` : '';
      return stripTags(`${pd.p.title}${loc} — ${pd.p.ind}. ${pd.p.desc}`);
    }
  }
  switch (routeKey) {
    case 'services': return stripTags(d.svc.text);
    case 'work':     return stripTags(d.wrk.text);
    case 'my-fonts': return stripTags(d.fonts.text);
    case 'about':    return stripTags(d.abt.sub) + ' ' + stripTags(d.abt.bio);
    case 'contact':  return stripTags(d.contact.intro);
    default:         return stripTags(d.hero.sub); // home + fallback
  }
}

/* ---- JSON-LD: Person + WebSite (rendered on every page) ---- */
function jsonLd(lang, routeKey, slug) {
  const d = L[lang] || L.en;

  // Real, publicly linked profiles (also in the site footer) — valid for sameAs
  const SAME_AS = [
    'https://www.linkedin.com/in/achim-benzel-9a1890279/',
    'https://instagram.com/achimbenzel',
    'https://behance.net/achimbenzel',
    'https://pinterest.com/achimbenzel/_created/'
  ];

  // Derive skills/services from the existing translated service data
  const knowsAbout = (d.svc && d.svc.svcs) ? d.svc.svcs.map(s => s.t) : [];

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: BRAND,
    url: SITE,
    jobTitle: stripTags(d.hero.title),
    description: stripTags(d.hero.sub),
    email: 'info@achimbenzel.com',
    knowsLanguage: ['de', 'en'],
    knowsAbout: knowsAbout,
    sameAs: SAME_AS
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE,
    inLanguage: lang,
    author: { '@type': 'Person', name: BRAND }
  };

  const blocks = [person, website];

  // ProfessionalService block on home + services (where offerings are shown)
  if (routeKey === 'home' || routeKey === 'services') {
    const offers = (d.svc && d.svc.svcs)
      ? d.svc.svcs.map(s => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.t, description: stripTags(s.d) }
        }))
      : [];
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Design by Achim Benzel',
      url: SITE,
      image: `${SITE}/Assets/og-image.jpg`,
      founder: { '@type': 'Person', name: BRAND },
      areaServed: 'Europe',
      availableLanguage: ['de', 'en'],
      sameAs: SAME_AS,
      makesOffer: offers
    });
  }

  // FAQPage block ONLY where the FAQ content is actually visible (home page).
  // Built from the real translated FAQ items — no fabricated content.
  if (routeKey === 'home' && d.faq && Array.isArray(d.faq.items)) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.faq.items.map(it => ({
        '@type': 'Question',
        name: stripTags(it.q),
        acceptedAnswer: { '@type': 'Answer', text: stripTags(it.a) }
      }))
    });
  }

  // CreativeWork schema for a project detail page (built from real project data)
  if (routeKey === 'work' && slug) {
    const pd = projectData(lang, slug);
    if (pd) {
      const { proj, p } = pd;
      const cats = categoryLabels(lang, proj);
      const cw = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: stripTags(p.title),
        creator: { '@type': 'Person', name: BRAND, url: SITE },
        about: stripTags(p.ind),
        dateCreated: stripTags(proj.yr),
        inLanguage: lang,
        url: `${SITE}/${lang}/work/${slug}`,
        description: stripTags(p.desc),
        keywords: [...new Set(
          cats.concat([p.ind], String(p.scope || '').split(','), p.tags || [])
              .map(stripTags).filter(Boolean)
        )].join(', ')
      };
      if (cats.length) cw.genre = cats[0];
      if (proj.thumb) cw.image = `${SITE}${proj.thumb}`;
      if (proj.sw && proj.sw.length) {
        cw.tool = proj.sw.map(sw => ({ '@type': 'SoftwareApplication', name: stripTags(sw.name) }));
      }
      // Client as the organisation the work was made for; include location if present
      const org = { '@type': 'Organization', name: stripTags(proj.cl) };
      if (proj.location) {
        org.address = { '@type': 'PostalAddress', addressLocality: stripTags(proj.location) };
      }
      cw.audience = org;
      // Testimonial → Review (real, attributed quote)
      const testi = projectTestimonial(lang, proj);
      if (testi && testi.quote) {
        cw.review = {
          '@type': 'Review',
          reviewBody: stripTags(testi.quote),
          author: { '@type': 'Person', name: stripTags(testi.name) }
        };
      }
      blocks.push(cw);
    }
  }

  return blocks
    .map(b => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join('\n');
}

/* ---- <head> meta block ---- */
function metaTags(lang, routeKey, pageTitle, pathAfterLang, slug) {
  const desc = metaDescription(lang, routeKey, slug);
  const ogLocale = lang === 'de' ? 'de_DE' : 'en_US';
  const canonical = `${SITE}/${lang}${pathAfterLang}`;
  let ogImage = `${SITE}/Assets/og-image.jpg`; // default 1200x630 share image
  let titleText = pageTitle;
  // Project pages: use the project name + its hero image as preview
  if (routeKey === 'work' && slug) {
    const pd = projectData(lang, slug);
    if (pd) {
      titleText = stripTags(pd.p.title);
      if (pd.proj.thumb) ogImage = `${SITE}${pd.proj.thumb}`;
    }
  }
  const fullTitle = `${titleText} — ${BRAND}`;
  return `<meta name="description" content="${attr(desc)}"/>
<link rel="canonical" href="${canonical}"/>
<meta name="author" content="${BRAND}"/>
<meta name="robots" content="index,follow"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="${BRAND}"/>
<meta property="og:locale" content="${ogLocale}"/>
<meta property="og:title" content="${attr(fullTitle)}"/>
<meta property="og:description" content="${attr(desc)}"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:image" content="${ogImage}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${attr(fullTitle)}"/>
<meta name="twitter:description" content="${attr(desc)}"/>
<meta name="twitter:image" content="${ogImage}"/>`;
}

/* ---- Real, crawlable content injected into #app ----
   This is a semantic, lightweight representation of each page's core
   copy. The client JS replaces #app on load (hydration), so this is
   invisible to human visitors but fully readable by crawlers/AI.   */
function appContent(lang, routeKey, slug) {
  const d = L[lang] || L.en;
  /* Mirrors the client nav — the type library is reached from the work list,
     not from a nav tab of its own. */
  const nav = `<nav aria-label="Main"><a href="/${lang}/services">${d.nav.svc}</a> <a href="/${lang}/work">${d.nav.wrk}</a> <a href="/${lang}/about">${d.nav.abt}</a> <a href="/${lang}/contact">${d.nav.contact}</a></nav>`;

  // Project detail page: render the real, visible project copy
  if (routeKey === 'work' && slug) {
    const pd = projectData(lang, slug);
    if (pd) {
      const { proj, p } = pd;
      const pt = d.prj || {};
      const loc = proj.location ? ` — ${stripTags(proj.location)}` : '';
      let main = `<h1>${stripTags(p.title)}${loc}</h1>`;
      const metaBits = [
        [pt.cl || 'Client', proj.cl],
        [pt.yr || 'Year', proj.yr],
        [pt.sc || 'Scope', p.scope],
        [pt.ind || 'Industry', p.ind]
      ].filter(([, v]) => v).map(([l, v]) => `${l}: ${stripTags(v)}`);
      if (metaBits.length) main += `<p>${metaBits.join(' · ')}</p>`;
      const cats = categoryLabels(lang, proj);
      if (cats.length) main += `<p>${pt.cat || 'Category'}: ${cats.map(stripTags).join(', ')}</p>`;
      main += `<p>${stripTags(p.desc)}</p>`;
      // Text blocks in proj.content hold the real on-page copy
      (proj.content || []).forEach(b => {
        if (b.type !== 'text') return;
        const bd = b[lang] || b.en;
        if (!bd || !(bd.headline || bd.body)) return;
        const head = [bd.eyebrow, bd.headline].filter(Boolean).map(stripTags).join(' — ');
        main += `<section>${head ? `<h2>${head}</h2>` : ''}${bd.body ? `<p>${stripTags(bd.body)}</p>` : ''}</section>`;
      });
      if (proj.sw && proj.sw.length) {
        main += `<p>${pt.sw || 'Software'}: ${proj.sw.map(sw => stripTags(sw.name)).join(', ')}</p>`;
      }
      const testi = projectTestimonial(lang, proj);
      if (testi && testi.quote) {
        main += `<blockquote>${stripTags(testi.quote)} — ${stripTags(testi.name)}, ${stripTags(testi.role)}</blockquote>`;
      }
      const footer = `<footer><p>${d.ftr ? d.ftr.copy : '© 2026 Design by Achim Benzel.'}</p></footer>`;
      return nav + '<main>' + main + '</main>' + footer;
    }
  }

  let main = '';
  switch (routeKey) {
    case 'services': {
      const s = d.svc;
      main = `<h1>${stripTags(s.title)}</h1><p>${stripTags(s.text)}</p>` +
        s.svcs.map(x => `<section><h2>${x.t}</h2><p>${x.d}</p></section>`).join('') +
        s.blocks.filter(b => b.type === 'center')
          .map(b => `<section><h2>${b.h}</h2><p>${b.p}</p></section>`).join('');
      break;
    }
    case 'work': {
      // Work overview: list all projects with links so crawlers find detail pages
      let list = Object.keys(P).map(s => {
        const pr = P[s][lang] || P[s].en;
        return `<li><a href="/${lang}/work/${s}">${stripTags(pr.title)}</a> — ${stripTags(pr.ind)}</li>`;
      }).join('');
      // The type library is listed as a project but lives on its own route
      const fc = (d.fonts && d.fonts.card) || {};
      list += `<li><a href="/${lang}/my-fonts">${stripTags(fc.title || d.fonts.label)}</a> — ${stripTags(fc.ind || '')}</li>`;
      main = `<h1>${stripTags(d.wrk.title)}</h1><p>${stripTags(d.wrk.text)}</p><ul>${list}</ul>`;
      break;
    }
    case 'my-fonts':
      main = `<h1>${stripTags(d.fonts.title)}</h1><p>${d.fonts.text}</p>`;
      break;
    case 'about': {
      const a = d.abt;
      main = `<h1>${stripTags(a.title)}</h1><p>${a.sub}</p>` +
        `<p><strong>${a.name}</strong> — ${a.role}</p><p>${a.bio}</p>` +
        a.toggles.map(tg => {
          if (tg.type === 'text') return `<section><h2>${tg.q}</h2><p>${tg.body}</p></section>`;
          if (tg.type === 'journey') return `<section><h2>${tg.q}</h2>` +
            tg.items.map(i => `<p><strong>${i.year} — ${i.label}:</strong> ${i.text}</p>`).join('') + '</section>';
          if (tg.type === 'interests') return `<section><h2>${tg.q}</h2>` +
            tg.items.map(i => `<p><strong>${i.label}:</strong> ${i.text}</p>`).join('') + '</section>';
          return '';
        }).join('');
      break;
    }
    case 'contact':
      main = `<h1>${stripTags(d.contact.title)}</h1><p>${d.contact.intro}</p>` +
        `<p>Email: <a href="mailto:info@achimbenzel.com">info@achimbenzel.com</a></p>`;
      break;
    case 'imprint':
      main = `<h1>${d.imp.title}</h1>${d.imp.h}`;
      break;
    case 'privacy':
      main = `<h1>${d.prv.title}</h1>${d.prv.h}`;
      break;
    case 'tos':
      main = `<h1>${d.tos.title}</h1>${d.tos.h}`;
      break;
    case '404':
      main = `<h1>${stripTags(d.notFound.title)}</h1><p>${d.notFound.sub}</p>`;
      break;
    default: { // home
      const h = d.hero;
      main = `<h1>${stripTags(h.title)}</h1><p>${h.label}</p><p>${h.sub}</p>` +
        `<p><a href="/${lang}/work">${h.cta1}</a> · <a href="/${lang}/services">${h.cta2}</a></p>`;
    }
  }

  const footer = `<footer><p>${d.ftr ? d.ftr.copy : '© 2026 Design by Achim Benzel.'}</p></footer>`;
  return nav + '<main>' + main + '</main>' + footer;
}

module.exports = { metaTags, jsonLd, appContent, metaDescription, projectTitle };
