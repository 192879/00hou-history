import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { once } from 'node:events';

const edge='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if(!fs.existsSync(edge)){console.log('SKIP: Edge is unavailable');process.exit(0)}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const rel=req.url==='/'?'index.html':decodeURIComponent(req.url.split('?')[0].slice(1)),file=path.resolve(rel);if(!file.startsWith(process.cwd())){res.writeHead(403);return res.end()}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end()}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)})});
await new Promise(r=>server.listen(8123,'127.0.0.1',r));
const profile=await mkdtemp(join(tmpdir(),'00hou-e2e-'));
const debugPort=9300+Math.floor(Math.random()*400);
const browser=spawn(edge,['--headless=new','--disable-gpu','--disable-extensions','--disable-background-networking','--no-first-run',`--user-data-dir=${profile}`,`--remote-debugging-port=${debugPort}`,'--window-size=412,915','http://127.0.0.1:8123/'],{stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let socket,id=0,pending=new Map();
async function connect(){for(let i=0;i<30;i++){try{const tabs=await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r=>r.json()),tab=tabs.find(x=>x.type==='page'&&x.url.includes('127.0.0.1:8123'));if(tab){socket=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j});socket.onmessage=e=>{const msg=JSON.parse(e.data),p=pending.get(msg.id);if(p){pending.delete(msg.id);msg.error?p.reject(msg.error):p.resolve(msg.result)}};return}}catch{}await delay(200)}throw new Error('Unable to connect to Edge DevTools')}
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}))});
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value}
async function waitFor(selector){for(let i=0;i<100;i++){if(await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`))return;await delay(100)}const diagnostic=await evaluate(`({url:location.href,text:document.body.innerText.slice(0,300),html:document.querySelector('#app')?.innerHTML.slice(0,200)})`);throw new Error(`Missing selector ${selector}: ${JSON.stringify(diagnostic)}`)}
let passed=false;
try{
 await connect();await waitFor('#newLife');await evaluate(`document.querySelector('#newLife').click()`);await waitFor('[data-talent]');
 for(let i=0;i<3;i++){await evaluate(`document.querySelector('[data-talent]:not(.selected)').click()`);await delay(80)}
 await waitFor('#enterLife:not([disabled])');await evaluate(`document.querySelector('#enterLife').click()`);await waitFor('[data-advance="1"]');
 await evaluate(`document.querySelector('[data-advance="1"]').click()`);let firstAge=0;for(let i=0;i<30&&firstAge!==1;i++){await delay(100);firstAge=await evaluate(`Number(document.querySelector('.life-hud h1 span')?.textContent.match(/[0-9]+/)?.[0]||0)`)}if(firstAge!==1)throw new Error(`Expected age 1, got ${firstAge}`);
 await send('Page.reload',{ignoreCache:true});await delay(500);await waitFor('#continue:not([disabled])');await evaluate(`document.querySelector('#continue').click()`);await waitFor('.life-hud');
 const restoredAge=await evaluate(`Number(document.querySelector('.life-hud h1 span').textContent.match(/[0-9]+/)[0])`);if(restoredAge!==1)throw new Error(`Expected restored age 1, got ${restoredAge}`);
 const overflow=await evaluate(`document.documentElement.scrollWidth>document.documentElement.clientWidth`);if(overflow)throw new Error('Horizontal overflow detected at 412px');
 console.log('✓ Browser click flow: new life → talents → annual advance');
 console.log('✓ IndexedDB auto-save survives reload and restores age 1');
 console.log('✓ 412px Android viewport has no horizontal overflow');
 passed=true;
}finally{
 socket?.close();spawn('taskkill',['/PID',String(browser.pid),'/T','/F'],{stdio:'ignore'});await Promise.race([once(browser,'exit'),delay(1500)]);
 await new Promise(resolve=>server.close(resolve));
 for(let i=0;i<4;i++){try{await rm(profile,{recursive:true,force:true,maxRetries:2,retryDelay:150});break}catch(error){if(i===3)console.warn(`Temporary Edge profile retained: ${error.code}`);await delay(250)}}
}
if(passed)process.exit(0);
