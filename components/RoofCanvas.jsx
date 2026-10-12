"use client";
import {useEffect,useRef,useState} from "react";
import Image from "next/image";

/**
 * One camera/canvas, six immutable approved photographic layers.
 * All layers remain visible for the whole sequence: NO swapping assembled
 * and exploded reference pictures, NO per-layer React re-renders on scroll.
 * We cache each scaled layer and its soft shadow in an offscreen bitmap.
 *
 * Important: the six user-approved renders were generated separately;
 * consistent viewport does NOT mean physically matched 3D perspective.
 */
const SIZE={w:850,h:1050};
const scene=[
 {name:"charpente",scale:.58,start:170,end:231,step:4},
 {name:"zinguerie",scale:.64,start:175,end:242,step:5},
 {name:"isolation",scale:.65,start:70,end:139,step:3},
 {name:"sous-toiture",scale:.66,start:20,end:62,step:2},
 {name:"liteaux",scale:.66,start:26,end:-94,step:1},
 {name:"couverture",scale:.68,start:-25,end:-190,step:0}
];
const clamp=n=>Math.min(1,Math.max(0,n));
const ease=v=>{const n=clamp(v);return n*n*(3-2*n)};
const SRC="/images/toiture/";
function makeLayer(image,scale){
 const w=Math.round(image.naturalWidth*scale),h=Math.round(image.naturalHeight*scale);
 const padding=24;
 const cache=document.createElement("canvas");
 cache.width=w+padding*2;cache.height=h+padding*2;
 const cx=cache.getContext("2d",{alpha:true});
 if(!cx)throw new Error("Canvas unavailable");
 cx.shadowColor="rgba(0,0,0,.43)";
 cx.shadowBlur=12;
 cx.shadowOffsetY=11;
 cx.drawImage(image,padding,padding,w,h);
 return {image:cache,width:w,height:h,pad:padding};
}
export default function RoofCanvas({progressRef,active=0}){
 const canvasRef=useRef(null);
 const frameRef=useRef(0);
 const stateRef=useRef({ready:false,visible:false,drawn:false,current:0,assets:[]});
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let disposed=false,observer;
  const canvas=canvasRef.current;
  if(!canvas)return;
  const state=stateRef.current;
  const ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});
  if(!ctx){setFailed(true);return;}
  canvas.width=SIZE.w;canvas.height=SIZE.h;
  const paint=(p)=>{
   ctx.clearRect(0,0,SIZE.w,SIZE.h);
   for(let i=0;i<scene.length;i++){
    const spec=scene[i],asset=state.assets[i];
    if(!asset)continue;
    const a=ease((p-spec.step*.14)/.22);
    const y=spec.start+(spec.end-spec.start)*a;
    const px=Math.round((SIZE.w-asset.width)/2)-asset.pad;
    const py=Math.round((SIZE.h-asset.height)/2+y)-asset.pad;
    ctx.drawImage(asset.image,px,py);
   }
  };
  const tick=()=>{
   frameRef.current=0;
   if(disposed||!state.visible||!state.ready)return;
   const to=clamp(progressRef.current);
   const diff=to-state.current;
   state.current+=diff*.23;
   if(Math.abs(diff)<.0006)state.current=to;
   if(!state.drawn||Math.abs(diff)>.0006){
    paint(state.current);state.drawn=true;
   }
   // Keep inexpensive scroll tracking alive while visible, but only redraw
   // when its target changes. Image scaling/shadows are cached.
   frameRef.current=requestAnimationFrame(tick);
  };
  const start=()=>{
   if(frameRef.current||!state.ready||!state.visible)return;
   frameRef.current=requestAnimationFrame(tick);
  };
  observer=new IntersectionObserver(entries=>{
   state.visible=entries.some(e=>e.isIntersecting);
   if(state.visible)start();
   else {cancelAnimationFrame(frameRef.current);frameRef.current=0}
  },{rootMargin:"180px"});
  observer.observe(canvas);
  (async()=>{
   try{
    const assets=await Promise.all(scene.map(async spec=>{
     const image=new window.Image();
     image.decoding="async";
     image.src=SRC+spec.name+".png";
     await image.decode();
     if(!image.naturalWidth)throw new Error("Image missing: "+spec.name);
     return makeLayer(image,spec.scale);
    }));
    if(disposed)return;
    state.assets=assets;
    state.ready=true;
    state.drawn=false;
    state.current=0;
    paint(0);
    start();
   }catch(e){if(!disposed){setFailed(true);}}
  })();
  return()=>{
   disposed=true;observer?.disconnect();
   cancelAnimationFrame(frameRef.current);frameRef.current=0;
   state.assets=[];state.ready=false;state.visible=false;
  };
 },[progressRef]);
 return <div className="roof-canvas-host">
  {!failed&&<canvas ref={canvasRef} width={850} height={1050} className="roof-canvas-element" role="img" aria-label="Animation photographique des six couches de toiture, contrôlée au défilement"/>}
  {failed&&<div className="roof-canvas-fallback"><Image src={SRC+"vue-eclatee.png"} fill alt="Vue éclatée photographique de la toiture, six couches distinctes" sizes="(max-width: 820px) 60vw, 50vw"/></div>}
  <span className="roof-canvas-overlay" aria-hidden="true">TOITURE · SIX ÉLÉMENTS INDÉPENDANTS</span>
 </div>;
}
