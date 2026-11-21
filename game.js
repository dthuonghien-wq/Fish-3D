const $=id=>document.getElementById(id);
const wrap=$('wrap'),ov=$('ov'),msg=$('msg'),stB=$('st'),sc=$('sc'),bs=$('bs'),lvE=$('lv'),lfE=$('lf'),lvB=$('lvb'),mu=$('mu'),psB=$('ps'),fl=$('fl'),vg=$('vg'),pwE=$('pw'),skE=$('skins'),lbls=$('lbls'),joy=$('joy'),knob=$('knob'),enE=$('en'),ctrl=$('ctrl');
const fBtns=[...document.querySelectorAll('[data-f]')];
let best=0,muted=false;try{best=+localStorage.getItem('fishBest2')||0;muted=localStorage.getItem('fishMute')==='1'}catch(e){}
bs.textContent=best;mu.textContent=muted?'🔇':'🔊';
mu.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();muted=!muted;mu.textContent=muted?'🔇':'🔊';try{localStorage.setItem('fishMute',muted?'1':'0')}catch(e){}});

// ================= ÂM THANH =================
let AC=null,NB=null;
function unlockAudio(){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}
if(AC&&AC.state!=='running')AC.resume().catch(()=>{});
if(AC&&!NB){NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
if(AC&&!unlockAudio.done){unlockAudio.done=true;try{const b=AC.createBuffer(1,1,22050),s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0)}catch(e){}
try{const n=2205,buf=new ArrayBuffer(44+n*2),v=new DataView(buf),w=(o,str)=>{for(let i=0;i<str.length;i++)v.setUint8(o+i,str.charCodeAt(i))};w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,22050,true);v.setUint32(28,44100,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
const au=new Audio(URL.createObjectURL(new Blob([buf],{type:'audio/wav'})));au.loop=true;au.setAttribute('playsinline','');au.play().catch(()=>{});unlockAudio.au=au}catch(e){}}}
['touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,unlockAudio,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&AC.state!=='running')AC.resume().catch(()=>{})});
function snd(f1,f2,d,type,vol){if(muted||!AC)return;const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d)}
const seq=(fs,vol,gap,type)=>fs.forEach((f,i)=>setTimeout(()=>snd(f,f*1.01,0.14,type||'triangle',vol),i*(gap||80)));
function noise(t,d,vol,hp){if(!NB||muted)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+d+0.02)}
const sAbsorb=n=>{const k=Math.min(6,1+Math.floor(Math.log2(n+1)));for(let i=0;i<k;i++)setTimeout(()=>snd(600+i*120,1200+i*160,0.07,'sine',0.07),i*45)};
const sGateGood=()=>seq([784,988,1175,1568],0.07,60),sGateBad=()=>seq([523,392,311,233],0.07,70,'square');
const sBite=()=>{snd(180,60,0.18,'square',0.09);if(AC)noise(AC.currentTime,0.08,0.12,1500)},sRam=()=>{snd(120,40,0.25,'sawtooth',0.14);if(AC)noise(AC.currentTime,0.15,0.2,300)};
const sGiant=()=>{snd(110,440,0.5,'sawtooth',0.07);setTimeout(()=>seq([392,523,659,784],0.06,70),250)},sForm=()=>snd(500,900,0.12,'triangle',0.06);
const sEatBig=()=>{snd(220,50,0.5,'sawtooth',0.14);setTimeout(()=>seq([523,659,784,1047,1319],0.08,70),250)},sPower=()=>seq([523,784,1047,1568,2093],0.07,60);
const sHurt=()=>snd(300,60,0.4,'sawtooth',0.13),sDie=()=>snd(400,45,0.9,'sawtooth',0.15),sLife=()=>seq([659,880,1319],0.08);
const sSiren=()=>{for(let i=0;i<3;i++)setTimeout(()=>{snd(440,880,0.25,'square',0.06);setTimeout(()=>snd(880,440,0.25,'square',0.06),250)},i*500)},sZone=()=>seq([523,659,784,1047,1319,1568],0.08,90);
const sNet=()=>{if(AC)noise(AC.currentTime,0.5,0.25,600);snd(300,100,0.5,'sawtooth',0.08)},sZap=()=>{snd(1800,300,0.12,'square',0.05);if(AC)noise(AC.currentTime,0.06,0.1,4000)};
// Nhạc nền dưới nước: mỗi vùng một bài
const mtof=m=>440*Math.pow(2,(m-69)/12);
const SONGS=[{ch:[[57,60,64],[53,57,60],[55,59,62],[52,55,59]],arp:[0,1,2,1,2,1,0,1]},{ch:[[62,65,69],[60,64,67],[58,62,65],[57,61,64]],arp:[0,2,1,2,0,1,2,1]},
{ch:[[60,63,67],[56,60,63],[58,62,65],[55,58,62]],arp:[2,1,0,1,2,0,1,0]},{ch:[[57,60,64],[57,60,63],[53,57,60],[52,56,59]],arp:[0,1,2,0,1,2,1,0]},
{ch:[[52,55,59],[48,52,55],[50,53,57],[47,50,54]],arp:[0,2,1,0,2,1,2,1]},{ch:[[64,67,71],[60,64,67],[62,66,69],[59,62,66]],arp:[0,1,2,1,0,2,1,2]},{ch:[[60,64,67],[65,69,72],[67,71,74],[64,67,71]],arp:[0,1,2,2,1,0,1,2]}];
let nextNote=0,step16=0;
function note(f,t,d,type,vol){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02)}
setInterval(()=>{if(!AC||muted||!running||paused){nextNote=0;return}const song=SONGS[(zone-1)%SONGS.length],spb=60/(92+Math.min(zone-1,8)*5)/2,danger=!!boss;
if(nextNote<AC.currentTime)nextNote=AC.currentTime+0.05;
while(nextNote<AC.currentTime+0.25){const i=step16%16,ch=song.ch[Math.floor(step16/16)%4],t=nextNote;
if(i===0)note(mtof(ch[0]-12),t,spb*14,'sine',0.06);
if(i%4===0)note(mtof(ch[0]-24),t,spb*3.5,'triangle',0.09);
note(mtof(ch[song.arp[i%8]]+(i%8>=4?12:0)),t,spb*0.9,'triangle',0.022);
if(i%8===6)note(mtof(ch[2]+24),t,spb*0.6,'sine',0.02);
if(danger&&i%2===0)note(mtof(ch[0]-24),t,spb*0.8,'sawtooth',0.035);
if(Math.random()<0.08)note(1200+Math.random()*1400,t,0.06,'sine',0.012);
step16++;nextNote+=spb}},60);
if(typeof THREE==='undefined'){msg.textContent='Không tải được đồ hoạ 3D, hãy mở lại khi có mạng';stB.style.display='none';throw new Error('THREE missing')}

// ================= KHUNG CẢNH =================
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));wrap.prepend(R.domElement);
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,0.5,500);
function fit(){const w=wrap.clientWidth||340,h=wrap.clientHeight||w*1.4;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
fit();window.addEventListener('resize',fit);
const hemi=new THREE.HemisphereLight(0xffffff,0x204060,0.9);S.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,0.7);sun.position.set(10,30,8);S.add(sun);S.add(sun.target);
const lamp=new THREE.PointLight(0xFFE9A8,0,30,1.6);S.add(lamp);
S.fog=new THREE.Fog(0x1E9FB8,20,60);
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)}
const radT=canvasTex(128,128,(g)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)});
const gsC={};function glowSp(c,s,op){const k=c+'_'+(op||0.7);const m=gsC[k]||(gsC[k]=new THREE.SpriteMaterial({map:radT,color:c,transparent:true,opacity:op||0.7,blending:THREE.AdditiveBlending,depthWrite:false}));const sp=new THREE.Sprite(m);sp.scale.set(s,s,1);return sp}
function skyTex(a,b){return canvasTex(2,256,g=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,0,2,256)})}
function noiseTex(size,base,amp,draw){const t=canvasTex(size,size,g=>{g.fillStyle=base;g.fillRect(0,0,size,size);const d=g.getImageData(0,0,size,size);for(let i=0;i<d.data.length;i+=4){const n=(Math.random()-0.5)*amp;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n}g.putImageData(d,0,0);if(draw)draw(g,size)});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const rp=(a,b)=>a+Math.random()*(b-a),rnd=n=>Math.floor(Math.random()*n);
const matC={};const mat=(c,o)=>{const k=c+JSON.stringify(o||'');return matC[k]||(matC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.5},o||{})))};
const addC={};const addM=c=>addC[c]||(addC[c]=new THREE.MeshBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
const cyl=(r1,r2,h,c,o)=>new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,8),mat(c,o));
const cone=(r,h,c,seg,o)=>new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c,o));
const ball=(r,c,o)=>new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mat(c,o));
// Đáy biển & ánh sáng gợn nước (đi theo người chơi, hoa văn đứng yên theo thế giới)
const FLOOR=600,FREP=60;
const floorM=new THREE.MeshStandardMaterial({roughness:1});const floor=new THREE.Mesh(new THREE.PlaneGeometry(FLOOR,FLOOR),floorM);floor.rotation.x=-Math.PI/2;S.add(floor);
const causT=canvasTex(256,256,(g,w,h)=>{g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=2.5;g.lineJoin='round';const cells=[];for(let i=0;i<26;i++)cells.push([Math.random()*w,Math.random()*h]);for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){let a=1e9,b=1e9;cells.forEach(([cx,cy])=>{let dx=Math.abs(x-cx),dy=Math.abs(y-cy);dx=Math.min(dx,w-dx);dy=Math.min(dy,h-dy);const d=dx*dx+dy*dy;if(d<a){b=a;a=d}else if(d<b)b=d});if(Math.sqrt(b)-Math.sqrt(a)<2.2){g.fillStyle='rgba(255,255,255,.75)';g.fillRect(x,y,2,2)}}});causT.wrapS=causT.wrapT=THREE.RepeatWrapping;causT.repeat.set(40,40);
const causM=new THREE.MeshBasicMaterial({map:causT,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending,depthWrite:false});const caus=new THREE.Mesh(new THREE.PlaneGeometry(FLOOR,FLOOR),causM);caus.rotation.x=-Math.PI/2;caus.position.y=0.03;S.add(caus);
const rays=[];for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.PlaneGeometry(5,70),new THREE.MeshBasicMaterial({color:0xBFF6FF,transparent:true,opacity:0.06,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));r.rotation.set(0,rp(0,3),0.35);S.add(r);rays.push({m:r,ox:rp(-25,25),oz:rp(-30,10)})}

