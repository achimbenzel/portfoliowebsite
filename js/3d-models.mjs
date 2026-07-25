import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';

/* ===== Shared helpers ===== */
function createDracoLoader(){
  const draco=new DRACOLoader();
  draco.setDecoderPath('/Assets/vendor/draco/');
  return draco;
}

function setupRenderer(isDark){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,premultipliedAlpha:false});
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=isDark===false?1.6:1.2; /* LIGHT MODE — slightly higher exposure (change to taste) */
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  return renderer;
}

function setupLights(scene,isDark){
  /* Both modes use the same base lighting setup.
     Light mode adds one extra fill to lift the dark back-right area. */

  const ambientLight=new THREE.AmbientLight(0x404060,20.6);
  scene.add(ambientLight);

  const keyLight=new THREE.DirectionalLight(0xddeeff,25.8);
  keyLight.position.set(3,4,5);
  keyLight.castShadow=true;
  keyLight.shadow.mapSize.width=1024;
  keyLight.shadow.mapSize.height=1024;
  keyLight.shadow.bias=-0.001;
  scene.add(keyLight);

  const fillLight=new THREE.DirectionalLight(0x007588,40.7);
  fillLight.position.set(-4,2,2);
  scene.add(fillLight);

  const rimLight=new THREE.DirectionalLight(0x007588,40.0);
  rimLight.position.set(-1,3,-4);
  scene.add(rimLight);

  const bounceLight=new THREE.DirectionalLight(0x006eb2,40.3);
  bounceLight.position.set(0,-3,1);
  scene.add(bounceLight);

  /* === LIGHT MODE ONLY: extra fill from right + slightly behind ===
     Lifts the dark back-right area that no other light reaches.
     Uses same tone as the scene but positioned to fill the gap. */
  const lightModeFill=new THREE.DirectionalLight(
    0x88aacc,  /* LIGHT MODE FILL — color (change to taste) */
    35.0       /* LIGHT MODE FILL — intensity (change to taste) */
  );
  lightModeFill.position.set(
    5,   /* LIGHT MODE FILL — X: far right (change to taste) */
    1,   /* LIGHT MODE FILL — Y: slightly above center (change to taste) */
    -3   /* LIGHT MODE FILL — Z: behind the object (change to taste) */
  );
  lightModeFill.visible=!isDark;
  scene.add(lightModeFill);

  return {ambientLight,keyLight,fillLight,rimLight,bounceLight,lightModeFill};
}

function loadModel(loader,url,scene,state,opts,onDone){
  loader.load(url,
    (gltf)=>{
      if(!state.active)return;
      const model=gltf.scene;
      const box=new THREE.Box3().setFromObject(model);
      const center=box.getCenter(new THREE.Vector3());
      const size=box.getSize(new THREE.Vector3());
      const maxDim=Math.max(size.x,size.y,size.z);
      const scale=(opts.scale||2.2)/maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.traverse(child=>{if(child.isMesh){child.castShadow=true;child.receiveShadow=true}});

      const pivot=new THREE.Group();
      pivot.add(model);
      scene.add(pivot);
      state.model=pivot;

      if(opts.rotation){
        pivot.rotation.x=opts.rotation.x||0;
        pivot.rotation.y=opts.rotation.y||0;
        pivot.rotation.z=opts.rotation.z||0;
      }

      if(gltf.animations&&gltf.animations.length){
        const mixer=new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip=>mixer.clipAction(clip).play());
        state.mixer=mixer;
      }

      /* Elastic entrance */
      pivot.scale.set(0.001,0.001,0.001);
      const t0=performance.now();
      (function ent(){
        const p=Math.min((performance.now()-t0)/800,1);
        const e=p>=1?1:1-Math.pow(2,-10*p)*Math.cos((p*10-0.75)*2.094);
        pivot.scale.setScalar(Math.max(0.001,e));
        if(p<1)requestAnimationFrame(ent);
      })();

      if(onDone)onDone();
    },
    undefined,
    (err)=>{console.warn('3D load error ('+url+'):',err)}
  );
}

