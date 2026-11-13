const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const acorn = require('acorn');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
let browser;
const server = spawn('python3', ['scripts/serve.py', '--bind', '127.0.0.1', '--port', '8765'], {cwd: root, stdio: 'ignore'});
const base = 'http://127.0.0.1:8765/';
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; console.log('OK ' + message); }
(async () => {
  for (const file of ['app.js', 'config.js']) {
    acorn.parse(fs.readFileSync(path.join(root, 'assets', file), 'utf8'), {ecmaVersion: 5});
    check(true, file + ' sintaxis ES5');
  }
  for (let i=0;i<40;i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise(r=>setTimeout(r,100)); }
  for (const file of ['index.html','settings.html','diagnostics.html','assets/app.js','assets/config.js','assets/style.css']) {
    check((await fetch(base+file)).ok, 'HTTP recurso '+file);
  }
  check((await fetch(base+'package.json')).status===404,'servidor no expone archivos privados');
  browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless:true, args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[], external=[];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('request', r=>{if(!r.url().startsWith(base)) external.push(r.url());});
  await page.goto(base);
  check(await page.locator('.tile').count()===4,'cuatro accesos cargados');
  await page.keyboard.press('ArrowRight');
  check(await page.locator('[data-action=favorites]').evaluate(e=>e===document.activeElement),'flecha derecha');
  await page.keyboard.press('Enter');
  check(await page.locator('.tile').count()===2,'OK filtra favoritos');
  await page.keyboard.press('Escape');
  check(await page.locator('.tile').count()===4,'Atrás restaura aplicaciones');
  await page.keyboard.press('ArrowDown');
  check(await page.locator('.tile').first().evaluate(e=>e===document.activeElement),'abajo entra en cuadrícula');
  await page.keyboard.press('ArrowRight');
  check(await page.locator('.tile').nth(1).evaluate(e=>e===document.activeElement),'derecha entre accesos');
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowUp');
  check(await page.locator('#toolbar').evaluate(e=>e.contains(document.activeElement)),'izquierda y arriba regresan al menú');
  await page.screenshot({path:path.join(root,'artifacts/home-1080.png'),fullPage:true});
  await page.goto(base+'settings.html');
  const original=JSON.parse(await page.locator('#config').inputValue());
  const custom=structuredClone(original); custom.apps=[{name:'Servidor local',url:base+'diagnostics.html',favorite:true}]; custom.keys.ok=[13,29443];
  await page.locator('#config').fill(JSON.stringify(custom)); await page.getByText('Guardar configuración',{exact:true}).click();
  check((await page.locator('#status').innerText()).includes('guardada'),'guarda configuración');
  await page.goto(base); check(await page.locator('.tile').count()===1,'persistencia tras navegar');
  await page.locator('.tile').focus();
  await page.evaluate(()=>document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{keyCode:29443,bubbles:true,cancelable:true})));
  await page.waitForURL('**/diagnostics.html'); check(true,'OK remapeado abre acceso local');
  await page.keyboard.press('ArrowDown'); check((await page.locator('#keys').innerText()).includes('keyCode=40'),'registro de teclas');
  check((await page.locator('#report').innerText()).includes('Almacenamiento (escritura real): true'),'diagnóstico de almacenamiento');
  await page.keyboard.press('Escape'); await page.waitForURL(base+'index.html');
  await page.goto(base+'settings.html');
  for (const bad of [Object.assign({},custom,{apps:[{name:'X',url:'javascript:alert(1)',favorite:true}]}),Object.assign({},custom,{keys:Object.assign({},custom.keys,{left:[13]})})]) {
    await page.locator('#config').fill(JSON.stringify(bad)); await page.getByText('Guardar configuración',{exact:true}).click();
    check(!(await page.locator('#status').innerText()).includes('guardada'),'rechaza configuración insegura o ambigua');
  }
  await page.getByText('Restablecer valores',{exact:true}).click();
  await page.goto(base); check(await page.locator('.tile').count()===4,'restablece valores');
  await page.setViewportSize({width:1280,height:720});
  const geometry=await page.locator('.tile').evaluateAll(es=>es.map(e=>({x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth})));
  check(geometry[0].y===geometry[3].y,'cuatro columnas a 720p');
  await page.screenshot({path:path.join(root,'artifacts/home-720.png'),fullPage:true});
  await page.setViewportSize({width:800,height:600}); await page.reload();
  await page.locator('.tile').first().focus(); await page.keyboard.press('ArrowDown');
  check(await page.locator('.tile').nth(2).evaluate(e=>e===document.activeElement),'abajo en diseño de dos columnas');
  const blocked=await browser.newContext();
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));
  const fallback=await blocked.newPage(); await fallback.goto(base);
  check(await fallback.locator('.tile').count()===4,'funciona sin localStorage'); await blocked.close();
  const corrupt=await browser.newContext(); const cp=await corrupt.newPage(); await cp.goto(base); await cp.evaluate(()=>localStorage.setItem('atvio.launcher.v1','malformed')); await cp.reload();
  check(await cp.locator('.tile').count()===4,'recupera configuración corrupta'); await corrupt.close();
  check(external.length===0,'sin peticiones externas obligatorias'); check(errors.length===0,'sin errores JavaScript');
  console.log(checks+' comprobaciones correctas. Chromium automatizado; no constituye prueba física en ATVIO.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser) await browser.close();server.kill();});
