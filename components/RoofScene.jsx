'use client';
import {useEffect,useRef,useState} from "react";

/*
 * Every roof element is an independent 3D object.
 * No photograph is split into fragments.
 * Geometry is built once; scroll only changes group positions.
 */
export default function RoofScene({progress=0,reduced=false}){
 const mount=useRef(null),target=useRef(progress),[supported,setSupported]=useState(true);
 useEffect(()=>{target.current=progress},[progress]);
 useEffect(()=>{
  const host=mount.current;
  if(!host)return;
  let disposed=false,raf=0,renderer,observer,ro,scene,frames=[],materials=[],geometries=[],visible=false;
  const fallback=()=>{if(!disposed)setSupported(false)};
  (async()=>{
   try{
    const T=await import("three");
    if(disposed)return;
    if(!window.WebGLRenderingContext){fallback();return}
    renderer=new T.WebGLRenderer({alpha:true,antialias:window.innerWidth>700,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.25:1.65));
    renderer.setClearColor(0x111816,0);
    renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.42;
    renderer.domElement.setAttribute("aria-hidden","true");
    renderer.domElement.className="roof-3d-canvas";
    host.appendChild(renderer.domElement);
    scene=new T.Scene();
    const camera=new T.PerspectiveCamera(40,1,0.1,90);
    const light=new T.HemisphereLight(0xffe5cb,0x323c35,2.7);scene.add(light);
    const sun=new T.DirectionalLight(0xffdab6,3.4);sun.position.set(-4.5,10,7);scene.add(sun);
    const fill=new T.DirectionalLight(0xe0e9fa,1.2);fill.position.set(7,4,-6);scene.add(fill);
    const rig=new T.Group();scene.add(rig);rig.rotation.x=-.13;

    const mat=(hex,roughness=.86,metalness=0)=>{
      const m=new T.MeshStandardMaterial({color:hex,roughness,metalness,side:T.DoubleSide});materials.push(m);return m
    };
    const clay=[0xa95034,0xb75f3d,0xc16e48,0xa94c31,0xbb6342,0xcc7750,0xb95a36].map(c=>mat(c,.93));
    const wood=[mat(0x9b6840),mat(0xb98757),mat(0xc69764),mat(0xa9784c)];
    const membrane=mat(0x626d67,.92);
    const seam=mat(0x404d49,.9);
    const wool=[mat(0xd8c29a),mat(0xe6d5b1),mat(0xc9ad7b)];
    const zinc=mat(0x9ba8aa,.31,.72);
    const zincDark=mat(0x576363,.46,.65);
    const colored=(geo,m)=>{geometries.push(geo);return new T.Mesh(geo,m)};
    const cuboid=(group,w,h,d,x,y,z,m)=>{
      const mesh=colored(new T.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);group.add(mesh);return mesh
    };
    const groups=Array.from({length:6},()=>new T.Group());
    groups.forEach(g=>rig.add(g));

    // Independent timber frame, containing rafters, fascia and cross beams.
    for(let i=0;i<8;i++){
      const x=-3.12+i*.9;
      cuboid(groups[4],.17,.29,4.9,x,-.81,0,wood[i%wood.length]);
      if(i>0&&i<7) cuboid(groups[4],.18,.22,3.7,x,-1.02,.22,wood[(i+1)%wood.length]);
    }
    for(const z of [-1.92,-.65,.66,2.15])
      cuboid(groups[4],6.65,.22,.2,0,-1.05,z,wood[2]);
    cuboid(groups[4],6.9,.39,.25,0,-.94,2.42,wood[0]);

    // Each insulation panel is a separate slab: visible thickness, seams, and edges.
    for(let i=0;i<3;i++){
      const x=-2.18+i*2.18;
      cuboid(groups[3],2.07,.31,4.4,x,-.40,0,wool[i%3]);
      cuboid(groups[3],2.01,.015,4.35,x,-.235,0,wool[(i+1)%3]);
      for(let j=0;j<6;j++){
        const line=cuboid(groups[3],.012,.004,.39,x-0.67+j*.27,-.221,-1.42+(i%2)*.16,wool[2]);
        line.rotation.y=.15;
      }
    }

    // Continuous but independently animated waterproof membrane.
    cuboid(groups[2],6.77,.095,4.51,0,-.125,0,membrane);
    for(const x of [-2.1,0,2.1]){
      cuboid(groups[2],.022,.011,4.48,x,-.071,0,seam);
    }
    for(const z of [-1.2,.3,1.8]) cuboid(groups[2],6.65,.014,.018,0,-.066,z,seam);

    // Real wooden battens (individual beams), not a raster-texture cutout.
    for(let row=0;row<8;row++){
      cuboid(groups[1],6.88,.135,.14,0,.092,-2.13+row*.61,wood[row%4]);
    }
    for(let col=0;col<7;col++){
      cuboid(groups[1],.09,.08,4.55,-2.82+col*.94,.025,0,wood[(col+2)%4]);
    }

    // Curved clay tiles generated as separate mesh surfaces (14 columns x 7 rows).
    const positions=[],indices=[];
    const width=.48,depth=.76;
    for(let zz=0;zz<=5;zz++){
      const v=zz/5;
      for(let xx=0;xx<=10;xx++){
        const u=xx/10;
        const x=(u-.5)*width;
        const y=.108*Math.sin(Math.PI*u)+.013*Math.cos(Math.PI*v);
        const z=(v-.5)*depth;
        positions.push(x,y,z);
      }
    }
    for(let z=0;z<5;z++)for(let x=0;x<10;x++){
      const a=z*11+x,b=a+11;
      indices.push(a,b,a+1,b,b+1,a+1);
    }
    const tileGeometry=new T.BufferGeometry();
    tileGeometry.setAttribute("position",new T.Float32BufferAttribute(positions,3));
    tileGeometry.setIndex(indices);tileGeometry.computeVertexNormals();geometries.push(tileGeometry);
    for(let row=0;row<7;row++) for(let col=0;col<14;col++){
      const tile=new T.Mesh(tileGeometry,clay[(col*3+row*5)%clay.length]);
      tile.position.set(-3.11+col*.478,.335+(row%2)*.006,-1.82+row*.605);
      groups[0].add(tile);
    }
    // Ridge line and thick roof edges.
    cuboid(groups[0],6.98,.12,.21,0,.385,-2.19,clay[4]);
    cuboid(groups[0],6.92,.18,.12,0,.29,2.32,clay[3]);

    // Zinc gutter: curved, metallic trough + separate front downpipe.
    const gutter=new T.Mesh(new T.CylinderGeometry(.185,.185,7.1,22,1,true,Math.PI*.06,Math.PI*.94),zinc);
    gutter.rotation.z=Math.PI/2;gutter.position.set(0,-.58,2.48);groups[5].add(gutter);
    geometries.push(gutter.geometry);
    cuboid(groups[5],7,.035,.05,0,-.45,2.63,zincDark);
    const pipe=colored(new T.CylinderGeometry(.10,.10,1.15,16),zincDark);
    pipe.position.set(3.46,-1.03,2.54);groups[5].add(pipe);
    const shoe=colored(new T.CylinderGeometry(.11,.11,.35,16),zinc);
    shoe.rotation.x=.7;shoe.position.set(3.46,-1.65,2.69);groups[5].add(shoe);

    const resize=()=>{
      if(!renderer||!host)return;
      const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
      renderer.setSize(w,h,false);
      camera.aspect=w/h;
      const small=w<560;
      camera.fov=small?49:40;
      camera.position.set(small?9.3:8.5,small?8.2:8.1,small?16.6:13.4);
      camera.lookAt(0,.22,0);
      camera.updateProjectionMatrix();
      renderer.render(scene,camera);
    };
    ro=new ResizeObserver(resize);ro.observe(host);resize();
    let current=0;
    const ease=(t)=>{const n=Math.max(0,Math.min(1,t));return n*n*(3-2*n)};
    const offsets=[
      [0,2.75,-.30],[0,1.36,-.11],[0,.53,0],[0,-.40,.12],[0,-.91,.23],[0,-.82,.45]
    ];
    const render=()=>{
      raf=0;
      if(disposed||!visible)return;
      const goal=reduced?0:Math.max(0,Math.min(1,target.current));
      const difference=goal-current;
      current+=difference*.19;
      if(Math.abs(difference)<.0004)current=goal;
      for(let i=0;i<groups.length;i++){
        const p=ease((current-.04-i*.105)/.30),g=groups[i],offset=offsets[i];
        g.position.set(offset[0]*p,offset[1]*p,offset[2]*p);
      }
      rig.rotation.y=-.09+current*.045;
      renderer.render(scene,camera);
      if(Math.abs(goal-current)>.0004)raf=requestAnimationFrame(render);
    };
    const schedule=()=>{if(!raf&&!disposed&&visible)raf=requestAnimationFrame(render)};
    // Each scroll update can trigger a new render without a permanent GPU loop.
    let last=target.current;
    const poll=()=>{
      if(disposed||!visible)return;
      if(Math.abs(last-target.current)>.0003){last=target.current;schedule()}
      timer=requestAnimationFrame(poll);
    };
    let timer=0;
    observer=new IntersectionObserver(entries=>{
      const inView=entries.some(e=>e.isIntersecting);
      if(inView&&!visible){visible=true;last=target.current;schedule();timer=requestAnimationFrame(poll)}
      else if(!inView&&visible){visible=false;cancelAnimationFrame(timer);cancelAnimationFrame(raf);raf=0}
    },{rootMargin:"100px"});
    observer.observe(host);
   }catch(e){fallback()}
  })();
  return()=>{disposed=true;cancelAnimationFrame(raf);observer?.disconnect();ro?.disconnect();if(renderer){scene?.traverse(o=>{if(o.geometry)o.geometry.dispose()});materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()}};
 },[reduced]);
 return <div className="roof-3d-host" ref={mount}>
  {!supported&&<img className="roof-3d-fallback" src="/images/toiture-explosee.webp" alt="Vue pédagogique d’une toiture avec couverture, bois, protection et isolation."/>}
  <span className="roof-3d-hint" aria-hidden="true">MODÈLE 3D INTERACTIF · SIX ÉLÉMENTS INDÉPENDANTS</span>
 </div>;
}
