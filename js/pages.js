/* ===== SERVICE CATEGORIES =====
   Route keys, in nav order. Each has an entry in i18n svcCat{}. */
const SVC_CATS=['branding','motion-design','web-design'];

/* Lucide "sun" (ISC) — mirrors /Assets/Icons/sun.svg. Inlined so `currentColor`
   inherits the button's colour; an <img> tag could not. */
const SUN_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
/* Lucide "settings" (ISC) — mirrors /Assets/Icons/settings.svg */
const SETTINGS_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';
/* Lucide "moon" (ISC) — mirrors /Assets/Icons/moon.svg */
const MOON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>';

/* ===== FLOATING ISLAND NAV =====
   The site has no theme switch: everything runs dark apart from a few sections
   that opt into the light palette locally, and the font pages, which open light
   and carry their own toggle in .ft-controls. */
function navH(r){
/* Exit project theme on every render; projPg / the font pages re-enter it */
if(r&&!r.startsWith('work/')&&!r.startsWith('my-fonts'))exitProjectTheme();
const initCls=isFirstRender?' nav-initial':'';
const n=t('nav');
return`<div class="nav-outer${initCls}"><nav class="nav" id="navIsland">
  <div class="nav-top-row">
    <a class="nav-logo" data-cl="Home" href="${routeToPath('home')}" onclick="event.preventDefault();go('home')"><img class="nav-logo-img nav-logo-dark" src="/Assets/Logo/logo_wide_dark.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light" src="/Assets/Logo/logo_wide_light.svg" alt="Achim"/><img class="nav-logo-img nav-logo-dark-project" src="/Assets/Logo/logo_wide_dark_project.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light-project" src="/Assets/Logo/logo_wide_light_project.svg" alt="Achim"/></a>
    <div class="nav-right">
      ${settingsMenuH()}
      <button class="ham" id="hamBtn" onclick="tM()"><svg viewBox="0 0 100 100"><path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"/><path class="line line2" d="M 20,50 H 80"/><path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"/></svg></button>
    </div>
  </div>
  <div class="island-menu" id="islandMenu">
    ${svcMenuH()}
    <a class="island-menu-link" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${n.wrk}</a>
    <a class="island-menu-link" href="${routeToPath('shop')}" onclick="event.preventDefault();go('shop')">${n.shop}</a>
    <a class="island-menu-link" href="${routeToPath('about')}" onclick="event.preventDefault();go('about')">${n.abt}</a>
    <a class="island-menu-link" href="${routeToPath('contact')}" onclick="event.preventDefault();go('contact')">${n.contact}</a>
    <div class="island-menu-footer">
      <button class="nav-toggle-btn" onclick="tL()" title="${lang==='en'?'Sprache':'Language'}">${lang==='en'?'DE':'EN'}</button>
      <button class="nav-toggle-btn" onclick="setBaseTheme(baseTheme==='dark'?'light':'dark')" title="${themeBtnLabel()}">${baseTheme==='dark'?SUN_SVG:MOON_SVG}</button>
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
  const cardArrow='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  /* Description and arrow are desktop-only — the drawer shows the label alone */
  const links=SVC_CATS.map(k=>`<a class="nav-sub-link" href="${routeToPath(k)}" onclick="event.preventDefault();go('${k}')"><span class="nav-sub-text"><span class="nav-sub-name">${cats[k].label}</span><span class="nav-sub-desc">${cats[k].short}</span></span><span class="nav-sub-go">${cardArrow}</span></a>`).join('');
  /* A <button>, not a link: there is no services overview page behind it, so
     the item is purely a disclosure for the three category routes. */
  return`<div class="island-menu-item" id="svcMenuItem" onmouseenter="svcSubHover(true)" onmouseleave="svcSubHover(false)">
      <button type="button" class="island-menu-link island-menu-link-has-sub" id="svcMenuLink" aria-haspopup="true" aria-expanded="false" aria-controls="svcSubmenu" onclick="svcMenuClick(event)" onkeydown="svcMenuKey(event)">${n.svc}${chev}</button>
      <div class="nav-sub" id="svcSubmenu" aria-labelledby="svcMenuLink" inert onmouseenter="svcSubHover(true)"><div class="nav-sub-inner">${links}</div></div>
    </div>`;
}

/* ===== SETTINGS MENU (desktop) =====
   Replaces the loose language and appearance buttons with one gear that opens a
   small panel — that is what lets the bar shrink to fit its links. On mobile the
   drawer keeps the two direct buttons instead. */
function themeBtnLabel(){
  const toLight=baseTheme==='dark';
  if(lang==='en')return toLight?'Light mode':'Dark mode';
  return toLight?'Heller Modus':'Dunkler Modus';
}
function settingsMenuH(){
  const s=t('settings');
  const opt=(val,label,icon)=>`<button type="button" class="set-opt${baseTheme===val?' active':''}" role="menuitemradio" aria-checked="${baseTheme===val}" onclick="setBaseTheme('${val}')">${icon}<span>${label}</span></button>`;
  return`<div class="set-menu desktop-only" id="setMenu" onmouseleave="setMenuHover(false)" onmouseenter="setMenuHover(true)">
      <button type="button" class="nav-toggle-btn set-trigger" id="setTrigger" aria-haspopup="true" aria-expanded="false" aria-controls="setPanel" title="${s.title}" onclick="setMenuClick(event)" onkeydown="setMenuKey(event)">${SETTINGS_SVG}</button>
      <div class="set-panel" id="setPanel" aria-label="${s.title}" role="menu" inert>
        <div class="set-panel-inner">
          <div class="set-group"><div class="set-label">${s.appearance}</div><div class="set-opts">${opt('dark',s.dark,MOON_SVG)}${opt('light',s.light,SUN_SVG)}</div></div>
          <div class="set-group"><div class="set-label">${s.language}</div><div class="set-opts">
            <button type="button" class="set-opt${lang==='de'?' active':''}" role="menuitemradio" aria-checked="${lang==='de'}" onclick="if(lang!=='de')tL()"><span>Deutsch</span></button>
            <button type="button" class="set-opt${lang==='en'?' active':''}" role="menuitemradio" aria-checked="${lang==='en'}" onclick="if(lang!=='en')tL()"><span>English</span></button>
          </div></div>
        </div>
      </div>
    </div>`;
}

let _setMenuTimer=null;
function setMenuIsOpen(){const m=document.getElementById('setMenu');return !!(m&&m.classList.contains('set-open'))}
function setMenuSet(open){
  const m=document.getElementById('setMenu'),b=document.getElementById('setTrigger'),p=document.getElementById('setPanel');
  if(!m||!b||!p)return;
  clearTimeout(_setMenuTimer);_setMenuTimer=null;
  m.classList.toggle('set-open',open);
  b.setAttribute('aria-expanded',open?'true':'false');
  if(open)p.removeAttribute('inert');else p.setAttribute('inert','');
}
function setMenuClose(){setMenuSet(false)}
function setMenuHover(entering){
  if(!svcSubHoverMode())return;
  clearTimeout(_setMenuTimer);
  if(entering){svcSubClose();setMenuSet(true)}
  else _setMenuTimer=setTimeout(setMenuClose,200);
}
function setMenuClick(e){e.preventDefault();setMenuSet(!setMenuIsOpen())}
function setMenuKey(e){
  if(e.key==='ArrowDown'){
    e.preventDefault();setMenuSet(true);
    const f=document.querySelector('#setPanel .set-opt');
    if(f)requestAnimationFrame(()=>f.focus());
  }else if(e.key==='Escape')setMenuClose();
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
  if(entering){setMenuClose();svcSubSet(true)}
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

/* Click/Enter/Space all land here — the trigger is a button with no destination,
   so every activation just toggles the panel. */
function svcMenuClick(e){
  e.preventDefault();
  svcSubSet(!svcSubIsOpen());
}

function svcMenuKey(e){
  if(e.key==='ArrowDown'){
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
  /* No artwork any more — the accordion is centred on its own. */
  return`<section class="faq-section"><div class="reveal">
    <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${f.title}</h2>
    <div class="faq-layout">
      <div class="faq-list">${f.items.map((item,i)=>`<div class="faq-item" id="faq${i}"><button class="faq-question" onclick="toggleFaq(${i})">${item.q} ${plusSVG}</button><div class="faq-answer"><div class="faq-answer-inner">${item.a}</div></div></div>`).join('')}</div>
    </div>
  </div></section>`;
}
function toggleFaq(i){
  const item=document.getElementById('faq'+i);
  if(!item)return;
  item.classList.toggle('open');
}

/* ===== TESTIMONIALS =====
   Collected from the projects themselves: any project carrying a testimonial
   block shows up here, in the same order the work grid uses. Adding one to a
   project.json is all it takes — nothing here needs touching. */
function allTestimonials(){
  const out=[];
  allWorkKeys().forEach(slug=>{
    const pr=P[slug];if(!pr)return;
    (pr.content||[]).forEach(b=>{
      if(b.type!=='testimonial')return;
      const d=b[lang]||b.en||{};
      if(!d.quote)return;
      out.push({slug,photo:b.photo||'',name:b.name||'',role:d.role||'',quote:d.quote,
        project:(pr[lang]||pr.en||{}).title||slug});
    });
  });
  return out;
}

function testiHomeHtml(){
  const items=allTestimonials();
  if(!items.length)return'';
  const ts=t('testi');
  const arrow='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  const cards=items.map((it,i)=>{
    const href=routeToPath('work/'+it.slug);
    const photo=it.photo?`<img class="htesti-photo" src="${it.photo}" alt="" loading="lazy" onerror="this.remove()"/>`:'';
    /* person on top, then the full quote, then the "view project" link — the
       foot moves above the text, only the CTA stays at the bottom */
    return`<figure class="htesti" data-anim="fade" data-anim-delay="${120+i*110}">`
      +`<figcaption class="htesti-foot">`
        +`<div class="htesti-person">${photo}<div class="htesti-who">`
          +`<span class="htesti-name">${it.name}</span>`
          +(it.role?`<span class="htesti-role">${it.role}</span>`:'')
        +`</div></div>`
      +`</figcaption>`
      +`<blockquote class="htesti-quote">“${it.quote}”</blockquote>`
      +`<a class="htesti-cta" href="${href}" onclick="event.preventDefault();go('work/${it.slug}')" aria-label="${ts.cta}: ${it.project}">${ts.cta} ${arrow}</a>`
    +`</figure>`;
  }).join('');
  return`<section class="section testi-section"><div class="reveal">`
    +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${ts.title}</h2>`
    +`<div class="htesti-grid">${cards}</div>`
  +`</div></section>`;
}

