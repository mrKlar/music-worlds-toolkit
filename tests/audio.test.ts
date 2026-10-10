import {describe,it,expect,vi} from 'vitest';
import {createAudio} from '../src/audio';
class Media extends EventTarget {
 currentTime=0;duration=10;playbackRate=1;paused=true;ended=false;seeking=false;volume=.7;src='';preload='';
 play=vi.fn(async()=>{this.paused=false;this.dispatchEvent(new Event('playing'));});
 pause=vi.fn(()=>{this.paused=true;this.dispatchEvent(new Event('pause'));});
 load=vi.fn();removeAttribute=vi.fn();
}
describe('audio adapter',()=>{
 it('never autoplays; preserves chosen volume through pause and play',async()=>{const m=new Media();const a=createAudio('/song.mp3',m as unknown as HTMLAudioElement);expect(m.play).not.toHaveBeenCalled();a.setVolume(.23);await a.play();a.pause();await a.play();expect(m.volume).toBe(.23);a.dispose();});
 it('propagates browser play rejection without pretending to play',async()=>{const m=new Media();m.play.mockRejectedValueOnce(new Error('blocked'));const a=createAudio('/song.mp3',m as unknown as HTMLAudioElement);await expect(a.play()).rejects.toThrow('blocked');expect(m.paused).toBe(true);a.dispose();});
 it('reports seek discontinuity and detaches subscribers on disposal',()=>{const m=new Media();const a=createAudio('/song.mp3',m as unknown as HTMLAudioElement);const cb=vi.fn();a.subscribe(cb);a.seek(9);expect(cb.mock.calls.at(-1)?.[0].seeking).toBe(true);a.dispose();cb.mockClear();m.dispatchEvent(new Event('timeupdate'));expect(cb).not.toHaveBeenCalled();});
});
