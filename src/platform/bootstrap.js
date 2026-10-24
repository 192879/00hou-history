import { createSaveRepository } from '../storage/saves.js';
import { installNativeLifecycle, isNative } from './index.js';

const saves=createSaveRepository();
saves.preserveLegacy().catch(error=>console.warn('V1 archive preservation failed',error));

installNativeLifecycle({
  onPause:()=>window.dispatchEvent(new CustomEvent('00hou:pause')),
  onResume:()=>window.dispatchEvent(new CustomEvent('00hou:resume')),
  onBack:()=>{
    if(document.querySelector('[data-modal-open]')){window.dispatchEvent(new CustomEvent('00hou:close-modal'));return true}
    return false;
  }
}).catch(error=>console.warn('Native lifecycle unavailable',error));

document.documentElement.dataset.platform=isNative()?'android':'web';
window.__V2_STORAGE__=saves;