// ================= 7 VÙNG BIỂN =================
const DD=55;let decor=[];
function addDecor(g,m,x,z,sway){m.position.x=x;m.position.z=z;if(!(m.position.y>8))m.scale.multiplyScalar(1.5);g.add(m);decor.push({m,sway:sway||0,s:rp(0.7,1.4)})}
function scatter(n,fn){for(let i=0;i<n;i++)fn(rp(-DD,DD),rp(-DD,DD),i)}
const ZONES=[
{n:'🪸 Rạn san hô',sky:['#5FD8E8','#0E6E8C'],fog:0x1B8FB0,hemi:[0xBFEFFF,0x14506a,0.75],sun:0.45,caus:0.22,rays:0.06,floor:()=>noiseTex(128,'#B9B488',26),
 build(g){const CC=[0xFF6F91,0xFF9F1C,0xB04DFF,0xFFE14D,0x4DC3FF,0xFF4D6D];scatter(70,(x,z,i)=>{const c=new THREE.Group(),col=CC[i%6];
  if(i%3===0){for(let j=0;j<6;j++){const b=cyl(0.1,0.18,rp(1.2,2.6),col);b.position.set(rp(-0.4,0.4),1,rp(-0.4,0.4));b.rotation.set(rp(-0.6,0.6),0,rp(-0.6,0.6));c.add(b);const t=ball(0.2,col);t.position.copy(b.position);t.position.y+=1.1;c.add(t)}}
  else if(i%3===1){const b=ball(rp(0.8,1.6),col,{flatShading:true});b.scale.y=0.55;c.add(b)}else{for(let j=0;j<4;j++){const s=cone(0.14,rp(3,5),0x2E9E5A,5);s.position.set(rp(-0.4,0.4),2,rp(-0.4,0.4));c.add(s)}}
  addDecor(g,c,x,z,i%3===2?0.12:0)});scatter(40,(x,z)=>{const r=ball(rp(0.3,0.9),0xC9B48A,{flatShading:true});r.position.y=0.1;addDecor(g,r,x,z)})},amb:'bubble'},
{n:'🌿 Rừng tảo bẹ',sky:['#3FB89A','#0A3A34'],fog:0x2A7262,hemi:[0xC8FFE0,0x1a4a3a,0.7],sun:0.4,caus:0.14,rays:0.07,floor:()=>noiseTex(128,'#6B6A48',30),
 build(g){scatter(80,(x,z,i)=>{const c=new THREE.Group(),h=rp(8,16);for(let j=0;j<3;j++){const s=new THREE.Mesh(new THREE.BoxGeometry(0.25,h,0.25),mat(0x5C8A2E));s.position.set(j*0.4-0.4,h/2,rp(-0.3,0.3));c.add(s);for(let k=1;k<6;k++){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.5),mat(0x7FB23A,{side:THREE.DoubleSide}));l.position.set(j*0.4-0.4+0.4,k*h/6,0);l.rotation.z=0.4;c.add(l)}}addDecor(g,c,x,z,0.06)});
  scatter(30,(x,z)=>{const r=ball(rp(0.6,1.4),0x4A4A3A,{flatShading:true});r.position.y=0.2;addDecor(g,r,x,z)})},amb:'plankton'},
{n:'🍄 Hang phát sáng',sky:['#6A3AA0','#12061F'],fog:0x2A1240,hemi:[0xC8A0FF,0x100820,0.55],sun:0.25,caus:0,rays:0,floor:()=>noiseTex(128,'#2E2240',24),
 build(g){const GC=[0x00E5FF,0xFF4FD8,0x7CFF6B,0xFFE14D];scatter(60,(x,z,i)=>{const c=new THREE.Group(),col=GC[i%4],h=rp(0.8,2.4);const st=cyl(0.12,0.18,h,0xE8E0F0);st.position.y=h/2;c.add(st);const cap=ball(rp(0.6,1.1),col,{emissive:col,emissiveIntensity:0.8});cap.scale.y=0.45;cap.position.y=h;c.add(cap);const gl=glowSp(col,4,0.45);gl.position.y=h;c.add(gl);addDecor(g,c,x,z)});
  scatter(30,(x,z,i)=>{const s=cone(rp(0.4,0.8),rp(2,4),0x8A5AD8,5,{emissive:0x5A2AAA,emissiveIntensity:0.6,flatShading:true});s.position.y=1;addDecor(g,s,x,z)})},amb:'spore'},
{n:'🌑 Vực thẳm',sky:['#0A1430','#000005'],fog:0x02040C,hemi:[0x4060A0,0x000000,0.18],sun:0.05,caus:0,rays:0,dark:true,floor:()=>noiseTex(128,'#10141C',18),
 build(g){scatter(70,(x,z,i)=>{const col=[0x00E5FF,0x7CFF6B,0xB04DFF][i%3];const c=new THREE.Group();const b=ball(0.2,col,{emissive:col,emissiveIntensity:1.5});b.position.y=rp(0.3,4);c.add(b);const gl=glowSp(col,2.5,0.6);gl.position.copy(b.position);c.add(gl);addDecor(g,c,x,z,0.05)});
  scatter(30,(x,z)=>{const r=cone(rp(0.8,1.8),rp(3,6),0x1A1A24,6,{flatShading:true});r.position.y=1.5;addDecor(g,r,x,z)})},amb:'glow'},
{n:'🌋 Núi lửa đáy biển',sky:['#7A2A10','#140402'],fog:0x3A0E08,hemi:[0xFF9A6A,0x200505,0.6],sun:0.45,caus:0.05,rays:0,floor:()=>noiseTex(128,'#2A1A16',20,(g,s)=>{g.strokeStyle='#FF5A00';g.lineWidth=1.5;for(let i=0;i<6;i++){g.beginPath();let x=Math.random()*s,y=Math.random()*s;g.moveTo(x,y);for(let j=0;j<5;j++){x+=rp(-18,18);y+=rp(-18,18);g.lineTo(x,y)}g.stroke()}}),floorGlow:1,
 build(g){scatter(26,(x,z)=>{const c=new THREE.Group(),h=rp(2,4);const v=cone(rp(1.2,2),h,0x2A1A1A,8,{flatShading:true});v.position.y=h/2;c.add(v);const t=ball(0.35,0xFF5A00,{emissive:0xFF5A00,emissiveIntensity:1.2});t.position.y=h;c.add(t);const gl=glowSp(0xFF6A00,5,0.6);gl.position.y=h+0.4;c.add(gl);c.vent=h;addDecor(g,c,x,z)});
  scatter(30,(x,z)=>{const r=cone(rp(0.4,0.8),rp(1.5,3),0x150A10,5,{roughness:0.2,metalness:0.4,flatShading:true});r.position.y=0.8;addDecor(g,r,x,z)})},amb:'ember'},
{n:'🧊 Băng cực',sky:['#E0F4FF','#3A78A8'],fog:0x5E9CC8,hemi:[0xE8F6FF,0x2a5888,0.65],sun:0.4,caus:0.12,rays:0.05,floor:()=>noiseTex(128,'#8DB4D4',14),
 build(g){scatter(50,(x,z,i)=>{const s=cone(rp(0.5,1.2),rp(2,5),0xA8E8FF,5,{transparent:true,opacity:0.85,roughness:0.05,emissive:0x2a6a8a,flatShading:true});s.position.y=1.2;addDecor(g,s,x,z)});
  scatter(26,(x,z)=>{const s=cone(rp(1.5,3),rp(4,8),0xEAF6FF,6,{flatShading:true,roughness:0.3});s.rotation.x=Math.PI;s.position.y=16;addDecor(g,s,x,z)})},amb:'snow'},
{n:'🏛️ Thành Atlantis',sky:['#3A6AB0','#081428'],fog:0x1A3A6A,hemi:[0xFFE8B0,0x102040,0.7],sun:0.45,caus:0.16,rays:0.06,floor:()=>noiseTex(128,'#8A8A9A',14,(g,s)=>{g.strokeStyle='rgba(40,40,60,.6)';g.lineWidth=2;for(let i=0;i<=s;i+=32){g.beginPath();g.moveTo(i,0);g.lineTo(i,s);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(s,i);g.stroke()}}),
 build(g){scatter(45,(x,z,i)=>{const c=new THREE.Group(),h=rp(3,8);const p=cyl(0.5,0.6,h,0xE8E0C8,{roughness:0.6});p.position.y=h/2;c.add(p);const cap=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.4,1.5),mat(0xD4AF37,{metalness:0.6,roughness:0.3}));cap.position.y=h;c.add(cap);if(i%3===0){p.rotation.z=0.5;cap.visible=false}addDecor(g,c,x,z)});
  scatter(14,(x,z)=>{const c=new THREE.Group();const b=ball(0.9,0xD4AF37,{metalness:0.7,roughness:0.25});b.position.y=0.9;c.add(b);{const gl=glowSp(0xFFD700,4,0.4);gl.position.y=1;c.add(gl)}addDecor(g,c,x,z)})},amb:'gold'},
{n:'🕳️ Rãnh Mariana',sky:['#300808','#000000'],fog:0x100303,hemi:[0xFF6A4A,0x000000,0.2],sun:0.05,caus:0,rays:0,dark:true,floor:()=>noiseTex(128,'#1A1010',16,(g,s)=>{g.strokeStyle='#A01A0A';g.lineWidth=1.5;for(let i=0;i<5;i++){g.beginPath();let x=Math.random()*s,y=Math.random()*s;g.moveTo(x,y);for(let j=0;j<5;j++){x+=rp(-18,18);y+=rp(-18,18);g.lineTo(x,y)}g.stroke()}}),floorGlow:1,
 build(g){scatter(40,(x,z)=>{const c=new THREE.Group();for(let j=0;j<5;j++){const h=rp(1,3),t=cyl(0.07,0.09,h,0xEDE0D0);t.position.set(rp(-0.4,0.4),h/2,rp(-0.4,0.4));c.add(t);const tip=ball(0.13,0xFF2A1A,{emissive:0xFF2A1A,emissiveIntensity:1.4});tip.position.set(t.position.x,h,t.position.z);c.add(tip)}{const gl=glowSp(0xFF2A1A,3,0.5);gl.position.y=2;c.add(gl)}addDecor(g,c,x,z,0.05)});
  scatter(10,(x,z)=>{const c=new THREE.Group();for(let j=0;j<6;j++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.6,0.12,6,16,Math.PI),mat(0xE8E0D0,{roughness:0.8}));r.position.z=j*0.9-2.2;r.rotation.y=Math.PI/2;r.rotation.z=Math.PI/2;c.add(r)}addDecor(g,c,x,z)})},amb:'redglow'},
{n:'💎 Hang pha lê',sky:['#4A2A8A','#0A0420'],fog:0x2A1A5A,hemi:[0xC8B8FF,0x1a0a3a,0.6],sun:0.3,caus:0.08,rays:0,floor:()=>noiseTex(128,'#3A2A5A',20),
 build(g){const CC=[0x00E5FF,0xFF4FD8,0xB04DFF,0x7CFF6B];scatter(55,(x,z,i)=>{const c=new THREE.Group(),col=CC[i%4];for(let j=0;j<4;j++){const h=rp(1.2,3.5),k=new THREE.Mesh(new THREE.OctahedronGeometry(0.4),mat(col,{emissive:col,emissiveIntensity:0.7,roughness:0.05,metalness:0.2,flatShading:true,transparent:true,opacity:0.88}));k.scale.set(1,h,1);k.position.set(rp(-0.5,0.5),h*0.35,rp(-0.5,0.5));k.rotation.set(rp(-0.4,0.4),rp(0,3),rp(-0.4,0.4));c.add(k)}{const gl=glowSp(col,4,0.4);gl.position.y=1;c.add(gl)}addDecor(g,c,x,z)})},amb:'spore'},
{n:'🌌 Đại dương vũ trụ',sky:['#000010','#1A0A3A'],fog:0x0A0828,hemi:[0x9090FF,0x000010,0.5],sun:0.3,caus:0.1,rays:0,floor:()=>noiseTex(128,'#0A0A22',10,(g,s)=>{for(let i=0;i<60;i++){g.fillStyle=Math.random()<0.5?'#ffffff':'#B8C8FF';g.fillRect(Math.random()*s,Math.random()*s,1.5,1.5)}}),floorGlow:1,
 build(g){scatter(16,(x,z,i)=>{const c=new THREE.Group(),r=rp(1,2.2),col=[0xE8A15A,0x5FA8E8,0xE070C0,0x7CFF6B][i%4];const pl=ball(r,col,{roughness:0.8,emissive:col,emissiveIntensity:0.2});c.add(pl);if(i%2){const rg=new THREE.Mesh(new THREE.RingGeometry(r*1.4,r*2,40),new THREE.MeshBasicMaterial({color:0xF4D9A8,side:THREE.DoubleSide,transparent:true,opacity:0.6}));rg.rotation.x=1.2;c.add(rg)}c.position.y=rp(9,14);addDecor(g,c,x,z,0.03)});
  scatter(40,(x,z,i)=>{const col=RB[i%6],c=new THREE.Group(),st=new THREE.Mesh(new THREE.OctahedronGeometry(0.25),new THREE.MeshBasicMaterial({color:col}));st.position.y=rp(0.5,4);c.add(st);const gl=glowSp(col,2,0.6);gl.position.copy(st.position);c.add(gl);addDecor(g,c,x,z,0.05)})},amb:'cosmic'}];
ZONES.forEach(z=>{z.g=null});
let curZ=null;
function setZone(zi){const Z=ZONES[(zi-1)%ZONES.length];if(curZ&&curZ.g)curZ.g.visible=false;curZ=Z;
if(!Z.g){Z.g=new THREE.Group();const before=decor.length;Z.build(Z.g);Z.decor=decor.splice(before);S.add(Z.g);Z.skyT=skyTex(...Z.sky);Z.floorT=Z.floor();Z.floorT.repeat.set(FREP,FREP)}
decor=Z.decor;Z.g.visible=true;causT.repeat.set(40,40);S.background=Z.skyT;S.fog.color.setHex(Z.fog);hemi.color.setHex(Z.hemi[0]);hemi.groundColor.setHex(Z.hemi[1]);hemi.intensity=Z.hemi[2];sun.intensity=Z.sun;
floorM.map=Z.floorT;floorM.emissive.setHex(Z.floorGlow?0xffffff:0);floorM.emissiveMap=Z.floorGlow?Z.floorT:null;floorM.emissiveIntensity=Z.floorGlow?0.8:0;floorM.needsUpdate=true;causM.opacity=Z.caus;rays.forEach(r=>r.m.material.opacity=Z.rays);
lamp.intensity=Z.dark?2.4:0.35}

