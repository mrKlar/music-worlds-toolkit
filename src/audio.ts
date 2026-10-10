export interface AudioSample {
  position:number; duration:number; wallTime:number; rate:number;
  paused:boolean; waiting:boolean; seeking:boolean; ended:boolean; visible:boolean;
}
export interface AudioController {
  play():Promise<void>; pause():void; seek(seconds:number):void; setVolume(value:number):void;
  subscribe(listener:(sample:AudioSample)=>void):()=>void; dispose():void;
}
export function createAudio(url:string, media:HTMLAudioElement = new Audio()):AudioController {
  media.src=url; media.preload='auto';
  let waiting=false,disposed=false;
  const listeners=new Set<(s:AudioSample)=>void>();
  const emit=(seeking=media.seeking)=>{
    if(disposed)return;
    const sample:AudioSample={position:media.currentTime,duration:media.duration,wallTime:performance.now()/1000,
      rate:media.playbackRate,paused:media.paused,waiting,seeking,ended:media.ended,visible:typeof document==='undefined'||!document.hidden};
    listeners.forEach(fn=>fn(sample));
  };
  const events=['playing','pause','waiting','seeking','seeked','timeupdate','ended','loadedmetadata','ratechange','error'];
  const handler=(e:Event)=>{if(e.type==='waiting')waiting=true;if(e.type==='playing'||e.type==='seeked')waiting=false;emit();};
  events.forEach(e=>media.addEventListener(e,handler));
  const timer=setInterval(()=>emit(),50);
  return {
    async play(){media.playbackRate=1;await media.play();emit();},
    pause(){emit();media.pause();},
    seek(seconds){emit(true);media.currentTime=Math.max(0,Math.min(Number.isFinite(media.duration)?media.duration:Infinity,seconds));emit(true);},
    setVolume(value){media.volume=Math.max(0,Math.min(1,value));},
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    dispose(){disposed=true;clearInterval(timer);events.forEach(e=>media.removeEventListener(e,handler));listeners.clear();media.pause();media.removeAttribute('src');media.load();}
  };
}
