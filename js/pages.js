/* ===== SERVICE CATEGORIES =====
   Route keys, in nav order. Each has an entry in i18n svcCat{}. */
const SVC_CATS=['branding','motion-design','web-design'];

/* ===== FLOATING ISLAND NAV ===== */
function navH(r){
/* Exit project theme on every render; projPg will re-enter if needed */
if(r&&!r.startsWith('work/')&&!r.startsWith('my-fonts'))exitProjectTheme();
const initCls=isFirstRender?' nav-initial':'';
const n=t('nav');
const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
/* Lucide "sun" (ISC) — mirrors /Assets/Icons/sun.svg. Inlined so `currentColor`
   inherits the button's theme colour; an <img> tag could not. */
const sunSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
/* Lucide "moon" (ISC) — mirrors /Assets/Icons/moon.svg */
const moonSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>';
const themeSVG=(theme==='dark'||theme==='darkproject')?sunSVG:moonSVG;
const themeLabel=(theme==='dark'||theme==='darkproject')?'Light':'Dark';
return`<div class="nav-outer${initCls}"><nav class="nav" id="navIsland">
  <div class="nav-top-row">
    <a class="nav-logo" data-cl="Home" href="${routeToPath('home')}" onclick="event.preventDefault();go('home')"><img class="nav-logo-img nav-logo-dark" src="/Assets/Logo/logo_wide_dark.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light" src="/Assets/Logo/logo_wide_light.svg" alt="Achim"/><img class="nav-logo-img nav-logo-dark-project" src="/Assets/Logo/logo_wide_dark_project.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light-project" src="/Assets/Logo/logo_wide_light_project.svg" alt="Achim"/></a>
    <div class="nav-right">
      <button class="nav-toggle-btn desktop-only" onclick="tL()" title="Language">${lang==='en'?'DE':'EN'}</button>
      <button class="nav-toggle-btn desktop-only" onclick="tT()" title="${themeLabel} mode">${themeSVG}</button>
      <button class="ham" id="hamBtn" onclick="tM()"><svg viewBox="0 0 100 100"><path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"/><path class="line line2" d="M 20,50 H 80"/><path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"/></svg></button>
    </div>
  </div>
  <div class="island-menu" id="islandMenu">
    ${svcMenuH()}
    <a class="island-menu-link" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${n.wrk}</a>
    <a class="island-menu-link" href="${routeToPath('about')}" onclick="event.preventDefault();go('about')">${n.abt}</a>
    <a class="island-menu-link" href="${routeToPath('contact')}" onclick="event.preventDefault();go('contact')">${n.contact}</a>
    <div class="island-menu-footer">
      <button class="nav-toggle-btn" onclick="tL()">${lang==='en'?'DE':'EN'}</button>
      <button class="nav-toggle-btn" onclick="tT()">${themeSVG}</button>
    </div>
  </div>
</nav></div>`}

/* ===== SERVICES NAV ITEM + SUBMENU =====
   One markup tree drives both breakpoints: at >=1100px .nav-sub is absolutely
   positioned under the bar (floating secondary header), below that it sits in
   the drawer flow as an accordion. */
function svcMenuH(){
  const n=t('nav'),cats=t('svcCat');
  const chev='<svg class="island-sub-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';
  const links=SVC_CATS.map(k=>`<a class="nav-sub-link" href="${routeToPath(k)}" onclick="event.preventDefault();go('${k}')"><span class="nav-sub-name">${cats[k].label}</span><span class="nav-sub-desc">${cats[k].short}</span></a>`).join('');
  return`<div class="island-menu-item" id="svcMenuItem" onmouseenter="svcSubHover(true)" onmouseleave="svcSubHover(false)">
      <a class="island-menu-link island-menu-link-has-sub" id="svcMenuLink" href="${routeToPath('services')}" aria-haspopup="true" aria-expanded="false" aria-controls="svcSubmenu" onclick="svcMenuClick(event)" onkeydown="svcMenuKey(event)">${n.svc}${chev}</a>
      <div class="nav-sub" id="svcSubmenu" aria-labelledby="svcMenuLink" inert onmouseenter="svcSubHover(true)"><div class="nav-sub-inner">${links}</div></div>
    </div>`;
}

/* Layout mode: the floating bar only exists where the horizontal nav does. */
function svcSubBarMode(){return window.matchMedia('(min-width:1100px)').matches}
/* Hover mode: bar layout AND a pointer that can actually hover. Touch devices
   and narrow windows fall through to the tap-to-toggle accordion instead. */
function svcSubHoverMode(){return svcSubBarMode()&&window.matchMedia('(hover:hover) and (pointer:fine)').matches}

let _svcSubTimer=null;
/* Set while Escape hands focus back to the trigger, so the focusin listener
   below doesn't immediately re-open what the user just dismissed. */
let _svcSubSuppressFocus=false;

function svcSubSet(open){
  const item=document.getElementById('svcMenuItem'),link=document.getElementById('svcMenuLink');
  if(!item||!link)return;
  clearTimeout(_svcSubTimer);_svcSubTimer=null;
  item.classList.toggle('sub-open',open);
  link.setAttribute('aria-expanded',open?'true':'false');
  /* The closed panel fades out over 300ms before visibility:hidden lands, so
     without this its links stay tabbable for a moment after Escape. `inert`
     drops them from the tab order and the a11y tree immediately, and still
     lets the fade play out. */
  const sub=document.getElementById('svcSubmenu');
  if(!sub)return;
  if(open)sub.removeAttribute('inert');else sub.setAttribute('inert','');

  if(svcSubBarMode()){
    /* Flyout sizes itself; drop any inline height left over from drawer mode
       (e.g. the window was resized across the breakpoint while expanded). */
    sub.style.height='';
    return;
  }

  /* Drawer mode: the row and the island have to grow as one movement, so the
     submenu gets an explicit target height sharing the island's duration and
     easing. The island is measured with the submenu's TARGET height — reading
     it mid-transition would otherwise lock in the half-animated value. */
  const inner=sub.querySelector('.nav-sub-inner');
  const target=open?inner.getBoundingClientRect().height:0;
  const delta=target-sub.getBoundingClientRect().height;
  const island=document.getElementById('navIsland');
  if(island&&island.classList.contains('island-open'))lbMeasureIsland(island,delta);
  sub.style.height=target+'px';
}
function svcSubClose(){svcSubSet(false)}
function svcSubIsOpen(){const i=document.getElementById('svcMenuItem');return !!(i&&i.classList.contains('sub-open'))}

/* The panel is a DOM child of the item, so moving the cursor from the link into
   the bar never fires mouseleave. The transparent bridge on .nav-sub keeps the
   two boxes touching across the visual gap; the delay only catches fast exits. */
function svcSubHover(entering){
  if(!svcSubHoverMode())return;
  clearTimeout(_svcSubTimer);
  if(entering)svcSubSet(true);
  else _svcSubTimer=setTimeout(svcSubClose,200);
}

/* Crossing the layout breakpoint swaps the submenu between an absolutely
   positioned panel and an in-flow accordion — the inline height belongs only to
   the latter. Re-syncing here also keeps an expanded drawer correct when the
   viewport is resized (the links rewrap, so the target height changes).
   Registered before router.js's resize handler, so the island is re-measured
   after the submenu has its new height. */
window.addEventListener('resize',()=>{
  const sub=document.getElementById('svcSubmenu');
  if(!sub)return;
  if(svcSubBarMode()){sub.style.height='';return}
  if(!svcSubIsOpen()){sub.style.height='0px';return}
  const inner=sub.querySelector('.nav-sub-inner');
  if(inner)sub.style.height=inner.getBoundingClientRect().height+'px';
});

/* Opening on focus keeps the panel reachable with Tab alone. Delegated from the
   document because focusin bubbles — no per-render wiring, and it survives the
   nav being re-rendered on every route change. */