// ================= CÁ =================
const fs=new THREE.Shape();fs.moveTo(0,0.62);fs.bezierCurveTo(0.3,0.55,0.42,0.2,0.36,-0.05);fs.bezierCurveTo(0.3,-0.3,0.12,-0.4,0.07,-0.42);fs.lineTo(0.34,-0.74);fs.lineTo(0,-0.58);fs.lineTo(-0.34,-0.74);fs.lineTo(-0.07,-0.42);fs.bezierCurveTo(-0.12,-0.4,-0.3,-0.3,-0.36,-0.05);fs.bezierCurveTo(-0.42,0.2,-0.3,0.55,0,0.62);
const fishG=new THREE.ExtrudeGeometry(fs,{depth:0.14,bevelEnabled:true,bevelThickness:0.08,bevelSize:0.05,bevelSegments:2,curveSegments:8});fishG.rotateX(Math.PI/2);fishG.translate(0,0.07,0);
const CAP=180,NCAP=520,dummy=new THREE.Object3D(),tc=new THREE.Color();
const myIM=new THREE.InstancedMesh(fishG,new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.15}),CAP);myIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);for(let i=0;i<CAP;i++)myIM.setColorAt(i,tc.setHex(0xffffff));myIM.frustumCulled=false;S.add(myIM);
const finG=new THREE.ConeGeometry(0.13,0.36,3);finG.scale(0.25,1,1);finG.rotateX(-0.35);finG.translate(0,0.2,-0.05);
const swordG=new THREE.ConeGeometry(0.045,0.55,6);swordG.rotateX(Math.PI/2);swordG.translate(0,0.02,0.88);
const wingG=new THREE.BufferGeometry();wingG.setAttribute('position',new THREE.Float32BufferAttribute([0.18,0,0.2, 0.75,0,-0.25, 0.2,0,-0.15, -0.18,0,0.2, -0.2,0,-0.15, -0.75,0,-0.25],3));wingG.computeVertexNormals();
const haloG=new THREE.PlaneGeometry(1.5,1.5);haloG.rotateX(-Math.PI/2);
function accIM(geo,m){const im=new THREE.InstancedMesh(geo,m,CAP);im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);im.frustumCulled=false;im.count=0;S.add(im);return im}
const finIM=accIM(finG,new THREE.MeshStandardMaterial({color:0xFFE9C0,roughness:0.4})),swordIM=accIM(swordG,new THREE.MeshStandardMaterial({color:0xE8F0F8,metalness:0.7,roughness:0.2})),
wingIM=accIM(wingG,new THREE.MeshStandardMaterial({color:0x9FE8FF,emissive:0x2a6a8a,transparent:true,opacity:0.75,side:THREE.DoubleSide})),haloIM=accIM(haloG,new THREE.MeshBasicMaterial({map:radT,color:0xFFE36B,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}));
const npcIM=new THREE.InstancedMesh(fishG,new THREE.MeshStandardMaterial({roughness:0.4,metalness:0.1}),NCAP);npcIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);for(let i=0;i<NCAP;i++)npcIM.setColorAt(i,tc.setHex(0xffffff));npcIM.frustumCulled=false;S.add(npcIM);
// Cá thủ lĩnh
const leadM=new THREE.MeshStandardMaterial({color:0xFFC21E,roughness:0.25,metalness:0.3,emissive:0x5a3a00,emissiveIntensity:0.5});
const lead=new THREE.Group(),lbody=new THREE.Mesh(fishG,leadM);lbody.scale.setScalar(1.3);lead.add(lbody);
[-1,1].forEach(s=>{const e=ball(0.09,0xffffff);e.position.set(s*0.2,0.12,0.45);lead.add(e);const p=ball(0.05,0x111111);p.position.set(s*0.22,0.15,0.5);lead.add(p)});
const lglow=glowSp(0xFFE36B,3,0.5);lead.add(lglow);S.add(lead);
const lwings=new THREE.Group(),lwL=new THREE.Group(),lwR=new THREE.Group(),lwM=new THREE.MeshStandardMaterial({color:0xE0C0FF,emissive:0x8A4AFF,emissiveIntensity:0.6,transparent:true,opacity:0.85,side:THREE.DoubleSide});
{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(1.1,0.4);sh.lineTo(0.9,-0.05);sh.lineTo(0.6,-0.3);sh.lineTo(0.3,-0.2);sh.lineTo(0,-0.1);const wg=new THREE.ShapeGeometry(sh);const a=new THREE.Mesh(wg,lwM);a.rotation.x=-Math.PI/2;lwL.add(a);const b=new THREE.Mesh(wg,lwM);b.rotation.x=-Math.PI/2;b.scale.x=-1;lwR.add(b);lwL.position.set(0.2,0.25,0);lwR.position.set(-0.2,0.25,0);lwings.add(lwL,lwR)}lwings.visible=false;lead.add(lwings);
const crownM=mat(0xFFD700,{metalness:0.7,roughness:0.2,emissive:0x6a4a00}),crown=new THREE.Group();for(let i=0;i<5;i++){const c=cone(0.06,0.22,0xFFD700,5);c.material=crownM;c.position.set(Math.cos(i/5*6.28)*0.16,0.3,Math.sin(i/5*6.28)*0.16+0.1);crown.add(c)}lead.add(crown);
const shieldB=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshBasicMaterial({color:0x6fd8ff,transparent:true,opacity:0.15,depthWrite:false}));shieldB.visible=false;S.add(shieldB);
const auraR=new THREE.Mesh(new THREE.RingGeometry(0.9,1,48),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.4,side:THREE.DoubleSide,depthWrite:false}));auraR.rotation.x=-Math.PI/2;S.add(auraR);

// ---- Kẻ săn mồi ----
const PRED=[
 {n:'Cá mập',build(g){const b=ball(1,0x6B7B8C);b.scale.set(0.55,0.5,1.6);g.add(b);const be=ball(1,0xE8EEF2);be.scale.set(0.45,0.3,1.3);be.position.y=-0.18;g.add(be);const d=cone(0.35,0.9,0x5A6A7A,3);d.scale.z=0.3;d.position.set(0,0.75,0);d.rotation.x=-0.3;g.add(d);
  const t=new THREE.Group();const t1=cone(0.32,1,0x5A6A7A,3);t1.scale.z=0.25;t1.position.set(0,0.45,-0.2);t1.rotation.x=-0.7;t.add(t1);const t2=cone(0.24,0.7,0x5A6A7A,3);t2.scale.z=0.25;t2.position.set(0,-0.3,-0.15);t2.rotation.x=-2.4;t.add(t2);t.position.z=-1.5;g.add(t);g.tail=t;
  [-1,1].forEach(s=>{const f=cone(0.25,0.8,0x5A6A7A,3);f.scale.z=0.2;f.position.set(s*0.55,-0.2,0.3);f.rotation.set(Math.PI/2,0,s*1.9);g.add(f);const e=ball(0.07,0x111111);e.position.set(s*0.32,0.15,1.1);g.add(e)});
  const m=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.04,6,16,Math.PI),mat(0xffffff));m.position.set(0,-0.12,1.35);m.rotation.set(Math.PI/2,0,Math.PI);g.add(m)}},
 {n:'Bạch tuộc',build(g){const h=ball(1,0xB04DFF,{roughness:0.4});h.scale.set(0.9,0.9,1.1);h.position.set(0,0.4,-0.2);g.add(h);g.tents=[];for(let i=0;i<8;i++){const t=new THREE.Group(),a=i/8*Math.PI*2;for(let k=0;k<5;k++){const s=ball(0.26-k*0.04,0x9A3AE0);s.position.set(0,0,k*0.4);t.add(s)}t.position.set(Math.cos(a)*0.5,-0.2,Math.sin(a)*0.5);t.rotation.y=Math.PI/2-a;g.add(t);g.tents.push(t)}
  [-1,1].forEach(s=>{const e=ball(0.2,0xFFF2A0);e.position.set(s*0.4,0.6,0.7);g.add(e);const p=ball(0.1,0x111111);p.scale.x=1.6;p.position.set(s*0.42,0.62,0.86);g.add(p)})}},
 {n:'Cá rồng hang',build(g){const segs=[];for(let k=0;k<7;k++){const s=ball(0.5-k*0.04,k%2?0x2E8B57:0x3CB371,{emissive:0x0a3a1a});s.position.z=-k*0.7;g.add(s);segs.push(s)}g.segs=segs;[-1,1].forEach(s=>{const h=cone(0.08,0.5,0xFFE14D,5);h.position.set(s*0.25,0.45,0.1);h.rotation.x=-0.5;g.add(h);const e=ball(0.08,0xFF3B1F,{emissive:0xFF3B1F});e.position.set(s*0.25,0.15,0.4);g.add(e)})}},
 {n:'Cá lồng đèn',build(g){const b=ball(1,0x2A2030,{roughness:0.3});b.scale.set(1,0.85,1);g.add(b);const m=new THREE.Mesh(new THREE.TorusGeometry(0.55,0.08,6,20,Math.PI),mat(0xffffff));m.position.set(0,-0.15,0.85);m.rotation.set(Math.PI/2,0,Math.PI);g.add(m);
  const st=cyl(0.03,0.03,1.4,0x3A3040);st.position.set(0,1.1,0.5);st.rotation.x=0.6;g.add(st);const lu=ball(0.18,0xBFFFE8,{emissive:0x7FFFD0,emissiveIntensity:2});lu.position.set(0,1.6,1.05);g.add(lu);const gl=glowSp(0x7FFFD0,4,0.8);gl.position.copy(lu.position);g.add(gl);
  [-1,1].forEach(s=>{const e=ball(0.1,0xFFE14D,{emissive:0x6a5a00});e.position.set(s*0.45,0.35,0.7);g.add(e)});const t=cone(0.4,0.8,0x2A2030,3);t.scale.z=0.2;t.rotation.x=-Math.PI/2;t.position.z=-1.2;g.add(t)}},
 {n:'Rắn dung nham',build(g){const segs=[];for(let k=0;k<9;k++){const s=ball(0.45-k*0.03,k%2?0xFF5A00:0x2A1A1A,{emissive:k%2?0xFF3A00:0x220800,emissiveIntensity:0.9});s.position.z=-k*0.6;g.add(s);segs.push(s)}g.segs=segs;[-1,1].forEach(s=>{const e=ball(0.08,0xFFE14D,{emissive:0xFFE14D});e.position.set(s*0.22,0.2,0.35);g.add(e)})}},
 {n:'Cá voi sát thủ',build(g){const b=ball(1,0x111418,{roughness:0.3});b.scale.set(0.7,0.6,1.7);g.add(b);const w=ball(1,0xF2F2F2);w.scale.set(0.5,0.3,1.2);w.position.y=-0.25;g.add(w);[-1,1].forEach(s=>{const p=ball(0.22,0xffffff);p.scale.set(0.4,0.6,1);p.position.set(s*0.5,0.25,0.9);g.add(p)});
  const d=cone(0.3,1.2,0x111418,3);d.scale.z=0.25;d.position.y=0.95;g.add(d);const t=new THREE.Group();const fl=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.08,0.5),mat(0x111418));t.add(fl);t.position.z=-1.7;g.add(t);g.tail=t}},
 {n:'Thủy thần Leviathan',build(g){const segs=[];for(let k=0;k<10;k++){const s=ball(0.6-k*0.035,0x1A5AAA,{emissive:0x0a2a6a,metalness:0.4,roughness:0.3});s.position.z=-k*0.75;g.add(s);segs.push(s);if(k%2===0){const f=cone(0.12,0.5,0xFFD700,4,{emissive:0x6a5000});f.position.set(0,0.6-k*0.03,-k*0.75);g.add(f)}}g.segs=segs;
  [-1,1].forEach(s=>{const h=cone(0.1,0.7,0xFFD700,5,{emissive:0x6a5000});h.position.set(s*0.3,0.55,0.2);h.rotation.x=-0.6;g.add(h);const e=ball(0.1,0x00E5FF,{emissive:0x00E5FF,emissiveIntensity:1.5});e.position.set(s*0.3,0.2,0.45);g.add(e)})}}];