function setupMouseParallax(container){
  let mouseX=0,mouseY=0;
  container.addEventListener('mousemove',e=>{
    const r=container.getBoundingClientRect();
    mouseX=((e.clientX-r.left)/r.width-0.5)*2;
    mouseY=((e.clientY-r.top)/r.height-0.5)*2;
  });
  container.addEventListener('mouseleave',()=>{mouseX=0;mouseY=0});
  return {get x(){return mouseX},get y(){return mouseY}};
}

function createAnimLoop(state,clock,renderer,scene,camera,mouse,opts){
  let time=0;
  const tRot={x:0,y:0};
  const mx=opts.mouseSensitivity||{x:0.15,y:0.25};
  (function animate(){
    if(!state.active)return;
    state.animId=requestAnimationFrame(animate);
    const delta=clock.getDelta();
    time+=delta;
    if(state.mixer)state.mixer.update(delta);
    const m=state.model;
    if(m){
      m.rotation.y+=delta*0.3;
      m.position.y=Math.sin(time*1.2)*0.06;
      tRot.x+=(mouse.y*mx.x-tRot.x)*0.05;
      tRot.y+=(mouse.x*mx.y-tRot.y)*0.05;
      m.rotation.x=tRot.x;
      m.rotation.y+=tRot.y*delta;
    }
    renderer.render(scene,camera);
  })();
}

function setupResize(container,camera,renderer,state){
  const obs=new ResizeObserver(entries=>{
    if(!state.active)return;
    for(const entry of entries){
      const cr=entry.contentRect;
      if(cr.width>0&&cr.height>0){
        camera.aspect=cr.width/cr.height;
        camera.updateProjectionMatrix();
        renderer.setSize(cr.width,cr.height);
      }
    }
  });
  obs.observe(container);
  return obs;
}

function setupThemeWatch(lights,state){
  const obs=new MutationObserver(()=>{
    if(!state.active)return;
    const d=document.body.getAttribute('data-theme')!=='light';
    /* Toggle the extra light-mode fill (lights up back-right dark spots) */
    if(lights.lightModeFill) lights.lightModeFill.visible=!d;
    /* Slightly higher exposure in light mode to brighten the scene overall */
    if(state.renderer){
      state.renderer.toneMappingExposure=d?1.2:1.6; /* LIGHT MODE — exposure boost (change to taste) */
    }
  });
  obs.observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  return obs;
}

function destroy(state){
  if(!state)return;
  state.active=false;
  if(state.animId)cancelAnimationFrame(state.animId);
  if(state.resizeObs)state.resizeObs.disconnect();
  if(state.themeObs)state.themeObs.disconnect();
  if(state.renderer){
    state.renderer.dispose();
    state.renderer.forceContextLoss();
    const c=state.renderer.domElement;
    if(c&&c.parentNode)c.parentNode.removeChild(c);
  }
}

/* ===== FAQ 3D (Key) ===== */
let _faq3d=null;

window._destroyFaq3D=function(){
  destroy(_faq3d);
  _faq3d=null;
};

window._startFaq3D=function(){
  window._destroyFaq3D();
  const container=document.getElementById('faq3dContainer');
  const fallback=document.getElementById('faq3dFallback');
  if(!container)return;

  const isDark=document.body.getAttribute('data-theme')!=='light';
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,0.1,100);
  camera.position.set(0,0,7);

  const renderer=setupRenderer(isDark);
  const rect=container.getBoundingClientRect();
  const w=Math.max(rect.width,200);
  const h=Math.max(rect.height,200);
  renderer.setSize(w,h);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();

  /* WHITE FLASH FIX: render one transparent frame BEFORE appending to DOM */
  renderer.render(scene,camera);
  container.appendChild(renderer.domElement);
  if(fallback)fallback.style.display='none';

  const lights=setupLights(scene,isDark);
  const mouse=setupMouseParallax(container);
  const clock=new THREE.Clock();

  _faq3d={active:true,scene,camera,renderer,model:null,mixer:null,clock,animId:null,resizeObs:null,themeObs:null};

  const loader=new GLTFLoader();
  loader.setDRACOLoader(createDracoLoader());

  loadModel(loader,'/Assets/3dmodel/Key.glb',scene,_faq3d,{    scale:2.2,
      rotation:{x:-45.3,y:180.0,z:-120}},()=>{
    /* Canvas becomes visible via CSS transition after model loads */
    renderer.domElement.classList.add('visible');
  });

  createAnimLoop(_faq3d,clock,renderer,scene,camera,mouse,{mouseSensitivity:{x:1.15,y:1.25}});
  _faq3d.resizeObs=setupResize(container,camera,renderer,_faq3d);
  _faq3d.themeObs=setupThemeWatch(lights,_faq3d);
};