document.addEventListener('focusin',e=>{
  const item=document.getElementById('svcMenuItem');
  if(!item||!svcSubBarMode())return;
  if(item.contains(e.target)){if(!_svcSubSuppressFocus)svcSubSet(true)}
  else if(svcSubIsOpen())svcSubClose();
});

function svcMenuClick(e){
  e.preventDefault();
  /* With hover available the item stays a plain link to the overview — the
     flyout has already opened on hover. Otherwise the tap toggles the
     accordion instead of navigating away. */
  if(svcSubHoverMode()){svcSubClose();go('services');return}
  svcSubSet(!svcSubIsOpen());
}

function svcMenuKey(e){
  if(e.key==='ArrowDown'||e.key===' '||e.key==='Spacebar'){
    e.preventDefault();
    svcSubSet(true);
    const first=document.querySelector('#svcSubmenu .nav-sub-link');
    if(first)requestAnimationFrame(()=>first.focus());
  }else if(e.key==='Escape'){
    svcSubClose();
  }
}

/* ===== FAQ ACCORDION ===== */
function faqHtml(){
  const f=t('faq');
  const plusSVG='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>';
  const heroGraphicSVG='';
  const faqImgSrc=(theme==='dark'||theme==='darkproject')?'/Assets/images/faq_dark.webp':'/Assets/images/faq.webp';
  return`<section class="faq-section"><div class="reveal">
    <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${f.title}</h2>
    <div class="faq-layout">
      <div class="faq-hero">
        <img src="${faqImgSrc}" alt="FAQ" class="faq-hero-img"/>
      </div>
      <div class="faq-list">${f.items.map((item,i)=>`<div class="faq-item" id="faq${i}"><button class="faq-question" onclick="toggleFaq(${i})">${item.q} ${plusSVG}</button><div class="faq-answer"><div class="faq-answer-inner">${item.a}</div></div></div>`).join('')}</div>
    </div>
  </div></section>`;
}
function toggleFaq(i){
  const item=document.getElementById('faq'+i);
  if(!item)return;
  item.classList.toggle('open');
}

/* ===== HOME PAGE ===== */
function homePg(){
  const h=t('hero'),w=t('wrk'),keys=allWorkKeys().slice(0,3);
  const arrowSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  return`<section class="hero-rickroll">
    <canvas id="heroShader" class="hero-shader-canvas" aria-hidden="true"></canvas>
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=" onload="if(window._startHeroShader)window._startHeroShader()" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none" alt=""/>
    <div class="hero-rickroll-inner">
      <div class="hero-rickroll-content">
        <h1 class="hero-rickroll-title" data-anim="chars" data-anim-stagger="25" data-anim-delay="450">${h.title}</h1>
        <p class="hero-rickroll-sub" data-anim="words" data-anim-stagger="20" data-anim-delay="600">${h.sub}</p>
        <div class="hero-rickroll-ctas" data-anim="fade" data-anim-delay="800">
          <a class="hero-cta-primary" data-cl="${lang==='en'?'View':'Ansehen'}" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${h.cta1} ${arrowSVG}</a>
          <a class="hero-cta-secondary" data-cl="${lang==='en'?'Process':'Prozess'}" href="${routeToPath('services')}" onclick="event.preventDefault();go('services')">${h.cta2} ${arrowSVG}</a>
        </div>
      </div>
      <div class="hero-rickroll-3d">
        <div class="hero-3d-container" id="hero3dContainer"></div>
      </div>
    </div>
    <div class="hero-rickroll-scroll-hint" data-anim="fade" data-anim-delay="1000">
      <span>Scroll Down</span>
      <div class="scroll-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg></div>
    </div>
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=" onload="if(window._startHero3D)window._startHero3D()" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none" alt=""/>
  </section>
  <section class="hero-accent reveal"><div class="hero-accent-inner">
    <span class="hero-accent-text">Branding</span><span class="hero-accent-dot">·</span>
    <span class="hero-accent-text">Motion</span><span class="hero-accent-dot">·</span>
    <span class="hero-accent-text">${lang==='en'?'More':'Mehr'}</span>
  </div></section>
  <section class="story-section"><div class="reveal"><p class="story-text" data-anim="words" data-anim-stagger="18" data-anim-duration="500">${
    lang==='en'
      ?'As an independent designer, I build identities with <em>substance</em>. I connect strategy and design, bridging intuitive ideas and well-considered systems. The result: brands that are clearly positioned and built for <em>lasting impact</em>.'
      :'Als freiberuflicher Designer entwickle ich Identitäten mit <em>Substanz</em>. Ich verbinde Strategie und Gestaltung, zwischen intuitiven Ideen und durchdachten Systemen. So entstehen Marken, die klar positioniert sind und <em>nachhaltig wirken</em>.'
  }</p></div></section>
  <section class="section"><div class="reveal">
    <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2>
    <div class="pgrid">${keys.map(wC).join('')}</div>
    <div class="pgrid-more"><a class="pgrid-more-btn" data-cl="${lang==='en'?'Work':'Projekte'}" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${w.allBtn} ${arrowSVG}</a></div>
  </div></section>
  ${faqHtml()}`
}

/* Category label from i18n (falls back to the raw id) */
function catLabel(id){const c=t('cats');return (c&&c[id])||id||''}

/* ===== PROJECT CARD ===== */
function wC(slug){
  const pr=workEntry(slug);if(!pr)return'';
  const p=pr[lang]||pr.en||{};const w=t('wrk');
  const arrow='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  const thumb=pr.thumb||vg(1600,900,(p.title||slug).split('\u2014')[0].trim(),pr.c);
  const sub=[p.type,p.ind].filter(Boolean).join(' \u00b7 ');
  const tags=(p.tags||[]).slice(0,3);
  /* Entries with their own route (e.g. the type library) link there instead
     of to a /work/<slug> detail page. */
  const route=pr.route||('work/'+slug);
  return`<a class="pcard" data-cats="${(pr.cats||[]).join(' ')}" data-cl="${w.view}" href="${routeToPath(route)}" onclick="event.preventDefault();go('${route}')">`
    +`<div class="pcard-media"><img src="${thumb}" alt="${p.title||slug}" loading="lazy"/></div>`
    +`<div class="pcard-body">`
      +`<div class="pcard-head"><span class="pcard-cat">${catLabel((pr.cats||[])[0])}</span><span class="pcard-year">${pr.yr||''}</span></div>`
      +`<h3 class="pcard-title">${p.title||slug}</h3>`
      +(sub?`<p class="pcard-sub">${sub}</p>`:'')
      +(tags.length?`<div class="pcard-tags">${tags.map(tg=>`<span class="pcard-tag">${tg}</span>`).join('')}</div>`:'')
      +`<span class="pcard-cta">${w.view} ${arrow}</span>`
    +`</div></a>`
}

