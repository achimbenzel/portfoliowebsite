/* ===== FLOATING ISLAND NAV ===== */
function navH(r){
/* Exit project theme on every render; projPg will re-enter if needed */
if(r&&!r.startsWith('work/')&&!r.startsWith('my-fonts'))exitProjectTheme();
const initCls=isFirstRender?' nav-initial':'';
const n=t('nav');
const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const sunSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
const moonSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
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
    <a class="island-menu-link" href="${routeToPath('services')}" onclick="event.preventDefault();go('services')">${n.svc}</a>
    <a class="island-menu-link" href="${routeToPath('work')}" onclick="event.preventDefault();go('work')">${n.wrk}</a>
    <a class="island-menu-link" href="${routeToPath('my-fonts')}" onclick="event.preventDefault();go('my-fonts')">${n.fonts}</a>
    <a class="island-menu-link" href="${routeToPath('about')}" onclick="event.preventDefault();go('about')">${n.abt}</a>
    <a class="island-menu-link" href="${routeToPath('contact')}" onclick="event.preventDefault();go('contact')">${n.contact}</a>
    <div class="island-menu-footer">
      <button class="nav-toggle-btn" onclick="tL()">${lang==='en'?'DE':'EN'}</button>
      <button class="nav-toggle-btn" onclick="tT()">${themeSVG}</button>
    </div>
  </div>
</nav></div>`}

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
  const h=t('hero'),w=t('wrk'),keys=Object.keys(P).slice(0,3);
  const arrowSVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  return`<section class="hero-rickroll">
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
    <span class="hero-accent-text">${lang==='en'?'Strategy':'Strategie'}</span><span class="hero-accent-dot">·</span>
    <span class="hero-accent-text">Intuition</span><span class="hero-accent-dot">·</span>
    <span class="hero-accent-text">${lang==='en'?'Design':'Design'}</span>
  </div></section>
  <section class="story-section"><div class="reveal"><p class="story-text" data-anim="words" data-anim-stagger="18" data-anim-duration="500">${
    lang==='en'
      ?'As an independent designer, I build identities with <em>substance</em>. I connect strategy and design, bridging intuitive ideas and well-considered systems. The result: brands that are clearly positioned and built for <em>lasting impact</em>.'
      :'Als freiberuflicher Designer entwickle ich Identitäten mit <em>Substanz</em>. Ich verbinde Strategie und Gestaltung, zwischen intuitiven Ideen und durchdachten Systemen. So entstehen Marken, die klar positioniert sind und <em>nachhaltig wirken</em>.'
  }</p></div></section>
  <section class="section"><div class="reveal">
    <h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2>
    <div class="wgrid home-grid">${keys.map(wC).join('')}</div>
  </div></section>
  ${faqHtml()}`
}

function wC(slug){const p=P[slug][lang],f=P[slug].f,c=P[slug].c;return`<a class="witem ${f?'feat':''}" data-cl="${lang==='en'?'View':'Ansehen'}" href="${routeToPath('work/'+slug)}" onclick="event.preventDefault();go('work/${slug}')"><img src="${P[slug].imgs?.[0] || vg(1600,900,p.title.split('—')[0].trim(),c)}" alt="${p.title}" loading="lazy"/><div class="woverlay"><h3>${p.title}</h3></div></a>`}

function projPg(slug){const proj=P[slug];if(!proj)return'<section class="section" style="padding-top:9rem"><h2>Not found</h2></section>';
enterProjectTheme();
const p=proj[lang],pt=t('prj'),c=proj.c;
const th=proj.theme||{};const thStyle=[th.bg?`--pdetail-bg:${th.bg}`:'',th.h1?`--pdetail-h1:${th.h1}`:'',th.dt?`--pdetail-dt:${th.dt}`:'',th.p?`--pdetail-p:${th.p}`:'',th.text2?`--pdetail-text2:${th.text2}`:'']. filter(Boolean).join(';');

/* Collect all image paths for lightbox */
const allImgs=proj.imgs||[];
const imgJson=JSON.stringify(allImgs).replace(/'/g,'&#39;');

/* Helper: render a clickable image frame */
function imgFrame(imgIdx,fallbackW,fallbackH,fallbackLabel){
  const src=allImgs[imgIdx]||vg(fallbackW,fallbackH,fallbackLabel,c);
  return`<div class="pgal-frame"><img src="${src}" onclick="lbOpen(JSON.parse(document.getElementById('pgal').dataset.imgs),${imgIdx})"/></div>`;
}

/* Build gallery blocks from layout array or fall back to legacy */
let galHtml='';
const layout=proj.layout;
if(layout&&layout.length){
  layout.forEach(block=>{
    switch(block.type){
      case 'hero':
        galHtml+=imgFrame(0,1600,900,'HERO IMAGE');
        break;
      case 'full':
        galHtml+=`<div class="reveal">${imgFrame(block.image,1600,700,'DETAIL',c)}</div>`;
        break;
      case 'pair':
        galHtml+=`<div class="reveal"><div class="irow">${block.images.map(i=>imgFrame(i,780,520,'DETAIL')).join('')}</div></div>`;
        break;
      case 'centerblock':{
        const bd=block[lang]||block.en;
        galHtml+=`<div class="reveal"><div class="centerblock"><h3 data-anim="words" data-anim-stagger="25">${bd.h}</h3><p data-anim="lines" data-anim-delay="100">${bd.p}</p></div></div>`;
        break;}
      case 'cblock':{
        const bd=block[lang]||block.en;
        galHtml+=`<div class="reveal"><div class="cblock"><div class="cblock-label" data-anim="words" data-anim-stagger="25">${bd.h}</div><div class="cblock-body"><p data-anim="lines" data-anim-delay="100">${bd.p}</p></div></div></div>`;
        break;}
    }
  });
}else{
  /* Legacy fallback: hero + pair + optional 4th image */
  const legacyImgs=[
    allImgs[0]||vg(1600,900,'HERO IMAGE',c),
    allImgs[1]||vg(780,520,'DETAIL 01',c),
    allImgs[2]||vg(780,520,'DETAIL 02',c)
  ];
  galHtml+=imgFrame(0,1600,900,'HERO IMAGE');
  galHtml+=`<div class="irow">${imgFrame(1,780,520,'DETAIL 01')}${imgFrame(2,780,520,'DETAIL 02')}</div>`;
  if(proj.n>3) galHtml+=imgFrame(3,1600,700,'DETAIL 03');
}

let testiHtml='';
if(proj.testimonial){const ti=proj.testimonial,td=ti[lang];const photoSrc=ti.photo||vg(64,64,'',c);testiHtml=`<div class="ptestimonial"><div class="ptesti-inner"><img class="ptesti-photo" src="${photoSrc}" alt="${td.name}"/><div class="ptesti-content"><div class="ptesti-label">${lang==='en'?'Testimonial':'Kundenstimme'}</div><div class="ptesti-name">${td.name}</div><div class="ptesti-role">${td.role}</div><p class="ptesti-quote">"${td.quote}"</p></div></div></div>`}
return`<div class="pdetail"${thStyle?' style="'+thStyle+'"':''}><button class="pback" onclick="history.back()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ${pt.back}</button><div class="pheader"><h1 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${p.title}</h1><dl class="pmeta" data-anim="fade" data-anim-delay="300"><div><dt>${pt.cl}</dt><dd>${p.cl}</dd></div><div><dt>${pt.yr}</dt><dd>${p.yr}</dd></div><div><dt>${pt.sc}</dt><dd>${p.sc}</dd></div><div><dt>${pt.ind}</dt><dd>${p.ind}</dd></div></dl></div><p class="pdesc" data-anim="words" data-anim-stagger="18" data-anim-delay="200">${p.desc}</p><div class="pgal" id="pgal" data-imgs='${imgJson}'>${galHtml}</div>${testiHtml}</div>`}

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


function legPg(type){const d=t(type);
/* Parse h2 headings from the raw HTML to build navigation */
const headings=[];
const contentHtml=d.h.replace(/<h2>(.*?)<\/h2>/g,(match,title)=>{
  const id='lsec-'+headings.length;
  headings.push({id,title});
  return`<h2 id="${id}" data-anim="words" data-anim-stagger="22">${title}</h2>`;
});
/* Add line animations to paragraphs */
const animatedHtml=contentHtml.replace(/<p>/g,'<p data-anim="lines" data-anim-delay="80">');
const navLabel=lang==='en'?'Navigate to':'Navigation';
const navHtml=headings.length?`<nav class="lpage-nav"><div class="lpage-nav-label">${navLabel}</div>${headings.map(h=>`<a class="lpage-nav-link" href="#${h.id}" onclick="event.preventDefault();scrollToLegalSection('${h.id}')">${h.title}</a>`).join('')}</nav>`:'';
return`<div class="lpage lpage-with-nav"><button class="pback" onclick="history.back()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ${lang==='en'?'Back':'Zurück'}</button><h1 data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${d.title}</h1><div class="lpage-layout">${navHtml}<div class="lpage-content">${animatedHtml}</div></div></div>`}

/* TOS — now served from i18n like imp/prv */
function tosPg(){return legPg('tos')}

/* ===== FONTS DATA ===== */
/* FONTS array is loaded from fonts-data.js (generated by build-fonts.js) */

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

function wrkPg(){const w=t('wrk');return`<section class="section" style="padding-top:9rem"><div class="reveal"><h2 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${w.title}</h2><p class="section-text" data-anim="words" data-anim-stagger="20">${w.text}</p><div class="wgrid home-grid" style="margin-top:4rem">${Object.keys(P).map(wC).join('')}</div></div></section>`}

function cselHtml(name,label,opts,ph,req){
const chevron='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
return`<div class="cf-group"><label>${label}${req?' <span class="req">*</span>':''}</label><div class="csel" data-name="${name}"><input type="hidden" name="${name}" value=""${req?' required':''}/><button type="button" class="csel-trigger placeholder" onclick="cselToggle(this)">${ph} ${chevron}</button><div class="csel-opts">${opts.map(o=>`<div class="csel-opt" onclick="cselPick(this,'${o.replace(/'/g,"\\'")}')">${o}</div>`).join('')}</div></div></div>`}

function cselToggle(btn){
const csel=btn.parentElement;const wasOpen=csel.classList.contains('open');
document.querySelectorAll('.csel.open').forEach(el=>el.classList.remove('open'));
if(!wasOpen)csel.classList.add('open');
}
function cselPick(opt,val){
const csel=opt.closest('.csel');const trigger=csel.querySelector('.csel-trigger');const hidden=csel.querySelector('input[type=hidden]');
hidden.value=val;
const svg=trigger.querySelector('svg').outerHTML;
trigger.innerHTML=val+' '+svg;
trigger.classList.remove('placeholder');
csel.querySelectorAll('.csel-opt').forEach(o=>o.classList.remove('active'));
opt.classList.add('active');
csel.classList.remove('open');
}
document.addEventListener('click',e=>{if(!e.target.closest('.csel'))document.querySelectorAll('.csel.open').forEach(el=>el.classList.remove('open'))});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.csel.open').forEach(el=>el.classList.remove('open'))});

function contactPg(){const c=t('contact');const arrowSVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const titleHtml=lang==='en'?'Get in <em>touch</em>':'Kontakt <em>aufnehmen</em>';
const tosAfter=c.tosAfter?' '+c.tosAfter:'';
return`<div class="contact-page"><div class="contact-top"><div class="contact-header-inner"><h1 class="hw" data-anim="chars" data-anim-stagger="22" data-anim-duration="550">${titleHtml}</h1><p class="contact-intro" data-anim="words" data-anim-stagger="20" data-anim-delay="200">${c.intro}</p></div></div><div class="contact-body"><div class="contact-form-wrap"><form class="contact-form" id="contactForm" onsubmit="return handleContact(event)"><div class="cf-group"><label>${c.name} <span class="req">*</span></label><input type="text" name="name" required placeholder="${c.name}"/></div><div class="cf-group"><label>${c.brand} <span class="req">*</span></label><input type="text" name="brand" required placeholder="${c.brand}"/></div><div class="cf-group"><label>${c.phone}</label><input type="tel" name="phone" placeholder="${c.phone}"/></div><div class="cf-group"><label>${c.email} <span class="req">*</span></label><input type="email" name="email" required placeholder="${c.email}"/></div>${cselHtml('hear',c.hear,c.hearOpts,c.selectPh,true)}${cselHtml('timeline',c.timeline,c.timeOpts,c.selectPh,true)}${cselHtml('budget',c.budget,c.budgetOpts,c.selectPh,true)}<div class="cf-group"><label>${c.message} <span class="req">*</span></label><p style="font-size:.78rem;color:var(--text3);font-weight:200;margin-bottom:.3rem;line-height:1.5">${c.messageSub}</p><textarea name="message" required maxlength="5000" placeholder="${c.message}…"></textarea></div><div class="cf-tos-group"><label class="cf-tos-label"><input type="checkbox" name="tos" id="cfTos"/><span class="cf-tos-check"></span><span class="cf-tos-text">${c.tos} <a href="${routeToPath('tos')}" onclick="event.preventDefault();go('tos')">${c.tosLink}</a>${tosAfter}</span></label></div><div class="cf-turnstile" id="cfTurnstile"></div><div class="cf-error" id="cfError"></div><div><button type="submit" class="cf-submit" id="cfSubmitBtn">${c.submit} ${arrowSVG}</button></div></form><div class="cf-success" id="cfSuccess"><h3>${c.success}</h3><p>${c.successMsg}</p></div></div></div></div>`}
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
  /* Disable button */
  btn.disabled=true;btn.textContent=c.sending;
  /* Send */
  fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
    .then(r=>{if(!r.ok)throw new Error();return r.json()})
    .then(()=>{form.style.display='none';document.getElementById('cfSuccess').style.display='block'})
    .catch(()=>{errEl.textContent=c.errSend;errEl.style.display='block';btn.disabled=false;btn.innerHTML=c.submit+' '+document.querySelector('.cf-submit svg').outerHTML;if(typeof turnstile!=='undefined')turnstile.reset('#cfTurnstile')})
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

return`<footer class="footer"><div class="footer-inner"><div class="ftop"><div><div class="fbrand"><img class="nav-logo-img nav-logo-dark" src="/Assets/Logo/logo_wide_dark.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light" src="/Assets/Logo/logo_wide_light.svg" alt="Achim"/><img class="nav-logo-img nav-logo-dark-project" src="/Assets/Logo/logo_wide_dark_project.svg" alt="Achim"/><img class="nav-logo-img nav-logo-light-project" src="/Assets/Logo/logo_wide_light_project.svg" alt="Achim"/></div><p class="ftag">${f.tag}</p></div>${ctaHtml}</div><div class="fmid"><div class="fsocial">${makeLetterLink('LinkedIn','https://www.linkedin.com/in/achim-benzel-9a1890279/')}${makeLetterLink('Instagram','https://instagram.com/achimbenzel')}${makeLetterLink('Behance','https://behance.net/achimbenzel')}${makeLetterLink('Pinterest','https://pinterest.com/achimbenzel/_created/')}</div></div><div class="fbot"><span>${f.copy}</span><div class="flegal"><a href="${routeToPath('imprint')}" onclick="event.preventDefault();go('imprint')">${f.imp}</a><a href="${routeToPath('privacy')}" onclick="event.preventDefault();go('privacy')">${f.priv}</a><a href="${routeToPath('tos')}" onclick="event.preventDefault();go('tos')">${f.tos}</a></div></div></div></footer>`}

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

/* Close island on Escape */
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mob)tM()});

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
