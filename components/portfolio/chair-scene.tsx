"use client";
import { useEffect,useRef,useState } from 'react';
export function ChairScene({hero=false}:{hero?:boolean}){
 const host=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{let teardown=()=>{};let disposed=false;
  (async()=>{const THREE=await import('three');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const {gsap}=await import('gsap');const {ScrollTrigger}=await import('gsap/ScrollTrigger');gsap.registerPlugin(ScrollTrigger);if(disposed||!host.current)return;
   const element=host.current;const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);element.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,.01,50);camera.position.set(1.9,1.45,2.65);camera.lookAt(0,.65,0);scene.add(new THREE.HemisphereLight(0xffffff,0x607060,1.8));const light=new THREE.DirectionalLight(0xffedcf,2.3);light.position.set(3,4,3);scene.add(light);
   const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0;let mixer:InstanceType<typeof THREE.AnimationMixer>|undefined;let model:InstanceType<typeof THREE.Group>|undefined;let duration=0;let progress=0;let visible=true;let trigger:ReturnType<typeof ScrollTrigger.create>|undefined;let mx=0,my=0;
   const resize=()=>{const r=element.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(element);resize();
   const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});visibility.observe(element);
   const move=(e:PointerEvent)=>{if(reduced.matches)return;mx=(e.clientX/innerWidth-.5)*.22;my=(e.clientY/innerHeight-.5)*.05;};window.addEventListener('pointermove',move,{passive:true});
   const render=()=>{raf=requestAnimationFrame(render);if(!visible||document.hidden)return;if(model){model.rotation.y+=(mx-model.rotation.y)*.04;model.rotation.x+=(my-model.rotation.x)*.04;if(mixer)mixer.setTime(progress*duration*.58);}renderer.render(scene,camera);};render();
   const configure=()=>{trigger?.kill();progress=0;if(!reduced.matches&&!hero)trigger=ScrollTrigger.create({trigger:'#chair-story',start:'top top',end:'bottom bottom',onUpdate:self=>{progress=self.progress;gsap.set('.chair-title',{opacity:Math.max(0,1-progress*9)});gsap.set('.chair-note',{opacity:Math.max(0,1-progress*12)});}});};
   teardown=()=>{trigger?.kill();cancelAnimationFrame(raf);observer.disconnect();visibility.disconnect();window.removeEventListener('pointermove',move);reduced.removeEventListener('change',configure);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const mat of (Array.isArray(o.material)?o.material:[o.material])){for(const v of Object.values(mat))if(v instanceof THREE.Texture)v.dispose();mat.dispose();}}});renderer.dispose();renderer.domElement.remove();};
   new GLTFLoader().load('/portfolio/sprachstuhl.glb',g=>{if(disposed)return;model=g.scene;model.traverse(o=>{if(o instanceof THREE.Light)o.visible=false;});scene.add(model);if(g.animations.length){mixer=new THREE.AnimationMixer(model);const action=mixer.clipAction(g.animations[0]);action.play();duration=g.animations[0].duration;}configure();reduced.addEventListener('change',configure);},undefined,()=>{if(!disposed)setFailed(true);});
  })().catch(()=>{if(!disposed)setFailed(true);});return()=>{disposed=true;teardown();};
 },[hero]);
 return <div ref={host} className="chair-canvas" role="img" aria-label="Dreidimensionaler Sprachstuhl. Beim Scrollen lösen sich Sitz, Stützen und Hülle voneinander.">{failed&&<img src="/portfolio/chair.webp" alt="Sprachstuhl aus Papier und Holz"/>}</div>;
}