/* ===== PROJECT DETAIL PAGE ===== */
function projPg(slug){
  const proj=P[slug];
  if(!proj)return'<section class="section" style="padding-top:9rem"><h2>Not found</h2></section>';
  enterProjectTheme();
  const p=proj[lang]||proj.en||{},pt=t('prj'),c=proj.c;
  const th=proj.theme||{};
  const thStyle=[th.bg?`--pdetail-bg:${th.bg}`:'',th.h1?`--pdetail-h1:${th.h1}`:'',th.dt?`--pdetail-dt:${th.dt}`:'',th.p?`--pdetail-p:${th.p}`:'',th.text2?`--pdetail-text2:${th.text2}`:''].filter(Boolean).join(';');

  /* Flat image list for the lightbox — index `li` is baked in at build time */
  const imgJson=JSON.stringify(proj.imgs||[]).replace(/'/g,'&#39;');
  const lb=i=>`onclick="lbOpen(JSON.parse(document.getElementById('pgal').dataset.imgs),${i})"`;

  /* ===== Header meta ===== */
  const metaItems=[[pt.cl,proj.cl],[pt.yr,proj.yr],[pt.sc,p.scope],[pt.ind,p.ind]].filter(([l,v])=>v);
  const metaHtml=metaItems.length
    ?`<dl class="pmeta" data-anim="fade" data-anim-delay="300">${metaItems.map(([l,v])=>`<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>`:'';

  const swHtml=(proj.sw&&proj.sw.length)
    ?`<div class="psw" data-anim="fade" data-anim-delay="380"><div class="psw-label">${pt.sw}</div><div class="psw-list">${proj.sw.map(sw=>`<span class="psw-item"><img src="${sw.icon}" alt="" loading="lazy" onerror="this.remove()"/>${sw.name}</span>`).join('')}</div></div>`:'';

  /* ===== Content blocks ===== */
  let galHtml='',testiHtml='';
  (proj.content||[]).forEach(block=>{
    switch(block.type){
      case 'text':{
        const b=block[lang]||block.en||{};
        const eyebrow=b.eyebrow?`<div class="cblock-eyebrow">${b.eyebrow}</div>`:'';
        if(block.variant==='center'){
          galHtml+=`<div class="reveal"><div class="centerblock">`
            +eyebrow
            +(b.headline?`<h3 data-anim="words" data-anim-stagger="25">${b.headline}</h3>`:'')
            +(b.body?`<p data-anim="lines" data-anim-delay="100">${b.body}</p>`:'')
          +`</div></div>`;
        }else{
          galHtml+=`<div class="reveal"><div class="cblock">`
            +`<div class="cblock-label">${eyebrow}<span data-anim="words" data-anim-stagger="25">${b.headline||''}</span></div>`
            +`<div class="cblock-body">${b.body?`<p data-anim="lines" data-anim-delay="100">${b.body}</p>`:''}</div>`
          +`</div></div>`;
        }
        break;}
      case 'image':{
        const alt=(block.alt||{})[lang]||(block.alt||{}).en||'';
        galHtml+=`<div class="reveal"><div class="pgal-frame"><img src="${block.src}" alt="${alt}" loading="lazy" ${lb(block.li)}/></div></div>`;
        break;}
      case 'imageGrid':{
        const imgs=block.images||[];
        galHtml+=`<div class="reveal"><div class="irow" style="--cols:${imgs.length}">`
          +imgs.map(im=>{
            const alt=(im.alt||{})[lang]||(im.alt||{}).en||'';
            return`<div class="pgal-frame"><img src="${im.src}" alt="${alt}" loading="lazy" ${lb(im.li)}/></div>`;
          }).join('')
          +`</div></div>`;
        break;}
      case 'testimonial':{
        const td=block[lang]||block.en||{};
        const photo=block.photo||vg(64,64,'',c);
        testiHtml+=`<div class="ptestimonial"><div class="ptesti-inner">`
          +`<img class="ptesti-photo" src="${photo}" alt="${block.name||''}" loading="lazy"/>`
          +`<div class="ptesti-content">`
            +`<div class="ptesti-label">${pt.testimonial}</div>`
            +`<div class="ptesti-name">${block.name||''}</div>`
            +(td.role?`<div class="ptesti-role">${td.role}</div>`:'')
            +(td.quote?`<p class="ptesti-quote">\u201c${td.quote}\u201d</p>`:'')
          +`</div></div></div>`;
        break;}
    }
  });

  return`<div class="pdetail"${thStyle?' style="'+thStyle+'"':''}>`
    +`<button class="pback" onclick="history.back()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ${pt.back}</button>`
    +`<div class="pheader"><h1 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${p.title||slug}</h1>${metaHtml}${swHtml}</div>`
    +(p.desc?`<p class="pdesc" data-anim="words" data-anim-stagger="18" data-anim-delay="200">${p.desc}</p>`:'')
    +`<div class="pgal" id="pgal" data-imgs='${imgJson}'>${galHtml}</div>`
    +testiHtml
  +`</div>`
}

function abtPg(){const a=t('abt');
const plusSVG='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>';
const lucideIcons={
  mountain:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="m4.14 15.08 2.36-2.36a1 1 0 0 1 1.41 0l1.18 1.18"/></svg>',
  gamepad:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>',
  type:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>',
  wrench:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  tea:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>'
};

function renderToggleContent(item){
  if(item.type==='journey'){
    return '<div class="abt-journey">'+item.items.map(s=>'<div class="abt-journey-step"><div class="abt-journey-marker"><span class="abt-journey-year">'+s.year+'</span><span class="abt-journey-dot"></span></div><div class="abt-journey-content"><span class="abt-journey-label">'+s.label+'</span><p class="abt-journey-text">'+s.text+'</p></div></div>').join('')+'</div>';
  }
  if(item.type==='interests'){
    return '<div class="abt-interests">'+item.items.map(s=>'<div class="abt-interest-card"><div class="abt-interest-icon">'+(lucideIcons[s.icon]||'')+'</div><div class="abt-interest-body"><span class="abt-interest-label">'+s.label+'</span><p class="abt-interest-text">'+s.text+'</p></div></div>').join('')+'</div>';
  }
  return '<div class="abt-toggle-text">'+item.body+'</div>';
}

return`<div class="abt-page">

  <section class="abt-hero-section"><div class="reveal">
    <h2 class="hw abt-headline" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${a.title}</h2>
  </div></section>

  <section class="abt-intro-section"><div class="reveal">
    <div class="abt-intro-bar">
      <div class="abt-portrait-small">
        <img src="/Assets/images/portrait.webp" alt="Achim — Portrait" onerror="this.style.display='none';this.parentElement.classList.add('abt-portrait-ph')"/>
        <span class="abt-portrait-label">Portrait</span>
      </div>
      <div class="abt-intro-info">
        <span class="abt-name">${a.name}</span>
        <span class="abt-role">${a.role}</span>
        <p class="abt-bio">${a.bio}</p>
      </div>
    </div>
  </div></section>

  <section class="abt-toggles-section"><div class="reveal">
    <div class="abt-toggles">
      ${a.toggles.map((item,i)=>`<div class="abt-toggle-item" id="abtToggle${i}"><button class="abt-toggle-question" onclick="toggleAbt(${i})">${item.q} ${plusSVG}</button><div class="abt-toggle-answer"><div class="abt-toggle-answer-inner">${renderToggleContent(item)}</div></div></div>`).join('')}
    </div>
  </div></section>

</div>
`}

function toggleAbt(i){
  const item=document.getElementById('abtToggle'+i);
  if(!item)return;
  item.classList.toggle('open');
}


/* Legal pages (imprint / privacy / ToS) render without any text animation —
   the copy has to be readable the moment the page opens. */
function legPg(type){const d=t(type);
/* Parse h2 headings from the raw HTML to build navigation */
const headings=[];
const contentHtml=d.h.replace(/<h2>(.*?)<\/h2>/g,(match,title)=>{
  const id='lsec-'+headings.length;
  headings.push({id,title});
  return`<h2 id="${id}">${title}</h2>`;
});
const navLabel=lang==='en'?'Navigate to':'Navigation';
const navHtml=headings.length?`<nav class="lpage-nav"><div class="lpage-nav-label">${navLabel}</div>${headings.map(h=>`<a class="lpage-nav-link" href="#${h.id}" onclick="event.preventDefault();scrollToLegalSection('${h.id}')">${h.title}</a>`).join('')}</nav>`:'';
return`<div class="lpage lpage-with-nav"><button class="pback" onclick="history.back()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ${lang==='en'?'Back':'Zurück'}</button><h1>${d.title}</h1><div class="lpage-layout">${navHtml}<div class="lpage-content">${contentHtml}</div></div></div>`}

/* TOS — now served from i18n like imp/prv */
function tosPg(){return legPg('tos')}

/* ===== FONTS DATA ===== */
/* FONTS array is loaded from fonts-data.js (generated by build-fonts.js) */

/* Category chooser shown on the /services overview — same three destinations
   as the nav submenu, so the split is reachable from the page too. */
function svcCatLinksH(){
  const s=t('svc'),cats=t('svcCat');
  const arrow='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  return`<div class="reveal"><div class="svc-cats-block">`
    +`<div class="wbar-label">${s.catsLabel}</div>`
    +`<div class="svc-cats">${SVC_CATS.map(k=>`<a class="svc-cat-card" href="${routeToPath(k)}" onclick="event.preventDefault();go('${k}')"><span class="svc-cat-name">${cats[k].label} ${arrow}</span><span class="svc-cat-text">${cats[k].short}</span></a>`).join('')}</div>`
  +`</div></div>`;
}

/* ===== SERVICE CATEGORY PAGE (/branding, /motion-design, /web-design) =====
   Built from the same components as the /services overview: .services-grid
   cards, full-width image + .centerblock pairs, and the project grid filtered
   to the category's cats{} id. */
function svcCatPg(key){
  const cats=t('svcCat')||{};const c=cats[key];
  if(!c)return notFoundPg();
  const s=t('svc'),w=t('wrk');
  const _dk=(theme==='dark'||theme==='darkproject')?'_dark':'';
  const arrowSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  const backSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';

  const cards=(c.svcs||[]).map((v,i)=>`<div class="scard" data-anim="fade" data-anim-delay="${150+i*120}"><div class="num" data-anim="mask" data-anim-delay="${200+i*120}">0${i+1}</div><h3 data-anim="words" data-anim-stagger="25" data-anim-delay="${250+i*120}">${v.t}</h3><p data-anim="words" data-anim-stagger="15" data-anim-delay="${300+i*120}">${v.d}</p><div class="stags">${(v.tags||[]).map(tg=>`<span class="stag">${tg}</span>`).join('')}</div></div>`).join('');

  const blocks=(c.blocks||[]).map(b=>`<div class="reveal"><div class="fullimg fullimg-nobg"><img src="/Assets/images/services${b.img}${_dk}.webp" alt="${b.h}"/></div><div class="centerblock"><h3 data-anim="words" data-anim-stagger="25">${b.h}</h3><p data-anim="lines" data-anim-delay="100">${b.p}</p></div></div>`).join('');

  /* Related work — reuses the project cards and the category ids from cats{} */
  const rel=c.work?allWorkKeys().filter(k=>(workEntry(k).cats||[]).includes(c.work)):[];
  const relHtml=rel.length?`<div class="reveal">`
    +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2>`
    +`<div class="pgrid">${rel.map(wC).join('')}</div>`
    +`<div class="pgrid-more"><a class="pgrid-more-btn" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${w.allBtn} ${arrowSVG}</a></div>`
  +`</div>`:'';

  /* The back button sits in its own <div> so it picks up the same inner rail as
     the .reveal blocks — from 1920px up .section drops its horizontal padding
     and hands it to `.section > .reveal, .section > div`, which a bare <button>
     would miss and end up flush against the viewport edge. */
  return`<section class="section svc-cat-page" style="padding-top:9rem">`
    +`<div class="svc-cat-back"><button class="pback" onclick="go('services')">${backSVG} ${s.label}</button></div>`
    +`<div class="reveal">`
      +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${c.title}</h2>`
      +`<p class="section-text" data-anim="words" data-anim-stagger="20">${c.text}</p>`
      +`<div class="services-grid">${cards}</div>`
    +`</div>`
    +blocks
    +relHtml
  +`</section>`;
}

function servicesPg(){const s=t('svc');
let bhtml='';let _svcImgIdx=0;
if(s.blocks){const _blocks=s.blocks;for(let _bi=0;_bi<_blocks.length;_bi++){const b=_blocks[_bi];
  if(b.type==='img'){_svcImgIdx++;const _dk=(theme==='dark'||theme==='darkproject')?'_dark':'';const nextB=_blocks[_bi+1];if(nextB&&(nextB.type==='center'||nextB.type==='split')){_bi++;if(nextB.type==='center')bhtml+=`<div class="reveal"><div class="fullimg fullimg-nobg"><img src="/Assets/images/services${_svcImgIdx}${_dk}.webp" alt="${b.label}"/></div><div class="centerblock"><h3 data-anim="words" data-anim-stagger="25">${nextB.h}</h3><p data-anim="lines" data-anim-delay="100">${nextB.p}</p></div></div>`;else bhtml+=`<div class="reveal"><div class="fullimg fullimg-nobg"><img src="/Assets/images/services${_svcImgIdx}${_dk}.webp" alt="${b.label}"/></div><div class="cblock"><div class="cblock-label" data-anim="words" data-anim-stagger="25">${nextB.h}</div><div class="cblock-body"><p data-anim="lines" data-anim-delay="100">${nextB.p}</p></div></div></div>`}else{bhtml+=`<div class="reveal"><div class="fullimg fullimg-nobg"><img src="/Assets/images/services${_svcImgIdx}${_dk}.webp" alt="${b.label}"/></div></div>`}}
  else if(b.type==='split')bhtml+=`<div class="reveal"><div class="cblock"><div class="cblock-label" data-anim="words" data-anim-stagger="25">${b.h}</div><div class="cblock-body"><p data-anim="lines" data-anim-delay="100">${b.p}</p></div></div></div>`;
  else if(b.type==='center')bhtml+=`<div class="reveal"><div class="centerblock"><h3 data-anim="words" data-anim-stagger="25">${b.h}</h3><p data-anim="lines" data-anim-delay="100">${b.p}</p></div></div>`;
}}
let toshtml='';
return`<section class="section" style="padding-top:9rem"><div class="reveal">
  <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${s.title}</h2>
  <p class="section-text" data-anim="words" data-anim-stagger="20">${s.text}</p>
  <div class="services-grid">${s.svcs.map((v,i)=>`<div class="scard" data-anim="fade" data-anim-delay="${150 + i * 120}"><div class="num" data-anim="mask" data-anim-delay="${200 + i * 120}">0${i+1}</div><h3 data-anim="words" data-anim-stagger="25" data-anim-delay="${250 + i * 120}">${v.t}</h3><p data-anim="words" data-anim-stagger="15" data-anim-delay="${300 + i * 120}">${v.d}</p><div class="stags">${v.tags.map(t=>`<span class="stag">${t}</span>`).join('')}</div></div>`).join('')}</div>
</div>
  ${svcCatLinksH()}
  ${bhtml}

  <div class="reveal">${toshtml}</div>
</section>`}

function fontsPg(){enterProjectTheme();const f=t('fonts');
return`<div class="fonts-gallery"><div class="reveal">
  <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${f.title}</h2>
  <p class="section-text" data-anim="words" data-anim-stagger="20">${f.text}</p>
  <div class="fonts-grid">${FONTS.map(fd=>`<a class="font-card" data-cl="${lang==='en'?'Explore':'Entdecken'}" href="${routeToPath('my-fonts/'+fd.slug)}" onclick="event.preventDefault();go('my-fonts/${fd.slug}')">
    <div class="font-card-header">
      <span class="font-card-name">${fd.name}</span>
      <span class="font-card-meta">${fd.cardLabel||fd.name}</span>
    </div>
    <div class="font-card-preview" style="font-family:'${fd.family}',sans-serif">${fd.preview}</div>
  </a>`).join('')}</div>
</div></div>`}

function fontTesterPg(slug){const fd=FONTS.find(f=>f.slug===slug);if(!fd)return'<section class="section" style="padding-top:9rem"><h2>Font not found</h2></section>';
enterProjectTheme();
const f=t('fonts');
const alignSVGs={
  left:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10H3M21 6H3M21 14H3M17 18H3"/></svg>',
  center:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10H6M21 6H3M21 14H3M18 18H6"/></svg>',
  right:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H7M21 6H3M21 14H3M21 18H7"/></svg>'
};
let versionHtml='';
if(fd.hasItalic){const chevron='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';versionHtml=`<div class="ft-control-group"><div class="ft-control-label"><span>${f.version}</span></div><div class="csel" id="ftVerCsel"><button type="button" class="csel-trigger" onclick="cselToggle(this)">${f.regular} ${chevron}</button><div class="csel-opts"><div class="csel-opt active" onclick="ftCselPick(this,'normal','${f.regular}')">${f.regular}</div><div class="csel-opt" onclick="ftCselPick(this,'italic','${f.italic}')">${f.italic}</div></div></div></div><div class="ft-controls-divider"></div>`}
return`<div class="font-tester"><a class="pback" href="${routeToPath('my-fonts')}" onclick="event.preventDefault();go('my-fonts')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ${f.back}</a>
  <div class="ft-header"><h1 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${fd.name}</h1></div>
  <div class="ft-layout">
    <div class="ft-controls">
      ${versionHtml}
      <div class="ft-control-group"><div class="ft-control-label"><span>${f.size}</span><span class="ft-control-value" id="ftSizeVal">64px</span></div><input type="range" class="ft-slider" id="ftSize" min="12" max="200" value="64" oninput="updateFontPreview()"/></div>
      <div class="ft-controls-divider"></div>
      <div class="ft-control-group"><div class="ft-control-label"><span>${f.spacing}</span><span class="ft-control-value" id="ftSpacingVal">0%</span></div><input type="range" class="ft-slider" id="ftSpacing" min="-10" max="30" value="0" oninput="updateFontPreview()"/></div>
      <div class="ft-controls-divider"></div>
      <div class="ft-control-group"><div class="ft-control-label"><span>${f.lineH}</span><span class="ft-control-value" id="ftLineVal">1.2</span></div><input type="range" class="ft-slider" id="ftLine" min="80" max="250" value="120" oninput="updateFontPreview()"/></div>
      <div class="ft-controls-divider"></div>
      <div class="ft-control-group"><div class="ft-control-label"><span>${f.align}</span></div><div class="ft-align-btns"><button class="ft-align-btn active" id="ftAlignL" onclick="setFontAlign('left')">${alignSVGs.left}</button><button class="ft-align-btn" id="ftAlignC" onclick="setFontAlign('center')">${alignSVGs.center}</button><button class="ft-align-btn" id="ftAlignR" onclick="setFontAlign('right')">${alignSVGs.right}</button></div></div>
    </div>
    <div class="ft-preview-area"><textarea class="ft-textarea" id="ftTextarea" placeholder="${f.preview}" data-font="${fd.family}" style="font-family:'${fd.family}',sans-serif;font-size:64px;letter-spacing:0em;line-height:1.2;text-align:left">${fd.preview}</textarea></div>
  </div>
  <div class="ft-about">
    <p class="ft-about-desc">${fd.desc[lang]}</p>
    ${fd.downloadable&&fd.downloadFile?`<a class="font-card-dl" href="${fd.downloadFile}" download><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> ${f.getFont}</a>`:''}
  </div>
  <div class="ft-meta">
    <div class="ft-meta-item"><dt>${lang==='en'?'Designer':'Designer'}</dt><dd>${fd.meta.designer}</dd></div>
    <div class="ft-meta-item"><dt>${lang==='en'?'Created':'Erstellt'}</dt><dd>${fd.meta.update}</dd></div>
    <div class="ft-meta-item"><dt>${lang==='en'?'Version':'Version'}</dt><dd>${fd.meta.version}</dd></div>
    <div class="ft-meta-item"><dt>${lang==='en'?'Formats':'Formate'}</dt><dd>${fd.meta.formats}</dd></div>
  </div>
  <div class="ft-bento">${(function(){const imgs=fd.images||[];let html='';if(imgs.length>=5){const bentoLabels=['Specimen','Glyphs','Weights','In Use','Detail'];const bentoClasses=['ft-bento-half','ft-bento-half','ft-bento-third','ft-bento-third','ft-bento-third'];for(let i=0;i<5;i++){const src=imgs[i]||vg(i<2?600:400,i<2?400:300,fd.name+' — '+bentoLabels[i],i%2===0?'#1a1a20':'#181820');html+=`<div class="ft-bento-item ${bentoClasses[i]}"><img src="${src}" alt="${fd.name} ${bentoLabels[i].toLowerCase()}"/></div>`}}else if(imgs.length>=3){const bentoLabels=['Weights','In Use','Detail'];for(let i=0;i<3;i++){const src=imgs[i]||vg(400,300,fd.name+' — '+bentoLabels[i],i%2===0?'#1a1a20':'#181820');html+=`<div class="ft-bento-item ft-bento-third"><img src="${src}" alt="${fd.name} ${bentoLabels[i].toLowerCase()}"/></div>`}}else{for(let i=0;i<imgs.length;i++){html+=`<div class="ft-bento-item ft-bento-third"><img src="${imgs[i]}" alt="${fd.name}"/></div>`}}return html})()}
  </div>
</div>`}

let ftCurrentStyle='normal';
function initFontTester(){ftCurrentStyle='normal';updateFontPreview()}
function updateFontPreview(){
  const ta=document.getElementById('ftTextarea');if(!ta)return;
  const size=document.getElementById('ftSize').value;
  const spacing=document.getElementById('ftSpacing').value;
  const line=document.getElementById('ftLine').value;
  ta.style.fontSize=size+'px';
  ta.style.letterSpacing=(spacing/100)+'em';
  ta.style.lineHeight=(line/100);
  ta.style.fontStyle=ftCurrentStyle;
  document.getElementById('ftSizeVal').textContent=size+'px';
  document.getElementById('ftSpacingVal').textContent=spacing+'%';
  document.getElementById('ftLineVal').textContent=(line/100).toFixed(2);
}
function setFontAlign(a){
  const ta=document.getElementById('ftTextarea');if(!ta)return;
  ta.style.textAlign=a;
  document.querySelectorAll('.ft-align-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('ftAlign'+a.charAt(0).toUpperCase()).classList.add('active');
}
function setFontVersion(style){
  ftCurrentStyle=style;
  const ta=document.getElementById('ftTextarea');if(ta)ta.style.fontStyle=style;
}
function ftCselPick(opt,val,label){
  const csel=opt.closest('.csel');const trigger=csel.querySelector('.csel-trigger');
  const svg=trigger.querySelector('svg').outerHTML;
  trigger.innerHTML=label+' '+svg;
  csel.querySelectorAll('.csel-opt').forEach(o=>o.classList.remove('active'));
  opt.classList.add('active');
  csel.classList.remove('open');
  setFontVersion(val);
}

function svcPg(key){const s=t(key);let bhtml='';let _svcImgIdx=0;if(s.blocks){s.blocks.forEach(b=>{if(b.type==='img'){_svcImgIdx++;const _dk=(theme==='dark'||theme==='darkproject')?'_dark':'';bhtml+=`<div class="reveal"><div class="fullimg fullimg-nobg"><img src="/Assets/images/services${_svcImgIdx}${_dk}.png" alt="${b.label}"/></div></div>`}else if(b.type==='split')bhtml+=`<div class="reveal"><div class="cblock"><div class="cblock-label" data-anim="words" data-anim-stagger="25">${b.h}</div><div class="cblock-body"><p data-anim="lines" data-anim-delay="100">${b.p}</p></div></div></div>`;else if(b.type==='center')bhtml+=`<div class="reveal"><div class="centerblock"><h3 data-anim="words" data-anim-stagger="25">${b.h}</h3><p data-anim="lines" data-anim-delay="100">${b.p}</p></div></div>`})}let toshtml='';return`<section class="section" style="padding-top:9rem"><div class="reveal"><h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${s.title}</h2><p class="section-text" data-anim="words" data-anim-stagger="20">${s.text}</p><div class="services-grid">${s.svcs.map((v,i)=>`<div class="scard"><div class="num">0${i+1}</div><h3>${v.t}</h3><p>${v.d}</p><div class="stags">${v.tags.map(t=>`<span class="stag">${t}</span>`).join('')}</div></div>`).join('')}</div></div>${bhtml}<div class="reveal">${toshtml}</div></section>`}

/* ===== WORK PAGE (filterable) ===== */
const WRK_CATS=['all','brand-identity','motion-design','3d-design','web-design','type-design'];
let wrkCat='all';

/* ===== WORK ITEMS THAT LIVE ON THEIR OWN PAGE =====
   The type library is listed like any other project, but keeps its existing
   /my-fonts route instead of getting a /work/<slug> detail page. Shaped like a
   P entry so it flows through wC() and the filters unchanged. */
function extraWorkEntries(){
  const loc=l=>{
    const c=((L[l]||L.en).fonts||{}).card||{};
    return{title:c.title||'',type:c.type||'',scope:'',ind:c.ind||'',desc:'',tags:c.tags||[]};
  };
  return{
    'my-fonts':{
      slug:'my-fonts',
      route:'my-fonts',
      pop:70,
      date:{m:11,y:2025},
      yr:'2023 – 2025',
      cl:'',
      cats:['type-design'],
      thumb:'/Assets/images/fonthero.webp',
      c:'#5b57b5',
      en:loc('en'),
      de:loc('de')
    }
  };
}

/* A work item by key — a real project, or one of the extra entries above. */
function workEntry(slug){return P[slug]||extraWorkEntries()[slug]}

/* All work keys, ordered like the build output: popularity desc, newest first. */
function allWorkKeys(){
  const extra=extraWorkEntries();
  return Object.keys(P).concat(Object.keys(extra)).sort((a,b)=>{
    const A=P[a]||extra[a],B=P[b]||extra[b];
    if((B.pop||0)!==(A.pop||0))return(B.pop||0)-(A.pop||0);
    return((B.date?.y||0)*12+(B.date?.m||0))-((A.date?.y||0)*12+(A.date?.m||0));
  });
}

function wrkVisible(){
  return allWorkKeys().filter(k=>wrkCat==='all'||(workEntry(k).cats||[]).includes(wrkCat));
}

function renderWrkGrid(){
  const grid=document.getElementById('wgridEl');if(!grid)return;
  const keys=wrkVisible();
  grid.innerHTML=keys.map(wC).join('');
  const empty=document.getElementById('wempty');
  if(empty)empty.hidden=keys.length>0;
}

function setWrkCat(id,btn){
  wrkCat=id;
  document.querySelectorAll('.wfilter').forEach(b=>b.classList.toggle('active',b===btn));
  renderWrkGrid();
}

function wrkPg(){
  wrkCat='all';
  const w=t('wrk');
  const keys=allWorkKeys();
  const filters=WRK_CATS.map(id=>`<button type="button" class="wfilter${id==='all'?' active':''}" onclick="setWrkCat('${id}',this)">${catLabel(id)}</button>`).join('');
  return`<section class="section" style="padding-top:9rem"><div class="reveal">`
    +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2>`
    +`<p class="section-text" data-anim="words" data-anim-stagger="20">${w.text}</p>`
    +`<div class="wbar">`
      +`<div class="wbar-row"><span class="wbar-label">${w.filterLabel}</span><div class="wfilters">${filters}</div></div>`
    +`</div>`
    +`<div class="pgrid" id="wgridEl">${keys.map(wC).join('')}</div>`
    +`<p class="wempty" id="wempty" hidden>${w.empty}</p>`
  +`</div></section>`
}

function cselToggle(btn){
const csel=btn.parentElement;const wasOpen=csel.classList.contains('open');
document.querySelectorAll('.csel.open').forEach(el=>el.classList.remove('open'));
if(!wasOpen)csel.classList.add('open');
}
document.addEventListener('click',e=>{if(!e.target.closest('.csel'))document.querySelectorAll('.csel.open').forEach(el=>el.classList.remove('open'))});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.csel.open').forEach(el=>el.classList.remove('open'))});

/* Public contact address — shown as the alternative to the form */
const CONTACT_MAIL='info@achimbenzel.com';

function contactPg(){const c=t('contact');const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const titleHtml=lang==='en'?'Get in <em>touch</em>':'Kontakt <em>aufnehmen</em>';
const tosAfter=c.tosAfter?' '+c.tosAfter:'';
return`<div class="contact-page"><div class="contact-top"><div class="contact-header-inner"><h1 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${titleHtml}</h1><p class="contact-intro" data-anim="words" data-anim-stagger="20" data-anim-delay="200">${c.intro}</p></div></div><div class="contact-body"><div class="contact-form-wrap"><form class="contact-form" id="contactForm" onsubmit="return handleContact(event)"><div class="cf-group"><label>${c.name} <span class="req">*</span></label><input type="text" name="name" required placeholder="${c.name}"/></div><div class="cf-group"><label>${c.email} <span class="req">*</span></label><input type="email" name="email" required placeholder="${c.email}"/></div><div class="cf-group"><label>${c.message} <span class="req">*</span></label><textarea name="message" required maxlength="5000" placeholder="${c.message}…"></textarea></div><div class="cf-tos-group"><label class="cf-tos-label"><input type="checkbox" name="tos" id="cfTos"/><span class="cf-tos-check"></span><span class="cf-tos-text">${c.tos} <a href="${routeToPath('tos')}" onclick="event.preventDefault();go('tos')">${c.tosLink}</a>${tosAfter}</span></label></div><div class="cf-turnstile" id="cfTurnstile"></div><div class="cf-error" id="cfError"></div><div><button type="submit" class="cf-submit" id="cfSubmitBtn">${c.submit} ${arrowSVG}</button></div><p class="cf-alt">${c.altMail} <a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a></p></form><div class="cf-success" id="cfSuccess"><h3>${c.success}</h3><p>${c.successMsg}</p></div></div></div></div>`}
function handleContact(e){
  e.preventDefault();
  const c=t('contact');
  const errEl=document.getElementById('cfError');
  const btn=document.getElementById('cfSubmitBtn');
  errEl.textContent='';errEl.style.display='none';
  /* ToS check */
  if(!document.getElementById('cfTos').checked){errEl.textContent=c.errTos;errEl.style.display='block';return false}
  /* Turnstile token */
  const token=typeof turnstile!=='undefined'?turnstile.getResponse('#cfTurnstile'):'';
  if(!token){errEl.textContent=c.errTurnstile;errEl.style.display='block';return false}
  /* Collect form data */
  const form=document.getElementById('contactForm');
  const fd=new FormData(form);
  const data={};fd.forEach((v,k)=>{if(k!=='tos')data[k]=v});
  data['cf-turnstile-response']=token;

  /* Disable button and save SVG string for later */
  const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  btn.disabled=true;
  btn.textContent=c.sending;

  /* Send */
  fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
    .then(r=>{if(!r.ok)throw new Error();return r.json()})
    .then(()=>{form.style.display='none';document.getElementById('cfSuccess').style.display='block'})
    .catch(()=>{
      errEl.textContent=c.errSend;
      errEl.style.display='block';
      btn.disabled=false;
      // Hier nutzen wir nun den fest definierten SVG String anstatt outerHTML!
      btn.innerHTML=c.submit+' '+arrowSVG;
      if(typeof turnstile!=='undefined')turnstile.reset('#cfTurnstile');
    })
  return false;
}

/* ===== 404 NOT FOUND PAGE ===== */
function notFoundPg(){const nf=t('notFound');const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
return`<div class="notfound-page"><div class="notfound-inner"><div class="reveal"><div class="notfound-img-wrap"><img class="notfound-img" src="/Assets/images/404.webp" alt="404 — Page not found"/></div><h1 class="hw notfound-title" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${nf.title}</h1><p class="notfound-sub" data-anim="words" data-anim-stagger="20" data-anim-delay="200">${nf.sub}</p><div class="notfound-cta" data-anim="fade" data-anim-delay="400"><a class="fcta notfound-btn" href="${routeToPath('home')}" onclick="event.preventDefault();go('home')">${nf.btn} ${arrowSVG}</a></div></div></div></div>`}

/* ===== FOOTER with letter-animated social links ===== */
function ftrH(r){const f=t('ftr');const ctaHtml=r==='contact'?'':`<a class="fcta" data-cl="${lang==='en'?'Contact':'Kontakt'}" href="${routeToPath('contact')}" onclick="event.preventDefault();go('contact')">${f.cta} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>`;

function makeLetterLink(text, url){
  const letters = letterize(text);
  return `<div class="letter-link"><a href="#" onclick="event.preventDefault();showExt('${url}')"><span class="letter-original">${letters}</span><span class="letter-clone">${letters}</span></a></div>`;
}

return`<footer class="footer"><div class="footer-inner"><div class="ftop"><div><div class="fbrand"><img class="nav-logo-img nav-logo-dark" src="/Assets/Logo/logo_wide_dark.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light" src="/Assets/Logo/logo_wide_light.svg" alt="Achim"/><img class="nav-logo-img nav-logo-dark-project" src="/Assets/Logo/logo_wide_dark_project.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light-project" src="/Assets/Logo/logo_wide_light_project.svg" alt="Achim"/></div><p class="ftag">${f.tag}</p></div>${ctaHtml}</div><div class="fmid"><div class="fsocial">${makeLetterLink('LinkedIn','https://www.linkedin.com/in/achim-benzel-9a1890279/')}${makeLetterLink('Instagram','https://instagram.com/achimbenzel')}${makeLetterLink('Behance','https://behance.net/achimbenzel')}${makeLetterLink('Pinterest','https://pinterest.com/achimbenzel/_created/')}${makeLetterLink('X/Twitter','https://x.com/achimbenzel')}</div></div><div class="fbot"><span>${f.copy}</span><div class="flegal"><a href="${routeToPath('imprint')}" onclick="event.preventDefault();go('imprint')">${f.imp}</a><a href="${routeToPath('privacy')}" onclick="event.preventDefault();go('privacy')">${f.priv}</a><a href="${routeToPath('tos')}" onclick="event.preventDefault();go('tos')">${f.tos}</a></div></div></div></footer>`}

/* External link modal */
let extTarget='';
function showExt(url){extTarget=url;const e=t('ext');document.getElementById('extTitle').textContent=e.title;document.getElementById('extText').textContent=e.text;document.getElementById('extUrl').textContent=url;document.getElementById('extGo').textContent=e.go;document.getElementById('extCancel').textContent=e.cancel;document.getElementById('extOverlay').classList.add('show')}
function hideExt(){document.getElementById('extOverlay').classList.remove('show');extTarget=''}
function goExt(){window.open(extTarget,'_blank','noopener');hideExt()}
function closeExt(e){if(e.target===document.getElementById('extOverlay'))hideExt()}

/* Cookie */
function ckU(){const c=t('ck');document.getElementById('ckt').innerHTML=`${c.t} <a href="${routeToPath('privacy')}" onclick="event.preventDefault();go('privacy')">${c.l}</a>`;document.getElementById('cka').textContent=c.a;document.getElementById('ckd').textContent=c.d}
function showCk(){setTimeout(()=>document.getElementById('ckb').classList.add('show'),1200)}
function hideCk(){document.getElementById('ckb').classList.remove('show');try{localStorage.setItem('ck','1')}catch(e){}}

/* Lightbox */
let lbImages=[],lbIdx=0,lbZoomVal=100;
let lbPanX=0,lbPanY=0,lbDragging=false,lbDragStartX=0,lbDragStartY=0,lbPanStartX=0,lbPanStartY=0;

/* Calculate max pan so image edge aligns with wrapper edge */
function lbPanBounds(){
  const img=document.getElementById('lbImg');
  const wrap=document.querySelector('.lightbox-img-wrap');
  if(!img||!wrap)return{mx:0,my:0};
  const s=lbZoomVal/100;
  const iw=img.naturalWidth,ih=img.naturalHeight;
  const ww=wrap.clientWidth,wh=wrap.clientHeight;
  /* Displayed size of image at 1x (object-fit:contain) */
  const ratioW=ww/iw,ratioH=wh/ih,fit=Math.min(ratioW,ratioH);
  const dispW=iw*fit,dispH=ih*fit;
  /* Scaled size vs wrapper — extra pixels on each side */
  const overflowX=Math.max(0,(dispW*s-ww)/2);
  const overflowY=Math.max(0,(dispH*s-wh)/2);
  /* translate values are in pre-scale space, so divide by s */
  return{mx:overflowX/s,my:overflowY/s};
}

function lbClampPan(){
  const b=lbPanBounds();
  lbPanX=Math.max(-b.mx,Math.min(b.mx,lbPanX));
  lbPanY=Math.max(-b.my,Math.min(b.my,lbPanY));
}

function lbApplyTransform(){
  const img=document.getElementById('lbImg');
  if(!img)return;
  const s=lbZoomVal/100;
  const tx=s>1?lbPanX:0;
  const ty=s>1?lbPanY:0;
  img.style.transform='scale('+s+') translate('+tx+'px,'+ty+'px)';
}

function lbSetZoom(v){
  lbZoomVal=Math.max(100,Math.min(300,v));
  if(lbZoomVal<=100){lbPanX=0;lbPanY=0}
  else{lbClampPan()}
  lbApplyTransform();
  const slider=document.getElementById('lbZoomSlider');
  const pct=document.getElementById('lbZoomPct');
  if(slider)slider.value=lbZoomVal;
  if(pct)pct.textContent=lbZoomVal+'%';
  const wrap=document.querySelector('.lightbox-img-wrap');
  if(wrap){wrap.classList.toggle('lb-zoomed',lbZoomVal>100)}
}

function lbResetPan(){lbPanX=0;lbPanY=0;lbDragging=false}

function lbZoom(dir){lbSetZoom(lbZoomVal+(dir*25))}
function lbZoomTo(v){lbSetZoom(parseInt(v))}

function lbOpen(imgs,idx){
  lbImages=imgs;lbIdx=idx;lbResetPan();lbSetZoom(100);
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lbImg');
  if(!lb||!img)return;
  img.style.opacity='1';img.style.transform='scale(1)';
  img.src=lbImages[lbIdx];
  document.getElementById('lbCounter').textContent=`${lbIdx+1} / ${lbImages.length}`;
  lb.classList.add('show');document.body.style.overflow='hidden';
}

function lbClose(){
  const lb=document.getElementById('lightbox');
  if(lb)lb.classList.remove('show');
  document.body.style.overflow='';lbImages=[];lbResetPan();lbSetZoom(100);
}

function lbNav(dir){
  if(!lbImages.length)return;
  lbIdx=(lbIdx+dir+lbImages.length)%lbImages.length;
  lbResetPan();lbSetZoom(100);
  const img=document.getElementById('lbImg');
  if(!img)return;
  img.style.opacity='0';img.style.transform='scale(.96)';
  setTimeout(()=>{
    img.src=lbImages[lbIdx];
    document.getElementById('lbCounter').textContent=`${lbIdx+1} / ${lbImages.length}`;
    img.style.opacity='1';lbApplyTransform();
  },180);
}

function lbClick(e){if(e.target===document.getElementById('lightbox'))lbClose()}

/* Drag to pan when zoomed */
(function(){
  document.addEventListener('mousedown',e=>{
    if(lbZoomVal<=100)return;
    const wrap=e.target.closest('.lightbox-img-wrap');
    if(!wrap)return;
    e.preventDefault();lbDragging=true;lbDragStartX=e.clientX;lbDragStartY=e.clientY;lbPanStartX=lbPanX;lbPanStartY=lbPanY;
  });
  document.addEventListener('mousemove',e=>{
    if(!lbDragging)return;
    const s=lbZoomVal/100;
    lbPanX=lbPanStartX+(e.clientX-lbDragStartX)/s;
    lbPanY=lbPanStartY+(e.clientY-lbDragStartY)/s;
    lbClampPan();
    lbApplyTransform();
  });
  document.addEventListener('mouseup',()=>{lbDragging=false});

  /* Touch support for mobile drag */
  document.addEventListener('touchstart',e=>{
    if(lbZoomVal<=100)return;
    const wrap=e.target.closest('.lightbox-img-wrap');
    if(!wrap||e.touches.length!==1)return;
    lbDragging=true;lbDragStartX=e.touches[0].clientX;lbDragStartY=e.touches[0].clientY;lbPanStartX=lbPanX;lbPanStartY=lbPanY;
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!lbDragging||e.touches.length!==1)return;
    if(lbZoomVal>100)e.preventDefault();
    const s=lbZoomVal/100;
    lbPanX=lbPanStartX+(e.touches[0].clientX-lbDragStartX)/s;
    lbPanY=lbPanStartY+(e.touches[0].clientY-lbDragStartY)/s;
    lbClampPan();
    lbApplyTransform();
  },{passive:false});
  document.addEventListener('touchend',()=>{lbDragging=false});
})();

document.addEventListener('keydown',e=>{if(!document.getElementById('lightbox').classList.contains('show'))return;if(e.key==='Escape')lbClose();if(e.key==='ArrowRight')lbNav(1);if(e.key==='ArrowLeft')lbNav(-1);if(e.key==='+'||e.key==='=')lbZoom(1);if(e.key==='-')lbZoom(-1)});

/* Legal page nav — scroll to section, clamped to max scroll position (no blank space) */
function scrollToLegalSection(id){
  const el=document.getElementById(id);
  if(!el)return;
  /* Reset any previously injected padding so measurements are clean */
  const content=document.querySelector('.lpage-content');
  if(content)content.style.paddingBottom='';
  requestAnimationFrame(()=>{
    const targetY=el.getBoundingClientRect().top+window.scrollY-100;
    const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
    window.scrollTo({top:Math.min(targetY,maxScroll),behavior:'smooth'});
  });
}

/* Legal page nav — scroll spy for active section highlighting */
let lpageScrollCleanup=null;
function initLpageNav(){
  if(lpageScrollCleanup)lpageScrollCleanup();
  const nav=document.querySelector('.lpage-nav');
  if(!nav)return;
  const links=nav.querySelectorAll('.lpage-nav-link');
  const sections=Array.from(links).map(a=>{
    const id=a.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);
  if(!sections.length)return;
  function onScroll(){
    /* If user has scrolled to (or very near) the bottom, force-highlight the last item */
    const atBottom=window.innerHeight+window.scrollY>=document.body.offsetHeight-2;
    if(atBottom){
      links.forEach(a=>a.classList.remove('active'));
      links[links.length-1].classList.add('active');
      return;
    }
    /* Standard position check with fixed offset matching scroll-to (100px + buffer) */
    const offset=120;
    let active=sections[0];
    for(const sec of sections){
      if(sec.getBoundingClientRect().top<=offset)active=sec;
    }
    links.forEach(a=>{
      const id=a.getAttribute('href').slice(1);
      a.classList.toggle('active',id===active.id);
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
  lpageScrollCleanup=()=>{window.removeEventListener('scroll',onScroll);lpageScrollCleanup=null};
}

function observe(){
  document.querySelectorAll('.reveal:not(.vis)').forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight*0.85&&rect.bottom>0){el.classList.add('vis');return}
    new IntersectionObserver((e,obs)=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');obs.unobserve(x.target)}})},{threshold:0,rootMargin:'0px 0px -30% 0px'}).observe(el);
  });
  document.querySelectorAll('.hw:not(.hw-vis)').forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight*0.85&&rect.bottom>0){el.classList.add('hw-vis');return}
    new IntersectionObserver((e,obs)=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('hw-vis');obs.unobserve(x.target)}})},{threshold:0,rootMargin:'0px 0px -30% 0px'}).observe(el);
  });
  /* Scan for text animations after each page render */
  if(typeof NoirTextAnim!=='undefined') NoirTextAnim.refresh();
  /* Init legal page sidebar scroll spy */
  initLpageNav();
}

/* ===== PROJECT THEME MANAGEMENT ===== */
/* Store the user's base theme preference (dark/light) separately */
let _baseTheme=null;

function enterProjectTheme(){
  /* Save current base theme and switch to its project variant */
  const base=(theme==='dark'||theme==='darkproject')?'dark':'light';
  _baseTheme=base;
  theme=base==='dark'?'darkproject':'lightproject';
  document.body.dataset.theme=theme;
}

function exitProjectTheme(){
  /* Restore the user's base theme */
  if(_baseTheme){theme=_baseTheme;_baseTheme=null}
  else{theme=(theme==='darkproject')?'dark':(theme==='lightproject')?'light':theme}
  document.body.dataset.theme=theme;
}

/* Override tT to handle project themes — set in DOMContentLoaded to ensure it overrides the original */

/* Escape closes the services submenu first, then the island */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(svcSubIsOpen()){
    const link=document.getElementById('svcMenuLink');
    /* Only pull focus back if it was inside the submenu we just closed */
    const refocus=!!(link&&document.activeElement&&link.parentElement.contains(document.activeElement));
    _svcSubSuppressFocus=true;
    svcSubClose();
    if(refocus)link.focus();
    /* Released after the focusin from .focus() has been dispatched */
    setTimeout(()=>{_svcSubSuppressFocus=false},0);
    return;
  }
  if(mob)tM();
});

/* Pointer outside the services item closes the flyout (bar mode only — in the
   drawer the item is collapsed by tapping it again) */
document.addEventListener('click',e=>{
  if(!svcSubBarMode()||!svcSubIsOpen())return;
  if(!e.target.closest('#svcMenuItem'))svcSubClose();
});

document.addEventListener('DOMContentLoaded',()=>{
  /* Override tT after all scripts have loaded */
  window.tT=function(){
    const isProject=theme==='darkproject'||theme==='lightproject';
    if(isProject){
      if(theme==='darkproject'){theme='lightproject';_baseTheme='light'}
      else{theme='darkproject';_baseTheme='dark'}
    }else{
      theme=theme==='dark'?'light':'dark';
    }
    document.body.dataset.theme=theme;
    try{localStorage.setItem('noir-theme',isProject?_baseTheme:theme)}catch(e){}
    render(hr());
  };

  // Restore theme from localStorage if saved
  try{const saved=localStorage.getItem('noir-theme');if(saved)theme=saved;document.body.dataset.theme=theme}catch(e){}
  const r=hr();
  history.replaceState({r},'',routeToPath(r));
  render(r);
  isFirstRender=false;
  try{if(!localStorage.getItem('ck'))showCk()}catch(e){showCk()}
});
