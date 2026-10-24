import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

const files = ['index.html','styles.css','app.js','v2-app.js','manifest.webmanifest','sw.js','icon.svg','icon-maskable.svg'];
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of files) await cp(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
await cp('public/game-data','dist/game-data',{recursive:true});
await writeFile('dist/.nojekyll','');
console.log(`Built ${files.length} entry assets plus shared modules into dist/`);
