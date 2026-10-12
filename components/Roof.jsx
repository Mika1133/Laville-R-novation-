'use client';
import {useEffect,useRef,useState} from "react";
import Link from "next/link";

const layers=[
  {title:"Couverture",subtitle:"Tuiles et rénovation",desc:"La première protection face aux intempéries.",href:"/prestations/renovation-toiture",poly:"polygon(0% 37%,25% 29%,53% 18%,82% 1%,93% 13%,94% 25%,77% 34%,46% 49%,0% 60%)",dx:-2,dy:-12},
  {title:"Liteaux",subtitle:"Fixation de la couverture",desc:"Les pièces de bois sur lesquelles la couverture est fixée.",href:"/prestations/renovation-toiture",poly:"polygon(16% 47%,68% 20%,92% 12%,97% 24%,94% 34%,67% 49%,22% 61%,10% 57%)",dx:1,dy:-7},
  {title:"Écran de sous-toiture",subtitle:"Protection complémentaire",desc:"Une barrière supplémentaire qui contribue à protéger la toiture.",href:"/prestations/etancheite",poly:"polygon(9% 55%,64% 30%,96% 27%,97% 47%,59% 66%,14% 68%)",dx:2,dy:-1},
  {title:"Isolation",subtitle:"Confort thermique",desc:"Couche visible à titre pédagogique, prestation à confirmer.",href:"/prestations",poly:"polygon(16% 70%,60% 50%,94% 45%,96% 68%,57% 85%,20% 83%)",dx:2,dy:5},
  {title:"Charpente",subtitle:"Structure porteuse",desc:"L’ossature soutient l’ensemble de la toiture.",href:"/prestations",poly:"polygon(16% 73%,60% 51%,98% 54%,100% 90%,67% 99%,30% 96%)",dx:3,dy:12},
  {title:"Zinguerie & évacuation",subtitle:"Gouttières et raccords",desc:"Les éléments qui recueillent et évacuent l’eau de pluie.",href:"/prestations/zinguerie-gouttieres",poly:"polygon(0% 44%,20% 47%,41% 61%,59% 74%,67% 92%,57% 99%,40% 91%,0% 76%)",dx:-3,dy:11}
];
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const ease=v=>{const x=clamp(v);return x*x*(3-2*x)};
const photo="/images/toiture-explosee.webp";
export default function Roof(){
 const root=useRef(null);
 const [progress,setProgress]=useState(0);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
   const media=window.matchMedia("(prefers-reduced-motion: reduce)");
   const onMedia=()=>setReduced(media.matches);
   onMedia();media.addEventListener("change",onMedia);
   let frame=0;
   const measure=()=>{
     if(frame)return;
     frame=window.requestAnimationFrame(()=>{
       frame=0;
       if(!root.current)return;
       const rect=root.current.getBoundingClientRect();
       const travel=Math.max(1,rect.height-window.innerHeight);
       const next=clamp(-rect.top/travel);
       setProgress(previous=>Math.abs(previous-next)<.0006?previous:next);
     });
   };
   measure();
   window.addEventListener("scroll",measure,{passive:true});
   window.addEventListener("resize",measure);
   return()=>{window.removeEventListener("scroll",measure);window.removeEventListener("resize",measure);media.removeEventListener("change",onMedia);window.cancelAnimationFrame(frame)};
 },[]);
 const active=Math.min(5,Math.floor(progress*6));
 const explosion=reduced?0:ease((progress-.03)/.83);
 const select=(index)=>{
   if(!root.current)return;
   const top=window.scrollY+root.current.getBoundingClientRect().top;
   const max=root.current.offsetHeight-window.innerHeight;
   window.scrollTo({top:top+max*((index+.4)/6),behavior:reduced?"instant":"smooth"});
 };
 return <section className="roof-v2-journey" id="au-coeur-de-votre-toiture" ref={root} aria-label="Anatomie interactive d'une toiture">
  <div className="roof-v2-sticky">
   <div className="roof-v2-overline"><span>02. — NOTRE SAVOIR-FAIRE</span><span>SCROLL POUR EXPLORER <span aria-hidden="true">↓</span></span></div>
   <div className="roof-v2-main">
    <div className="roof-v2-heading">
      <span className="roof-v2-section-number">02.</span>
      <h2>Au cœur<br/>de votre <em>toiture.</em></h2>
      <p>Découvrez les différentes couches de votre toiture et nos zones d’intervention.</p>
    </div>
    <div className="roof-v2-art" aria-label="Toiture en perspective, couches qui se séparent pendant le défilement" role="img">
      <div className="roof-v2-rim"/>
      <div className="roof-v2-photo" style={{backgroundImage:`url("${photo}")`,opacity:reduced?1:1-ease((progress-.04)/.16)}}/>
      {!reduced&&layers.map((layer,i)=>{
        const a=ease((progress-(.035+i*.095))/.27);
        return <div className="roof-v2-slice" key={layer.title} aria-hidden="true"
          style={{backgroundImage:`url("${photo}")`,clipPath:layer.poly,
           transform:`translate3d(${layer.dx*a}%,${layer.dy*a}%,0)`,opacity:ease((progress-.015)/.14)}}/>;
      })}
      <div className="roof-v2-shadow" aria-hidden="true"/>
    </div>
    <div className="roof-v2-labels" aria-label="Les différentes couches">
      {layers.map((layer,i)=><div className={i===active?"roof-v2-item is-active":"roof-v2-item"} key={layer.title}>
       <button type="button" onClick={()=>select(i)} className="roof-v2-select" aria-current={i===active?"step":undefined} aria-label={"Afficher : "+layer.title}>
        <span className="roof-v2-dot">{i===active?"−":"+"}</span><span className="roof-v2-copy"><small>0{i+1}</small><strong>{layer.title}</strong><em>{layer.subtitle}</em></span>
       </button>
       <Link href={layer.href} className="roof-v2-discover">En savoir plus ↗</Link>
      </div>)}
    </div>
   </div>
   <div className="roof-v2-bottom">
    <button type="button" className="roof-v2-overview" onClick={()=>select(0)} aria-label="Revenir à la vue complète de la toiture">
      <img alt="" src="/images/vue-complete.webp" width="95" height="95"/>
      <span>Vue complète <span>↗</span></span>
    </button>
    <div className="roof-v2-stepper">
      <span className="roof-v2-counter">0{active+1} <small>/ 06</small></span>
      <button type="button" onClick={()=>select(Math.max(0,active-1))} disabled={active===0} aria-label="Couche précédente">←</button>
      <button type="button" onClick={()=>select(Math.min(5,active+1))} disabled={active===5} aria-label="Couche suivante">→</button>
    </div>
   </div>
   <div className="roof-v2-progress" aria-hidden="true"><span style={{width:(progress*100)+"%"}}/></div>
  </div>
 </section>;
}