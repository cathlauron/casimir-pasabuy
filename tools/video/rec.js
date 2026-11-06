// Scripted, frame-by-frame recording of the order page for a 9:16 tutorial.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const FM='/home/claude/pasabuy/poster/node_modules/@fontsource';
const OUT=path.join(__dirname,'frames'); fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT);
const W=390,H=694,DSF=1080/390;
const fontCss=[['Fredoka',500],['Fredoka',600],['Fredoka',700],['Nunito',400],['Nunito',600],['Nunito',700],['Nunito',800]]
 .map(([f,w])=>`@font-face{font-family:${f};font-weight:${w};font-display:block;src:url(file://${FM}/${f.toLowerCase()}/files/${f.toLowerCase()}-latin-${w}-normal.woff2)}`).join('\n');
let n=0; const marks=[];
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:DSF,hasTouch:false});
const p=await ctx.newPage();
await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({status:200,contentType:'text/css',body:fontCss}));
await p.addInitScript(()=>{try{Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{}},configurable:true})}catch(e){}});
await p.goto('file:///home/claude/pasabuy/site/index.html');
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
// overlay: caption pill + tap ring; block real navigation to IG/TikTok
await p.evaluate(()=>{
  const st=document.createElement('style');st.textContent=`
  #cap{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:999;background:rgba(58,47,54,.92);color:#fff;font:800 15px/1.25 Nunito;padding:9px 16px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.18);transition:none}
  #cap b{color:#ffb8cf}
  #tap{position:fixed;z-index:998;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(217,67,122,.28);border:3px solid rgba(217,67,122,.85);pointer-events:none;display:none}
  html{scroll-behavior:auto!important}`;document.head.appendChild(st);
  const c=document.createElement('div');c.id='cap';c.style.opacity=0;document.body.appendChild(c);
  const t=document.createElement('div');t.id='tap';document.body.appendChild(t);
  document.addEventListener('click',e=>{const a=e.target.closest('a[target=_blank]');if(a)e.preventDefault()},true);
});
const frame=async()=>{await p.screenshot({path:path.join(OUT,String(n++).padStart(5,'0')+'.jpg'),type:'jpeg',quality:92});};
const hold=async(f)=>{for(let i=0;i<f;i++)await frame();};
const cap=async(html,f=0)=>{marks.push([n/30,html.replace(/<[^>]+>/g,'')]);await p.evaluate(h=>{const c=document.getElementById('cap');c.innerHTML=h;c.style.opacity=h?1:0},html);if(f)await hold(f);};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const scrollTo=async(target,f=24)=>{const y0=await p.evaluate(()=>scrollY);const y1=typeof target==='number'?target:await p.evaluate(([s,off])=>{const el=document.querySelector(s);return el.getBoundingClientRect().top+scrollY-off},target);
  for(let i=1;i<=f;i++){await p.evaluate(y=>window.scrollTo(0,y),y0+(y1-y0)*ease(i/f));await frame();}};
const tap=async(sel,act)=>{const box=await p.locator(sel).first().boundingBox();const x=box.x+box.width/2,y=box.y+box.height/2;
  for(let i=0;i<5;i++){await p.evaluate(([x,y,s])=>{const t=document.getElementById('tap');t.style.display='block';t.style.left=x+'px';t.style.top=y+'px';t.style.transform=`scale(${s})`},[x,y,0.6+i*0.1]);await frame();}
  await (act?act():p.locator(sel).first().click()); await p.waitForTimeout(60);
  for(let i=0;i<5;i++){await p.evaluate(o=>{document.getElementById('tap').style.opacity=o},1-i*0.2);await frame();}
  await p.evaluate(()=>{const t=document.getElementById('tap');t.style.display='none';t.style.opacity=1});};
const type=async(sel,text)=>{await p.locator(sel).scrollIntoViewIfNeeded().catch(()=>{});await p.focus(sel);for(let i=0;i<text.length;i+=2){await p.fill(sel,text.slice(0,i+2));await frame();}};

// 1. Intro (0-4s)
await cap('Order from <b>Casimir Pasa"buy"</b> 🛍️',105);
// 2. Browse (4-9s)
await cap('<b>1</b> · Browse the fancon merch');
await scrollTo(['#shop',4],30); await hold(30);
await scrollTo(['#grid .item:nth-child(3)',60],24); await hold(10);
// 3. Add items
await cap('Tap <b>+</b> to add items');
await scrollTo(['#grid .item:nth-child(1) .qty',300],20);
await tap('#grid .item:nth-child(1) button[data-d="1"]'); await hold(8);
await scrollTo(['#grid .item:nth-child(3) .qty',300],22);
await tap('#grid .item:nth-child(3) button[data-d="1"]'); await hold(12);
await cap('Your total updates below 👇',50);
// 4. Shop tab
await cap('More MuvMuv items in this tab');
await scrollTo(['.tabs',70],18);
await tap('.tabs button[data-tab=shop]'); await hold(10);
await scrollTo(['#grid .item:nth-child(2) .qty',330],22);
await tap('#grid .item:nth-child(2) button[data-d="1"]'); await hold(28);
// 5. Sold out
await cap('If it sells out: <b>refund</b> or <b>swap</b>');
await scrollTo(['#soldout',60],26); await hold(60);
// 6. Details
await cap('<b>2</b> · Fill in your details');
await scrollTo(['#checkout',60],24); await hold(15);
await type('#f-name','Juana Dela Cruz'); await type('#f-handle','@juana.fan');
await type('#f-mobile','0917 123 4567');
await scrollTo(['#f-street',120],14);
await type('#f-street','12 Rizal St.'); await type('#f-brgy','San Isidro');
await type('#f-city','Quezon City'); await type('#f-prov','Metro Manila'); await type('#f-zip','1100');
// 7. Sold-out choice
await cap('Pick <b>refund</b> or a <b>swap</b> per item');
await scrollTo(['#prefs',130],20);
await tap('input[name="p_talkie"][value="swap"]'); await hold(6);
await tap('select[data-swap="talkie"]',()=>p.selectOption('select[data-swap="talkie"]','s_sitting')); await hold(30);
// 8. Payment
await cap('<b>3</b> · Pay via GCash <b>after we confirm</b>');
await scrollTo(['.qrbox',150],24); await hold(50);
await type('#f-gname','Juana Dela Cruz');
// 9. Review
await cap('<b>4</b> · Review your order');
await scrollTo(['.final',70],22); await hold(36);
await tap('#c1'); await tap('#c2'); await hold(6);
await cap('Tap <b>Review &amp; send my order</b>');
await scrollTo(['#form button[type=submit]',360],14);
await tap('#form button[type=submit]'); await hold(10);
// 10. Send
await cap('<b>5</b> · Copy &amp; send it to <b>@csmrzrzr</b>');
await hold(40);
await tap('#go-ig'); await hold(40);
await cap('Order sent? Tick the box ✅');
await tap('#sent'); await p.evaluate(()=>{const b=document.querySelector('#modal .box');b.scrollTop=b.scrollHeight}); await hold(35);
await cap('We\'ll DM you to confirm your slots 💌',75);
fs.writeFileSync(path.join(__dirname,'marks.json'),JSON.stringify(marks,null,1));
console.log('frames',n,'seconds',(n/30).toFixed(1));
await b.close();})();