/* ===== PRICING =====
   Home: one card per service category, its cheapest tier and a link through.
   Service pages: the three tiers, middle one flagged as popular. */
function pricingHomeHtml(){
  const pr=t('pricing'),cats=t('svcCat')||{};
  const arrow='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  const cards=SVC_CATS.map((k,i)=>{
    const c=cats[k];if(!c||!c.fromPrice)return'';
    /* Placeholder lucide icons, one file per service in Assets/Icons/services —
       swapping in the real artwork means replacing the file, nothing else. */
    return`<div class="pr-card" data-anim="fade" data-anim-delay="${120+i*110}">`
      +`<img class="pr-card-icon" src="/Assets/Icons/services/${k}.svg" alt="" aria-hidden="true" loading="lazy" onerror="this.remove()"/>`
      +`<h3 class="pr-card-title">${c.label}</h3>`
      +(c.short?`<p class="pr-card-text">${c.short}</p>`:'')
      +`<div class="pr-card-price"><span class="pr-from">${pr.from}</span><span class="pr-amount">${c.fromPrice}</span></div>`
      +`<a class="pr-card-cta" href="${routeToPath(k)}" onclick="event.preventDefault();go('${k}')">${pr.homeCta} ${arrow}</a>`
    +`</div>`;
  }).join('');
  if(!cards)return'';
  return`<section class="section pricing-section"><div class="reveal">`
    +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${pr.title}</h2>`
    +`<p class="section-text" data-anim="words" data-anim-stagger="20">${pr.text}</p>`
    +`<div class="pr-grid">${cards}</div>`
    +`<p class="pr-note">${pr.note}</p>`
  +`</div></section>`;
}

/* The three tiers on a service page. Index 1 carries the popular flag. */
function pricingPlansHtml(c){
  /* c.key is stamped on by svcCatPg so the CTA can name its own category */
  const plans=c.plans||[];if(!plans.length)return'';
  const pr=t('pricing');
  /* The packages sit on an inverted band: light against the dark site, dark
     once the visitor has switched to light. Attribute themes are not bound to
     <body>, so the subtree simply opts into the other palette. */
  const band=baseTheme==='dark'?'light':'dark';
  const tick='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const arrow='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  const cards=plans.map((pl,i)=>{
    const pop=i===1;
    return`<div class="pr-plan${pop?' pop':''}">`
      +(pop?`<span class="pr-plan-badge">${pr.popular}</span>`:'')
      +`<div class="pr-plan-head"><span class="pr-plan-name">${pl.name}</span></div>`
      +`<div class="pr-plan-price">${pl.price}</div>`
      +(pl.d?`<p class="pr-plan-text">${pl.d}</p>`:'')
      +`<ul class="pr-plan-list">${(pl.f||[]).map(f=>`<li>${tick}<span>${f}</span></li>`).join('')}</ul>`
      +`<a class="pr-plan-cta${pop?' acc':''}" href="${routeToPath('contact')}" onclick="event.preventDefault();inquirePlan('${c.key}',${i})">${pr.planCta} ${arrow}</a>`
    +`</div>`;
  }).join('');
  /* Collapsible feature comparison under the cards: one row per feature, a
     tick / dash for yes-no rows and the raw value for counts, plus a price
     row at the foot. The middle (popular) column is tinted throughout. */
  const cmp=c.compare||[];
  const cell=v=>{
    if(v===true)return`<span class="pr-cmp-yes">${tick}</span>`;
    if(v===false||v==null||v===''||v==='—')return`<span class="pr-cmp-no" aria-hidden="true">–</span>`;
    return`<span class="pr-cmp-val">${v}</span>`;
  };
  const chev='<svg class="pr-compare-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  /* Default the selected column to the popular (middle) tier. On mobile only one
     column shows at a time, picked with the tabs; on desktop all three show. */
  const defCol=plans.length>1?1:0;
  const compareHtml=cmp.length
    ?`<div class="pr-compare">`
      +`<button type="button" class="pr-compare-toggle" aria-expanded="false" aria-controls="prComparePanel" onclick="toggleCompare(this)"><span>${pr.compareTitle}</span> ${chev}</button>`
      +`<div class="pr-compare-panel" id="prComparePanel" data-active="${defCol}" hidden>`
        +`<div class="pr-cmp-tabs" role="tablist" aria-label="${pr.compareTitle}">`
          +plans.map((pl,i)=>`<button type="button" class="pr-cmp-tab${i===defCol?' active':''}" role="tab" aria-selected="${i===defCol}" onclick="setCmpCol(this,${i})">${pl.name}</button>`).join('')
        +`</div>`
        +`<div class="pr-compare-scroll"><table class="pr-compare-table">`
          +`<thead><tr><th scope="col"></th>${plans.map((pl,i)=>`<th scope="col" data-col="${i}"${i===1?' class="pop"':''}>${pl.name}</th>`).join('')}</tr></thead>`
          +`<tbody>`
            +cmp.map(r=>`<tr><th scope="row">${r.l}</th>${(r.v||[]).map((v,i)=>`<td data-col="${i}"${i===1?' class="pop"':''}>${cell(v)}</td>`).join('')}</tr>`).join('')
            +`<tr class="pr-cmp-price"><th scope="row">${pr.priceRow}</th>${plans.map((pl,i)=>`<td data-col="${i}"${i===1?' class="pop"':''}>${pl.price}</td>`).join('')}</tr>`
          +`</tbody>`
        +`</table></div>`
      +`</div>`
    +`</div>`
    :'';
  return`<section class="svc-plans-band" data-theme="${band}" id="svcPlans"><div class="reveal">`
    +`<h3 class="svc-sec-title svc-plans-title">${pr.planTitle}</h3>`
    +`<div class="pr-plans">${cards}</div>`
    +compareHtml
    +`<p class="pr-note">${pr.note}</p>`
  +`</div></section>`;
}
/* Expand / collapse the package comparison table under the cards */
function toggleCompare(btn){
  const panel=document.getElementById('prComparePanel');if(!panel)return;
  const open=panel.hasAttribute('hidden');
  if(open)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
  btn.setAttribute('aria-expanded',open?'true':'false');
  btn.classList.toggle('open',open);
}
/* Pick which package column the comparison shows — used on mobile, where only
   one column is visible at a time (the CSS keys off data-active on the panel). */
function setCmpCol(btn,i){
  const panel=document.getElementById('prComparePanel');if(!panel)return;
  panel.setAttribute('data-active',i);
  panel.querySelectorAll('.pr-cmp-tab').forEach(t=>{
    const on=t===btn;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false');
  });
}

/* Scroll to the packages, clearing the fixed header so the heading is not
   hidden underneath it. Falls back to a plain jump without smooth scrolling. */
function jumpToPlans(){
  const el=document.getElementById('svcPlans');if(!el)return;
  /* Walk the offset chain rather than reading getBoundingClientRect(): the
     block is a .reveal, so it is still translated down until it animates in,
     and a rect-based target would drift once it settles. offsetTop is layout
     position and ignores transforms. */
  let y=0,n=el;while(n){y+=n.offsetTop;n=n.offsetParent}
  const nav=document.getElementById('navIsland');
  const off=Math.max((nav?nav.getBoundingClientRect().bottom:0)+24,90);
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({top:Math.max(0,y-off),behavior:reduce?'auto':'smooth'});
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
          <a class="hero-cta-secondary" data-cl="${lang==='en'?'Contact':'Kontakt'}" href="${routeToPath('contact')}" onclick="event.preventDefault();go('contact')">${h.cta2} ${arrowSVG}</a>
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
    <span class="hero-accent-text">Brand &amp; Logo Design</span><span class="hero-accent-dot">·</span>
    <span class="hero-accent-text">Motion Design</span><span class="hero-accent-dot">·</span>
    <span class="hero-accent-text">Web Design</span>
  </div></section>
  <section class="story-section"><div class="reveal"><p class="story-text" data-anim="words" data-anim-stagger="18" data-anim-duration="500">${
    lang==='en'
      ?'As an independent designer, I develop identities <em>from the logo to the launch video</em>. All of a piece, so that every element fits the next. And when a brand system already exists, I <em>build on it</em> instead of overwriting it.'
      :'Als eigenständiger Designer entwickle ich Identitäten <em>vom Logo bis zum Launch Video</em>. Alles aus einem Guss, damit jedes Element zum nächsten passt. Und wenn schon ein Markensystem existiert, baue ich <em>darauf weiter</em>, statt es zu überschreiben.'
  }</p></div></section>
  <section class="section"><div class="reveal">
    <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2>
    <div class="pgrid">${keys.map(wC).join('')}</div>
    <div class="pgrid-more"><a class="pgrid-more-btn" data-cl="${lang==='en'?'Work':'Projekte'}" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${w.allBtn} ${arrowSVG}</a></div>
  </div></section>
  ${testiHomeHtml()}
  ${pricingHomeHtml()}
  ${faqHtml()}`
}

