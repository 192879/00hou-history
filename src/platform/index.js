export const isNative=()=>globalThis.Capacitor?.isNativePlatform?.()===true;

export async function installNativeLifecycle({onPause,onResume,onBack}={}){
  if(!isNative())return()=>{};
  const App=globalThis.Capacitor?.Plugins?.App;if(!App)throw new Error('Capacitor App plugin unavailable');
  const handles=[];
  handles.push(await App.addListener('appStateChange',({isActive})=>isActive?onResume?.():onPause?.()));
  handles.push(await App.addListener('backButton',()=>{if(onBack?.()!==true)App.minimizeApp()}));
  return()=>handles.forEach(h=>h.remove());
}
export async function exportJson(filename,data){
  const text=JSON.stringify(data,null,2);
  if(!isNative()){const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);return;}
  const Filesystem=globalThis.Capacitor?.Plugins?.Filesystem,Share=globalThis.Capacitor?.Plugins?.Share;
  if(!Filesystem||!Share)throw new Error('Native file export plugins unavailable');
  const saved=await Filesystem.writeFile({path:`exports/${filename}`,data:text,directory:'CACHE',recursive:true,encoding:'utf8'});
  await Share.share({title:'导出00后渡劫存档',url:saved.uri,dialogTitle:'保存或分享存档'});
}
