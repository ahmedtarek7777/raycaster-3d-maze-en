(()=>{const W=720,H=420;const[c,x]=canvas(W,H);c.style.cssText="max-width:100%;height:auto;background:#000;border-radius:14px";
const M=["1111111111111111","1000000000000001","1011101111011101","1010000001010001","1010111101010101","1000100001000101","1110101111110101","1000101000000101","1011101011110101","1010001010000001","1010111010111111","1000000010000001","1011111110111101","1000000000100001","1111111111111111"].map(r=>[...r].map(Number));
let p={x:1.5,y:1.5,a:0},k=keys(),mini=document.createElement("canvas");const FOV=Math.PI/3;
app.insertAdjacentHTML("beforeend",`<p class=small>${t("الأسهم أو WASD للحركة والدوران. اوصل للخروج الأخضر في آخر الخريطة.","Arrows or WASD to move and turn. Reach the green exit in the corner.")} <span class=tag id=ms></span></p>`);
let win=0,t0=performance.now();
loop(dt=>{const sp=3*dt,ro=2.2*dt;if(k.ArrowLeft||k.KeyA)p.a-=ro;if(k.ArrowRight||k.KeyD)p.a+=ro;let dx=0,dy=0;if(k.ArrowUp||k.KeyW){dx=Math.cos(p.a)*sp;dy=Math.sin(p.a)*sp}if(k.ArrowDown||k.KeyS){dx=-Math.cos(p.a)*sp;dy=-Math.sin(p.a)*sp}
if(!M[Math.floor(p.y)][Math.floor(p.x+dx*3)])p.x+=dx;if(!M[Math.floor(p.y+dy*3)][Math.floor(p.x)])p.y+=dy;
const sky=x.createLinearGradient(0,0,0,H/2);sky.addColorStop(0,"#1a1f3a");sky.addColorStop(1,"#3d4a78");x.fillStyle=sky;x.fillRect(0,0,W,H/2);const fl=x.createLinearGradient(0,H/2,0,H);fl.addColorStop(0,"#1c1a1a");fl.addColorStop(1,"#4a4036");x.fillStyle=fl;x.fillRect(0,H/2,W,H/2);
const cols=W/3;for(let i=0;i<cols;i++){const ang=p.a-FOV/2+FOV*i/cols,cs=Math.cos(ang),sn=Math.sin(ang);let mx=Math.floor(p.x),my=Math.floor(p.y);const dX=Math.abs(1/cs),dY=Math.abs(1/sn);let sx=cs<0?-1:1,sy=sn<0?-1:1,sdx=(cs<0?p.x-mx:mx+1-p.x)*dX,sdy=(sn<0?p.y-my:my+1-p.y)*dY,side=0;
while(!M[my][mx]){if(sdx<sdy){sdx+=dX;mx+=sx;side=0}else{sdy+=dY;my+=sy;side=1}}
const d=(side?sdy-dY:sdx-dX)*Math.cos(ang-p.a),h=Math.min(H*2,H/d*.9),sh=Math.max(.15,1-d/10)*(side?.7:1);const ex=mx==14&&my==13?1:0;const hx=side?p.x+(sdy-dY)*cs:p.y+(sdx-dX)*sn,tx=hx-Math.floor(hx);const br=(tx<.06||tx>.94)?.7:1;
x.fillStyle=ex?`rgb(60,${200*sh|0},120)`:`rgb(${190*sh*br|0},${110*sh*br|0},${90*sh*br|0})`;x.fillRect(i*3,(H-h)/2,3,h)}
const s=5;x.globalAlpha=.8;for(let y=0;y<M.length;y++)for(let z=0;z<M[0].length;z++){x.fillStyle=M[y][z]?"#fff6":"#0006";x.fillRect(8+z*s,8+y*s,s,s)}x.fillStyle="#ff0";x.fillRect(8+p.x*s-2,8+p.y*s-2,4,4);x.globalAlpha=1;
$("#ms").textContent=((performance.now()-t0)/1000).toFixed(0)+"s";if(!win&&p.x>13&&p.y>12){win=1;toast(t("وصلت للخروج! 🎉 الوقت "+$("#ms").textContent,"You made it! 🎉 Time "+$("#ms").textContent));setTimeout(()=>{p={x:1.5,y:1.5,a:0};win=0;t0=performance.now()},3000)}});})();
