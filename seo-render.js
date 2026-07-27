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
let LG;
try { LG = require('./logos-data.js').LG || {}; } catch (e) { LG = {}; }

const SITE = 'https://achimbenzel.com';
const BRAND = 'Achim Benzel';

/* Strip HTML tags and decode the entities the i18n copy uses, so the result is
   plain text. Meta tags, JSON-LD and titles all want the decoded form; attr()
   re-escapes what actually needs escaping. */
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", '#039': "'" };
function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#0?39);/g, (m, e) => ENTITIES[e] || m)
    .replace(/\s+/g, ' ').trim();
}
/* Escape for safe insertion into an HTML attribute */
function attr(s) {
  return stripTags(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/* ---- Service category helpers ---- */
/* Keys must match SVC_CATS in js/pages.js and SVC_CAT_ROUTES in server.js */
const SVC_CAT_KEYS = ['branding', 'motion-design', 'web-design'];
function svcCat(lang, key) {
  const d = L[lang] || L.en;
  return (d.svcCat || {})[key] || null;
}
function svcCatLabel(lang, key) {
  const c = svcCat(lang, key);
  return c ? stripTags(c.label) : null;
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

/* ---- Logo shop helpers ---- */
function logoData(lang, slug) {
  const lo = LG[slug];
  if (!lo) return null;
  return { lo, l: lo[lang] || lo.en || {} };
}
function logoTitle(lang, slug) {
  const d = logoData(lang, slug);
  return d ? stripTags(d.l.name) : null;
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
  const cat = svcCat(lang, routeKey);
  if (routeKey === 'shop') {
    const ld = slug && logoData(lang, slug);
    if (ld) return stripTags(`${ld.l.name} — ${ld.l.tagline || ld.l.tag || ''} ${ld.l.description || ld.l.desc || ''}`);
    return stripTags((d.logos || {}).text || '');
  }
  if (cat) return stripTags(cat.text);
  switch (routeKey) {
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

  // Derive skills from the three service categories and the services each lists
  const knowsAbout = SVC_CAT_KEYS.flatMap(k => {
    const c = svcCat(lang, k);
    return c ? [stripTags(c.label)].concat((c.svcs || []).map(s => stripTags(s.t))) : [];
  });

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

  // ProfessionalService block on the home page, where the offering is introduced
  if (routeKey === 'home') {
    const offers = SVC_CAT_KEYS.map(k => {
      const c = svcCat(lang, k);
      if (!c) return null;
      return {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: stripTags(c.label),
          description: stripTags(c.short),
          url: `${SITE}/${lang}/${k}`
        }
      };
    }).filter(Boolean);
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

  // Service schema on a category page, built from its real card list
  const cat = svcCat(lang, routeKey);
  if (cat) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: stripTags(cat.title),
      serviceType: stripTags(cat.label),
      description: stripTags(cat.text),
      provider: { '@type': 'Person', name: BRAND, url: SITE },
      areaServed: 'Europe',
      availableLanguage: ['de', 'en'],
      url: `${SITE}/${lang}/${routeKey}`,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: stripTags(cat.label),
        itemListElement: (cat.svcs || []).map(s => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: stripTags(s.t), description: stripTags(s.d) }
        }))
      }
    });
  }

  // FAQPage blocks ONLY where the FAQ is actually visible — the home page and
  // each service category page. Built from the real translated items.
  if (cat && Array.isArray(cat.faq) && cat.faq.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cat.faq.map(it => ({
        '@type': 'Question',
        name: stripTags(it.q),
        acceptedAnswer: { '@type': 'Answer', text: stripTags(it.a) }
      }))
    });
  }
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
  /* Mirrors the client nav — Services is only a heading for its three category
     routes, and the type library is reached from the work list. */
  const svcNav = SVC_CAT_KEYS.map(k => {
    const c = svcCat(lang, k);
    return c ? `<a href="/${lang}/${k}">${stripTags(c.label)}</a> ` : '';
  }).join('');
  const nav = `<nav aria-label="Main">${svcNav}<a href="/${lang}/work">${d.nav.wrk}</a> <a href="/${lang}/about">${d.nav.abt}</a> <a href="/${lang}/contact">${d.nav.contact}</a></nav>`;

  /* Logo shop — the listing and each logo's own page. Prices are placeholders
     so far, which is why they appear as ordinary copy and not as an Offer in
     the JSON-LD: nothing quotable gets published as structured data. */
  if (routeKey === 'shop') {
    const g = d.logos || {};
    if (slug) {
      const ld = logoData(lang, slug);
      if (ld) {
        const items = (ld.l.incl || ld.l.includes || []).map(x => `<li>${stripTags(x)}</li>`).join('');
        return `${nav}<main><a href="/${lang}/shop">${stripTags(g.back || 'Logos')}</a>`
          + `<h1>${stripTags(ld.l.name)}</h1>`
          + (ld.l.tag ? `<p>${stripTags(ld.l.tag)}</p>` : '')
          + (ld.l.desc ? `<p>${stripTags(ld.l.desc)}</p>` : '')
          + `<p>${stripTags(g.price || 'Price')}: ${stripTags(ld.lo.price)}</p>`
          + (items ? `<h2>${stripTags(g.includes || '')}</h2><ul>${items}</ul>` : '')
          + `</main>`;
      }
    }
    const list = Object.keys(LG).map(k => {
      const ld = logoData(lang, k);
      return `<li><a href="/${lang}/shop/${k}">${stripTags(ld.l.name)}</a> — ${stripTags(ld.lo.price)}</li>`;
    }).join('');
    return `${nav}<main><h1>${stripTags(g.title || 'Logos')}</h1><p>${stripTags(g.text || '')}</p><ul>${list}</ul></main>`;
  }

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

  // Service category page: render its real, visible copy
  const catPage = svcCat(lang, routeKey);
  if (catPage) {
    const sp = d.svcPage || {};
    const main = `<h1>${stripTags(catPage.title)}</h1><p>${stripTags(catPage.text)}</p>` +
      (catPage.svcs || []).map(x => `<section><h2>${x.t}</h2><p>${x.d}</p></section>`).join('') +
      `<section><h2>${stripTags(sp.process)}</h2>` +
        (catPage.process || []).map((p, i) => `<h3>${i + 1}. ${p.t}</h3><p>${p.d}</p>`).join('') + '</section>' +
      `<section><h2>${stripTags(sp.deliver)}</h2><ul>` +
        (catPage.deliver || []).map(x => `<li>${x}</li>`).join('') + '</ul></section>' +
      `<section><h2>${stripTags(sp.faq)}</h2>` +
        (catPage.faq || []).map(f => `<h3>${f.q}</h3><p>${f.a}</p>`).join('') + '</section>' +
      `<p><a href="/${lang}/work">${stripTags(d.nav.wrk)}</a></p>`;
    const footer = `<footer><p>${d.ftr ? d.ftr.copy : '© 2026 Design by Achim Benzel.'}</p></footer>`;
    return nav + '<main>' + main + '</main>' + footer;
  }

  let main = '';
  switch (routeKey) {
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
        `<p><a href="/${lang}/work">${h.cta1}</a> · <a href="/${lang}/contact">${h.cta2}</a></p>`;
    }
  }

  const footer = `<footer><p>${d.ftr ? d.ftr.copy : '© 2026 Design by Achim Benzel.'}</p></footer>`;
  return nav + '<main>' + main + '</main>' + footer;
}

module.exports = { metaTags, jsonLd, appContent, metaDescription, projectTitle, logoTitle, svcCatLabel, attr };