function makePred(type,boss){const g=new THREE.Group();PRED[type].build(g);if(boss){const a=new THREE.Mesh(new THREE.RingGeometry(1.6,1.9,40),new THREE.MeshBasicMaterial({color:0xFF3344,transparent:true,opacity:0.6,side:THREE.DoubleSide,depthWrite:false}));a.rotation.x=-Math.PI/2;a.position.y=-0.9;g.add(a);g.aura=a;g.add(glowSp(0xFF3344,6,0.35))}return g}
// ---- Sứa, lưới, xoáy, vật phẩm ----
function makeJelly(){const g=new THREE.Group(),col=[0xFF6FD8,0xB04DFF,0x7FDBFF][rnd(3)];const d=new THREE.Mesh(new THREE.SphereGeometry(0.7,16,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:0.5,transparent:true,opacity:0.7,side:THREE.DoubleSide}));g.add(d);g.dome=d;
for(let i=0;i<6;i++){const t=cyl(0.03,0.02,1.6,col,{emissive:col,emissiveIntensity:0.6,transparent:true,opacity:0.7});const a=i/6*6.28;t.position.set(Math.cos(a)*0.35,-0.8,Math.sin(a)*0.35);g.add(t)}g.add(glowSp(col,2.4,0.4));return g}
const netT=canvasTex(128,64,(g,w,h)=>{g.strokeStyle='rgba(230,230,220,.9)';g.lineWidth=2;for(let x=0;x<=w;x+=8){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<=h;y+=8){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}});
function makeNet(){const g=new THREE.Group();const p=new THREE.Mesh(new THREE.PlaneGeometry(16,8),new THREE.MeshBasicMaterial({map:netT,transparent:true,side:THREE.DoubleSide,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.y=1.4;g.add(p);g.plane=p;
for(let i=0;i<8;i++){const f=ball(0.22,0xFF5A3A);f.position.set(-7.5+i*15/7,1.6,-4);g.add(f);const f2=ball(0.22,0xFF5A3A);f2.position.set(-7.5+i*15/7,1.6,4);g.add(f2)}return g}
function makeWhirl(){const g=new THREE.Group();const t=canvasTex(128,128,(c,w,h)=>{c.translate(64,64);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=5;for(let a=0;a<3;a++){c.beginPath();for(let r=4;r<62;r+=1){const th=r*0.12+a*2.09;c.lineTo(Math.cos(th)*r,Math.sin(th)*r)}c.stroke()}});
const m=new THREE.Mesh(new THREE.CircleGeometry(7,40),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=0.6;g.add(m);g.disc=m;return g}
const PW={shield:{c:0x4FC3F7,e:'🛡️',n:'Khiên!',t:8},magnet:{c:0xE24B4A,e:'🧲',n:'Nam châm!',t:8},star:{c:0xFFD700,e:'⭐',n:'Siêu sao!',t:6},double:{c:0xF4C430,e:'x2',n:'Nhân đôi điểm!',t:12},slow:{c:0x7FDBFF,e:'⏳',n:'Chậm thời gian!',t:7},food:{c:0x7CFF6B,e:'🍤',n:'Đầy năng lượng!'},heart:{c:0xFF4F7B,e:'❤️',n:'+1 Mạng!'}};
const POOL=['shield','magnet','star','double','slow','food','food','shield','double','heart'];
Object.keys(PW).forEach(k=>{const p=PW[k];p.tex=canvasTex(128,128,g=>{g.font=(p.e==='x2'?'bold 78px':'86px')+' sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#FFE36B';g.lineWidth=8;g.strokeStyle='#7a4a00';if(p.e==='x2')g.strokeText(p.e,64,68);g.fillText(p.e,64,70)});p.om=new THREE.MeshBasicMaterial({color:p.c,transparent:true,opacity:0.3,depthWrite:false})});
const orbG=new THREE.SphereGeometry(0.7,20,14);
function makePower(k){const p=PW[k],g=new THREE.Group();g.add(new THREE.Mesh(orbG,p.om));const s=new THREE.Sprite(new THREE.SpriteMaterial({map:p.tex,depthWrite:false}));s.scale.set(1.1,1.1,1);g.add(s);g.add(glowSp(p.c,3,0.5));return g}
// Cổng phép toán
function gateTex(txt,good){return canvasTex(256,128,g=>{g.font='bold 92px sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=12;g.strokeStyle=good?'#0a4a2a':'#5a0a0a';g.strokeText(txt,128,68);g.fillStyle=good?'#8BFFB0':'#FF8A8A';g.fillText(txt,128,68)})}
function makeGate(txt,good){const g=new THREE.Group(),col=good?0x3DDC84:0xFF4D4D;const r=new THREE.Mesh(new THREE.TorusGeometry(2.3,0.16,10,48),new THREE.MeshBasicMaterial({color:col}));r.rotation.x=-Math.PI/2;r.position.y=1.2;g.add(r);
const d=new THREE.Mesh(new THREE.CircleGeometry(2.3,40),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.18,depthWrite:false,side:THREE.DoubleSide}));d.rotation.x=-Math.PI/2;d.position.y=1.15;g.add(d);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:gateTex(txt,good),depthWrite:false,fog:false}));s.scale.set(4.4,2.2,1);s.position.y=3.2;g.add(s);{const gl=glowSp(col,6,0.35);gl.position.y=1.2;g.add(gl)}g.ring=r;return g}

// ================= HIỆU ỨNG =================
const pG=new THREE.BoxGeometry(0.15,0.15,0.15),bubG=new THREE.SphereGeometry(0.12,8,6),parts=[],fx=[];
function part(x,y,z,m,v,s,decay,grav,geo){const p=new THREE.Mesh(geo||pG,m);p.position.set(x,y,z);p.v=v;p.s0=s;p.decay=decay;p.grav=grav===undefined?6:grav;p.life=1;p.scale.setScalar(s);S.add(p);parts.push(p)}
function burst(x,z,c,n,pw,y){pw=pw||1;for(let i=0;i<n;i++){const a=Math.random()*6.28,sp=(2+Math.random()*3)*pw;part(x,y||1.2,z,addM(c),new THREE.Vector3(Math.cos(a)*sp,rp(1,4)*pw,Math.sin(a)*sp),rp(0.6,1.3),1.4,3)}}
function bubbles(x,z,n){for(let i=0;i<n;i++)part(x+rp(-0.5,0.5),rp(0.8,1.6),z+rp(-0.5,0.5),addM(0xCFF6FF),new THREE.Vector3(rp(-0.5,0.5),rp(2,4),rp(-0.5,0.5)),rp(0.8,1.6),0.6,-1,bubG)}
const ringG=new THREE.RingGeometry(0.85,1,48);
function ring(x,z,c,size,y,life){const m=new THREE.Mesh(ringG,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.85,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,y||0.2,z);S.add(m);fx.push({m,life:life||0.6,max:life||0.6,g0:0.5,g1:size||4,op:0.85})}
function flash(c,op){fl.style.transition='none';fl.style.background=c;fl.style.opacity=op;requestAnimationFrame(()=>requestAnimationFrame(()=>{fl.style.transition='opacity .45s';fl.style.opacity=0}))}
const pv=new THREE.Vector3();
function scr(x,y,z){pv.set(x,y,z).project(cam);return[(pv.x+1)/2*100,(1-pv.y)/2*100,pv.z<1]}
function pop(txt,x,y,z,col,size){const[a,b]=scr(x,y,z);const d=document.createElement('div');d.className='pp';d.textContent=txt;d.style.left=a+'%';d.style.top=b+'%';if(col)d.style.color=col;if(size)d.style.fontSize=size+'px';wrap.appendChild(d);setTimeout(()=>d.remove(),1000)}
function showLv(t,ms){lvB.innerHTML=t;lvB.style.opacity=1;lvB.style.transform='scale(1)';clearTimeout(showLv.t);showLv.t=setTimeout(()=>{lvB.style.opacity=0;lvB.style.transform='scale(0.8)'},ms||1700)}
const HEX=c=>'#'+c.toString(16).padStart(6,'0'),RB=[0xFF4D4D,0xFF9F1C,0xFFE14D,0x4DFF88,0x4DC3FF,0xB04DFF];
function firework(){const c=RB[rnd(6)],x=P.x+rp(-12,12),z=P.z-rp(6,14),y=rp(8,14);for(let i=0;i<40;i++){const a=Math.random()*6.28,e=Math.acos(2*Math.random()-1),sp=rp(4,7);part(x,y,z,addM(i%2?c:0xffffff),new THREE.Vector3(Math.sin(e)*Math.cos(a)*sp,Math.cos(e)*sp,Math.sin(e)*Math.sin(a)*sp),1.4,0.9,2)}snd(900,150,0.35,'triangle',0.05)}
// Nhãn số trên đầu các đàn
const lbPool=[];let lbUsed=0;
function label(txt,x,y,z,cls){let d=lbPool[lbUsed];if(!d){d=document.createElement('div');lbls.appendChild(d);lbPool.push(d)}lbUsed++;const[a,b,vis]=scr(x,y,z);if(!vis||a<-10||a>110||b<-10||b>110){d.style.display='none';return}
if(d._t!==txt){d.textContent=txt;d._t=txt}if(d._c!==cls){d.className='lb '+cls;d._c=cls}d.style.display='block';d.style.left=a+'%';d.style.top=b+'%'}

// ================= SKIN ĐÀN CÁ =================
const SKINS=[{n:'Cá vàng',need:0,c:[0xFF8A1E,0xFFB347,0xFF6F3C]},{n:'Ngọc bích',need:1000,c:[0x1DE9B6,0x00BFA5,0x64FFDA]},{n:'San hô hồng',need:2000,c:[0xFF6FA8,0xFF8FB1,0xF06292]},
{n:'Ánh trăng',need:4000,c:[0xCFD8DC,0xECEFF1,0xB0BEC5]},{n:'Neon',need:6000,c:[0x00E5FF,0xFF4FD8,0xB04DFF]},{n:'Cầu vồng',need:8000,c:RB}];
let skin=0;try{skin=+localStorage.getItem('fishSkin')||0}catch(e){}if(!SKINS[skin]||best<SKINS[skin].need)skin=0;
function renderSkins(){skE.innerHTML='<small>Chọn màu đàn cá (mở khoá bằng kỷ lục)</small>';SKINS.forEach((k,i)=>{const b=document.createElement('button'),ok=best>=k.need;b.textContent=ok?k.n:'🔒 '+k.need;if(i===skin)b.className='on';
b.addEventListener('click',e=>{e.stopPropagation();if(!ok)return;skin=i;try{localStorage.setItem('fishSkin',i)}catch(e){}renderSkins()});skE.appendChild(b)})}

// ================= TRẠNG THÁI =================
const ZT=[30,60,100,150,210,280,360,450,560,700],BHP=[40,75,115,165,225,300,385,480,600,750],MAXN=1500;
const lapOf=z=>Math.ceil(z/10),zoneTarget=z=>Math.min(1200,Math.round(ZT[(z-1)%10]*(1+0.6*(lapOf(z)-1)))),bossHP=z=>Math.min(1400,Math.round(BHP[(z-1)%10]*(1+0.6*(lapOf(z)-1))));
const P={x:0,z:0,vx:0,vz:0,hd:0};let N=10,form='swarm',energy=40,mem=[],slots=[],slotN=-1,slotForm='';
let schools=[],preds=[],gates=[],items=[],jellies=[],nets=[],whirls=[],boss=null;
let score=0,pts=0,zone=1,lives=3,running=false,paused=false,T=0,shake=0,inv=0,nextLife=2000,startBest=0,annBest=0,recAnn=false,st={};
const TIERS=[0,400,1200,3000,6500,12000,22000,40000];
const TN=['🐟 Cá bột','🐠 Cá hề','🐡 Cá vây gai','🗡️ Cá kiếm','🦈 Cá mập con','🐉 Cá rồng','✨ Cá thần','🌈 Thần long đại dương'];
const SK=[{id:'dash',e:'⚡',n:'Tăng tốc',cd:5,d:'Bơi nhanh gấp đôi 1,5 giây'},{id:'bubble',e:'🫧',n:'Bom bong bóng',cd:9,d:'Làm choáng kẻ thù quanh đàn 3 giây'},{id:'vortex',e:'🌀',n:'Lốc hút',cd:12,d:'Hút các đàn nhỏ quanh đó vào đàn'},
{id:'bolt',e:'🔱',n:'Sét đinh ba',cd:9,d:'Sét đánh trúng kẻ săn mồi gần nhất'},{id:'wave',e:'🌊',n:'Sóng thần',cd:14,d:'Đẩy lùi mọi thứ, phá lưới và sứa'},{id:'decoy',e:'👥',n:'Ảo ảnh',cd:16,d:'Tạo đàn ảo để kẻ thù đuổi theo'},{id:'dragon',e:'🐉',n:'Hoá rồng',cd:25,d:'8 giây hợp thể miễn phí, bất tử, sức mạnh x2'}];
let tier=0,skCD=[0,0,0,0,0,0,0],dashT=0,vortexT=0,dragonT=0,decoy=null,bolts=[],skS='';
let shieldT=0,magT=0,starT=0,dblT=0,slowT=0,spawnT=0,gateT=2,itemT=8,jellyT=10,netTm=18,whirlT=25,camH=16,joyV={x:0,y:0},keyV={x:0,y:0},hudT=0,hudS='',bossWarned=false,maxN=10,clearing=false;
for(let i=0;i<CAP;i++)mem.push({x:0,z:0,hd:0,c:0});
const gain=n=>{n=Math.round(n*(dblT>0?2:1));pts+=n;return n};
function rad(){const s=Math.sqrt(Math.min(N,CAP));return form==='ball'?0.36*s+0.5:form==='arrow'?0.38*s+0.5:form==='giant'?giantScale()*0.62:0.48*s+0.6}
const inFish=(x,y)=>((x/0.3)**2+((y-0.12)/0.6)**2<1)||(y<-0.42&&y>-1.0&&Math.abs(x)<(-0.42-y)*0.85+0.05);
const giantScale=()=>Math.sqrt(Math.min(N,CAP)*0.34/0.85);
function buildSlots(){const n=Math.min(N,CAP);slots=[];
if(form==='giant'){const s=giantScale(),step=0.56/s;const ps=[];for(let y=-1.0;y<=0.72;y+=step)for(let x=-0.55;x<=0.55;x+=step*0.95){const xx=x+((Math.round(y/step))%2?step*0.45:0);if(inFish(xx,y))ps.push([xx*s,y*s])}
 ps.sort((a,b)=>Math.hypot(a[0],(a[1]-0.1*s)*0.6)-Math.hypot(b[0],(b[1]-0.1*s)*0.6));for(let i=0;i<n;i++)slots.push(ps[i%Math.max(1,ps.length)]||[0,0]);}
else for(let i=0;i<n;i++){if(form==='arrow'){const r=Math.floor(Math.sqrt(i))+1,c=i-(r-1)*(r-1);slots.push([(c-(r-1))*0.4,-r*0.5])}
 else{const k=form==='ball'?0.34:0.46,r=k*Math.sqrt(i+1),a=i*2.39996;slots.push([Math.cos(a)*r,Math.sin(a)*r-(form==='ball'?0:0.35)])}}
slotN=n;slotForm=form}
function setN(n,x,z){const old=N;N=Math.max(0,Math.min(MAXN,Math.round(n)));maxN=Math.max(maxN,N);
if(N>old)for(let i=Math.min(old,CAP);i<Math.min(N,CAP);i++){mem[i].x=(x!==undefined?x:P.x)+rp(-0.5,0.5);mem[i].z=(z!==undefined?z:P.z)+rp(-0.5,0.5);mem[i].c=rnd(3)}
if(N<old)for(let i=Math.min(N,CAP);i<Math.min(old,CAP);i++)burst(mem[i].x,mem[i].z,0xFF6F6F,3,0.8);
if(form==='giant'&&N<12)setForm('swarm');if(N<=0&&running)loseLife()}
function setForm(f){if(dragonT>0&&f!=='giant')return;if(form===f||f==='swarm'){if(form!=='swarm')sForm();form='swarm'}
else{if(f==='giant'){if(N<12||energy<25){pop(N<12?'Cần ít nhất 12 cá':'Chưa đủ năng lượng',P.x,2.5,P.z,'#FFB0B0',18);return}sGiant();flash('#FFE36B',0.25);ring(P.x,P.z,0xFFE36B,giantScale()*2.5);pop('🐋 HỢP THỂ!',P.x,3,P.z,'#FFE36B',28)}else sForm();form=f}
fBtns.forEach(b=>b.classList.toggle('on',b.dataset.f===form))}
function around(dmin,dmax,ahead){const a=ahead?P.hd+rp(-0.6,0.6):rp(0,6.28),d=rp(dmin,dmax);return[P.x+Math.sin(a)*d,P.z+Math.cos(a)*d]}
const SCH=[[0x9FB8C8,0xEEF4F8],[0xFFE14D,0xFFC21E],[0x4DC3FF,0x2D7BD8],[0x7CFF6B,0x3ACB5A],[0xFF9FD0,0xF06292]];
function spawnSchool(){const r=Math.random(),zs=zone+(lapOf(zone)-1)*4;let n,kind;
if(r<0.6){n=Math.max(1,Math.min(N-1,Math.round(rp(3,7)+zs*rp(1.5,4))));kind='small'}else if(r<0.84){n=N+Math.round(rp(4,10)+zs*rp(1.5,3.5));kind='rival'}else if(r<0.92){n=Math.max(2,Math.min(60,Math.round(N*rp(0.3,0.6))));kind='rival'}else{n=N+Math.round(rp(15,30)+zs*4);kind='big'}
const[x,z]=around(camH*0.75+4,camH*1.1+12);const pal=kind==='rival'?[0xE53935,0x8E1E1E]:SCH[rnd(SCH.length)];schools.push({x,z,n,kind,pal,hd:rp(0,6.28),sp:2,t:0})}
function spawnPred(isBoss){const type=isBoss?(zone-1)%PRED.length:rnd(Math.min(PRED.length,zone+1));const hp=isBoss?bossHP(zone):Math.max(8,Math.round(Math.min(N,600)*rp(0.6,1.3))+zone*3);
const s=(isBoss?1.7:1)*(0.9+Math.log2(1+hp/6)*0.42);const m=makePred(type,isBoss);m.scale.setScalar(s);S.add(m);const[x,z]=around(camH*1.2+(isBoss?4:10),camH*1.2+(isBoss?8:24),isBoss);
const p={x,z,hd:0,hp,max:hp,s,type,m,boss:isBoss,biteT:0,ramT:0,stun:0,t:0,hist:[]};preds.push(p);if(isBoss){boss=p;sSiren();vg.style.opacity=0.6;setTimeout(()=>vg.style.opacity=0,1500);showLv('⚠️ TRÙM XUẤT HIỆN ⚠️<br><span style="font-size:24px">'+PRED[type].n+' khổng lồ</span><br><span style="font-size:15px">Máu '+hp+' · Hợp thể khi đàn ≥ '+hp+' hoặc húc bằng 🏹</span>',2600)}return p}
function spawnGates(){const a=P.hd,d=rp(18,24),cx=P.x+Math.sin(a)*d,cz=P.z+Math.cos(a)*d,px=Math.cos(a),pz=-Math.sin(a);
const zs=zone+(lapOf(zone)-1)*4,good=()=>Math.random()<0.22&&N>4&&N<40?{op:'×',v:2}:{op:'+',v:Math.round(rp(4,10)+zs*3)},bad=()=>Math.random()<0.12&&N>60?{op:'÷',v:2}:{op:'−',v:Math.round(rp(5,12)+zs*4)};
const pair=Math.random()<0.75?[good(),bad()]:[good(),good()];if(Math.random()<0.5)pair.reverse();
pair.forEach((o,i)=>{const s=i?1:-1,x=cx+px*s*3.2,z=cz+pz*s*3.2,isGood=o.op==='+'||o.op==='×';const m=makeGate(o.op+o.v,isGood);m.position.set(x,0,z);S.add(m);gates.push({x,z,op:o.op,v:o.v,good:isGood,m,pair:gates.length+(i?-1:1),t:0,used:false})});
const g1=gates[gates.length-2],g2=gates[gates.length-1];g1.mate=g2;g2.mate=g1}
function spawnItem(){const k=POOL[rnd(POOL.length)],m=makePower(k);const[x,z]=around(10,22,true);m.position.set(x,1.4,z);S.add(m);items.push({x,z,k,m,t:18})}
function spawnJellies(){const[cx,cz]=around(18,26,true);for(let i=0;i<5;i++){const m=makeJelly();const x=cx+rp(-5,5),z=cz+rp(-5,5);m.position.set(x,1.6,z);m.scale.setScalar(rp(0.9,1.3));S.add(m);jellies.push({x,z,m,ph:rp(0,6),t:30,tick:0})}}
function spawnNet(){const a=P.hd+(Math.random()<0.5?1:-1)*Math.PI/2,d=24,m=makeNet();const x=P.x+Math.sin(a)*d+Math.sin(P.hd)*12,z=P.z+Math.cos(a)*d+Math.cos(P.hd)*12;m.position.set(x,0,z);m.rotation.y=a;S.add(m);nets.push({x,z,vx:-Math.sin(a)*4.2,vz:-Math.cos(a)*4.2,rot:a,m,t:14,hit:false})}
function spawnWhirl(){const[x,z]=around(16,24,true),m=makeWhirl();m.position.set(x,0,z);S.add(m);whirls.push({x,z,m,t:20})}
function clearAll(){[...schools,...gates,...items,...jellies,...nets,...whirls].forEach(o=>o.m&&S.remove(o.m));preds.forEach(p=>S.remove(p.m));schools=[];preds=[];gates=[];items=[];jellies=[];nets=[];whirls=[];boss=null;
parts.forEach(p=>S.remove(p));parts.length=0;fx.forEach(f=>S.remove(f.m));fx.length=0;wrap.querySelectorAll('.pp').forEach(d=>d.remove())}
function clearPowers(){shieldT=magT=starT=dblT=slowT=0}
function reset(){clearAll();clearPowers();tier=0;skCD=skCD.map(()=>0);dashT=vortexT=dragonT=0;if(decoy){S.remove(decoy.m);decoy=null}bolts.forEach(b=>S.remove(b.m));bolts=[];renderSkills();P.x=0;P.z=0;P.vx=0;P.vz=0;P.hd=0;N=0;setN(10,0,0);form='swarm';fBtns.forEach(b=>b.classList.remove('on'));energy=40;zone=1;lives=3;pts=0;score=0;inv=0;nextLife=2000;startBest=best;annBest=best;recAnn=false;bossWarned=false;clearing=false;maxN=10;
st={absorbed:0,preds:0,bosses:0,gates:0};spawnT=0;gateT=2;itemT=8;jellyT=14;netTm=22;whirlT=30;sc.textContent=0;lvE.textContent=1;lfE.textContent='❤️3';pwE.innerHTML='';hudS='';setZone(1);for(let i=0;i<8;i++)spawnSchool()}
function start(){unlockAudio();reset();paused=false;ov.style.display='none';psB.style.display='block';ctrl.style.display='flex';running=true;showLv('Vùng 1<br><span style="font-size:24px">'+ZONES[0].n+'</span><br><span style="font-size:15px">Đàn đủ '+zoneTarget(1)+' cá để gọi Trùm</span>',2200)}
function saveBest(){try{localStorage.setItem('fishBest2',best)}catch(e){}}
function loseLife(){lives--;lfE.textContent='❤️'+Math.max(lives,0);sHurt();flash('#E24B4A',0.45);shake=0.6;if(lives<=0){die();return}
pop('-1 ❤️',P.x,2.5,P.z,'#ff8080',26);N=0;setN(8,P.x,P.z);inv=3;form='swarm';fBtns.forEach(b=>b.classList.remove('on'));preds.forEach(p=>{const dx=p.x-P.x,dz=p.z-P.z,d=Math.hypot(dx,dz)||1;if(d<14){p.x=P.x+dx/d*16;p.z=P.z+dz/d*16}});schools.forEach(s=>{if(s.n>N&&Math.hypot(s.x-P.x,s.z-P.z)<12){s.x+=rp(-1,1)*14;s.z+=14}})}
function die(){running=false;clearPowers();sDie();saveBest();ctrl.style.display='none';
const nb=score>startBest&&score>0,un=SKINS.filter(k=>k.need>startBest&&k.need<=best).map(k=>k.n);
msg.innerHTML=(nb?'🎉 KỶ LỤC MỚI! 🎉':'Đàn cá đã tan!')+'<br><b style="font-size:32px">'+score+'</b> điểm · tới '+ZONES[(zone-1)%ZONES.length].n+'<br><small>🧬 Tiến hoá: '+TN[tier]+'<br>🐟 Đàn đông nhất: '+maxN+' · Nhập đàn '+st.absorbed+' cá<br>🦈 Hạ '+st.preds+' kẻ săn mồi · 👑 '+st.bosses+' trùm · 🔢 '+st.gates+' cổng'+(un.length?'<br>🔓 Mở khoá màu mới: <b>'+un.join(', ')+'</b>':'')+'</small>';
if(nb)for(let i=0;i<3;i++)setTimeout(firework,i*250);renderSkins();skE.style.display='flex';psB.style.display='none';stB.textContent='Chơi lại';ov.style.display='flex'}
function pause(){if(!running||paused)return;paused=true;msg.innerHTML='Tạm dừng ⏸';skE.style.display='none';stB.textContent='Tiếp tục';ov.style.display='flex';psB.style.display='none'}
function resume(){paused=false;ov.style.display='none';psB.style.display='block';last=performance.now()}
function gainLife(txt){lives=Math.min(9,lives+1);lfE.textContent='❤️'+lives;sLife();flash('#FF4F7B',0.3);pop(txt,P.x,3,P.z,'#FF8FB1',24)}
function nextZone(){clearing=false;zone++;lvE.textContent=zone;if(zone%10===1&&zone>1)setTimeout(()=>showLv('🔁 VÒNG '+lapOf(zone)+'<br><span style="font-size:16px">Đại dương mạnh hơn, trùm nhiều máu hơn!</span>',2000),2600);setZone(zone);sZone();flash('#ffffff',0.4);for(let i=0;i<4;i++)setTimeout(firework,i*220);bossWarned=false;
schools.forEach(s=>S.remove(s.m));schools=[];preds.filter(p=>!p.boss).forEach(p=>S.remove(p.m));preds=preds.filter(p=>p.boss);
showLv('Vùng '+zone+'<br><span style="font-size:26px">'+ZONES[(zone-1)%ZONES.length].n+'</span><br><span style="font-size:15px">Đàn đủ '+zoneTarget(zone)+' cá để gọi Trùm</span>',2400);if(curZ.dark)setTimeout(()=>showLv('🔦 Tối quá! Chỉ thấy cá gần đèn của thủ lĩnh',1800),2500)}
function defeat(p,how){const i=preds.indexOf(p);if(i<0)return;preds.splice(i,1);S.remove(p.m);st.preds++;const g=gain(30*p.max);sEatBig();shake=0.5;flash('#FFE36B',0.35);burst(p.x,p.z,0xFF6F6F,40,1.5);bubbles(p.x,p.z,25);ring(p.x,p.z,0xFFE36B,8);
const bonus=Math.ceil(Math.min(p.max,N)*0.2)+5;setN(N+bonus,p.x,p.z);energy=Math.min(100,energy+25);pop((how==='eat'?'🍽️ NUỐT CHỬNG! ':'💥 HẠ GỤC! ')+'+'+g,p.x,3.5,p.z,'#FFE36B',26);pop('+'+bonus+' 🐟',p.x,2,p.z,'#8BFFB0',22);
if(p.boss){boss=null;clearing=true;st.bosses++;for(let k=0;k<5;k++)setTimeout(firework,k*200);setTimeout(nextZone,1200)}}
function hurtSchool(loss,x,z){if(inv>0||starT>0||dragonT>0)return;if(shieldT>0){shieldT=Math.max(0,shieldT-2);sZap();ring(P.x,P.z,0x6fd8ff,rad()*2.5);return}
if(form==='ball')loss=Math.ceil(loss/2);setN(N-loss);sBite();shake=Math.max(shake,0.25);pop('-'+loss,x!==undefined?x:P.x,2.4,z!==undefined?z:P.z,'#FF7A7A',22)}

// ================= TIẾN HOÁ & KỸ NĂNG =================
const skE2=document.getElementById('sk');
function renderSkills(){skE2.innerHTML='';for(let i=0;i<tier;i++){const b=document.createElement('button');b.innerHTML=SK[i].e+'<i></i>';b.title=SK[i].n;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();useSkill(i)});skE2.appendChild(b)}skS=''}
function evolve(){tier++;const k=SK[tier-1];sZone();setTimeout(()=>seq([523,659,784,1047,1319,1568,2093],0.07,55),200);flash('#ffffff',0.5);shake=0.4;
for(let i=0;i<5;i++)setTimeout(firework,i*180);ring(P.x,P.z,0xFFE36B,rad()*3);ring(P.x,P.z,0xffffff,rad()*2);for(let i=0;i<40;i++)part(P.x+rp(-1,1),1,P.z+rp(-1,1),addM(RB[i%6]),new THREE.Vector3(rp(-1.5,1.5),rp(6,11),rp(-1.5,1.5)),rp(0.8,1.5),1,3);
energy=100;const b=Math.ceil(N*0.15)+5;setN(N+b,P.x,P.z);renderSkills();
showLv('✨ TIẾN HOÁ! ✨<br><span style="font-size:26px">'+TN[tier]+'</span><br><span style="font-size:15px">+'+b+' 🐟 · Mở kỹ năng '+k.e+' '+k.n+'<br>'+k.d+'</span>',2800)}
function nearestPred(r){let best=null,bd=r;preds.forEach(p=>{const d=Math.hypot(p.x-P.x,p.z-P.z);if(d<bd){bd=d;best=p}});return boss&&Math.hypot(boss.x-P.x,boss.z-P.z)<r?boss:best}
function makeBolt(x1,z1,x2,z2){const pts=[];const n=10;for(let i=0;i<=n;i++){const t=i/n;pts.push(new THREE.Vector3(x1+(x2-x1)*t+(i&&i<n?rp(-0.8,0.8):0),1.5+(1-Math.abs(t-0.5)*2)*3+(i&&i<n?rp(-0.6,0.6):0),z1+(z2-z1)*t+(i&&i<n?rp(-0.8,0.8):0)))}
const m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xCFF6FF,transparent:true,blending:THREE.AdditiveBlending}));S.add(m);bolts.push({m,t:0.35})}
function useSkill(i){if(!running||paused||i>=tier||skCD[i]>0)return;const k=SK[i];
if(k.id==='bolt'){const p=nearestPred(32);if(!p){pop('Không có mục tiêu gần',P.x,2.5,P.z,'#FFB0B0',18);return}const dmg=Math.ceil(p.max*0.25+N*0.1);p.hp-=dmg;p.stun=1.2;for(let j=0;j<3;j++)makeBolt(P.x,P.z,p.x,p.z);sZap();setTimeout(sZap,80);snd(80,30,0.4,'sawtooth',0.15);flash('#CFF6FF',0.4);shake=0.4;burst(p.x,p.z,0xCFF6FF,24,1.3);pop('🔱 -'+dmg,p.x,p.s+2.5,p.z,'#CFF6FF',28);if(p.hp<=0)defeat(p,'ram')}
skCD[i]=k.cd;
if(k.id==='dash'){dashT=1.5;snd(200,1200,0.3,'triangle',0.09);ring(P.x,P.z,0x7FF,rad()*2.5);pop('⚡ TĂNG TỐC!',P.x,3,P.z,'#7FF',22)}
else if(k.id==='bubble'){const R=13;preds.forEach(p=>{if(Math.hypot(p.x-P.x,p.z-P.z)<R+p.s)p.stun=3});schools.forEach(s=>{if(Math.hypot(s.x-P.x,s.z-P.z)<R)s.stun=3});for(let j=0;j<40;j++){const a=rp(0,6.28),r=rp(1,R);bubbles(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,1)}ring(P.x,P.z,0xCFF6FF,R*2);seq([1500,1200,1800,1400],0.06,40,'sine');pop('🫧 CHOÁNG!',P.x,3,P.z,'#CFF6FF',24)}
else if(k.id==='vortex'){vortexT=3;snd(300,900,0.8,'sine',0.08);pop('🌀 LỐC HÚT!',P.x,3,P.z,'#7FDBFF',24)}
else if(k.id==='wave'){const R=17;preds.forEach(p=>{const dx=p.x-P.x,dz=p.z-P.z,d=Math.hypot(dx,dz)||1;if(d<R+p.s){p.x=P.x+dx/d*(R+3);p.z=P.z+dz/d*(R+3);p.stun=2}});schools.forEach(s=>{const dx=s.x-P.x,dz=s.z-P.z,d=Math.hypot(dx,dz)||1;if(d<R&&s.n>=N){s.x=P.x+dx/d*(R+2);s.z=P.z+dz/d*(R+2);s.stun=2}});
 nets.forEach(n=>{if(Math.hypot(n.x-P.x,n.z-P.z)<R+8){n.hit=true;n.t=Math.min(n.t,1)}});jellies.forEach(j=>{if(Math.hypot(j.x-P.x,j.z-P.z)<R){burst(j.x,j.z,0xFF6FD8,8);j.t=0}});
 for(let r=4;r<=R;r+=4.5)setTimeout(()=>ring(P.x,P.z,0x5CC8FF,r*2,0.4,0.7),r*15);if(AC)noise(AC.currentTime,0.9,0.3,200);snd(150,60,0.8,'sine',0.15);shake=0.5;pop('🌊 SÓNG THẦN!',P.x,3,P.z,'#5CC8FF',26)}
else if(k.id==='decoy'){if(decoy)S.remove(decoy.m);const g=new THREE.Group(),mm=new THREE.MeshBasicMaterial({color:0x9FE8FF,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false});for(let j=0;j<14;j++){const f=new THREE.Mesh(fishG,mm);const r=0.45*Math.sqrt(j+1),a=j*2.4;f.position.set(Math.cos(a)*r,1.2,Math.sin(a)*r);f.scale.setScalar(0.6);g.add(f)}
 const x=P.x-Math.sin(P.hd)*6,z=P.z-Math.cos(P.hd)*6;g.position.set(x,0,z);S.add(g);decoy={x,z,t:6,m:g,hd:P.hd+Math.PI};snd(800,400,0.4,'sine',0.07);pop('👥 ẢO ẢNH!',x,3,z,'#9FE8FF',22)}
else if(k.id==='dragon'){dragonT=8;form='giant';fBtns.forEach(b=>b.classList.toggle('on',b.dataset.f==='giant'));sGiant();snd(60,200,0.8,'sawtooth',0.12);flash('#FF5A3A',0.45);shake=0.6;ring(P.x,P.z,0xFF5A3A,giantScale()*3);showLv('🐉 HOÁ RỒNG! 🐉<br><span style="font-size:16px">8 giây bất tử · sức mạnh x2</span>',1600)}}
// ================= ĐIỀU KHIỂN =================
stB.onclick=e=>{e.stopPropagation();if(paused)resume();else start()};
psB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
fBtns.forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(running&&!paused)setForm(b.dataset.f)}));
const keys={};document.addEventListener('keydown',e=>{keys[e.key]=1;if(e.key==='1')setForm('arrow');if(e.key==='2')setForm('ball');if(e.key==='3')setForm('giant');const si='4567890'.indexOf(e.key);if(si>=0)useSkill(si);if(e.key===' '){e.preventDefault();useSkill(0)}if(e.key.startsWith('Arrow'))e.preventDefault()});document.addEventListener('keyup',e=>{keys[e.key]=0});
let jId=null,jx=0,jy=0;
wrap.addEventListener('touchstart',e=>{if(e.target.closest('button')||!running||paused)return;const t=e.changedTouches[0];jId=t.identifier;const r=wrap.getBoundingClientRect();jx=t.clientX;jy=t.clientY;joy.style.left=(jx-r.left)+'px';joy.style.top=(jy-r.top)+'px';joy.style.display='block';knob.style.transform='translate(0,0)';joyV.x=joyV.y=0},{passive:true});
document.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===jId){let dx=t.clientX-jx,dy=t.clientY-jy;const d=Math.hypot(dx,dy),m=50;if(d>m){dx*=m/d;dy*=m/d}knob.style.transform='translate('+dx+'px,'+dy+'px)';joyV.x=dx/m;joyV.y=dy/m}},{passive:false});
document.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===jId){jId=null;joy.style.display='none';joyV.x=joyV.y=0}});
let mDown=false;wrap.addEventListener('mousedown',e=>{if(e.target.closest('button')||!running)return;mDown=true;jx=e.clientX;jy=e.clientY});document.addEventListener('mousemove',e=>{if(!mDown)return;let dx=e.clientX-jx,dy=e.clientY-jy;const d=Math.hypot(dx,dy),m=50;if(d>m){dx*=m/d;dy*=m/d}joyV.x=dx/m;joyV.y=dy/m});document.addEventListener('mouseup',()=>{mDown=false;joyV.x=joyV.y=0});
reset();running=false;renderSkins();