/* ===== STRATEGY 3D (Pawn) ===== */
let _strat3d=null;

window._destroyStrategy3D=function(){
  destroy(_strat3d);
  _strat3d=null;
};

window._startStrategy3D=function(){
  window._destroyStrategy3D();
  const container=document.getElementById('strategy3dContainer');
  if(!container)return;

  const isDark=document.body.getAttribute('data-theme')!=='light';
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,0.1,100);
  camera.position.set(0,0,5);

  const renderer=setupRenderer(isDark);
  const rect=container.getBoundingClientRect();
  const w=Math.max(rect.width,200);
  const h=Math.max(rect.height,200);
  renderer.setSize(w,h);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();

  /* WHITE FLASH FIX: render one transparent frame BEFORE appending to DOM */
  renderer.render(scene,camera);
  container.appendChild(renderer.domElement);

  const lights=setupLights(scene,isDark);
  const mouse=setupMouseParallax(container);
  const clock=new THREE.Clock();

  _strat3d={active:true,scene,camera,renderer,model:null,mixer:null,clock,animId:null,resizeObs:null,themeObs:null};

  const loader=new GLTFLoader();
  loader.setDRACOLoader(createDracoLoader());

  loadModel(loader,'/Assets/3dmodel/pawn.glb',scene,_strat3d,{
    scale:2.2,
    rotation:{x:-45.3,y:180.0,z:-120}
  },()=>{
    renderer.domElement.classList.add('visible');
  });

  createAnimLoop(_strat3d,clock,renderer,scene,camera,mouse,{mouseSensitivity:{x:1.15,y:1.25}});
  _strat3d.resizeObs=setupResize(container,camera,renderer,_strat3d);
  _strat3d.themeObs=setupThemeWatch(lights,_strat3d);
};

/* ===== ABOUT 3D CARDS (Pawn, 3DLogo, Key — one per card) ===== */
let _aboutCards=[null,null,null];

window._destroyAbout3DCards=function(){
  _aboutCards.forEach(s=>destroy(s));
  _aboutCards=[null,null,null];
};

function _initCardScene(containerId,modelUrl,opts){
  const container=document.getElementById(containerId);
  if(!container)return null;

  const isDark=document.body.getAttribute('data-theme')!=='light';
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,0.1,100);
  camera.position.set(0,0,7);

  const renderer=setupRenderer(isDark);
  const rect=container.getBoundingClientRect();
  const w=Math.max(rect.width,120);
  const h=Math.max(rect.height,120);
  renderer.setSize(w,h);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();

  renderer.render(scene,camera);
  container.appendChild(renderer.domElement);

  const lights=setupLights(scene,isDark);
  const mouse=setupMouseParallax(container);
  const clock=new THREE.Clock();

  const state={active:true,scene,camera,renderer,model:null,mixer:null,clock,animId:null,resizeObs:null,themeObs:null};

  const loader=new GLTFLoader();
  loader.setDRACOLoader(createDracoLoader());

  loadModel(loader,modelUrl,scene,state,opts,()=>{
    renderer.domElement.classList.add('visible');
  });

  createAnimLoop(state,clock,renderer,scene,camera,mouse,{mouseSensitivity:{x:0.8,y:0.9}});
  state.resizeObs=setupResize(container,camera,renderer,state);
  state.themeObs=setupThemeWatch(lights,state);

  return state;
}