/* Category label from i18n (falls back to the raw id) */
function catLabel(id){const c=t('cats');return (c&&c[id])||id||''}

/* ===== PROJECT CARD ===== */
function wC(slug){
  const pr=workEntry(slug);if(!pr)return'';
  const p=pr[lang]||pr.en||{};const w=t('wrk');
  const thumb=pr.thumb||vg(1600,900,(p.title||slug).split('\u2014')[0].trim(),pr.c);
  /* Osmo-style card: image, then name + type on the left, year on the right.
     No border, no tag row, no "view project" line \u2014 the whole card is the link. */
  const route=pr.route||('work/'+slug);
  /* The category ("Brand Identity"), not p.type ("Client Project") */
  const type=catLabel((pr.cats||[])[0])||p.type;
  return`<a class="pcard" data-cats="${(pr.cats||[]).join(' ')}" data-cl="${w.view}" href="${routeToPath(route)}" onclick="event.preventDefault();go('${route}')">`
    +`<div class="pcard-media"><img src="${thumb}" alt="${p.title||slug}" loading="lazy"/></div>`
    +`<div class="pcard-body">`
      +`<div class="pcard-main">`
        +`<h3 class="pcard-title">${p.title||slug}</h3>`
        +(type?`<span class="pcard-type">${type}</span>`:'')
      +`</div>`
      +(pr.yr?`<div class="pcard-meta"><span class="pcard-year">${pr.yr}</span></div>`:'')
    +`</div></a>`
}

/* ===== LOGO SHOP =====
   Ready-made logos at a fixed price. LG is generated by build-logos.js from
   /logos/<slug>/logo.json, the same folder-per-item shape /projects uses. */
function allLogoKeys(){return typeof LG==='undefined'?[]:Object.keys(LG)}

/* Card — mirrors the project card, with the price where the year sits */
function lgC(slug){
  const lo=LG[slug];if(!lo)return'';
  const d=lo[lang]||lo.en||{};const g=t('logos');
  const fb=vg(1600,900,d.name||slug,lo.c);
  const sold=lo.status==='sold';
  const route='shop/'+slug;
  /* The flat mark, revealed on hover instead of a zoom — shown a little smaller
     and recoloured for dark mode (see .lgcard-mark). Falls back to detail-01, then
     to no swap. */
  const hover=lo.svg||(lo.images&&lo.images[1]&&lo.images[1].src)||'';
  const hoverIsMark=/\.svg(\?|$)/i.test(hover);
  return`<a class="pcard lgcard${sold?' sold':''}" data-cl="${g.view}" href="${routeToPath(route)}" onclick="event.preventDefault();go('${route}')">`
    +`<div class="pcard-media"><img class="lgcard-base" src="${lo.thumb||fb}" alt="${d.name||slug}" loading="lazy" onerror="this.src='${fb}'"/>`
      +(hover?`<img class="lgcard-hover${hoverIsMark?' lgcard-mark':''}" src="${hover}" alt="" loading="lazy" aria-hidden="true" onerror="this.remove()"/>`:'')
      +(sold?`<span class="lg-sold-badge">${g.sold}</span>`:'')
    +`</div>`
    +`<div class="pcard-body">`
      +`<div class="pcard-main">`
        +`<h3 class="pcard-title">${d.name||slug}</h3>`
        +(d.tag?`<span class="pcard-type">${d.tag}</span>`:'')
      +`</div>`
      +(lo.price?`<div class="pcard-meta"><span class="pcard-year lg-price">${lo.price}</span></div>`:'')
    +`</div></a>`
}