// ================= VÒNG LẶP =================
let last=performance.now(),lastSpawn=0;
function loop(now){const dt=Math.min((now-last)/1000,0.05);last=now;T+=dt;const act=running&&!paused;lbUsed=0;
const es=slowT>0?0.5:1;
if(act){
// ---- Di chuyển đàn ----
keyV.x=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0);keyV.y=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);
let ix=joyV.x+keyV.x,iz=joyV.y+keyV.y;const im=Math.min(1,Math.hypot(ix,iz));
const vmax=(form==='arrow'?9:form==='ball'?4.6:form==='giant'?5.6:6.4)*(starT>0?1.25:1)*(dashT>0?2.1:1)*(dragonT>0?1.3:1);
if(im>0.05){const d=Math.hypot(ix,iz);P.vx+=(ix/d*vmax*im-P.vx)*Math.min(1,dt*4);P.vz+=(iz/d*vmax*im-P.vz)*Math.min(1,dt*4)}else{P.vx*=1-Math.min(1,dt*1.5);P.vz*=1-Math.min(1,dt*1.5)}
whirls.forEach(w=>{const dx=w.x-P.x,dz=w.z-P.z,d=Math.hypot(dx,dz);if(d<8&&d>0.3){P.vx+=dx/d*dt*9;P.vz+=dz/d*dt*9;if(form!=='swarm'&&starT<=0){setForm('swarm');pop('🌀 Vỡ đội hình!',P.x,2.5,P.z,'#7FDBFF',18)}}});
P.x+=P.vx*dt;P.z+=P.vz*dt;const sp=Math.hypot(P.vx,P.vz);if(sp>0.4){const th=Math.atan2(P.vx,P.vz);let da=th-P.hd;da=Math.atan2(Math.sin(da),Math.cos(da));P.hd+=da*Math.min(1,dt*7)}
if(form==='giant'&&dragonT<=0){energy-=dt*11;if(energy<=0){energy=0;setForm('swarm');pop('Hết năng lượng hợp thể',P.x,2.5,P.z,'#FFB0B0',18)}}else energy=Math.min(100,energy+dt*1.2);
for(let k=0;k<7;k++)if(skCD[k]>0)skCD[k]-=dt;if(dashT>0)dashT-=dt;if(vortexT>0)vortexT-=dt;if(dragonT>0){dragonT-=dt;if(dragonT<=0){dragonT=0;form='swarm';fBtns.forEach(b=>b.classList.remove('on'));pop('Hết hoá rồng',P.x,2.5,P.z,'#FFB0B0',18)}}
if(decoy){decoy.t-=dt;decoy.x+=Math.sin(decoy.hd)*dt*3;decoy.z+=Math.cos(decoy.hd)*dt*3;decoy.m.position.set(decoy.x,0,decoy.z);decoy.m.rotation.y+=dt;decoy.m.children[0].material.opacity=0.35+Math.sin(T*8)*0.15;if(decoy.t<=0){S.remove(decoy.m);decoy=null}}
if(shieldT>0)shieldT-=dt;if(magT>0)magT-=dt;if(starT>0)starT-=dt;if(dblT>0)dblT-=dt;if(slowT>0)slowT-=dt;if(inv>0)inv-=dt;
const Rp=rad();
// ---- Đàn cá khác ----
for(let i=schools.length-1;i>=0;i--){const s=schools[i];s.t+=dt;const dx=P.x-s.x,dz=P.z-s.z,d=Math.hypot(dx,dz),weaker=s.n<N||starT>0,Rn=0.45*Math.sqrt(Math.min(s.n,40))+0.5;
if((magT>0&&d<22||vortexT>0&&d<22)&&weaker){const pw=vortexT>0?11:7;s.x+=dx/d*dt*pw;s.z+=dz/d*dt*pw}
let tx=Math.sin(s.hd),tz=Math.cos(s.hd),spd=2*es;if(s.stun>0)s.stun-=dt;
if(s.stun>0)spd=0;else if(weaker&&d<15){tx=-dx/d;tz=-dz/d;spd=4.3*es}else if(s.kind==='rival'&&!weaker&&decoy&&Math.hypot(decoy.x-s.x,decoy.z-s.z)<30){const ex=decoy.x-s.x,ez=decoy.z-s.z,ed=Math.hypot(ex,ez)||1;tx=ex/ed;tz=ez/ed;spd=4.6*es}else if(s.kind==='rival'&&!weaker&&d<22&&inv<=0){tx=dx/d;tz=dz/d;spd=4.6*es}else{s.hd+=rp(-1,1)*dt;}
const th=Math.atan2(tx,tz);let da=th-s.hd;da=Math.atan2(Math.sin(da),Math.cos(da));s.hd+=da*Math.min(1,dt*3);s.x+=Math.sin(s.hd)*spd*dt;s.z+=Math.cos(s.hd)*spd*dt;
if(d<Rp+Rn*0.8){if(weaker){schools.splice(i,1);const n=s.n;setN(N+n,s.x,s.z);st.absorbed+=n;energy=Math.min(100,energy+n*1.6);sAbsorb(n);const g=gain(10*n);bubbles(s.x,s.z,8);ring(s.x,s.z,s.pal[0],Rn*2.5);pop('+'+n+' 🐟',s.x,2.6,s.z,'#8BFFB0',22);continue}
 else if((s.kind==='rival'||s.n>N*1.5)&&!(s.stun>0)){s.bt=(s.bt||0)-dt;if(s.bt<=0){s.bt=0.3;const k=Math.max(1,Math.ceil(Math.min(N,s.n)*0.08));hurtSchool(k,s.x,s.z);s.n=Math.max(0,s.n-Math.ceil(k*(form==='ball'?1.6:form==='arrow'?1.3:0.8)));burst(s.x,s.z,0xff4444,4);if(s.n<=0||s.n<N){/* yếu hơn thì sẽ bị nhập ở khung sau */}}}
 else{s.x-=dx/d*dt*4;s.z-=dz/d*dt*4}}
if(d>camH*1.2+45){schools.splice(i,1)}}
// ---- Kẻ săn mồi & trùm ----
for(let i=preds.length-1;i>=0;i--){const p=preds[i];p.t+=dt;if(p.stun>0)p.stun-=dt;if(p.ramT>0)p.ramT-=dt;const dx=P.x-p.x,dz=P.z-p.z,d=Math.hypot(dx,dz)||1,pr=p.s*0.95;
const scared=(form==='giant'&&N*(dragonT>0?2:1)>=p.hp)||starT>0;let tx=Math.sin(p.hd),tz=Math.cos(p.hd),spd=2.2;
if(p.stun>0)spd=0;else if(scared&&d<26){tx=-dx/d;tz=-dz/d;spd=(p.boss?4.4:4.8)*es}else if(decoy&&Math.hypot(decoy.x-p.x,decoy.z-p.z)<35){const ex=decoy.x-p.x,ez=decoy.z-p.z,ed=Math.hypot(ex,ez)||1;tx=ex/ed;tz=ez/ed;spd=4.6*es}else if(d<(p.boss?60:28)&&inv<=0){tx=dx/d;tz=dz/d;spd=(p.boss?4.9:4.4+zone*0.12)*es}else p.hd+=rp(-1,1)*dt;
const th=Math.atan2(tx,tz);let da=th-p.hd;da=Math.atan2(Math.sin(da),Math.cos(da));p.hd+=da*Math.min(1,dt*2.6);p.x+=Math.sin(p.hd)*spd*dt;p.z+=Math.cos(p.hd)*spd*dt;
if(d<Rp*0.85+pr){if(scared){defeat(p,'eat');continue}
 if(form==='arrow'&&p.ramT<=0){p.ramT=0.8;const dmg=Math.max(2,Math.ceil(N*0.2));p.hp-=dmg;p.stun=0.6;p.x-=dx/d*3.5;p.z-=dz/d*3.5;sRam();shake=0.35;burst(p.x,p.z,0xFFE36B,14,1.2);pop('💥 -'+dmg,p.x,p.s+2,p.z,'#FFE36B',26);hurtSchool(Math.max(1,Math.ceil(p.hp*0.03)));if(p.hp<=0){defeat(p,'ram');continue}}
 else if(p.stun<=0){p.biteT-=dt;if(p.biteT<=0){p.biteT=0.5;hurtSchool(Math.ceil(p.hp*0.05)+1,p.x,p.z)}}}
if(!p.boss&&d>camH*1.2+50){preds.splice(i,1);S.remove(p.m)}}
// ---- Cổng phép toán ----
for(let i=gates.length-1;i>=0;i--){const g=gates[i];g.t+=dt;if(!g.used&&Math.hypot(P.x-g.x,P.z-g.z)<2.6){g.used=true;if(g.mate)g.mate.used=true;st.gates++;const o=N;
 let nn=g.op==='+'?N+g.v:g.op==='×'?N*g.v:g.op==='−'?N-g.v:Math.floor(N/g.v);if(!g.good&&(starT>0||shieldT>0)){nn=N;pop('🛡️ Chặn!',g.x,3,g.z,'#9fe8ff',22)}
 setN(nn,g.x,g.z);if(g.good){sGateGood();gain(5*(N-o));ring(g.x,g.z,0x3DDC84,6);bubbles(g.x,g.z,14);pop(g.op+g.v+' → '+N,g.x,3,g.z,'#8BFFB0',26)}else if(nn!==o){sGateBad();ring(g.x,g.z,0xFF4D4D,6);pop(g.op+g.v+' → '+N,g.x,3,g.z,'#FF8A8A',26)}
 [g,g.mate].forEach(x=>{if(!x)return;x.m.visible=false;x.dead=1})}
if(g.dead||Math.hypot(P.x-g.x,P.z-g.z)>70){S.remove(g.m);gates.splice(i,1)}}
// ---- Vật phẩm ----
for(let i=items.length-1;i>=0;i--){const o=items[i];o.t-=dt;if(Math.hypot(P.x-o.x,P.z-o.z)<Rp+0.8){items.splice(i,1);S.remove(o.m);const p=PW[o.k];sPower();flash(HEX(p.c),0.3);ring(o.x,o.z,p.c,5);burst(o.x,o.z,p.c,20);
 if(o.k==='heart')gainLife('❤️ +1 Mạng!');else{if(o.k==='food')energy=100;else if(o.k==='shield')shieldT=p.t;else if(o.k==='magnet')magT=p.t;else if(o.k==='star')starT=p.t;else if(o.k==='double')dblT=p.t;else if(o.k==='slow')slowT=p.t;pop(p.e+' '+p.n,o.x,3,o.z,HEX(p.c),24)}continue}
if(o.t<=0){items.splice(i,1);S.remove(o.m)}}
// ---- Sứa, lưới, xoáy ----
for(let i=jellies.length-1;i>=0;i--){const j=jellies[i];j.t-=dt;j.x+=Math.sin(T*0.4+j.ph)*dt*0.8;j.z+=Math.cos(T*0.3+j.ph)*dt*0.8;if(Math.hypot(P.x-j.x,P.z-j.z)<Rp*0.8+0.8&&form!=='giant'){j.tick-=dt;if(j.tick<=0){j.tick=0.35;if(inv<=0&&starT<=0&&shieldT<=0){sZap();hurtSchool(form==='arrow'?1:2,j.x,j.z)}}}
 if(j.t<=0||Math.hypot(P.x-j.x,P.z-j.z)>70){S.remove(j.m);jellies.splice(i,1)}}
