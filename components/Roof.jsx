'use client';
import {useEffect,useRef,useState} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
const RoofScene=dynamic(()=>import("./RoofScene"),{ssr:false,loading:()=><div className="roof-3d-loading">Chargement de la toiture…</div>});
const elements=[
  {title:"Couverture",subtitle:"Tuiles et rénovation",href:"/prestations/renovation-toiture"},
  {title:"Liteaux",subtitle:"Fixation de la couverture",href:"/prestations/renovation-toiture"},
  {title:"Écran de sous-toiture",subtitle:"Protection contre l’humidité",href:"/prestations/etancheite"},
  {title:"Isolation",subtitle:"Confort thermique",href:"/prestations"},
  {title:"Charpente",subtitle:"Structure porteuse",href:"/prestations"},
  {title:"Zinguerie & évacuation",subtitle:"Gouttières et raccords",href:"/prestations/zinguerie-gouttieres"}
];
const clamp=n=>Math.max(0,Math.min(1,n));
export default function Roof(){
 const root=useRef(null),[progress,setProgress]=useState(0),[reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMedia=()=>setReduced(media.matches);
  onMedia();
  media.addEventListener("change",onMedia);
  let raf=0;
  const measure=()=>{
   if(raf)return;
   raf=requestAnimationFrame(()=>{
    raf=0;
    if(!root.current)return;
    const r=root.current.getBoundingClientRect();
    const distance=Math.max(1,r.height-window.innerHeight);
    const next=clamp(-r.top/distance);
    setProgress(prev=>Math.abs(prev-next)<.0006?prev:next);
   });
  };
  measure();
  window.addEventListener("scroll",measure,{passive:true});
  window.addEventListener("resize",measure);
  return()=>{cancelAnimationFrame(raf);media.removeEventListener("change",onMedia);window.removeEventListener("scroll",measure);window.removeEventListener("resize",measure)};
 },[]);
 const active=Math.min(5,Math.floor(progress*6));
 const select=index=>{
  if(!root.current)return;
  const start=window.scrollY+root.current.getBoundingClientRect().top;
  const travel=Math.max(1,root.current.offsetHeight-window.innerHeight);
  window.scrollTo({top:start+travel*((index+.35)/6),behavior:reduced?"instant":"smooth"});
 };
 return <section className="roof-v2-journey roof-v3-journey" id="au-coeur-de-votre-toiture" ref={root} aria-label="Découvrir les couches indépendantes de la toiture">
  <div className="roof-v2-sticky roof-v3-sticky">
   <div className="roof-v2-overline roof-v3-overline"><span>02. — NOTRE SAVOIR-FAIRE</span><span>FAITES DÉFILER POUR DÉCOMPOSER LA TOITURE ↓</span></div>
   <div className="roof-v2-main roof-v3-main">
    <div className="roof-v2-heading roof-v3-heading"><span className="roof-v2-section-number">02.</span><h2>Au cœur<br/>de votre <em>toiture.</em></h2><p>Six éléments, un seul ensemble : faites défiler pour les découvrir.</p></div>
    <div className="roof-v2-art roof-v3-art">
     <RoofScene progress={progress} reduced={reduced}/>
    </div>
    <div className="roof-v2-labels roof-v3-labels" aria-label="Les six éléments de la toiture">
     {elements.map((part,index)=><div key={part.title} className={"roof-v2-item roof-v3-item"+(active===index?" is-active":"")}>
       <button className="roof-v2-select" type="button" aria-current={active===index?"step":undefined} aria-label={"Découvrir "+part.title} onClick={()=>select(index)}>
        <span className="roof-v2-dot">{active===index?"−":"+"}</span><span className="roof-v2-copy"><small>{"0"+(index+1)}</small><strong>{part.title}</strong><em>{part.subtitle}</em></span>
       </button>
       <Link href={part.href} className="roof-v2-discover">En savoir plus ↗</Link>
      </div>)}
    </div>
   </div>
   <div className="roof-v2-bottom roof-v3-bottom">
    <button type="button" className="roof-v2-overview" onClick={()=>select(0)} aria-label="Revenir à la vue complète">
      <img src="/images/vue-complete.webp" alt="" width="82" height="82"/><span>Vue complète <span>↗</span></span>
    </button>
    <div className="roof-v2-stepper"><span className="roof-v2-counter">{"0"+(active+1)} <small>/ 06</small></span>
      <button type="button" aria-label="Précédent" disabled={active===0} onClick={()=>select(Math.max(0,active-1))}>←</button>
      <button type="button" aria-label="Suivant" disabled={active===5} onClick={()=>select(Math.min(5,active+1))}>→</button>
    </div>
   </div>
   <div className="roof-v2-progress" aria-hidden="true"><span style={{width:(progress*100)+"%"}}/></div>
  </div>
 </section>;
}