function logosPg(){
  const g=t('logos');const keys=allLogoKeys();
  return`<section class="section" style="padding-top:9rem"><div class="reveal">`
    +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${g.title}</h2>`
    +`<p class="section-text" data-anim="words" data-anim-stagger="20">${g.text}</p>`
    +(keys.length
      ?`<div class="pgrid" style="margin-top:3.5rem">${keys.map(lgC).join('')}</div>`
      :`<p class="wempty">${g.empty}</p>`)
  +`</div></section>`
}

/* Carried across the in-app jump so the contact form opens with its subject
   already filled in. Direct links to /contact simply get an empty form. */
let pendingSubject='';
function htmlEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
/* i18n labels are authored as HTML ("Brand &amp; Logo Design"); a form value is
   plain text, so decode before it goes in. */
function deEnt(s){const d=document.createElement('textarea');d.innerHTML=String(s||'');return d.value}
function inquire(subject){pendingSubject=deEnt(subject);go('contact')}
function inquireLogo(slug){
  const lo=LG[slug];const g=t('logos');
  inquire(lo?`${g.inquirySubjectPlain}: ${(lo[lang]||lo.en||{}).name||slug}${lo.price?' — '+lo.price:''}`:'');
}
/* Service packages: the tier name lands in the subject the same way */
function inquirePlan(cat,i){
  const c=(t('svcCat')||{})[cat],pr=t('pricing');
  const pl=c&&(c.plans||[])[i];
  inquire(pl?`${pr.planSubject}: ${c.label} — ${pl.name}${pl.price?' ('+pl.price+')':''}`:'');
}

/* ===== Logo gallery — one stage image plus a scrollable thumbnail strip =====
   Set by logoPg() on every render; the handlers below only touch the DOM. */
let lgImgs=[],lgIdx=0;

function lgPick(i){
  if(!lgImgs.length)return;
  lgIdx=(i%lgImgs.length+lgImgs.length)%lgImgs.length;
  const stage=document.getElementById('lgStage');if(!stage)return;
  const im=lgImgs[lgIdx];
  stage.src=im.src;stage.alt=im.alt;
  stage.classList.toggle('lg-svgimg',!!im.svg);
  /* a missing file must fall back here too, not just on first paint */
  stage.onerror=function(){this.onerror=null;this.src=im.fb};
  const cnt=document.getElementById('lgCount');if(cnt)cnt.textContent=lgIdx+1;
  document.querySelectorAll('.lgshop-thumb').forEach((b,n)=>{
    const on=n===lgIdx;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',on?'true':'false');
    b.tabIndex=on?0:-1;
    if(on&&b.scrollIntoView)b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
  });
}
function lgStep(d){lgPick(lgIdx+d)}
/* Open the project lightbox on the current image. The thumbnails already hold
   the resolved src — a file that 404'd has been swapped for the placeholder by
   its own onerror — so read from them rather than re-deriving the URLs. */
function lgLightbox(){
  const thumbs=[...document.querySelectorAll('.lgshop-thumb img')];
  const stage=document.getElementById('lgStage');
  const list=lgImgs.map((im,i)=>(thumbs[i]&&thumbs[i].getAttribute('src'))||(i===lgIdx&&stage?stage.getAttribute('src'):im.src));
  if(list.length)lbOpen(list,lgIdx);
}
/* Left/Right walk the strip and select as they go (ARIA tabs, automatic
   activation). Step from the FOCUSED thumb, not from lgIdx: the two can differ
   once focus has moved on its own, and stepping from lgIdx would jump. */
function lgKey(e){
  if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
  e.preventDefault();
  const all=[...document.querySelectorAll('.lgshop-thumb')];
  const from=all.indexOf(document.activeElement);
  lgPick((from<0?lgIdx:from)+(e.key==='ArrowRight'?1:-1));
  const b=all[lgIdx];if(b)b.focus();
}

function logoPg(slug){
  const lo=(typeof LG==='undefined')?null:LG[slug];
  if(!lo)return notFoundPg();
  const d=lo[lang]||lo.en||{};const g=t('logos');
  const backSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  const tickSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const checkSVG='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const chev=dir=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M${dir<0?'15 18l-6-6 6-6':'9 18l6-6-6-6'}"/></svg>`;
  const sold=lo.status==='sold';
  const fb=vg(1600,900,d.name||slug,lo.c);

  lgImgs=(lo.images||[]).map(im=>({src:im.src,alt:(im.alt||{})[lang]||(im.alt||{}).en||d.name||'',fb,svg:/\.svg(\?|$)/i.test(im.src||'')}));
  lgIdx=0;
  const first=lgImgs[0]||{src:fb,alt:d.name||slug,fb};

  const thumbs=lgImgs.length>1
    ?`<div class="lgshop-thumbs" role="tablist" aria-label="${d.name||slug}">`
      +lgImgs.map((im,i)=>`<button type="button" class="lgshop-thumb${i===0?' active':''}" role="tab" aria-selected="${i===0}" tabindex="${i===0?0:-1}" onclick="lgPick(${i})" onkeydown="lgKey(event)"><img class="${im.svg?'lg-svgimg':''}" src="${im.src}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${fb}'"/></button>`).join('')
    +`</div>`
    :'';

  const gallery=`<div class="lgshop-gallery">`
    +`<div class="lgshop-stage">`
      +`<img id="lgStage" class="${first.svg?'lg-svgimg':''}" src="${first.src}" alt="${first.alt}" onclick="lgLightbox()" onerror="this.onerror=null;this.src='${fb}'"/>`
      +(lgImgs.length>1
        ?`<button type="button" class="lgshop-nav prev" onclick="lgStep(-1)" aria-label="${g.prev}">${chev(-1)}</button>`
         +`<button type="button" class="lgshop-nav next" onclick="lgStep(1)" aria-label="${g.next}">${chev(1)}</button>`
         +`<span class="lgshop-count"><span id="lgCount">1</span> / ${lgImgs.length}</span>`
        :'')
    +`</div>`
    +thumbs
  +`</div>`;

  const incl=(d.incl||[]).length
    ?`<div class="lg-incl"><div class="lg-incl-label">${g.includes}</div>`
      +`<ul class="svc-deliver">${d.incl.map(x=>`<li class="svc-deliver-item">${tickSVG}<span>${x}</span></li>`).join('')}</ul></div>`
    :'';

  /* Logo tester — type a brand name and preview the mark beside it. Built in the
     same spirit as the font tester (sliders + a live canvas). The mark SVGs are
     pure #000000, so the preview recolours them per its own light/dark ground. */
  const brand='Brand';
  /* Fonts the tester can preview — each already declared in css/fonts.css.
     The dropdown shows every name set in its own typeface. */
  const lgtFonts=['DM Sans','Roboto','Inter','Fraunces','JetBrains Mono'];
  const cselChev='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const tester=lo.svg
    ?`<div class="lgtester">`
      +`<div class="lg-incl-label">${g.testerLabel}</div>`
      +`<p class="lgt-hint">${g.testerHint}</p>`
      +`<div class="lgt-layout">`
        +`<div class="lgt-controls">`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tBrand}</span></div>`
            +`<input type="text" class="lgt-input" id="lgtText" value="${brand}" maxlength="28" placeholder="${g.tBrandPh}" oninput="updateLogoTester()"/></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tFont}</span></div>`
            +`<div class="csel lgt-fontsel" id="lgtFontCsel">`
              +`<button type="button" class="csel-trigger" style="font-family:'${lgtFonts[0]}'" onclick="cselToggle(this)">${lgtFonts[0]} ${cselChev}</button>`
              +`<div class="csel-opts">${lgtFonts.map((fn,i)=>`<div class="csel-opt${i===0?' active':''}" style="font-family:'${fn}'" onclick="lgtPickFont(this,'${fn}')">${fn}</div>`).join('')}</div>`
            +`</div></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tStyle}</span></div>`
            +`<div class="ft-align-btns">`
              +`<button type="button" class="ft-align-btn lgt-stybtn" id="lgtBold" style="font-weight:700" aria-pressed="false" onclick="toggleLgtStyle(this)">${g.tBold}</button>`
              +`<button type="button" class="ft-align-btn lgt-stybtn" id="lgtItalic" style="font-style:italic" aria-pressed="false" onclick="toggleLgtStyle(this)">${g.tItalic}</button>`
            +`</div></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tSize}</span><span class="ft-control-value" id="lgtSizeVal">64px</span></div>`
            +`<input type="range" class="ft-slider" id="lgtSize" min="24" max="120" value="64" oninput="updateLogoTester()"/></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tSpacing}</span><span class="ft-control-value" id="lgtSpaceVal">0px</span></div>`
            +`<input type="range" class="ft-slider" id="lgtSpace" min="-4" max="16" value="0" oninput="updateLogoTester()"/></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tGap}</span><span class="ft-control-value" id="lgtGapVal">24px</span></div>`
            +`<input type="range" class="ft-slider" id="lgtGap" min="0" max="80" value="24" oninput="updateLogoTester()"/></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tLayout}</span></div>`
            +`<div class="ft-align-btns"><button type="button" class="ft-align-btn active" id="lgtLayoutRow" onclick="setLgtLayout('row')">${g.tSide}</button>`
              +`<button type="button" class="ft-align-btn" id="lgtLayoutCol" onclick="setLgtLayout('col')">${g.tStack}</button></div></div>`
          +`<div class="ft-control-group"><div class="ft-control-label"><span>${g.tGround}</span></div>`
            +`<div class="ft-align-btns lgt-modes" role="group" aria-label="${g.tGround}">`
              +`<button type="button" class="ft-align-btn lgt-mode active" data-m="light" title="${g.tLight}" aria-label="${g.tLight}" onclick="setLgtMode('light')">${SUN_SVG}</button>`
              +`<button type="button" class="ft-align-btn lgt-mode" data-m="dark" title="${g.tDark}" aria-label="${g.tDark}" onclick="setLgtMode('dark')">${MOON_SVG}</button>`
            +`</div></div>`
        +`</div>`
        +`<div class="lgt-preview" id="lgtPreview" data-lgt="light">`
          +`<div class="lgt-lockup" id="lgtLockup">`
            +`<img class="lgt-mark" id="lgtMark" src="${lo.svg}" alt="${d.name||slug}"/>`
            +`<span class="lgt-word" id="lgtWord">${brand}</span>`
          +`</div>`
        +`</div>`
      +`</div>`
    +`</div>`
    :'';

  /* Shop layout: images on top, then the title with the price under it, then
     the description, then what the price covers. Nothing here carries a
     data-anim — a shop item should be readable the moment it opens. */
  return`<div class="pdetail lgdetail">`
    +`<div><a class="pback" href="${routeToPath('shop')}" onclick="event.preventDefault();go('shop')">${backSVG} ${g.back}</a></div>`
    +`<div class="lgshop">`
      +gallery
      +`<div class="lgshop-head">`
        +`<h1 class="lgshop-title">${d.name||slug}</h1>`
        +(d.tag?`<p class="lgshop-tagline">${d.tag}</p>`:'')
        +`<div class="lgshop-buy">`
          /* one-of-one badge sits on the amount's line, so it centres on the
             price number and not on the label above it */
          +`<div class="lgshop-price"><span class="lg-buy-label">${g.price}</span>`
            +`<span class="lgshop-price-line"><span class="lg-buy-amount">${lo.price||'—'}</span>`
              +`<span class="lgshop-excl-badge">${g.exclusive} · ${sold?g.sold:g.availability}</span></span>`
          +`</div>`
          +(sold
            ?''
            :`<button type="button" class="lg-buy-btn" onclick="inquireLogo('${slug}')">${g.inquire}</button>`)
        +`</div>`
        +`<p class="lgshop-wordmark">${checkSVG} ${g.wordmark}</p>`
      +`</div>`
      +(d.desc?`<p class="lgshop-desc">${d.desc}</p>`:'')
      +((d.tags||[]).length?`<div class="stags lgshop-tags">${d.tags.map(x=>`<span class="stag">${x}</span>`).join('')}</div>`:'')
      +incl
      +tester
    +`</div>`
  +`</div>`
}

/* ===== Logo tester handlers — mirror the font tester: read the controls, push
   the values onto the live lockup. The mark scales with the wordmark so the two
   stay in proportion from one size slider. ===== */
function updateLogoTester(){
  const word=document.getElementById('lgtWord');if(!word)return;
  const size=+document.getElementById('lgtSize').value;
  const space=+document.getElementById('lgtSpace').value;
  const gap=+document.getElementById('lgtGap').value;
  word.textContent=document.getElementById('lgtText').value;
  word.style.fontSize=size+'px';
  word.style.letterSpacing=space+'px';
  const mark=document.getElementById('lgtMark');if(mark)mark.style.height=Math.round(size*1.5)+'px';
  const lockup=document.getElementById('lgtLockup');if(lockup)lockup.style.gap=gap+'px';
  document.getElementById('lgtSizeVal').textContent=size+'px';
  document.getElementById('lgtSpaceVal').textContent=space+'px';
  document.getElementById('lgtGapVal').textContent=gap+'px';
}
function setLgtLayout(dir){
  const lockup=document.getElementById('lgtLockup');if(!lockup)return;
  lockup.classList.toggle('lgt-stacked',dir==='col');
  const row=document.getElementById('lgtLayoutRow'),col=document.getElementById('lgtLayoutCol');
  if(row)row.classList.toggle('active',dir==='row');
  if(col)col.classList.toggle('active',dir==='col');
}
function setLgtMode(m){
  const pv=document.getElementById('lgtPreview');if(!pv)return;
  pv.setAttribute('data-lgt',m);
  document.querySelectorAll('.lgt-mode').forEach(b=>b.classList.toggle('active',b.dataset.m===m));
}
/* Pick the wordmark typeface from the font dropdown (reuses the .csel widget) */
function lgtPickFont(opt,fam){
  const csel=opt.closest('.csel');if(!csel)return;
  const trigger=csel.querySelector('.csel-trigger');
  const svg=trigger.querySelector('svg').outerHTML;
  trigger.innerHTML=fam+' '+svg;
  trigger.style.fontFamily="'"+fam+"'";
  csel.querySelectorAll('.csel-opt').forEach(o=>o.classList.remove('active'));
  opt.classList.add('active');
  csel.classList.remove('open');
  const word=document.getElementById('lgtWord');if(word)word.style.fontFamily="'"+fam+"'";
}
/* Bold / italic toggles for the wordmark — each on/off, combining to give
   Regular, Bold, Italic and Bold Italic (the cuts shipped for every family). */
function toggleLgtStyle(btn){
  btn.classList.toggle('active');
  btn.setAttribute('aria-pressed',btn.classList.contains('active')?'true':'false');
  const word=document.getElementById('lgtWord');if(!word)return;
  const bold=document.getElementById('lgtBold').classList.contains('active');
  const ital=document.getElementById('lgtItalic').classList.contains('active');
  word.style.fontWeight=bold?'700':'400';
  word.style.fontStyle=ital?'italic':'normal';
}
function initLogoTester(){
  if(!document.getElementById('lgtPreview'))return;
  setLgtMode('light');
  const word=document.getElementById('lgtWord');
  if(word){word.style.fontWeight='400';word.style.fontStyle='normal';}
  updateLogoTester();
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
        galHtml+=`<div class="reveal"><div class="pgal-frame"><img src="${block.src}" alt="${alt}" loading="lazy" onerror="this.closest('.reveal').remove()" ${lb(block.li)}/></div></div>`;
        break;}
      case 'video':{
        galHtml+=`<div class="reveal"><div class="pgal-frame pgal-video"><video controls playsinline preload="metadata"${block.poster?` poster="${block.poster}"`:''}${block.title?` aria-label="${block.title}"`:''} onerror="this.closest('.reveal').remove()"><source src="${block.src}" type="video/mp4"/></video></div></div>`;
        break;}
      case 'imageGrid':{
        const imgs=block.images||[];
        galHtml+=`<div class="reveal"><div class="irow" style="--cols:${imgs.length}">`
          +imgs.map(im=>{
            const alt=(im.alt||{})[lang]||(im.alt||{}).en||'';
            return`<div class="pgal-frame"><img src="${im.src}" alt="${alt}" loading="lazy" onerror="this.closest('.pgal-frame').remove()" ${lb(im.li)}/></div>`;
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
      </div>
    </div>
  </div></section>

  <section class="abt-lead-section"><div class="reveal">
    <p class="abt-lead">${a.bio}</p>
  </div></section>

  <section class="abt-section-block"><div class="reveal abt-section">
    <h3 class="abt-section-title">${a.timelineTitle}</h3>
    <div class="abt-journey">${a.timeline.map(s=>`<div class="abt-journey-step"><div class="abt-journey-marker"><span class="abt-journey-year">${s.year}</span><span class="abt-journey-dot"></span></div><div class="abt-journey-content"><p class="abt-journey-text">${s.text}</p></div></div>`).join('')}</div>
  </div></section>

  <section class="abt-section-block"><div class="reveal abt-section">
    <h3 class="abt-section-title">${a.pointsTitle}</h3>
    <div class="svc-gain abt-points">${a.points.map((pt,i)=>`<div class="svc-gain-item"><div class="svc-gain-media"><img src="/Assets/images/0${i+1}.webp" alt="" loading="lazy" onerror="this.remove()"/></div><span class="svc-gain-num">${i+1}.</span><div class="svc-gain-body"><h4 class="svc-gain-t">${pt.t}</h4><p class="svc-gain-d">${pt.d}</p></div></div>`).join('')}</div>
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

/* ===== SERVICE CATEGORY PAGE (/branding, /motion-design, /web-design) =====
   Hero with a bento of placeholder tiles -> what you gain -> what you end up
   with -> real projects -> packages on an inverted band -> closing CTA ->
   (branding only) the logo shop. */
function svcCatPg(key){
  const cats=t('svcCat')||{};const c=cats[key];
  if(!c)return notFoundPg();
  const sp=t('svcPage'),w=t('wrk');
  const arrowSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  const downSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
  const subj=deEnt(c.label).replace(/'/g,"\\'");

  /* ---- Hero: copy on the left, a single square image on the right (same
         square ratio as the gain-media images; hero.webp per service folder) ---- */
  const heroMedia=`<div class="svc-hero-media"><img src="/Assets/Icons/services/${key}/hero.webp" alt="" loading="eager" onerror="this.remove()"/></div>`;
  const heroHtml=`<div class="reveal svc-hero">`
    +`<div class="svc-hero-copy">`
      +`<h2 class="svc-hero-title">${c.hero||c.title}</h2>`
      +`<p class="svc-hero-lead">${c.text}</p>`
      +`<div class="svc-hero-cta">`
        +((c.plans||[]).length?`<a class="svc-jump" href="#svcPlans" onclick="event.preventDefault();jumpToPlans()">${sp.jump} ${downSVG}</a>`:'')
        +`<a class="svc-hero-alt" href="${routeToPath('contact')}" onclick="event.preventDefault();inquire('${subj}')">${sp.inquire} ${arrowSVG}</a>`
      +`</div>`
    +`</div>`
    +heroMedia
  +`</div>`;

  /* ---- What you gain: three numbered columns ---- */
  /* ---- What you gain: three numbered columns, each led by an image from
         Assets/Icons/services/<key>/0N.webp (01–03). Until a file is added the
         <img> removes itself and the striped placeholder shows. On mobile the
         columns stack, so the images sit one under the other. ---- */
  const gainHtml=(c.svcs||[]).length?`<div class="reveal svc-block">`
    +`<h3 class="svc-sec-title">${c.benefits||sp.benefits}</h3>`
    +`<div class="svc-gain">${c.svcs.map((v,i)=>`<div class="svc-gain-item">`
        +`<div class="svc-gain-media"><img src="/Assets/Icons/services/${key}/0${i+1}.webp" alt="" loading="lazy" onerror="this.remove()"/></div>`
        +`<span class="svc-gain-num">${i+1}.</span><div class="svc-gain-body"><h4 class="svc-gain-t">${v.t}</h4><p class="svc-gain-d">${v.d}</p></div>`
      +`</div>`).join('')}</div>`
  +`</div>`:'';

  /* ---- Real projects in this category ---- */
  const rel=c.work?allWorkKeys().filter(k=>(workEntry(k).cats||[]).includes(c.work)):[];
  const relHtml=rel.length?`<div class="reveal svc-block">`
    +`<h3 class="svc-sec-title">${sp.work}</h3>`
    +`<div class="pgrid">${rel.map(wC).join('')}</div>`
    +`<div class="pgrid-more"><a class="pgrid-more-btn" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${w.allBtn} ${arrowSVG}</a></div>`
  +`</div>`:'';

  /* ---- Closing CTA: headline left, the practicalities and the button right ---- */
  const closeHtml=`<div class="reveal svc-block svc-close">`
    +`<h3 class="svc-sec-title svc-close-title">${sp.ctaTitle}</h3>`
    +`<div class="svc-close-side">`
      +`<p class="svc-close-text">${sp.ctaText}</p>`
      +`<a class="svc-close-btn" href="${routeToPath('contact')}" onclick="event.preventDefault();inquire('${subj}')">${sp.ctaBtn} ${arrowSVG}</a>`
    +`</div>`
  +`</div>`;

  /* ---- Logo shop — branding only, and only items tagged 'logo'. Sits below
         the closing CTA, as a footnote to it rather than ahead of it. ---- */
  const lgKeys=(key==='branding')?allLogoKeys().filter(k=>(LG[k].cats||[]).includes('logo')):[];
  const lgCta=lgKeys.length?(()=>{const g=t('logos');
    return`<div class="reveal svc-block lg-cta">`
      +`<h3 class="svc-sec-title">${g.ctaTitle}</h3>`
      +`<p class="lg-cta-text">${g.ctaText}</p>`
      +`<div class="pgrid lg-cta-grid">${lgKeys.slice(0,3).map(lgC).join('')}</div>`
      +`<div class="pgrid-more"><a class="pgrid-more-btn" href="${routeToPath('shop')}" onclick="event.preventDefault();go('shop')">${g.ctaBtn} ${arrowSVG}</a></div>`
    +`</div>`;})():'';

  /* The back button sits in its own <div> so it picks up the same inner rail as
     the .reveal blocks — from 1920px up .section drops its horizontal padding
     and hands it to `.section > .reveal, .section > div`, which a bare <button>
     would miss and end up flush against the viewport edge. */
  return`<section class="section svc-cat-page" style="padding-top:9rem">`
    +heroHtml+gainHtml+relHtml
  +`</section>`
  /* The packages sit on their own inverted band, so they leave the .section.
     Real projects come first, so the prices land after the proof. */
  +pricingPlansHtml(Object.assign({key},c))
  +`<section class="section svc-cat-page">`
    +closeHtml+lgCta
  +`</section>`;
}

function fontsPg(){enterFontTheme();const f=t('fonts');
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
enterFontTheme();
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
      <div class="ft-controls-divider"></div>
      <div class="ft-control-group ft-control-group-theme"><div class="ft-control-label"><span>${f.themeLabel}</span></div><div class="ft-align-btns"><button class="ft-align-btn ft-theme-btn" id="ftThemeBtn" type="button" aria-pressed="false" title="${ftPreviewLabel(baseTheme==='light')}" onclick="ftTogglePreview()">${baseTheme==='light'?MOON_SVG:SUN_SVG}</button></div></div>
    </div>
    <div class="ft-preview-area" id="ftPreviewArea"><textarea class="ft-textarea" id="ftTextarea" placeholder="${f.preview}" data-font="${fd.family}" style="font-family:'${fd.family}',sans-serif;font-size:64px;letter-spacing:0em;line-height:1.2;text-align:left">${fd.preview}</textarea></div>
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


/* ===== WORK PAGE (filterable) ===== */
const WRK_CATS=['all','brand-identity','logo-design','motion-design','3d-design','web-design','type-design'];
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

/* ===== Category dropdown (trigger + searchable option list) ===== */
/* Fold case and diacritics so "Schriftgestaltung" is found by "schrift" and
   a German keyboard is not required to reach any option. */
function wselNorm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function wselEls(){return{
  sel:document.getElementById('wselEl'),
  trig:document.getElementById('wselTrigger'),
  search:document.getElementById('wselSearch'),
  none:document.getElementById('wselNone')
}}
/* Options still visible after the search filter, in DOM order */
function wselShown(){return[...document.querySelectorAll('.wsel-opt')].filter(o=>!o.hidden)}

function wselOpen(){
  const{sel,trig,search}=wselEls();if(!sel)return;
  sel.classList.add('open');trig.setAttribute('aria-expanded','true');
  if(search){search.value='';wselFilter();search.focus()}
}
function wselClose(focusTrigger){
  const{sel,trig,search}=wselEls();if(!sel||!sel.classList.contains('open'))return;
  sel.classList.remove('open');trig.setAttribute('aria-expanded','false');
  if(search){search.value='';wselFilter()}
  if(focusTrigger)trig.focus();
}
function wselToggle(){
  const sel=document.getElementById('wselEl');
  if(sel&&sel.classList.contains('open'))wselClose(true);else wselOpen();
}
function wselFilter(){
  const{search,none}=wselEls();if(!search)return;
  const q=wselNorm(search.value.trim());
  document.querySelectorAll('.wsel-opt').forEach(o=>{
    o.hidden=!!q&&!wselNorm(o.dataset.label).includes(q);
  });
  if(none)none.hidden=wselShown().length>0;
}
/* Enter picks the first match, Arrow keys walk the list, Escape closes. */
function wselKey(e){
  const shown=wselShown();
  if(e.key==='Escape'){e.preventDefault();wselClose(true);return}
  if(e.key==='Enter'){
    if(e.target.classList.contains('wsel-search-input')&&shown.length){e.preventDefault();shown[0].click()}
    return;
  }
  if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
  e.preventDefault();
  if(!shown.length)return;
  const i=shown.indexOf(document.activeElement);
  if(i<0){shown[e.key==='ArrowDown'?0:shown.length-1].focus();return}
  const n=i+(e.key==='ArrowDown'?1:-1);
  if(n<0){wselEls().search?.focus();return}
  shown[Math.min(n,shown.length-1)].focus();
}

function setWrkCat(id){
  wrkCat=id;
  document.querySelectorAll('.wsel-opt').forEach(o=>{
    const on=o.dataset.id===id;
    o.classList.toggle('active',on);o.setAttribute('aria-selected',on?'true':'false');
  });
  const val=document.getElementById('wselValue');
  if(val)val.textContent=catLabel(id);
  wselClose(true);
  renderWrkGrid();
}

document.addEventListener('click',e=>{if(!e.target.closest('.wsel'))wselClose(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')wselClose(true)});

function wrkPg(){
  wrkCat='all';
  const w=t('wrk');
  const keys=allWorkKeys();
  const chevron='<svg class="wsel-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const magnifier='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>';
  const opts=WRK_CATS.map(id=>{
    const lb=catLabel(id),on=id==='all';
    return`<button type="button" class="wsel-opt${on?' active':''}" role="option" aria-selected="${on}" data-id="${id}" data-label="${lb}" onclick="setWrkCat('${id}')" onkeydown="wselKey(event)">${lb}</button>`;
  }).join('');
  return`<section class="section" style="padding-top:9rem"><div class="reveal">`
    +`<h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2>`
    +`<p class="section-text" data-anim="words" data-anim-stagger="20">${w.text}</p>`
    +`<div class="wbar">`
      +`<div class="wbar-row">`
        +`<span class="wbar-label" id="wselLabel">${w.filterLabel}</span>`
        +`<div class="wsel" id="wselEl">`
          +`<button type="button" class="wsel-trigger" id="wselTrigger" aria-haspopup="listbox" aria-expanded="false" aria-controls="wselOpts" aria-labelledby="wselLabel wselValue" onclick="wselToggle()">`
            +`<span class="wsel-value" id="wselValue">${catLabel('all')}</span>${chevron}`
          +`</button>`
          +`<div class="wsel-panel">`
            +`<div class="wsel-search">${magnifier}<input type="text" class="wsel-search-input" id="wselSearch" placeholder="${w.filterSearch}" aria-label="${w.filterSearch}" autocomplete="off" oninput="wselFilter()" onkeydown="wselKey(event)"></div>`
            +`<div class="wsel-opts" id="wselOpts" role="listbox" aria-label="${w.filterLabel}">${opts}</div>`
            +`<p class="wsel-none" id="wselNone" hidden>${w.filterNone}</p>`
          +`</div>`
        +`</div>`
      +`</div>`
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

function contactPg(){const c=t('contact');
/* Carried over from an enquiry button; used once, then cleared so a later
   visit to /contact starts empty. */
const subjPrefill=pendingSubject?htmlEsc(pendingSubject):'';pendingSubject='';
const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const titleHtml=lang==='en'?'Get in <em>touch</em>':'Kontakt <em>aufnehmen</em>';
const tosAfter=c.tosAfter?' '+c.tosAfter:'';
return`<div class="contact-page"><div class="contact-top"><div class="contact-header-inner"><h1 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${titleHtml}</h1><p class="contact-intro" data-anim="words" data-anim-stagger="20" data-anim-delay="200">${c.intro}</p></div></div><div class="contact-body"><div class="contact-form-wrap"><form class="contact-form" id="contactForm" onsubmit="return handleContact(event)"><div class="cf-group"><label>${c.name} <span class="req">*</span></label><input type="text" name="name" required placeholder="${c.name}"/></div><div class="cf-group"><label>${c.email} <span class="req">*</span></label><input type="email" name="email" required placeholder="${c.email}"/></div><div class="cf-group"><label>${c.subject}</label><input type="text" name="subject" maxlength="200" placeholder="${c.subjectPh}" value="${subjPrefill}"/></div><div class="cf-group"><label>${c.message} <span class="req">*</span></label><textarea name="message" required maxlength="5000" placeholder="${c.message}…"></textarea></div><div class="cf-tos-group"><label class="cf-tos-label"><input type="checkbox" name="tos" id="cfTos"/><span class="cf-tos-check"></span><span class="cf-tos-text">${c.tos} <a href="${routeToPath('tos')}" onclick="event.preventDefault();go('tos')">${c.tosLink}</a>${tosAfter}</span></label></div><div class="cf-turnstile" id="cfTurnstile"></div><div class="cf-error" id="cfError"></div><div><button type="submit" class="cf-submit" id="cfSubmitBtn">${c.submit} ${arrowSVG}</button></div><p class="cf-alt">${c.altMail} <a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a></p></form><div class="cf-success" id="cfSuccess"><h3>${c.success}</h3><p>${c.successMsg}</p></div></div></div></div>`}
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
function ftrH(r){const f=t('ftr');
/* The service pages close with their own CTA, so the footer one would repeat it */
const ctaHtml=(r==='contact'||SVC_CATS.includes(r))?'':`<a class="fcta" data-cl="${lang==='en'?'Contact':'Kontakt'}" href="${routeToPath('contact')}" onclick="event.preventDefault();go('contact')">${f.cta} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>`;

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
  /* A flat SVG mark is pure black on transparent — give it a light plate so it
     stays visible on the dark lightbox overlay */
  img.classList.toggle('lb-svgimg',/\.svg(\?|$)/i.test(lbImages[lbIdx]||''));
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
    img.classList.toggle('lb-svgimg',/\.svg(\?|$)/i.test(lbImages[lbIdx]||''));
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

  /* Wheel zoom, anchored on the cursor so the point under it stays put.
     With transform `scale(s) translate(t)` about the centre, a point p maps to
     s*(p+t); holding the screen offset c fixed across s0 -> s1 gives
     t1 = t0 + c*(1/s1 - 1/s0). */
  document.addEventListener('wheel',e=>{
    const lb=document.getElementById('lightbox');
    if(!lb||!lb.classList.contains('show'))return;
    const wrap=e.target.closest('.lightbox-img-wrap');
    if(!wrap)return;
    e.preventDefault();
    /* deltaMode 1 is lines, not pixels — normalise before scaling */
    const raw=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?wrap.clientHeight:1);
    const step=Math.max(-60,Math.min(60,-raw*0.35));
    const next=Math.max(100,Math.min(300,lbZoomVal+step));
    if(next===lbZoomVal)return;
    const s0=lbZoomVal/100,s1=next/100;
    const r=wrap.getBoundingClientRect();
    const cx=e.clientX-(r.left+r.width/2);
    const cy=e.clientY-(r.top+r.height/2);
    lbPanX+=cx*(1/s1-1/s0);
    lbPanY+=cy*(1/s1-1/s0);
    lbSetZoom(next);
  },{passive:false});
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

/* ===== THEME =====
   `baseTheme` is the user's choice (dark | light) and is the only thing stored.
   Project detail and font pages render it as the neutral "project" variant so
   the work sets the colour; individual sections can still opt into the light
   palette locally via data-theme. */
function setTheme(t){theme=t;document.body.dataset.theme=t}
function projectVariant(){return baseTheme==='light'?'lightproject':'darkproject'}

/* Project detail pages — neutral palette so the work sets the colour */
function enterProjectTheme(){setTheme(projectVariant())}

function exitProjectTheme(){setTheme(baseTheme)}

/* Font pages use the same neutral variant as the project pages */
function enterFontTheme(){setTheme(projectVariant())}

/* Switch between dark and light. Stored as a functional preference (no cookie
   consent needed) and re-rendered, because a few pages pick assets by theme. */
function setBaseTheme(next){
  if(next===baseTheme)return;
  baseTheme=next;
  try{localStorage.setItem('noir-theme',next)}catch(e){}
  /* Paint it before rendering: page builders run before navH() and some of them
     pick assets by theme (the FAQ artwork, the services images). Project and
     font pages re-enter their own variant during their render. */
  setTheme(next);
  render(hr(),'theme');
}

/* Toggle in .ft-controls — it only repaints the preview area so the specimen
   can be judged on a light ground; the page around it stays dark. Same trick as
   the light sections on the home page: data-theme is an attribute selector, so
   putting it on the element gives that subtree the light palette. Not stored,
   and no re-render, which keeps the typed text and slider positions. */
function ftTogglePreview(){
  const area=document.getElementById('ftPreviewArea');
  if(!area)return;
  /* Flips to the opposite of the page it sits on, so it works in either theme */
  const opposite=baseTheme==='light'?'darkproject':'lightproject';
  const flipped=area.getAttribute('data-theme')!==opposite;
  if(flipped)area.setAttribute('data-theme',opposite);
  else area.removeAttribute('data-theme');
  const btn=document.getElementById('ftThemeBtn');
  if(btn){
    const showsLight=flipped?opposite==='lightproject':baseTheme==='light';
    btn.innerHTML=showsLight?MOON_SVG:SUN_SVG;
    btn.setAttribute('aria-pressed',flipped?'true':'false');
    btn.title=ftPreviewLabel(showsLight);
  }
}
function ftPreviewLabel(isLight){
  if(lang==='en')return isLight?'Dark preview':'Light preview';
  return isLight?'Dunkle Vorschau':'Helle Vorschau';
}

/* Escape closes the services submenu first, then the island */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(setMenuIsOpen()){
    const trig=document.getElementById('setTrigger');
    const refocus=!!(trig&&document.activeElement&&trig.parentElement.contains(document.activeElement));
    setMenuClose();
    if(refocus)trig.focus();
    return;
  }
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
  if(!svcSubBarMode())return;
  if(svcSubIsOpen()&&!e.target.closest('#svcMenuItem'))svcSubClose();
  if(setMenuIsOpen()&&!e.target.closest('#setMenu'))setMenuClose();
});

document.addEventListener('DOMContentLoaded',()=>{
  /* Restore the stored appearance before the first render */
  try{const saved=localStorage.getItem('noir-theme');if(saved==='light'||saved==='dark')baseTheme=saved}catch(e){}
  setTheme(baseTheme);
  const r=hr();
  history.replaceState({r},'',routeToPath(r));
  render(r);
  isFirstRender=false;
  try{if(!localStorage.getItem('ck'))showCk()}catch(e){showCk()}
});