for(let i=nets.length-1;i>=0;i--){const n=nets[i];n.t-=dt;n.x+=n.vx*dt*es;n.z+=n.vz*dt*es;if(n.hit)n.m.position.y+=dt*4;
 const ca=Math.cos(n.rot),sa=Math.sin(n.rot),rx=P.x-n.x,rz=P.z-n.z,lx=rx*ca-rz*sa,lz=rx*sa+rz*ca;
 if(!n.hit&&Math.abs(lx)<8+Rp*0.5&&Math.abs(lz)<4+Rp*0.5){n.hit=true;if(starT<=0&&inv<=0&&form!=='giant'){const loss=Math.max(1,Math.ceil(N*(form==='arrow'?0.12:0.3)));sNet();flash('#ffffff',0.2);pop('🕸️ Dính lưới! -'+loss,P.x,3,P.z,'#FFB0B0',24);if(shieldT>0)shieldT=0;else setN(N-loss)}else pop('Thoát lưới!',P.x,3,P.z,'#8BFFB0',22)}
 if(n.t<=0){S.remove(n.m);nets.splice(i,1)}}
for(let i=whirls.length-1;i>=0;i--){const w=whirls[i];w.t-=dt;if(w.t<=0){S.remove(w.m);whirls.splice(i,1)}}
// ---- Sinh vật mới ----
spawnT-=dt;if(spawnT<=0){spawnT=0.6;if(schools.length<9+Math.min(zone,7))spawnSchool();const pc=preds.filter(p=>!p.boss).length;if(pc<Math.min(1+Math.floor(zone/2),3)&&T>4)spawnPred(false)}
gateT-=dt;if(gateT<=0){gateT=boss?4:6.5;spawnGates()}
itemT-=dt;if(itemT<=0){itemT=rp(12,18);spawnItem()}
if(zone>=2){jellyT-=dt;if(jellyT<=0){jellyT=rp(18,26);spawnJellies()}}
if(zone>=3){netTm-=dt;if(netTm<=0){netTm=rp(22,30);spawnNet()}}
if(zone>=4){whirlT-=dt;if(whirlT<=0&&whirls.length<1){whirlT=rp(25,35);spawnWhirl()}}
if(!boss&&!clearing&&N>=zoneTarget(zone))spawnPred(true);
// ---- Điểm ----
score=pts;while(tier<7&&score>=TIERS[tier+1])evolve();if(+sc.textContent!==score){sc.textContent=score;if(score>best){best=score;bs.textContent=best;if(!recAnn&&startBest>0){recAnn=true;pop('🏆 KỶ LỤC MỚI!',P.x,4,P.z-2,'#FFD700',30);for(let k=0;k<3;k++)setTimeout(firework,k*200)}
 SKINS.forEach(k=>{if(k.need>annBest&&k.need<=best)setTimeout(()=>{pop('🔓 Màu mới: '+k.n+'!',P.x,3.5,P.z,'#7FF',24);sPower()},700)});annBest=best}
 if(score>=nextLife){nextLife+=2000;gainLife('🎁 +1 ❤️')}}
}
// ================= VẼ =================
const n=Math.min(N,CAP);if(slotN!==n||slotForm!==form)buildSlots();
const ch=Math.cos(P.hd),sh=Math.sin(P.hd),pal=SKINS[skin].c,swirl=form==='ball'?T*1.4:0,blink=inv>0&&Math.sin(T*25)<0;
for(let i=0;i<n;i++){const m=mem[i];let[lx,lz]=slots[i]||[0,0];if(swirl){const r=Math.hypot(lx,lz),a=Math.atan2(lz,lx)+swirl*(1-r*0.1);lx=Math.cos(a)*r;lz=Math.sin(a)*r}
 if(form==='swarm'){lx+=Math.sin(T*2+i)*0.12;lz+=Math.cos(T*1.7+i*1.3)*0.12}
 const tx=P.x+lx*ch+lz*sh,tz=P.z-lx*sh+lz*ch,k=Math.min(1,dt*(form==='giant'?5:6));const ox=m.x,oz=m.z;m.x+=(tx-m.x)*k;m.z+=(tz-m.z)*k;
 const vx=m.x-ox,vz=m.z-oz;if(Math.abs(vx)+Math.abs(vz)>0.004){const th=Math.atan2(vx,vz);let da=th-m.hd;da=Math.atan2(Math.sin(da),Math.cos(da));m.hd+=da*Math.min(1,dt*8)}else{let da=P.hd-m.hd;da=Math.atan2(Math.sin(da),Math.cos(da));m.hd+=da*Math.min(1,dt*3)}
 dummy.position.set(m.x,1.2+Math.sin(T*3+i)*0.08,m.z);dummy.rotation.set(0,m.hd,Math.sin(T*10+i)*0.12);dummy.scale.setScalar(blink?0.001:0.58+tier*0.025);dummy.updateMatrix();myIM.setMatrixAt(i,dummy.matrix);if(tier>=2)finIM.setMatrixAt(i,dummy.matrix);if(tier>=3)swordIM.setMatrixAt(i,dummy.matrix);if(tier>=4)wingIM.setMatrixAt(i,dummy.matrix);if(tier>=5)haloIM.setMatrixAt(i,dummy.matrix);
 if(starT>0)tc.setHSL((T*0.6+i*0.03)%1,0.9,0.6);else if(skin===5)tc.setHex(RB[(i+Math.floor(T*2))%6]);else tc.setHex(pal[m.c%pal.length]);if(form==='giant')tc.lerp(tmpW.setHex(0xFFE9A8),0.15);if(dragonT>0)tc.lerp(tmpW.setHex(0xFF3A1A),0.45);if(tier>=7&&starT<=0)tc.lerp(tmpW.setHSL((T*0.3+i*0.02)%1,0.9,0.6),0.35);myIM.setColorAt(i,tc)}
