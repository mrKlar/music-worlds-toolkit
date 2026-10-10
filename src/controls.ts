export interface Movement {forward:number;right:number;lookX:number;lookY:number}
export function createControls(canvas:HTMLCanvasElement,callbacks:{onInteract:()=>void;onPause:()=>void}){
 let enabled=false,lookX=0,lookY=0,drag:number|null=null,lastX=0,lastY=0,stickX=0,stickY=0,wasLocked=false;
 const resets:(()=>void)[]=[];
 const keys=new Set<string>(),cleanup:(()=>void)[]=[];
 const on=(target:EventTarget,event:string,fn:EventListener)=>{target.addEventListener(event,fn);cleanup.push(()=>target.removeEventListener(event,fn));};
 const clear=()=>{keys.clear();drag=null;stickX=stickY=lookX=lookY=0;resets.forEach(fn=>fn());};
 on(window,'keydown',((e:KeyboardEvent)=>{if(!enabled)return;if(e.code==='Escape'){e.preventDefault();clear();callbacks.onPause();return;}if((e.target as HTMLElement)?.matches?.('input,textarea'))return;if(['KeyW','KeyZ','KeyA','KeyQ','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys.add(e.code);e.preventDefault();}if(e.code==='KeyE'&&!e.repeat)callbacks.onInteract();}) as EventListener);
 on(window,'keyup',((e:KeyboardEvent)=>{keys.delete(e.code);}) as EventListener);
 on(window,'blur',clear);on(window,'orientationchange',clear);
 on(canvas,'pointerdown',((e:PointerEvent)=>{if(!enabled)return;canvas.focus();if(e.pointerType==='mouse'&&document.pointerLockElement===canvas){callbacks.onInteract();return;}drag=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);}) as EventListener);
 on(canvas,'dblclick',()=>{if(enabled&&navigator.maxTouchPoints===0)canvas.requestPointerLock?.()?.catch(()=>{});});
 on(window,'pointermove',((e:PointerEvent)=>{if(!enabled)return;if(document.pointerLockElement===canvas){lookX+=e.movementX;lookY+=e.movementY;}else if(drag===e.pointerId){lookX+=e.clientX-lastX;lookY+=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;}}) as EventListener);
 on(window,'pointerup',((e:PointerEvent)=>{if(drag===e.pointerId)drag=null;}) as EventListener);
 on(window,'pointercancel',clear);
 on(document,'pointerlockchange',()=>{const locked=document.pointerLockElement===canvas;if(wasLocked&&!locked){clear();callbacks.onPause();}wasLocked=locked;});
 return {
  readMovement():Movement {if(!enabled)return {forward:0,right:0,lookX:0,lookY:0};const v={forward:(keys.has('KeyW')||keys.has('KeyZ')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-stickY,right:(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('KeyQ')||keys.has('ArrowLeft')?1:0)+stickX,lookX,lookY};lookX=lookY=0;return v;},
  setEnabled(value:boolean){enabled=value;clear();},
  connectJoystick(element:HTMLElement){let id:number|null=null,originX=0,originY=0;const thumb=element.firstElementChild as HTMLElement;
   const reset=()=>{id=null;stickX=stickY=0;if(thumb)thumb.style.transform='translate(0,0)';};
   on(element,'pointerdown',((e:PointerEvent)=>{if(!enabled)return;e.preventDefault();id=e.pointerId;originX=e.clientX;originY=e.clientY;element.setPointerCapture?.(id);}) as EventListener);
   on(element,'pointermove',((e:PointerEvent)=>{if(!enabled||e.pointerId!==id)return;const dx=e.clientX-originX,dy=e.clientY-originY,r=Math.max(38,Math.hypot(dx,dy));stickX=dx/r;stickY=dy/r;if(thumb)thumb.style.transform=`translate(${stickX*30}px,${stickY*30}px)`;}) as EventListener);
   resets.push(reset);on(element,'lostpointercapture',reset);on(element,'pointerup',reset);on(element,'pointercancel',reset);on(window,'blur',reset);
  },
  dispose(){clear();cleanup.forEach(fn=>fn());}
 };
}
