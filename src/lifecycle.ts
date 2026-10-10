export function installLifecycle(pause:()=>void){
 const hidden=()=>{if(document.hidden)pause();};
 document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',pause);
 return()=>{document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',pause);};
}
