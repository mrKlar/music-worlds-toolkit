// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {installLifecycle} from '../src/lifecycle';
it('backgrounding pauses once and cleanup removes listeners',()=>{const pause=vi.fn();const cleanup=installLifecycle(pause);vi.spyOn(document,'hidden','get').mockReturnValue(true);document.dispatchEvent(new Event('visibilitychange'));expect(pause).toHaveBeenCalledTimes(1);cleanup();document.dispatchEvent(new Event('visibilitychange'));expect(pause).toHaveBeenCalledTimes(1);vi.restoreAllMocks();});