[[finIM,2],[swordIM,3],[wingIM,4],[haloIM,5]].forEach(([im,t])=>{im.count=tier>=t?n:0;im.instanceMatrix.needsUpdate=true});
wingIM.material.emissive.setHex(tier>=6?0xB04DFF:0x2a6a8a);haloIM.material.color.setHex(dragonT>0?0xFF5A3A:tier>=6?0xB04DFF:0xFFE36B);haloIM.material.opacity=0.35+Math.sin(T*4)*0.12;
myIM.count=n;myIM.instanceMatrix.needsUpdate=true;if(myIM.instanceColor)myIM.instanceColor.needsUpdate=true;
// Thủ lĩnh: khi hợp thể thì làm "con mắt" của cá khổng lồ
let lx=0,lz=0;if(form==='giant'){const s=giantScale();lx=0.13*s;lz=0.42*s}const ltx=P.x+lx*ch+lz*sh,ltz=P.z-lx*sh+lz*ch;
lead.position.x+=(ltx-lead.position.x)*Math.min(1,dt*8);lead.position.z+=(ltz-lead.position.z)*Math.min(1,dt*8);lead.position.y=1.35+Math.sin(T*3)*0.08;lead.rotation.y=P.hd;lead.visible=!blink;
lbody.scale.setScalar(form==='giant'?1.9:1.3);leadM.emissiveIntensity=form==='giant'?1.2:0.5;crown.visible=tier>=3;lglow.scale.setScalar((form==='giant'?5:3)+tier*0.4);lwings.visible=tier>=6;if(tier>=6){const f=Math.sin(T*(dashT>0?16:7));lwL.rotation.z=0.3+f*0.5;lwR.rotation.z=-(0.3+f*0.5)}if(tier>=7)leadM.color.setHSL((T*0.25)%1,0.9,0.6);else leadM.color.setHex(dragonT>0?0xFF5A3A:0xFFC21E);
lamp.position.set(P.x,6,P.z);lamp.distance=18+Math.sqrt(N)*2.5;
shieldB.visible=shieldT>0||starT>0;if(shieldB.visible){shieldB.position.set(P.x,1.2,P.z);shieldB.scale.setScalar(rad()+0.6);shieldB.material.color.setHex(starT>0?0xFFE36B:0x6fd8ff);shieldB.material.opacity=0.12+Math.sin(T*4)*0.04}
auraR.position.set(P.x,0.15,P.z);auraR.scale.setScalar(rad()+0.3);auraR.material.color.setHex(dragonT>0?0xFF5A3A:form==='giant'?0xFFE36B:form==='arrow'?0x7FF:form==='ball'?0x8BFFB0:0xffffff);auraR.material.opacity=form==='swarm'?0.15:0.45;
label((dragonT>0?'🐉 ':'🐟 ')+N,P.x,1.5,P.z-rad()-0.6,'me');
bolts.forEach(b=>{b.t-=dt;b.m.material.opacity=Math.max(0,b.t/0.35)});for(let i=bolts.length-1;i>=0;i--)if(bolts[i].t<=0){S.remove(bolts[i].m);bolts.splice(i,1)}
if(act&&vortexT>0&&Math.random()<dt*30){const a=rp(0,6.28),r=rp(4,20);part(P.x+Math.cos(a)*r,1,P.z+Math.sin(a)*r,addM(0x7FDBFF),new THREE.Vector3(-Math.cos(a)*r*0.8+Math.sin(a)*4,0,-Math.sin(a)*r*0.8-Math.cos(a)*4),0.7,1.3,0)}
if(act&&dashT>0&&Math.random()<dt*40)part(P.x+rp(-rad(),rad()),1.2,P.z+rp(-rad(),rad()),addM(0xBFFFFF),new THREE.Vector3(-P.vx*0.6,0,-P.vz*0.6),rp(0.5,1),3,0)
if(act&&dragonT>0&&Math.random()<dt*30)part(P.x+rp(-rad(),rad()),1.4,P.z+rp(-rad(),rad()),addM(Math.random()<0.5?0xFF5A1A:0xFFD23F),new THREE.Vector3(0,rp(2,4),0),rp(0.7,1.3),2,-2);
// Đàn cá khác
let ni=0;schools.forEach(s=>{const cnt=Math.min(s.n,40),c=Math.cos(s.hd),sn=Math.sin(s.hd);for(let j=0;j<cnt&&ni<NCAP;j++,ni++){const r=0.45*Math.sqrt(j+1),a=j*2.39996+Math.sin(T+j)*0.1,lx=Math.cos(a)*r,lz=Math.sin(a)*r;
 dummy.position.set(s.x+lx*c+lz*sn,1.1+Math.sin(T*3+j)*0.08,s.z-lx*sn+lz*c);dummy.rotation.set(0,s.hd,Math.sin(T*10+j)*0.12);dummy.scale.setScalar(0.52);dummy.updateMatrix();npcIM.setMatrixAt(ni,dummy.matrix);
 npcIM.setColorAt(ni,tc.setHex(s.pal[j%2]))}const weak=s.n<N||starT>0;label((s.kind==='rival'?'⚔️ ':'')+s.n,s.x,1.6,s.z-0.45*Math.sqrt(cnt)-0.6,weak?'ok':'bad')});