window._startAbout3DCards=function(){
  window._destroyAbout3DCards();
  _aboutCards[0]=_initCardScene('about3dCard1','/Assets/3dmodel/pawn.glb',{
    scale:2.2,
    rotation:{x:-45.3,y:180.0,z:-120}
  });
  _aboutCards[1]=_initCardScene('about3dCard2','/Assets/3dmodel/3dlogo.glb',{
    scale:2.2,
    rotation:{x:0,y:0,z:0}
  });
  _aboutCards[2]=_initCardScene('about3dCard3','/Assets/3dmodel/Key.glb',{
    scale:2.2,
    rotation:{x:-45.3,y:180.0,z:-120}
  });
};

/* ===== HERO 3D (Pawn — Scroll-Driven Rotation) ===== */
let _hero3d=null;

window._destroyHero3D=function(){
  destroy(_hero3d);
  if(_hero3d&&_hero3d._scrollHandler){
    window.removeEventListener('scroll',_hero3d._scrollHandler);
  }
  _hero3d=null;
};

window._startHero3D=function(){
  window._destroyHero3D();

  const container=document.getElementById('hero3dContainer');
  if(!container)return;

  const isDark=document.body.getAttribute('data-theme')!=='light';
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,0.1,100);
  camera.position.set(0,0,5);

  const renderer=setupRenderer(isDark);
  const rect=container.getBoundingClientRect();
  const w=Math.max(rect.width,200);
  const h=Math.max(rect.height,200);
  renderer.setSize(w,h);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();

  /* Render one transparent frame before appending to prevent flash */
  renderer.render(scene,camera);
  container.appendChild(renderer.domElement);

  const lights=setupLights(scene,isDark);
  const mouse=setupMouseParallax(container);
  const clock=new THREE.Clock();

  _hero3d={active:true,scene,camera,renderer,model:null,mixer:null,clock,animId:null,resizeObs:null,themeObs:null,_scrollHandler:null};

  const loader=new GLTFLoader();
  loader.setDRACOLoader(createDracoLoader());

  loadModel(loader,'/Assets/3dmodel/3dlogo.glb',scene,_hero3d,{
    scale:2.2,
    rotation:{x:0,y:0,z:0}
  },()=>{
    renderer.domElement.classList.add('visible');
  });

  /* Scroll-driven animation loop:
   * model.rotation.y is driven by window.scrollY
   * Mouse parallax adds subtle tilt overlay
   * Gentle float on Y keeps it feeling alive
   */
  const scrollRange=window.innerHeight*2;
  const maxRotation=Math.PI*2;
  const startRotation=-30*Math.PI/180; /* -30 degrees starting offset */
  const mx={x:0.15,y:0.25};
  let time=0;
  const tRot={x:0,y:0};
  let currentScrollY=0;

  const onScroll=()=>{currentScrollY=window.scrollY};
  window.addEventListener('scroll',onScroll,{passive:true});
  _hero3d._scrollHandler=onScroll;

  (function heroAnimate(){
    if(!_hero3d||!_hero3d.active)return;
    _hero3d.animId=requestAnimationFrame(heroAnimate);

    const delta=clock.getDelta();
    time+=delta;
    if(_hero3d.mixer)_hero3d.mixer.update(delta);

    const m=_hero3d.model;
    if(m){
      const scrollProgress=Math.min(currentScrollY/scrollRange,1);
      const scrollRotY=startRotation+scrollProgress*maxRotation;

      tRot.x+=(mouse.y*mx.x-tRot.x)*0.05;
      tRot.y+=(mouse.x*mx.y-tRot.y)*0.05;

      m.rotation.y=scrollRotY+tRot.y*0.3;
      m.rotation.x=tRot.x;

      m.position.y=Math.sin(time*1.2)*0.06;
    }

    renderer.render(scene,camera);
  })();

  _hero3d.resizeObs=setupResize(container,camera,renderer,_hero3d);
  _hero3d.themeObs=setupThemeWatch(lights,_hero3d);
};

/* Auto-fire if containers already exist when module loads */
if(document.getElementById('hero3dContainer')&&!document.getElementById('hero3dContainer').querySelector('canvas')){
  window._startHero3D();
}
if(document.getElementById('strategy3dContainer')&&!document.getElementById('strategy3dContainer').querySelector('canvas')){
  window._startStrategy3D();
}
if(document.getElementById('about3dCard1')&&!document.getElementById('about3dCard1').querySelector('canvas')){
  window._startAbout3DCards();
}
