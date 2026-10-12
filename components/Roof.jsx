"use client";
import {useEffect,useRef,useState} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const RoofCanvas=dynamic(()=>import("./RoofCanvas"),{ssr:false,loading:()=> <div className="roof-canvas-wait">Préparation de la toiture…</div>});
const PARTS=[
{name:"Couverture",sub:"Tuiles et rénovation",href:"/prestations/renovation-toiture"},
{name:"Liteaux",sub:"Fixation de la couverture",href:"/prestations/renovation-toiture"},
{name:"Écran de sous-toiture",sub:"Protection complémentaire",href:"/prestations/etancheite"},
{name:"Isolation",sub:"Confort thermique",href:"/prestations"},
{name:"Charpente",sub:"Structure porteuse",href:"/prestations"},
{name:"Zinguerie & évacuation",sub:"Gouttières et raccords",href:"/prestations/zinguerie-gouttieres"}
];
const clamp=x=>Math.max(0,Math.min(1,x));
export default function Roof(){
 const section=useRef(null),progressRef=useRef(0),[step,setStep]=useState(0),[reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const updateMedia=()=>setReduced(media.matches);
  updateMedia();media.addEventListener?.("change",updateMedia);
  let raf=0;
  const measure=()=>{
   if(raf)return;
   raf=requestAnimationFrame(()=>{
    raf=0;
    if(!section.current)return;
    const rect=section.current.getBoundingClientRect();
    const length=Math.max(1,rect.height-window.innerHeight);
    const p=media.matches?0:clamp(-rect.top/length);
    progressRef.current=p;
    const next=Math.min(5,Math.floor(p*6));
    setStep(prev=>prev===next?prev:next);
   });
  };
  measure();window.addEventListener("scroll",measure,{passive:true});window.addEventListener("resize",measure);
  return()=>{
   cancelAnimationFrame(raf);media.removeEventListener?.("change",updateMedia);
   window.removeEventListener("scroll",measure);window.removeEventListener("resize",measure);
  };
 },[]);
 const jump=i=>{
  const el=section.current;
  if(!el)return;
  const top=window.scrollY+el.getBoundingClientRect().top;
  const length=Math.max(1,el.offsetHeight-window.innerHeight);
  window.scrollTo({top:top+length*(i===0?.005:(i+.4)/6),behavior:reduced?"instant":"smooth"});
 };
 return <section className="roof-approved roof-continuous" id="au-coeur-de-votre-toiture" ref={section} aria-label="Au cœur de votre toiture : découvrir ses six couches">
  <div className="roof-approved-sticky">
   <div className="roof-approved-top"><span>02. — NOTRE SAVOIR-FAIRE</span><span>FAITES DÉFILER POUR EXPLORER ↓</span></div>
   <div className="roof-approved-content">
    <div className="roof-approved-heading">
     <small>02.</small><h2>Au cœur<br/>de votre <em>toiture.</em></h2>
     <p>Découvrez les différentes couches de votre toiture et les zones d'intervention.</p>
     <div className="roof-approved-context">
      <span>{"0"+(step+1)+" / 06"}</span><strong>{PARTS[step].name}</strong>
      <p>{PARTS[step].sub}</p>
     </div>
    </div>
    <div className="roof-approved-scene roof-continuous-stage">
      <RoofCanvas progressRef={progressRef} active={step}/>
    </div>
    <div className="roof-approved-list">
     {PARTS.map((part,i)=><div className={i===step?"roof-approved-item active":"roof-approved-item"} key={part.name}>
       <button type="button" className="roof-approved-item-main" onClick={()=>jump(i)} aria-current={step===i?"step":undefined} aria-label={"Découvrir "+part.name}>
        <span className="roof-approved-bullet">{step===i?"−":"+"}</span>
        <span className="roof-approved-title"><small>{"0"+(i+1)}</small><strong>{part.name}</strong><em>{part.sub}</em></span>
       </button>
       <Link href={part.href} className="roof-approved-more">En savoir plus ↗</Link>
      </div>)}
    </div>
   </div>
   <div className="roof-approved-footer">
    <button className="roof-approved-complete" type="button" onClick={()=>jump(0)}>
      <span className="roof-approved-thumbnail"><Image src="/images/toiture/vue-assemblee.png" alt="" fill sizes="70px" quality={90}/></span>
      <span>Vue complète <small>↗</small></span>
    </button>
    <div className="roof-approved-pagination">
      <span>{"0"+(step+1)} <small>/ 06</small></span>
      <button type="button" onClick={()=>jump(Math.max(0,step-1))} disabled={step===0} aria-label="Précédent">←</button>
      <button type="button" onClick={()=>jump(Math.min(5,step+1))} disabled={step===5} aria-label="Suivant">→</button>
    </div>
   </div>
  </div>
 </section>;
}
