/* ===== HERO CANVAS — Fluid Gradient Blobs (Koto-inspired) ===== */
let heroCanvas=null, heroCtx=null, heroRAF=null;
let canvasMX=0.5, canvasMY=0.5;
let blobs=[];

function initHeroCanvas(){
  heroCanvas=document.getElementById('heroCanvas');
  if(!heroCanvas)return;
  heroCtx=heroCanvas.getContext('2d');

  blobs=[
    {x:0.3,y:0.4,tx:0.3,ty:0.4,r:0.35,color:'#1a3a8f',vx:0,vy:0},
    {x:0.7,y:0.6,tx:0.7,ty:0.6,r:0.3,color:'#0d2266',vx:0,vy:0},
    {x:0.5,y:0.3,tx:0.5,ty:0.3,r:0.28,color:'#2952cc',vx:0,vy:0},
    {x:0.2,y:0.8,tx:0.2,ty:0.8,r:0.22,color:'#4169e1',vx:0,vy:0},
    {x:0.8,y:0.2,tx:0.8,ty:0.2,r:0.2,color:'#1e40af',vx:0,vy:0},
  ];

  resizeHeroCanvas();
  window.addEventListener('resize',resizeHeroCanvas);

  const wrap=heroCanvas.parentElement;
  wrap.addEventListener('mousemove',e=>{
    const rect=wrap.getBoundingClientRect();
    canvasMX=(e.clientX-rect.left)/rect.width;
    canvasMY=(e.clientY-rect.top)/rect.height;
  });
  wrap.addEventListener('mouseleave',()=>{canvasMX=0.5;canvasMY=0.5});
  wrap.addEventListener('touchmove',e=>{
    const rect=wrap.getBoundingClientRect();
    const t=e.touches[0];
    canvasMX=(t.clientX-rect.left)/rect.width;
    canvasMY=(t.clientY-rect.top)/rect.height;
  },{passive:true});

  drawHeroCanvas();
}

function resizeHeroCanvas(){
  if(!heroCanvas)return;
  const wrap=heroCanvas.parentElement;
  const w=wrap.clientWidth;
  const h=wrap.clientHeight;
  /* On ultrawide (3440px+) cap DPR at 1.5 to avoid huge canvas buffers */
  const maxDPR=w>3000?1.5:2;
  const dpr=Math.min(window.devicePixelRatio||1,maxDPR);
  heroCanvas.width=w*dpr;
  heroCanvas.height=h*dpr;
  heroCtx.scale(dpr,dpr);
}

function drawHeroCanvas(){
  if(!heroCanvas||!heroCtx)return;
  const w=heroCanvas.parentElement.clientWidth;
  const h=heroCanvas.parentElement.clientHeight;

  const isDark=document.body.dataset.theme!=='light';
  heroCtx.fillStyle=isDark?'#050508':'#e8e8ec';
  heroCtx.fillRect(0,0,w,h);

  blobs.forEach((b,i)=>{
    const influence=0.12+i*0.02;
    const offsetX=(i%2===0?1:-1)*0.08;
    const offsetY=(i%3===0?1:-1)*0.06;
    b.tx=canvasMX+offsetX;
    b.ty=canvasMY+offsetY;
    b.x+=(b.tx-b.x)*(0.008+i*0.003);
    b.y+=(b.ty-b.y)*(0.008+i*0.003);

    const time=Date.now()*0.0003;
    const floatX=Math.sin(time+i*1.7)*0.03;
    const floatY=Math.cos(time+i*2.3)*0.025;

    const cx=b.x*w+floatX*w;
    const cy=b.y*h+floatY*h;
    /* Use the geometric mean of w and h instead of max — prevents blobs from
       becoming disproportionately huge on ultrawide aspect ratios */
    const refDim=Math.sqrt(w*h);
    const rad=b.r*refDim;

    const grad=heroCtx.createRadialGradient(cx,cy,0,cx,cy,rad);
    if(isDark){
      grad.addColorStop(0,b.color+'cc');
      grad.addColorStop(0.4,b.color+'66');
      grad.addColorStop(1,b.color+'00');
    }else{
      grad.addColorStop(0,b.color+'55');
      grad.addColorStop(0.4,b.color+'22');
      grad.addColorStop(1,b.color+'00');
    }
    heroCtx.fillStyle=grad;
    heroCtx.fillRect(0,0,w,h);
  });

  if(isDark){
    heroCtx.fillStyle='rgba(255,255,255,0.012)';
    for(let i=0;i<80;i++){
      const rx=Math.random()*w;
      const ry=Math.random()*h;
      heroCtx.fillRect(rx,ry,1,1);
    }
  }

  heroRAF=requestAnimationFrame(drawHeroCanvas);
}

function destroyHeroCanvas(){
  if(heroRAF)cancelAnimationFrame(heroRAF);
  heroRAF=null;heroCanvas=null;heroCtx=null;
  window.removeEventListener('resize',resizeHeroCanvas);
}

/* ===== HERO SCROLL ANIMATION ===== */
let heroScrollBound=false;
function initHeroScroll(){
  if(heroScrollBound)return;
  heroScrollBound=true;
  const onScroll=()=>{
    const wrap=document.getElementById('heroCanvasWrap');
    if(!wrap)return;
    const maxScroll=window.innerHeight*0.5;
    const progress=Math.min(Math.max(window.scrollY/maxScroll,0),1);

    const scale=1-progress*0.08;
    const radius=progress*0;
    const translateY=progress*-10;
    wrap.style.transform=`scale(${scale}) translateY(${translateY}px)`;
    wrap.style.borderRadius=radius+'px';

    const textLayer=document.getElementById('heroTextLayer');
    const btnLayer=document.getElementById('heroBtnLayer');
    if(textLayer){
      textLayer.style.transform=`translateY(${progress*-40}px)`;
      textLayer.style.opacity=1-progress*0.6;
    }
    if(btnLayer){
      btnLayer.style.transform=`translateY(${progress*-30}px)`;
      btnLayer.style.opacity=1-progress*0.7;
    }
  };
  window.addEventListener('scroll',onScroll,{passive:true});
}
