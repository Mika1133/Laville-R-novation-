"use client";
import {useEffect,useRef,useState} from "react";
import Image from "next/image";
import Link from "next/link";

const parts=[
{name:"Couverture",sub:"Tuiles en terre cuite",description:"La première protection de la maison face aux intempéries.",page:"/prestations/renovation-toiture",asset:"couverture.png",dx:-9,dy:-21,scale:.88},
{name:"Liteaux",sub:"Fixation de la couverture",description:"Les liteaux en bois forment le support de la couverture.",page:"/prestations/renovation-toiture",asset:"liteaux.png",dx:-5,dy:-10,scale:.92},
{name:"Écran de sous-toiture",sub:"Protection complémentaire",description:"Une membrane qui aide à protéger contre les infiltrations.",page:"/prestations/etancheite",asset:"sous-toiture.png",dx:0,dy:0,scale:.90},
{name:"Isolation",sub:"Confort thermique",description:"Couche pédagogique : cette prestation reste à confirmer.",page:"/prestations",asset:"isolation.png",dx:3,dy:13,scale:.83},
{name:"Charpente",sub:"Structure porteuse",description:"La structure en bois soutient l'ensemble de la toiture.",page:"/prestations",asset:"charpente.png",dx:4,dy:26,scale:.85},
{name:"Zinguerie & évacuation",sub:"Gouttières et raccords",description:"Les éléments en zinc assurent l'évacuation des eaux.",page:"/prestations/zinguerie-gouttieres",asset:"zinguerie.png",dx:-7,dy:36,scale:.87}
];
const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{const t=clamp(v);return t*t*(3-2*t)};
const imgBase="/images/toiture/";
export default function Roof(){
 const scrollSection=useRef(null);
 const [p,setP]=useState(0);
 const [reduce,setReduce]=useState(false);
 useEffect(()=>{
  const mq=window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange=()=>setReduce(mq.matches);onChange();mq.addEventListener?.("change",onChange);
  let frame=0;
  function update(){
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    if(!scrollSection.current)return;
    const rect=scrollSection.current.getBoundingClientRect();
    const distance=Math.max(1,rect.height-window.innerHeight);
    const next=clamp(-rect.top/distance);
    setP(prev=>Math.abs(prev-next)<.0005?prev:next);
   });
  }
  update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
  return()=>{cancelAnimationFrame(frame);mq.removeEventListener?.("change",onChange);window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
 },[]);
 const active=Math.min(5,Math.floor(p*6));
 const travel=ease((p-.06)/.78);
 const assembled=1-ease((p-.035)/.24);
 const exploded=ease((p-.79)/.19);
 function go(i){
  const el=scrollSection.current;if(!el)return;
  const top=window.scrollY+el.getBoundingClientRect().top;
  const length=Math.max(1,el.offsetHeight-window.innerHeight);
  window.scrollTo({top:top+length*(i===0?.012:(i+.34)/6),behavior:reduce?"instant":"smooth"});
 }
 return <section className="roof-approved" id="au-coeur-de-votre-toiture" ref={scrollSection} aria-label="Exploration de la toiture">
  <div className="roof-approved-sticky">
   <div className="roof-approved-top"><span>02. — NOTRE SAVOIR-FAIRE</span><span>SCROLLEZ POUR EXPLORER ↓</span></div>
   <div className="roof-approved-content">
    <div className="roof-approved-heading">
     <small>02.</small><h2>Au cœur<br/>de votre <em>toiture.</em></h2>
     <p>Découvrez les différentes couches de votre toiture et les zones d'intervention.</p>
     <div className="roof-approved-context">
      <span>{"0"+(active+1)+" / 06"}</span>
      <strong>{parts[active].name}</strong>
      <p>{parts[active].description}</p>
     </div>
    </div>
    <div className="roof-approved-scene" role="group" aria-label="Vue photographique décomposée d'une toiture">
     <div className="roof-approved-glow" aria-hidden="true"/>
     <div className="roof-approved-hero" style={{opacity:reduce&&p>.65?0:assembled}}>
      <Image src={imgBase+"vue-assemblee.png"} alt="Toiture assemblée en terre cuite, bois et zinc" fill quality={90} sizes="(max-width: 800px) 60vw, 52vw" draggable={false}/>
     </div>
     <div className="roof-approved-layered" style={{opacity:reduce?0:ease((p-.09)/.18)*(1-exploded)}}>
      {parts.map((part,i)=>{
       const visibility=ease((p-(.04+i*.07))/.14);
       const moved=travel*(.68+.32*visibility);
       const style={zIndex:6-i,opacity:visibility,
         transform:"translate3d("+(part.dx*moved).toFixed(2)+"%, "+(part.dy*moved).toFixed(2)+"%, 0) scale("+part.scale+")"};
       return <div className="roof-approved-part" key={part.asset} style={style}>
        <Image src={imgBase+part.asset} alt="" fill quality={90} sizes="(max-width: 800px) 60vw, 52vw" draggable={false}/>
       </div>;
      })}
     </div>
     <div className="roof-approved-final" style={{opacity:reduce&&p>.65?1:exploded}}>
      <Image src={imgBase+"vue-eclatee.png"} alt="Vue éclatée de l'ensemble des couches de la toiture" fill quality={90} sizes="(max-width: 800px) 60vw, 52vw" draggable={false}/>
     </div>
    </div>
    <div className="roof-approved-list" aria-label="Éléments de la toiture">
     {parts.map((part,i)=><div className={i===active?"roof-approved-item active":"roof-approved-item"} key={part.asset}>
      <button type="button" className="roof-approved-item-main" aria-current={active===i?"step":undefined} onClick={()=>go(i)} aria-label={"Afficher "+part.name}>
       <span className="roof-approved-bullet">{active===i?"−":"+"}</span>
       <span className="roof-approved-title"><small>{"0"+(i+1)}</small><strong>{part.name}</strong><em>{part.sub}</em></span>
      </button>
      <Link href={part.page} className="roof-approved-more">En savoir plus ↗</Link>
     </div>)}
    </div>
   </div>
   <div className="roof-approved-footer">
    <button className="roof-approved-complete" type="button" onClick={()=>go(0)}>
     <span className="roof-approved-thumbnail"><Image src={imgBase+"vue-assemblee.png"} alt="" fill sizes="70px" quality={90}/></span>
     <span>Vue complète <small>↗</small></span>
    </button>
    <div className="roof-approved-pagination"><span>{"0"+(active+1)} <small>/ 06</small></span>
     <button type="button" aria-label="Couche précédente" disabled={active===0} onClick={()=>go(Math.max(0,active-1))}>←</button>
     <button type="button" aria-label="Couche suivante" disabled={active===5} onClick={()=>go(Math.min(5,active+1))}>→</button>
    </div>
   </div>
   <div className="roof-approved-bar" aria-hidden="true"><span style={{width:(100*p)+"%"}}/></div>
  </div>
 </section>
}