npcIM.count=ni;npcIM.instanceMatrix.needsUpdate=true;if(npcIM.instanceColor)npcIM.instanceColor.needsUpdate=true;
// Kẻ săn mồi
preds.forEach(p=>{p.m.position.set(p.x,1.3+Math.sin(T*2+p.t)*0.15,p.z);p.m.rotation.y=p.hd;const g=p.m;if(g.tail)g.tail.rotation.y=Math.sin(T*6+p.t)*0.35;
 if(g.tents)g.tents.forEach((t,i)=>{t.children.forEach((s,k)=>{s.position.y=Math.sin(T*4+i+k*0.8)*0.18*k})});
 if(g.segs)g.segs.forEach((s,k)=>{s.position.x=Math.sin(T*4-k*0.7)*0.25*k*0.4});if(g.aura){g.aura.rotation.z+=dt;g.aura.material.opacity=0.4+Math.sin(T*6)*0.2}
 const canEat=(form==='giant'&&N*(dragonT>0?2:1)>=p.hp)||starT>0;label((p.boss?'👑 ':'')+(canEat?'🍽️ ':'⚔️ ')+Math.max(0,Math.ceil(p.hp))+(p.boss?'/'+p.max:''),p.x,p.s*1.3+1.6,p.z,p.boss?'boss':canEat?'ok':'bad');if(p.stun>0&&Math.random()<0.3)burst(p.x,p.z,0xFFE36B,1,0.5,p.s+1.5)});
// Cổng, vật phẩm, sứa, lưới, xoáy
gates.forEach(g=>{g.m.ring.rotation.z+=dt*1.5;g.m.position.y=Math.sin(T*2+g.x)*0.15});
items.forEach(o=>{o.m.position.y=1.4+Math.sin(T*3+o.x)*0.25;o.m.rotation.y+=dt;o.m.visible=o.t>3||Math.sin(T*20)>0});
jellies.forEach(j=>{j.m.position.set(j.x,1.7+Math.sin(T*1.5+j.ph)*0.3,j.z);const k=1+Math.sin(T*3+j.ph)*0.12;j.m.dome.scale.set(k,1/k,k)});
nets.forEach(n=>{n.m.position.x=n.x;n.m.position.z=n.z;n.m.plane.material.color.setHex(n.hit?0xFF8A8A:0xffffff)});
whirls.forEach(w=>{w.m.disc.rotation.z+=dt*3;if(act&&Math.random()<dt*20){const a=rp(0,6.28),r=rp(2,7);part(w.x+Math.cos(a)*r,0.8,w.z+Math.sin(a)*r,addM(0xCFF6FF),new THREE.Vector3(-Math.sin(a)*3,0.3,Math.cos(a)*3),0.5,1,0,bubG)}});
// HUD
enE.style.width=energy+'%';fBtns[2].classList.toggle('no',N<12||energy<25);
hudT-=dt;if(hudT<=0){hudT=0.12;let h='';if(!boss)h+='<span>👑 '+Math.min(N,zoneTarget(zone))+'/'+zoneTarget(zone)+'</span>';else h+='<span>⚠️ Trùm '+Math.max(0,Math.ceil(boss.hp))+'</span>';
 h+='<span>🧬 '+(tier<7?Math.floor((score-TIERS[tier])/(TIERS[tier+1]-TIERS[tier])*100)+'%':'MAX')+'</span>';
 [['🛡️',shieldT],['🧲',magT],['⭐',starT],['x2',dblT],['⏳',slowT],['🐉',dragonT]].forEach(([e,t])=>{if(t>0)h+='<span>'+e+' '+Math.ceil(t)+'s</span>'});if(h!==hudS){hudS=h;pwE.innerHTML=h}
 const ss=skCD.slice(0,tier).map(c=>c>0?Math.ceil(c):0).join(',');if(ss!==skS){skS=ss;[...skE2.children].forEach((b,i)=>{const p=skCD[i]>0?skCD[i]/SK[i].cd*100:0;b.style.setProperty('--p',p+'%');b.classList.toggle('rd',skCD[i]<=0)})}}
// Thế giới bám theo người chơi
floor.position.set(P.x,0,P.z);if(floorM.map){floorM.map.offset.set(P.x/FLOOR*FREP,-P.z/FLOOR*FREP)}caus.position.set(P.x,0.03,P.z);causT.offset.set(P.x/FLOOR*40+T*0.02,-P.z/FLOOR*40+T*0.015);
decor.forEach(d=>{const m=d.m;if(m.position.x-P.x>DD)m.position.x-=2*DD;else if(m.position.x-P.x<-DD)m.position.x+=2*DD;if(m.position.z-P.z>DD)m.position.z-=2*DD;else if(m.position.z-P.z<-DD)m.position.z+=2*DD;if(d.sway)m.rotation.z=Math.sin(T*d.s+m.position.x)*d.sway});
rays.forEach((r,i)=>{r.m.position.set(P.x+r.ox,25,P.z+r.oz);r.m.material.opacity=(curZ?curZ.rays:0)*(0.7+Math.sin(T*0.6+i)*0.3)});
if(curZ&&act){const a=curZ.amb,rate=a==='snow'?18:a==='bubble'?8:12;if(Math.random()<dt*rate&&parts.length<380){const x=P.x+rp(-camH,camH),z=P.z+rp(-camH,camH*0.6);
 if(a==='bubble')part(x,0.2,z,addM(0xCFF6FF),new THREE.Vector3(0,rp(1.5,2.5),0),rp(0.6,1.2),0.25,-0.2,bubG);
 else if(a==='plankton')part(x,rp(0.5,4),z,addM(0xB8FF8A),new THREE.Vector3(rp(-0.3,0.3),rp(-0.2,0.2),rp(-0.3,0.3)),rp(0.4,0.7),0.35,0);
 else if(a==='spore')part(x,rp(0.5,4),z,addM([0xFF4FD8,0x00E5FF][rnd(2)]),new THREE.Vector3(0,rp(0.3,0.8),0),rp(0.4,0.8),0.3,0);
 else if(a==='glow')part(x,rp(0.5,4),z,addM([0x00E5FF,0x7CFF6B][rnd(2)]),new THREE.Vector3(rp(-0.2,0.2),0,rp(-0.2,0.2)),rp(0.5,0.9),0.3,0);
 else if(a==='ember')part(x,0.2,z,addM([0xFF7A1A,0xFFD23F][rnd(2)]),new THREE.Vector3(0,rp(1.5,3),0),rp(0.4,0.8),0.4,-0.5);
 else if(a==='snow')part(x,rp(8,12),z,addM(0xffffff),new THREE.Vector3(rp(-0.3,0.3),-rp(1,1.6),0),rp(0.4,0.7),0.13,0);
 else if(a==='redglow')part(x,rp(0.3,3),z,addM(0xFF3A1A),new THREE.Vector3(0,rp(0.3,0.8),0),rp(0.4,0.8),0.35,0);
 else if(a==='cosmic')part(x,rp(0.5,5),z,addM(RB[rnd(6)]),new THREE.Vector3(rp(-0.3,0.3),rp(0.2,0.6),rp(-0.3,0.3)),rp(0.4,0.9),0.3,0);
 else part(x,rp(0.5,4),z,addM(0xFFD700),new THREE.Vector3(0,rp(0.3,0.8),0),rp(0.4,0.8),0.35,0)}}
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.v.y-=p.grav*dt;p.position.addScaledVector(p.v,dt);p.life-=dt*p.decay;p.scale.setScalar(Math.max(p.life*p.s0,0.01));if(p.life<=0){S.remove(p);parts.splice(i,1)}}
for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.life-=dt;const q=1-f.life/f.max;f.m.scale.setScalar(f.g0+(f.g1-f.g0)*q);f.m.material.opacity=f.op*(1-q);if(f.life<=0){S.remove(f.m);f.m.material.dispose();fx.splice(i,1)}}
for(let i=lbUsed;i<lbPool.length;i++)lbPool[i].style.display='none';
// Camera: càng đông càng kéo xa
const tH=Math.min(48,13+Math.sqrt(N)*1.35+(form==='giant'?3:0)+(boss?3:0));camH+=(tH-camH)*Math.min(1,dt*1.5);if(shake>0)shake=Math.max(0,shake-dt);
S.fog.near=camH*0.55;S.fog.far=camH*(curZ&&curZ.dark?1.6:2.3)+8;
cam.position.set(P.x+(Math.random()-0.5)*shake,camH+(Math.random()-0.5)*shake,P.z+camH*0.55);cam.lookAt(P.x,0,P.z-camH*0.05);
sun.position.set(P.x+10,30,P.z+8);sun.target.position.set(P.x,0,P.z);
R.render(S,cam);requestAnimationFrame(loop)}
const tmpW=new THREE.Color();
requestAnimationFrame(loop);
// HET GAME
