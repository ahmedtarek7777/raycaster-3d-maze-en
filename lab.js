const AR=document.documentElement.lang.startsWith("ar"),t=(a,e)=>AR?a:e;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const app=$("#app"),KEY="lab:"+(document.body.dataset.app||"")+":";
const S={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(KEY+k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch{}}};
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[ri(0,a.length-1)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const seeded=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let x=Math.imul(s^s>>>15,1|s);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296};
const num=n=>new Intl.NumberFormat(AR?"ar-EG":"en-US").format(n);
const money=n=>new Intl.NumberFormat(AR?"ar-EG":"en-US",{style:"currency",currency:"EGP",maximumFractionDigits:0}).format(n);
function toast(m){let e=$("#toast");if(!e){e=document.createElement("div");e.id="toast";document.body.append(e)}e.textContent=m;e.hidden=false;clearTimeout(window._tt);window._tt=setTimeout(()=>e.hidden=true,3000)}
function dl(name,text,type="text/plain"){const a=document.createElement("a");a.href=text instanceof Blob?URL.createObjectURL(text):URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>no(new Error("load "+src));document.head.append(s)})}
function loadCSS(href){const l=document.createElement("link");l.rel="stylesheet";l.href=href;document.head.append(l)}
async function ai(prompt,system=""){
  const body=JSON.stringify({system_instruction:{parts:[{text:system+" Reply in "+(AR?"Egyptian Arabic (colloquial) unless asked otherwise":"English")+"."}]},contents:[{role:"user",parts:[{text:prompt}]}]});
  const models=["gemini-3.5-flash-lite","gemini-flash-lite-latest","gemini-3.5-flash","gemini-3-flash-preview","gemini-3.8-flash","gemini-flash-latest"];
  for(let round=0;round<3;round++){
    for(const m of models){
      try{const r=await fetch("https://portfolio-ai.ahmedtarek-portfolio.workers.dev/?model="+m,{method:"POST",headers:{"Content-Type":"application/json"},body,signal:AbortSignal.timeout(75000)});
        if(!r.ok)continue;const d=await r.json();const x=(d.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("").trim();if(x)return x}catch{}}
    await new Promise(r=>setTimeout(r,1500*(round+1)));
  }
  throw new Error("ai");
}
function aiJSON(x){const m=x.match(/[\[{][\s\S]*[\]}]/);if(!m)throw new Error("json");return JSON.parse(m[0])}
const AIERR=()=>t("الذكاء الاصطناعي مشغول دلوقتي. جرّب تاني بعد شوية.","The AI is busy right now. Try again in a moment.");
function md(s){return esc(s).replace(/^### (.*)$/gm,"<h4>$1</h4>").replace(/^## (.*)$/gm,"<h3>$1</h3>").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^[-*] (.*)$/gm,"<li>$1</li>").replace(/\n/g,"<br>")}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function loop(fn){let id,last=performance.now();const f=n=>{const dt=Math.min(.05,(n-last)/1000);last=n;fn(dt);id=requestAnimationFrame(f)};id=requestAnimationFrame(f);return()=>cancelAnimationFrame(id)}
function keys(){const k={};addEventListener("keydown",e=>{k[e.code]=1;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))e.preventDefault()});addEventListener("keyup",e=>k[e.code]=0);return k}
function canvas(w,h,parent=app){const c=document.createElement("canvas");c.width=w;c.height=h;parent.append(c);return[c,c.getContext("2d")]}
(()=>{const b=document.body,k="arabic-portfolio:studio-light";try{b.classList.toggle("light",JSON.parse(localStorage.getItem(k)||"false"))}catch{}const th=$("#theme");if(th)th.onclick=()=>{b.classList.toggle("light");try{localStorage.setItem(k,b.classList.contains("light"))}catch{}}})();
async function run(btn,out,fn){btn.disabled=true;const old=out.innerHTML;out.innerHTML='<span class="spin"></span> '+t("بفكّر...","Thinking...");try{await fn()}catch(e){out.innerHTML=esc(AIERR())}btn.disabled=false}
