const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'projects');
const outputFile  = path.join(__dirname, 'projects-data.js');

/* ===== Canonical filter categories =====
   These IDs must match the keys in i18n.js -> cats{}
   Aliases make project.json tolerant of human spelling. */
const CATEGORY_ALIASES = {
  'brand-identity': ['brand identity', 'brandidentity', 'branding', 'brand', 'markenidentitat', 'markenidentität'],
  'motion-design':  ['motion design / animation', 'motion design/animation', 'motion design', 'motion', 'animation', 'motiondesign'],
  '3d-design':      ['3d design', '3d', '3ddesign', '3d-modeling'],
  'web-design':     ['web design', 'webdesign', 'web', 'ui/ux design', 'ui ux design'],
  'type-design':    ['type design', 'typedesign', 'type', 'typografie', 'schriftgestaltung', 'schriften', 'fonts']
};

function normCategory(raw) {
  if (!raw) return null;
  const key = String(raw).trim().toLowerCase();
  if (CATEGORY_ALIASES[key]) return key;
  for (const [id, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.includes(key)) return id;
  }
  console.warn(`  ! Unknown category "${raw}" — will not match any filter`);
  return key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ===== Read project folders ===== */
if (!fs.existsSync(projectsDir)) {
  console.error(`Missing folder: ${projectsDir}`);
  process.exit(1);
}

const folders = fs.readdirSync(projectsDir).filter(f =>
  fs.statSync(path.join(projectsDir, f)).isDirectory() &&
  fs.existsSync(path.join(projectsDir, f, 'project.json'))
);

const projects = {};

folders.forEach(folder => {
  const file = path.join(projectsDir, folder, 'project.json');
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`  ! Invalid JSON in ${folder}/project.json — skipped\n    ${err.message}`);
    return;
  }

  const slug    = json.slug || folder;
  const imgBase = `/projects/${folder}/`;
  const img     = f => (f ? imgBase + f : '');

  /* Flat list of every image on the page, in document order.
     Each content image stores its index here so the lightbox can open at
     the right position without a second pass. */
  const lbImgs = [];
  const pushLb = src => { lbImgs.push(src); return lbImgs.length - 1; };

  /* Localised sub-object with EN fallback for half-translated projects */
  const loc = (obj, l) => (obj && (obj[l] || obj.en || obj.de)) || {};

  /* ===== Content blocks ===== */
  const content = (json.content || []).map(block => {
    switch (block.type) {
      case 'text':
        return {
          type: 'text',
          /* 'center' -> centerblock, anything else -> two-column cblock */
          ...(block.variant ? { variant: block.variant } : {}),
          en: { eyebrow: loc(block, 'en').eyebrow || '', headline: loc(block, 'en').headline || '', body: loc(block, 'en').body || '' },
          de: { eyebrow: loc(block, 'de').eyebrow || '', headline: loc(block, 'de').headline || '', body: loc(block, 'de').body || '' }
        };

      case 'image': {
        const src = img(block.src);
        return { type: 'image', src, li: pushLb(src), alt: { en: loc(block.alt, 'en') || block.alt || '', de: loc(block.alt, 'de') || block.alt || '' } };
      }

      case 'imageGrid':
        return {
          type: 'imageGrid',
          images: (block.images || []).map(im => {
            const src = img(im.src);
            return { src, li: pushLb(src), alt: { en: loc(im.alt, 'en') || im.alt || '', de: loc(im.alt, 'de') || im.alt || '' } };
          })
        };

      case 'testimonial':
        return {
          type: 'testimonial',
          photo: img(block.photo),
          name: block.name || '',
          en: { role: loc(block, 'en').role || '', quote: loc(block, 'en').quote || '' },
          de: { role: loc(block, 'de').role || '', quote: loc(block, 'de').quote || '' }
        };

      default:
        console.warn(`  ! Unknown block type "${block.type}" in ${folder} — skipped`);
        return null;
    }
  }).filter(Boolean);

  /* ===== Categories ===== */
  const rawCats = json.categories || (json.category ? [json.category] : []);
  const cats = rawCats.map(normCategory).filter(Boolean);
  if (!cats.length) console.warn(`  ! ${folder} has no category — hidden from all filters`);

  /* ===== Popularity (0–100), drives the sort order ===== */
  let pop = Number(json.popularity);
  if (!Number.isFinite(pop)) { pop = 0; console.warn(`  ! ${folder} has no popularity — sorted last`); }
  pop = Math.max(0, Math.min(100, pop));

  projects[slug] = {
    slug,
    pop,
    date: { m: json.date?.month ?? 1, y: json.date?.year ?? 0 },
    yr: json.year || String(json.date?.year || ''),
    cl: json.client || '',
    cats,
    thumb: img(json.thumbnail || 'hero.webp'),
    c: json.color || '#1a1a1a',
    theme: json.theme || {},
    sw: (json.software || []).map(s => ({ name: s.name, icon: `/Assets/software/${s.icon}.svg` })),
    en: {
      title: loc(json, 'en').title || json.title || slug,
      type:  loc(json, 'en').projectType || '',
      scope: loc(json, 'en').scope || '',
      ind:   loc(json, 'en').industry || '',
      desc:  loc(json, 'en').description || '',
      tags:  loc(json, 'en').tags || []
    },
    de: {
      title: loc(json, 'de').title || json.title || slug,
      type:  loc(json, 'de').projectType || '',
      scope: loc(json, 'de').scope || '',
      ind:   loc(json, 'de').industry || '',
      desc:  loc(json, 'de').description || '',
      tags:  loc(json, 'de').tags || []
    },
    content,
    imgs: lbImgs,
    ...(json.location ? { location: json.location } : {})
  };
});

/* ===== Sort: popularity desc, then newest first ===== */
const sortedKeys = Object.keys(projects).sort((a, b) => {
  const pa = projects[a], pb = projects[b];
  if (pa.pop !== pb.pop) return pb.pop - pa.pop;
  const da = pa.date.y * 12 + pa.date.m;
  const db = pb.date.y * 12 + pb.date.m;
  return db - da;
});

const sorted = {};
sortedKeys.forEach(k => { sorted[k] = projects[k]; });

/* ===== Write output ===== */
const output = `/* Auto-generated by build-projects.js — do not edit manually */
const P = ${JSON.stringify(sorted, null, 2)};

/* ===== Universal export: works in browser AND Node (SSR). Browser ignores this. ===== */
if (typeof module !== 'undefined' && module.exports) { module.exports = { P: P }; }
`;

fs.writeFileSync(outputFile, output, 'utf8');

console.log(`Built ${sortedKeys.length} projects → projects-data.js`);
console.log(`  Home (top 3): ${sortedKeys.slice(0, 3).join(', ') || 'none'}`);
sortedKeys.forEach(k => console.log(`    ${String(projects[k].pop).padStart(3)}%  ${k}  [${projects[k].cats.join(', ')}]`));
