const $=id=>document.getElementById(id);
const wrap=$('wrap'),ov=$('ov'),msg=$('msg'),stB=$('st'),sc=$('sc'),bs=$('bs'),lvE=$('lv'),lfE=$('lf'),lvB=$('lvb'),mu=$('mu'),psB=$('ps'),fl=$('fl'),vg=$('vg'),pwE=$('pw'),skE=$('skins'),lbls=$('lbls'),joy=$('joy'),knob=$('knob'),skE2=$('sk'),bbW=$('bb'),bbF=$('bbf'),bbN=$('bbn'),trE=$('tr');
let best=0,muted=false;try{best=+localStorage.getItem('fishBest3')||0;muted=localStorage.getItem('fishMute')==='1'}catch(e){}
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
const floorM=new THREE.MeshStandardMaterial({roughness:1,color:0x9FB2BC});const floor=new THREE.Mesh(new THREE.PlaneGeometry(FLOOR,FLOOR),floorM);floor.rotation.x=-Math.PI/2;S.add(floor);
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
if(!Z.g){Z.g=new THREE.Group();const before=decor.length;Z.build(Z.g);addCommon(Z.g,zi);Z.decor=decor.splice(before);S.add(Z.g);Z.skyT=skyTex(...Z.sky);Z.floorT=Z.floor();Z.floorT.repeat.set(FREP,FREP)}
decor=Z.decor;Z.g.visible=true;causT.repeat.set(40,40);S.background=Z.skyT;S.fog.color.setHex(Z.fog);hemi.color.setHex(Z.hemi[0]);hemi.groundColor.setHex(Z.hemi[1]);hemi.intensity=Z.hemi[2];sun.intensity=Z.sun;
floorM.map=Z.floorT;floorM.emissive.setHex(Z.floorGlow?0xffffff:0);floorM.emissiveMap=Z.floorGlow?Z.floorT:null;floorM.emissiveIntensity=Z.floorGlow?0.8:0;floorM.needsUpdate=true;causM.opacity=Z.caus;rays.forEach(r=>r.m.material.opacity=Z.rays);
lamp.intensity=Z.dark?2.4:0.35}

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
// ================= MÔ HÌNH CÁ =================
const sphG=new THREE.SphereGeometry(1,22,16);
function eyes(g,x,y,z,r,glow){[-1,1].forEach(s=>{const e=new THREE.Mesh(sphG,mat(0xffffff,{roughness:0.2}));e.scale.setScalar(r);e.position.set(s*x,y,z);g.add(e);
const p=new THREE.Mesh(sphG,glow?mat(glow,{emissive:glow,emissiveIntensity:1.3}):mat(0x111111,{roughness:0.1}));p.scale.setScalar(r*0.55);p.position.set(s*(x+r*0.4),y+r*0.12,z+r*0.5);g.add(p);
const h=new THREE.Mesh(sphG,mat(0xffffff,{emissive:0xffffff,emissiveIntensity:0.6}));h.scale.setScalar(r*0.18);h.position.set(s*(x+r*0.55),y+r*0.4,z+r*0.62);g.add(h)})}
function mkFish(o){const g=new THREE.Group(),L=o.len||1.2,W=o.w||0.45,Hh=o.h||0.6,top=o.top,fin=o.fin||top;
const b=new THREE.Mesh(sphG,mat(top,{roughness:o.rough||0.4,metalness:o.metal||0.05}));b.scale.set(W/2,Hh/2,L/2);g.add(b);g.body=b;
if(o.belly){const be=new THREE.Mesh(sphG,mat(o.belly,{roughness:0.5}));be.scale.set(W*0.42,Hh*0.3,L*0.43);be.position.set(0,-Hh*0.17,L*0.03);g.add(be)}
(o.bands||[]).forEach(z=>{const r=new THREE.Mesh(sphG,mat(o.band||0xffffff,{roughness:0.5}));r.scale.set(W*0.515,Hh*0.515,L*0.055);r.position.z=z*L;g.add(r)});
if(o.spots)for(let i=0;i<9;i++){const sp=new THREE.Mesh(sphG,mat(o.spotC||0x3a2a1a));sp.scale.setScalar(Math.min(W,Hh)*0.085);const a=rp(-1.1,1.1),zz=rp(-0.32,0.3);sp.position.set(Math.sin(a)*W*0.47,Math.cos(a)*Hh*0.45,zz*L);g.add(sp)}
const t=new THREE.Group(),tc=new THREE.Mesh(new THREE.ConeGeometry(o.tw||Hh*0.5,L*0.42,4),mat(fin,{side:THREE.DoubleSide}));tc.rotation.x=Math.PI/2;if(o.horiz)tc.scale.z=0.15;else tc.scale.x=0.15;tc.position.z=-L*0.18;t.add(tc);t.position.z=-L*0.44;g.add(t);g.tail=t;
if(o.dorsal!==false){const d=new THREE.Mesh(new THREE.ConeGeometry(o.dw||L*0.18,o.dh||Hh*0.55,3),mat(fin));d.scale.x=0.22;d.position.set(0,Hh*0.42,-L*0.05);d.rotation.x=-0.45;g.add(d)}
g.fins=[];[-1,1].forEach(s=>{const f=new THREE.Mesh(new THREE.ConeGeometry(Hh*0.2,Hh*0.5,3),mat(fin,{side:THREE.DoubleSide}));f.scale.z=0.25;f.position.set(s*W*0.5,-Hh*0.12,L*0.06);f.rotation.set(0,0,s*(Math.PI/2+0.6));g.add(f);g.fins.push(f)});
eyes(g,W*0.33,Hh*0.13,L*0.3,o.eye||Hh*0.15,o.eyeGlow);
if(o.sword){const s=new THREE.Mesh(new THREE.ConeGeometry(Hh*0.07,L*0.75,8),mat(0xD8E4EE,{metalness:0.6,roughness:0.2}));s.rotation.x=Math.PI/2;s.position.z=L*0.78;g.add(s)}
if(o.spikes){for(let i=0;i<24;i++){const a=Math.random()*6.28,e=Math.acos(rp(-0.85,0.9)),v=new THREE.Vector3(Math.sin(e)*Math.cos(a),Math.cos(e),Math.sin(e)*Math.sin(a));
 const c=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.15,5),mat(0xFFF2C0));c.position.set(v.x*W*0.5,v.y*Hh*0.5,v.z*L*0.5);c.lookAt(c.position.clone().multiplyScalar(3));c.rotateX(Math.PI/2);g.add(c)}}
return g}
function normalize(g,len){g.updateMatrixWorld(true);const b=new THREE.Box3(),tb=new THREE.Box3(),sz=new THREE.Vector3();g.traverse(o=>{if(o.isMesh&&o!==g.aura&&o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();tb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);b.union(tb)}});b.getSize(sz);g.userData.k=len/Math.max(sz.z,sz.x,0.01);return g}
function goldify(g){g.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&!o.material.map){const m=o.material.clone();if(m.color){const l=m.color.getHSL({}).l;if(l<0.85)m.color.setHSL(0.12,0.9,0.45+l*0.3);m.emissive=new THREE.Color(0x6a4500);m.emissiveIntensity=0.5;m.metalness=0.5;m.roughness=0.25}o.material=m}})}
function addWings(g,col,em,y,z,sc){const wm=new THREE.MeshStandardMaterial({color:col,emissive:em,emissiveIntensity:0.7,transparent:true,opacity:0.85,side:THREE.DoubleSide}),sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(1.3,0.5);sh.lineTo(1.1,-0.05);sh.lineTo(0.8,-0.35);sh.lineTo(0.5,-0.22);sh.lineTo(0.25,-0.4);sh.lineTo(0,-0.1);
const wg=new THREE.ShapeGeometry(sh),W=new THREE.Group(),l=new THREE.Group(),r=new THREE.Group();const a=new THREE.Mesh(wg,wm);a.rotation.x=-Math.PI/2;l.add(a);const b=new THREE.Mesh(wg,wm);b.rotation.x=-Math.PI/2;b.scale.x=-1;r.add(b);l.position.x=0.25;r.position.x=-0.25;W.add(l,r);W.position.set(0,y,z);W.scale.setScalar(sc);g.add(W);g.wings=[l,r]}
function addCrown(g,y,z,sc){const c=new THREE.Group(),m=mat(0xFFD700,{metalness:0.7,roughness:0.2,emissive:0x6a4a00});const rr=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.05,8,24),m);rr.rotation.x=Math.PI/2;c.add(rr);
for(let i=0;i<5;i++){const k=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.22,5),m);const a=i/5*6.28;k.position.set(Math.cos(a)*0.22,0.12,Math.sin(a)*0.22);c.add(k)}c.position.set(0,y,z);c.scale.setScalar(sc);g.add(c);return c}
// ---- 8 dạng tiến hoá của người chơi ----
const FORMS=[
{n:'🐟 Cá con',len:1.2,b:()=>mkFish({len:1,w:0.52,h:0.62,top:0xFFB347,belly:0xFFF1D6,fin:0xFF8A1E,eye:0.14})},
{n:'🐠 Cá hề',len:1.3,b:()=>mkFish({len:1.1,w:0.5,h:0.62,top:0xFF7A1A,belly:0xFFB070,bands:[0.2,-0.05,-0.3],fin:0xFF6A00,eye:0.12})},
{n:'🐡 Cá nóc',len:1.2,b:()=>mkFish({len:1,w:0.95,h:0.9,top:0xE8C547,belly:0xFFF6D0,fin:0xC9A230,spikes:true,spots:true,eye:0.13})},
{n:'🗡️ Cá kiếm',len:1.8,b:()=>mkFish({len:1.6,w:0.42,h:0.6,top:0x2F5D9A,belly:0xD8E4EE,fin:0x1E3E6A,sword:true,dh:1,dw:0.35,eye:0.09,metal:0.3})},
{n:'🦈 Cá mập',len:2,b:()=>makePred(0,false)},
{n:'🐋 Cá voi sát thủ',len:2.2,b:()=>makePred(5,false)},
{n:'🐉 Rồng biển',len:2.8,b:()=>{const g=makePred(6,false);addWings(g,0x7FFFD0,0x1a8a6a,0.6,-0.6,1.1);return g}},
{n:'🌈 Thần long',len:3,b:()=>{const g=makePred(6,false);goldify(g);addWings(g,0xFFE9A0,0xFF8A00,0.6,-0.6,1.3);addCrown(g,0.75,0.2,1.3);return g}}];
const TIERS=[0,200,700,1600,3200,5500,9000,14000];
const SKL=[{id:'dash',e:'⚡',n:'Lướt',cd:3.5,d:'Lao vút về phía trước, húc trùm mạnh gấp đôi'},{id:'bubble',e:'🫧',n:'Bom bong bóng',cd:9,d:'Làm choáng mọi kẻ thù xung quanh'},
{id:'puff',e:'🐡',n:'Phồng gai',cd:10,d:'Phồng to tua tủa gai, bất tử 3 giây'},{id:'bolt',e:'🔱',n:'Sét đinh ba',cd:8,d:'Sét thu nhỏ kẻ thù, gây sát thương lớn cho trùm'},
{id:'vortex',e:'🌀',n:'Lốc hút',cd:11,d:'Hút cá nhỏ quanh đó vào miệng'},{id:'wave',e:'🌊',n:'Sóng thần',cd:13,d:'Đẩy lùi tất cả, phá lưới, sứa, mực'},
{id:'decoy',e:'👥',n:'Ảo ảnh',cd:15,d:'Bóng ảo dụ kẻ thù đuổi theo'},{id:'rage',e:'🐲',n:'Cuồng long',cd:24,d:'8 giây bất tử, to lớn, ăn tất cả'}];
// ---- Cá thường ----
const SMALL=[()=>mkFish({len:0.9,w:0.32,h:0.42,top:0x9FB8C8,belly:0xEEF4F8,fin:0x8AA4B8,metal:0.3}),()=>mkFish({len:1.1,w:0.5,h:0.62,top:0xFF7A1A,belly:0xFFB070,bands:[0.2,-0.05,-0.3],fin:0xFF6A00}),
()=>mkFish({len:1,w:0.35,h:0.7,top:0x2D5BD8,belly:0x5A86F0,fin:0xFFD23F}),()=>mkFish({len:0.8,w:0.22,h:1,top:0xF4D03F,bands:[0.12,-0.15],band:0x222222,fin:0xF4D03F,dh:0.7}),
()=>mkFish({len:0.9,w:0.3,h:0.75,top:0xFFF1A0,belly:0xffffff,fin:0xFF9F1C,spots:true,spotC:0xFF9F1C}),()=>mkFish({len:1,w:0.5,h:0.5,top:0x7CFF6B,belly:0xE8FFE0,fin:0x3ACB5A}),
()=>mkFish({len:0.95,w:0.4,h:0.55,top:0xFF6FD8,belly:0xFFD1F0,fin:0xB04DFF})];
const MID=[()=>mkFish({len:1.3,w:0.5,h:0.6,top:0xE2553A,belly:0xF7B39A,fin:0xC93A2A}),()=>mkFish({len:1.4,w:0.6,h:0.65,top:0x7A6A4A,belly:0xB8A888,spots:true,spotC:0x4a3a2a,fin:0x6a5a3a}),
()=>mkFish({len:1.6,w:0.5,h:0.55,top:0x2B4A7A,belly:0xC9D6E2,fin:0xFFD23F,metal:0.3}),()=>mkFish({len:1.8,w:0.3,h:0.36,top:0xB8C4CC,belly:0xEEF2F4,fin:0x8A9AA4,metal:0.4,dh:0.3})];
const BIG=[()=>makePred(0,false),()=>makePred(1,false),()=>makePred(3,false),()=>makePred(5,false),()=>makePred(2,false),()=>mkFish({len:1.8,w:0.3,h:0.36,top:0x8A9AA4,belly:0xEEF2F4,fin:0x5A6A74,metal:0.4,dh:0.3,eyeGlow:0xFF3B1F})];
// ---- Trùm mới: cua hoàng đế, sứa nữ hoàng ----
function makeCrab(){const g=new THREE.Group(),m=mat(0xD8452A,{roughness:0.5});const b=new THREE.Mesh(sphG,m);b.scale.set(1.3,0.5,1);g.add(b);
[-1,1].forEach(s=>{for(let i=0;i<3;i++){const l=cyl(0.07,0.05,1.3,0xB83A20);l.position.set(s*1.3,-0.1,0.4-i*0.45);l.rotation.z=s*1.1;g.add(l)}
 const arm=cyl(0.12,0.12,0.9,0xD8452A);arm.position.set(s*0.8,0,1.1);arm.rotation.x=Math.PI/2.4;g.add(arm);const cl=new THREE.Mesh(sphG,m);cl.scale.set(0.35,0.28,0.5);cl.position.set(s*0.85,0.1,1.7);g.add(cl);
 const p=cone(0.1,0.5,0xF2E0D0,5);p.rotation.x=Math.PI/2;p.position.set(s*0.75,0.12,2.1);g.add(p);
 const st=cyl(0.04,0.04,0.45,0xD8452A);st.position.set(s*0.3,0.45,0.75);g.add(st);const e=ball(0.1,0x111111);e.position.set(s*0.3,0.7,0.78);g.add(e)});
const t=new THREE.Group();g.add(t);g.tail=t;return g}
function makeJellyQueen(){const g=new THREE.Group(),col=0xFF6FD8;const d=new THREE.Mesh(new THREE.SphereGeometry(1.4,24,14,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:0.6,transparent:true,opacity:0.75,side:THREE.DoubleSide}));g.add(d);g.dome=d;
g.tents=[];for(let i=0;i<10;i++){const t=new THREE.Group(),a=i/10*6.28;for(let k=0;k<6;k++){const s=ball(0.12-k*0.012,0xFFB8F0,{emissive:0xFF6FD8,emissiveIntensity:0.8});s.position.set(0,-0.3-k*0.35,0);t.add(s)}t.position.set(Math.cos(a)*0.9,0,Math.sin(a)*0.9);g.add(t);g.tents.push(t)}
const gl=glowSp(col,6,0.5);gl.position.y=0.3;g.add(gl);const t=new THREE.Group();g.add(t);g.tail=t;return g}
const BOSSES=[{n:'Cá mập trắng khổng lồ',b:()=>makePred(0,true),ab:'charge'},{n:'Bạch tuộc khổng lồ',b:()=>makePred(1,true),ab:'ink'},{n:'Cá rồng hang',b:()=>makePred(2,true),ab:'bubbles'},
{n:'Cá lồng đèn ma',b:()=>makePred(3,true),ab:'lure'},{n:'Rắn dung nham',b:()=>makePred(4,true),ab:'trail'},{n:'Cá voi sát thủ băng',b:()=>makePred(5,true),ab:'sonar'},
{n:'Thuỷ thần Leviathan',b:()=>makePred(6,true),ab:'whirl'},{n:'Cua hoàng đế',b:()=>{const g=makeCrab();addCrown(g,0.6,0.2,1.4);return g},ab:'claw'},
{n:'Sứa nữ hoàng',b:()=>{const g=makeJellyQueen();addCrown(g,1.5,0,1.6);return g},ab:'jellies'},{n:'Kraken vũ trụ',b:()=>{const g=makePred(1,true);goldify(g);addCrown(g,1.4,-0.2,1.6);return g},ab:'all'}];
// ---- Sinh vật nền: đàn cá nhỏ, cá đuối, rùa ----
const fshape=new THREE.Shape();fshape.moveTo(0,0.62);fshape.bezierCurveTo(0.3,0.55,0.42,0.2,0.36,-0.05);fshape.bezierCurveTo(0.3,-0.3,0.12,-0.4,0.07,-0.42);fshape.lineTo(0.34,-0.74);fshape.lineTo(0,-0.58);fshape.lineTo(-0.34,-0.74);fshape.lineTo(-0.07,-0.42);fshape.bezierCurveTo(-0.12,-0.4,-0.3,-0.3,-0.36,-0.05);fshape.bezierCurveTo(-0.42,0.2,-0.3,0.55,0,0.62);
const tinyG=new THREE.ExtrudeGeometry(fshape,{depth:0.1,bevelEnabled:true,bevelThickness:0.05,bevelSize:0.04,bevelSegments:1,curveSegments:6});tinyG.rotateX(Math.PI/2);
const AMB=90,ambIM=new THREE.InstancedMesh(tinyG,new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.3,metalness:0.4}),AMB);ambIM.frustumCulled=false;ambIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);S.add(ambIM);
const ambS=[0,1,2].map(i=>({a:rp(0,6.28),r:rp(5,11),y:rp(5.5,7.5),sp:rp(0.15,0.3)*(i%2?1:-1),ph:rp(0,6)})),dm=new THREE.Object3D();
function makeManta(){const g=new THREE.Group(),m=mat(0x2A3A55,{roughness:0.6,side:THREE.DoubleSide}),b=new THREE.Mesh(sphG,m);b.scale.set(0.7,0.2,1);g.add(b);g.wings=[];
[-1,1].forEach(s=>{const sh=new THREE.Shape();sh.moveTo(0,0.6);sh.lineTo(2.2*s,-0.1);sh.lineTo(0,-0.9);const w=new THREE.Mesh(new THREE.ShapeGeometry(sh),m);w.rotation.x=-Math.PI/2;const p=new THREE.Group();p.add(w);g.add(p);g.wings.push(p)});
const t=cyl(0.03,0.01,2.2,0x2A3A55);t.rotation.x=Math.PI/2;t.position.z=-2;g.add(t);eyes(g,0.4,0.1,0.75,0.07);return g}
function makeTurtle(){const g=new THREE.Group();const sh=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2),mat(0x6B8E3A,{flatShading:true}));sh.scale.set(0.9,0.5,1.1);g.add(sh);const bl=new THREE.Mesh(sphG,mat(0xE8D8A0));bl.scale.set(0.85,0.12,1.05);g.add(bl);
const hd=ball(0.28,0x9AB86A);hd.position.set(0,0.05,1.2);g.add(hd);eyes(g,0.12,0.12,1.35,0.05);g.wings=[];[[-1,0.6],[1,0.6],[-1,-0.6],[1,-0.6]].forEach(([s,z])=>{const f=new THREE.Group(),m=new THREE.Mesh(sphG,mat(0x9AB86A));m.scale.set(0.5,0.08,0.22);m.position.x=s*0.45;f.add(m);f.position.set(s*0.75,0,z);g.add(f);g.wings.push(f)});return g}
const critters=[];[makeManta,makeTurtle,makeManta].forEach((f,i)=>{const m=f();m.scale.setScalar(i===1?1.1:1.5);S.add(m);critters.push({m,a:rp(0,6.28),r:rp(6,12),y:i===1?7:8.5,sp:rp(0.05,0.09)*(i%2?-1:1),ph:rp(0,6)})});


// ================= CẢNH QUAN CHUNG: rong, san hô, tàu đắm, kho báu, sinh vật đáy =================
const G={seg:new THREE.BoxGeometry(0.34,1,0.05),blade:new THREE.ConeGeometry(0.07,1,4),coin:new THREE.CylinderGeometry(0.22,0.22,0.06,14),tent:new THREE.CylinderGeometry(0.035,0.055,1,5),tip:new THREE.SphereGeometry(0.07,6,5),
spike:new THREE.ConeGeometry(0.035,0.5,4),box:new THREE.BoxGeometry(1,1,1),hemi:new THREE.SphereGeometry(1,16,8,0,Math.PI*2,0,Math.PI/2),fan:new THREE.CircleGeometry(1,18,0,Math.PI),
pearl:new THREE.SphereGeometry(0.2,14,10),tube:new THREE.CylinderGeometry(0.2,0.15,1,10,1,true),disc:new THREE.CircleGeometry(1,20),cyl:new THREE.CylinderGeometry(1,1,1,10),gem:new THREE.OctahedronGeometry(0.14)};
G.seg.translate(0,0.5,0);G.blade.translate(0,0.5,0);G.tent.translate(0,0.5,0);G.tube.translate(0,0.5,0);G.disc.rotateX(-Math.PI/2);
{const s=new THREE.Shape();for(let i=0;i<10;i++){const r=i%2?0.16:0.5,a=i/10*Math.PI*2+Math.PI/2;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}s.closePath();
 G.star=new THREE.ExtrudeGeometry(s,{depth:0.06,bevelEnabled:true,bevelThickness:0.04,bevelSize:0.04,bevelSegments:1});G.star.rotateX(-Math.PI/2)}
{const pts=[[0,0],[0.18,0.02],[0.3,0.2],[0.33,0.45],[0.25,0.7],[0.12,0.82],[0.13,0.95],[0.18,1]].map(p=>new THREE.Vector2(p[0],p[1]));G.vase=new THREE.LatheGeometry(pts,12)}
const shadowT=canvasTex(64,64,g=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
const shadowM=new THREE.MeshBasicMaterial({map:shadowT,transparent:true,depthWrite:false});
function mkShadow(){const m=new THREE.Mesh(G.disc,shadowM);S.add(m);return m}
const sailT=canvasTex(64,64,(g,w,h)=>{g.fillStyle='#D8C8A0';g.fillRect(0,0,w,h);g.globalCompositeOperation='destination-out';for(let i=0;i<9;i++){g.beginPath();g.arc(Math.random()*w,Math.random()*h,rp(3,9),0,7);g.fill()}g.beginPath();g.moveTo(w,h);g.lineTo(w*0.5,h);g.lineTo(w,h*0.4);g.fill()});
const goldM=mat(0xFFC93C,{metalness:0.8,roughness:0.25,emissive:0x6a4500,emissiveIntensity:0.7});
// Bảng màu rong theo vùng: [màu 1, màu 2, phát sáng]
const WP=[[0x3E8E41,0x7CC85A,0],[0x5C8A2E,0x9AC23A,0],[0x2ACB9A,0x00E5FF,0.6],[0x1F5A4A,0x2ACB9A,0.45],[0x5A1A10,0xB8401A,0.5],[0x3A9A9A,0xA8F0F0,0.15],[0x3E8E41,0xC9B458,0],[0x4A0A0A,0xA01A1A,0.6],[0x8A3AE0,0xFF4FD8,0.6],[0x4D6BFF,0xB04DFF,0.7]];
const CORAL=[[0xFF6F91,0xFF9F1C,0xB04DFF,0xFFE14D,0x4DC3FF],[0xFF8A65,0xFFD54F,0xAED581],[0x00E5FF,0xFF4FD8,0x7CFF6B],[0x2ACB9A,0x6A5ACD,0x00BFA5],[0xFF5A1A,0xFFD23F,0x2A1A1A],[0xBFEFFF,0x8FD8FF,0xFFFFFF],[0xFF6F91,0xFFD700,0x4DC3FF],[0xFF2A1A,0xEDE0D0,0x6A0A0A],[0x00E5FF,0xFF4FD8,0xB04DFF],[0xFF4D4D,0x4DFF88,0x4DC3FF,0xB04DFF]];
const wm=(c,gl,o)=>mat(c,Object.assign(gl?{emissive:c,emissiveIntensity:gl}:{},{roughness:0.6},o||{}));
function kelp(c1,c2,gl,n,h){const root=new THREE.Group(),segs=[];let p=root;const sh=h/n;
for(let i=0;i<n;i++){const s=new THREE.Group(),m=new THREE.Mesh(G.seg,wm(i%2?c1:c2,gl,{side:THREE.DoubleSide}));m.scale.set(1-i*0.06,sh*1.05,1);m.rotation.y=i*0.7;s.add(m);
 if(i%2===0&&i>0){const l=new THREE.Mesh(sphG,wm(c2,gl));l.scale.set(0.28,0.1,0.12);l.position.set(0.22,sh*0.5,0);l.rotation.z=0.6;s.add(l);const b=new THREE.Mesh(sphG,wm(0xC8B85A,gl));b.scale.setScalar(0.08);b.position.set(-0.15,sh*0.3,0);s.add(b)}
 if(i)s.position.y=sh;p.add(s);segs.push(s);p=s}return{root,segs}}
function chainAnim(segs,amp,root){const ph=rp(0,6);let bx=0,bz=0;return(m,T)=>{let tx=0,tz=0;const o=root||m;o.getWorldPosition(wpV);const dx=wpV.x-P.x,dz=wpV.z-P.z,d=Math.hypot(dx,dz)||0.01,R=2.5+sz*0.9+(m.scale.x||1);
 if(d<R){const f=(1-d/R)*1.1/segs.length*1.6;tx=dx/d*f;tz=dz/d*f}bx+=(tx-bx)*0.12;bz+=(tz-bz)*0.12;
 for(let k=0;k<segs.length;k++){segs[k].rotation.z=Math.sin(T*1.1+ph+k*0.45)*amp-bx;segs[k].rotation.x=Math.cos(T*0.8+ph+k*0.4)*amp*0.6+bz}}}
const wpV=new THREE.Vector3();
function anemone(col,gl,host){const g=new THREE.Group(),b=new THREE.Mesh(G.cyl,wm(col,gl*0.5));b.scale.set(0.35,0.4,0.35);b.position.y=0.2;g.add(b);const tents=[];
for(let i=0;i<16;i++){const a=i/16*6.28,r=i%2?0.22:0.12,t=new THREE.Group(),m=new THREE.Mesh(G.tent,wm(col,gl||0.25));m.scale.y=rp(0.5,0.8);t.add(m);const tp=new THREE.Mesh(G.tip,wm(0xffffff,0.3));tp.position.y=m.scale.y;t.add(tp);
 t.position.set(Math.cos(a)*r,0.4,Math.sin(a)*r);t.rotation.set(Math.sin(a)*0.5,0,-Math.cos(a)*0.5);t.userData.a=a;g.add(t);tents.push(t)}
const ph=rp(0,6),cl=[];if(host){for(let i=0;i<2;i++){const f=clownMini();g.add(f);cl.push(f)}}
return{g,anim:(m,T)=>{tents.forEach((t,k)=>{const w=Math.sin(T*2+ph+k)*0.25;t.rotation.x=Math.sin(t.userData.a)*(0.5+w);t.rotation.z=-Math.cos(t.userData.a)*(0.5+w)});
 cl.forEach((f,i)=>{const a=T*(0.9+i*0.3)*(i?-1:1)+ph+i*3,r=0.45+Math.sin(T*1.3+i)*0.15;f.position.set(Math.cos(a)*r,0.75+Math.sin(T*2+i)*0.15,Math.sin(a)*r);f.rotation.y=-a+(i?0:Math.PI);if(f.tail)f.tail.rotation.y=Math.sin(T*14+i)*0.5})}}}
let clownProto=null;function clownMini(){if(!clownProto){clownProto=mkFish({len:1.1,w:0.5,h:0.62,top:0xFF7A1A,belly:0xFFB070,bands:[0.2,-0.05,-0.3],fin:0xFF6A00,eye:0.12})}
const f=clownProto.clone();f.tail=f.children.find(c=>c.isGroup);f.scale.setScalar(0.28);return f}
function fanCoral(col,gl){const g=new THREE.Group(),f=new THREE.Mesh(G.fan,wm(col,gl,{side:THREE.DoubleSide,transparent:true,opacity:0.9}));f.scale.set(1.3,1.5,1);f.position.y=0.3;g.add(f);
for(let i=0;i<5;i++){const v=new THREE.Mesh(G.tent,wm(0x5a2a3a,0));v.scale.set(0.7,1.3,0.7);v.position.y=0.3;v.rotation.z=(i-2)*0.45;g.add(v)}return g}
function tubes(cols,gl){const g=new THREE.Group();for(let i=0;i<4;i++){const c=cols[i%cols.length],h=rp(0.8,2),t=new THREE.Mesh(G.tube,wm(c,gl,{side:THREE.DoubleSide}));t.scale.set(rp(1,1.6),h,rp(1,1.6));t.position.set(rp(-0.4,0.4),0,rp(-0.4,0.4));t.rotation.z=rp(-0.2,0.2);g.add(t)}return g}
function brain(col,gl){const m=new THREE.Mesh(G.hemi,wm(col,gl,{flatShading:true,roughness:0.9}));m.scale.set(rp(0.8,1.3),rp(0.5,0.8),rp(0.8,1.3));return m}
function urchin(){const g=new THREE.Group(),b=new THREE.Mesh(sphG,mat(0x3A1A4A,{roughness:0.5}));b.scale.setScalar(0.3);b.position.y=0.25;g.add(b);const sm=mat(0x5A2A7A,{roughness:0.4});
for(let i=0;i<22;i++){const e=Math.acos(1-2*(i+0.5)/22),a=i*2.4,v=new THREE.Vector3(Math.sin(e)*Math.cos(a),Math.abs(Math.cos(e)),Math.sin(e)*Math.sin(a)),c=new THREE.Mesh(G.spike,sm);c.position.copy(v).multiplyScalar(0.4);c.position.y+=0.25;c.lookAt(c.position.clone().add(v));c.rotateX(Math.PI/2);g.add(c)}return g}
function starfish(){const m=new THREE.Mesh(G.star,mat([0xFF7A3A,0xE53935,0xB04DFF,0xFFC21E,0xFF5A8A][rnd(5)],{roughness:0.8}));m.position.y=0.06;m.rotation.y=rp(0,6.28);m.scale.setScalar(rp(0.7,1.2));return m}
function coinPile(n){const g=new THREE.Group();for(let i=0;i<n;i++){const c=new THREE.Mesh(G.coin,goldM);const a=rp(0,6.28),r=rp(0,0.6)*Math.sqrt(i/n);c.position.set(Math.cos(a)*r,0.03+(i<n/2?0:rp(0,0.25)),Math.sin(a)*r);c.rotation.set(rp(-0.4,0.4),0,rp(-0.4,0.4));g.add(c)}
const sp=glowSp(0xFFD700,1.4,0.6);sp.position.y=0.3;g.add(sp);return g}
function chestModel(){const g=new THREE.Group(),wd=mat(0x7A4A22,{roughness:0.75});const b=new THREE.Mesh(G.box,wd);b.scale.set(1.4,0.75,0.9);b.position.y=0.375;g.add(b);
[-0.5,0.5].forEach(x=>{const s=new THREE.Mesh(G.box,goldM);s.scale.set(0.1,0.78,0.93);s.position.set(x,0.375,0);g.add(s)});
const lid=new THREE.Group(),lm=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,1.4,14,1,false,0,Math.PI),wd);lm.rotation.z=Math.PI/2;lm.position.z=0.45;lid.add(lm);
[-0.5,0.5].forEach(x=>{const s=new THREE.Mesh(new THREE.TorusGeometry(0.46,0.04,5,14,Math.PI),goldM);s.rotation.y=Math.PI/2;s.position.set(x,0,0.45);lid.add(s)});
const lk=new THREE.Mesh(G.box,goldM);lk.scale.set(0.18,0.22,0.06);lk.position.set(0,0,0.92);lid.add(lk);lid.position.set(0,0.75,-0.45);g.add(lid);g.lid=lid;
const heap=new THREE.Mesh(G.hemi,goldM);heap.scale.set(0.62,0.3,0.38);heap.position.y=0.74;g.add(heap);
for(let i=0;i<5;i++){const gm=new THREE.Mesh(G.gem,mat([0xFF1744,0x00E676,0x2979FF,0xD500F9,0x00E5FF][i],{emissive:[0xFF1744,0x00E676,0x2979FF,0xD500F9,0x00E5FF][i],emissiveIntensity:0.8,roughness:0.1}));gm.position.set(rp(-0.45,0.45),0.86,rp(-0.25,0.25));g.add(gm)}
const sp=glowSp(0xFFD700,3,0.55);sp.position.y=1;g.add(sp);g.glow=sp;return g}
function clam(gl){const g=new THREE.Group(),sm=mat(0xD8C0D8,{roughness:0.35,metalness:0.2}),b=new THREE.Mesh(G.hemi,sm);b.scale.set(0.6,0.22,0.5);b.rotation.x=Math.PI;b.position.y=0.22;g.add(b);
const top=new THREE.Group(),t=new THREE.Mesh(G.hemi,sm);t.scale.set(0.6,0.25,0.5);t.position.z=0.45;top.add(t);top.position.set(0,0.22,-0.45);g.add(top);
const p=new THREE.Mesh(G.pearl,mat(0xFFFFFF,{emissive:0xFFF0FF,emissiveIntensity:0.5+gl,roughness:0.05,metalness:0.3}));p.position.set(0,0.3,0.05);g.add(p);const sp=glowSp(0xFFE8FF,1.2,0.7);sp.position.copy(p.position);g.add(sp);
const ph=rp(0,6);return{g,anim:(m,T)=>{const o=(Math.sin(T*0.7+ph)+1)/2;top.rotation.x=-o*0.9;sp.scale.setScalar(0.4+o*1)}}}
function wreck(gl){const g=new THREE.Group(),w=mat(0x5A3E26,{roughness:0.95}),w2=mat(0x3A2614,{roughness:0.95}),anims=[];
const keel=new THREE.Mesh(G.box,w2);keel.scale.set(1.4,0.7,9);keel.position.y=0.35;g.add(keel);
[-1,1].forEach(s=>{for(let k=0;k<4;k++){if(s>0&&k===1)continue;const p=new THREE.Mesh(G.box,k%2?w:w2);p.scale.set(0.22,2.3,2.1);p.position.set(s*1.55,1.3,-3.2+k*2.15);p.rotation.z=s*0.22;p.rotation.x=(k===2&&s>0)?0.25:0;g.add(p)}});
const bow=new THREE.Mesh(new THREE.ConeGeometry(1.75,3.2,4),w);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,0.8);bow.position.set(0,1.3,6);g.add(bow);
const cab=new THREE.Mesh(G.box,w);cab.scale.set(3,1.8,2.4);cab.position.set(0,2.8,-3.4);g.add(cab);const dk=new THREE.Mesh(G.box,w2);dk.scale.set(3.1,0.2,3.6);dk.position.set(0,2.3,0.2);dk.rotation.z=0.08;g.add(dk);
for(let i=0;i<3;i++){const h=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.06,6,12),goldM);h.position.set(1.52,2.9,-4.2+i*0.8);h.rotation.y=Math.PI/2;g.add(h);const gw=new THREE.Mesh(G.disc,mat(0xFFE9A8,{emissive:0xFFC040,emissiveIntensity:0.5+gl}));gw.scale.setScalar(0.18);gw.rotation.z=Math.PI/2;gw.position.set(1.54,2.9,-4.2+i*0.8);g.add(gw)}
const mast=new THREE.Mesh(G.cyl,w2);mast.scale.set(0.16,8,0.16);mast.position.set(0.3,5.5,0.6);mast.rotation.z=-0.42;g.add(mast);
const bar=new THREE.Mesh(G.cyl,w2);bar.scale.set(0.09,3.4,0.09);bar.rotation.x=Math.PI/2;bar.position.set(1.9,8.6,0.6);g.add(bar);
const sail=new THREE.Mesh(new THREE.PlaneGeometry(2.8,3.2),new THREE.MeshStandardMaterial({map:sailT,transparent:true,side:THREE.DoubleSide,roughness:1,alphaTest:0.1}));sail.position.set(1.6,7,0.75);sail.rotation.z=-0.42;g.add(sail);
anims.push((m,T)=>{sail.rotation.y=Math.sin(T*0.8)*0.15});
for(let i=0;i<2;i++){const c=new THREE.Mesh(G.cyl,mat(0x2A2A2E,{metalness:0.6,roughness:0.4}));c.scale.set(0.18,1.3,0.18);c.rotation.z=Math.PI/2;c.position.set(2.1,1.5,-1+i*2);g.add(c)}
for(let i=0;i<3;i++){const b=new THREE.Mesh(G.cyl,w);b.scale.set(0.45,0.9,0.45);b.position.set(-2.8+rp(-0.5,0.5),0.45,-1+i*1.6);if(i===2){b.rotation.z=Math.PI/2;b.position.y=0.45}g.add(b);
 [0.2,0.7].forEach(y=>{const r=new THREE.Mesh(new THREE.TorusGeometry(0.46,0.03,4,14),mat(0x2A2A2E));r.rotation.x=Math.PI/2;r.position.copy(b.position);if(i===2){r.rotation.set(0,Math.PI/2,0);r.position.x+=y-0.45}else r.position.y=y;g.add(r)})}
const ch=chestModel();ch.lid.rotation.x=-1.1;ch.position.set(-1.2,0,4.6);ch.rotation.y=0.5;g.add(ch);const cp=coinPile(14);cp.position.set(-1.8,0,5.6);g.add(cp);
const lan=glowSp(0xFFC040,4,0.5);lan.position.set(0,3.9,-4.7);g.add(lan);
[[0.8,2.4,0],[-0.8,2.4,1.2]].forEach(([x,y,z])=>{const k=kelp(0x3E8E41,0x7CC85A,gl,6,3);k.root.position.set(x,y,z);g.add(k.root);anims.push(chainAnim(k.segs,0.1,k.root))});
g.rotation.set(0.04,0,0.16);return{g,anim:(m,T)=>anims.forEach(f=>f(m,T))}}
function crabMini(){const g=new THREE.Group(),c=[0xD8452A,0xFF7A3A,0x8A4AE0][rnd(3)],m=mat(c,{roughness:0.5}),b=new THREE.Mesh(sphG,m);b.scale.set(0.38,0.16,0.3);b.position.y=0.22;g.add(b);const legs=[];
[-1,1].forEach(s=>{for(let i=0;i<3;i++){const l=new THREE.Mesh(G.tent,m);l.scale.set(0.6,0.42,0.6);l.position.set(s*0.3,0.2,0.15-i*0.15);l.rotation.z=s*2.2;g.add(l);legs.push(l)}const cl=new THREE.Mesh(sphG,m);cl.scale.set(0.13,0.09,0.16);cl.position.set(s*0.3,0.28,0.35);g.add(cl);
 const e=new THREE.Mesh(G.tip,mat(0x111111));e.position.set(s*0.1,0.42,0.22);g.add(e)});
const body=new THREE.Group();body.add(g);const ph=rp(0,6),R=rp(1.5,3);return{g:body,anim:(m,T)=>{const t=T*0.5+ph;g.position.x=Math.sin(t)*R;legs.forEach((l,k)=>l.rotation.x=Math.sin(T*14+k)*0.4)}}}
function seahorse(){const g=new THREE.Group(),c=[0xFFB020,0xFF6FA8,0x7CFF6B,0xFFE14D][rnd(4)],m=mat(c,{roughness:0.4});const pts=[[0,0.9,0.15,0.13],[0,0.72,0.06,0.15],[0,0.52,0.02,0.15],[0,0.32,0.04,0.13],[0,0.15,0.1,0.1],[0,0.03,0.05,0.07],[0,-0.05,-0.05,0.05]];
pts.forEach(([x,y,z,r])=>{const s=new THREE.Mesh(sphG,m);s.scale.setScalar(r);s.position.set(x,y,z);g.add(s)});const sn=new THREE.Mesh(G.cyl,m);sn.scale.set(0.04,0.3,0.04);sn.rotation.x=Math.PI/2.5;sn.position.set(0,0.95,0.38);g.add(sn);
const f=new THREE.Mesh(G.fan,mat(0xffffff,{transparent:true,opacity:0.6,side:THREE.DoubleSide}));f.scale.setScalar(0.18);f.rotation.y=Math.PI/2;f.position.set(0,0.5,-0.12);g.add(f);
eyes(g,0.08,0.95,0.2,0.045);const w=new THREE.Group();w.add(g);g.scale.setScalar(1.2);const ph=rp(0,6),y0=rp(1.2,2.6);return{g:w,anim:(mm,T)=>{g.position.y=y0+Math.sin(T*1.2+ph)*0.3;g.rotation.y=Math.sin(T*0.4+ph)*1.2;f.rotation.z=Math.sin(T*20)*0.4}}}
function eel(){const g=new THREE.Group(),h=new THREE.Mesh(G.disc,mat(0x050505));h.scale.setScalar(0.45);h.position.y=0.03;g.add(h);const e=new THREE.Group(),m=mat(0x4A7A2A,{roughness:0.5});
const b=new THREE.Mesh(G.cyl,m);b.scale.set(0.17,1.4,0.17);b.position.y=-0.2;e.add(b);const hd=new THREE.Mesh(sphG,m);hd.scale.set(0.2,0.26,0.24);hd.position.set(0,0.55,0.05);e.add(hd);eyes(e,0.1,0.6,0.15,0.045);
const sp=new THREE.Mesh(sphG,mat(0xFFE14D));sp.scale.setScalar(0.05);sp.position.set(0.15,0.2,0);e.add(sp);g.add(e);const ph=rp(0,6);
return{g,anim:(mm,T)=>{const o=Math.max(0,Math.sin(T*0.6+ph));e.position.y=-0.7+o*1.2;e.rotation.z=Math.sin(T*2+ph)*0.25*o;e.rotation.y=Math.sin(T*0.9)*0.8}}}
function vase(){const m=new THREE.Mesh(G.vase,mat(0xB86A3A,{roughness:0.85,side:THREE.DoubleSide}));m.scale.setScalar(rp(0.9,1.4));if(Math.random()<0.5){m.rotation.z=Math.PI/2;m.position.y=0.3}return m}
function goldBars(){const g=new THREE.Group();for(let i=0;i<6;i++){const b=new THREE.Mesh(G.box,goldM);b.scale.set(0.5,0.16,0.22);b.position.set((i%3)*0.27-0.27,0.08+(i>2?0.16:0),i>2?0.06:0);g.add(b)}const sp=glowSp(0xFFD700,1.6,0.6);sp.position.y=0.3;g.add(sp);return g}
function seagrass(c1,c2,gl){const g=new THREE.Group();for(let i=0;i<9;i++){const b=new THREE.Mesh(G.blade,wm(i%2?c1:c2,gl));b.scale.set(1,rp(0.6,1.6),1);b.position.set(rp(-0.4,0.4),0,rp(-0.4,0.4));b.rotation.set(rp(-0.3,0.3),0,rp(-0.3,0.3));g.add(b)}return g}
// Lấp lánh vàng
function twinkle(g,y){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:radT,color:0xFFF6C0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));s.position.y=y;g.add(s);const ph=rp(0,6);return(m,T)=>{const v=Math.max(0,Math.sin(T*2.2+ph));s.scale.setScalar(0.2+v*v*1.4);s.material.opacity=v}}
function staghorn(col,gl){const g=new THREE.Group(),m=wm(col,gl);for(let i=0;i<5;i++){const b=new THREE.Mesh(G.tent,m),h=rp(0.8,1.5);b.scale.set(2.2,h,2.2);b.position.set(rp(-0.3,0.3),0,rp(-0.3,0.3));b.rotation.set(rp(-0.5,0.5),0,rp(-0.5,0.5));g.add(b);
 const t=new THREE.Mesh(G.tent,m);t.scale.set(1.5,h*0.5,1.5);t.position.set(b.position.x,h*0.6,b.position.z);t.rotation.set(rp(-1,1),0,rp(-1,1));g.add(t)}return g}
function reefPatch(CC,gl,c1,c2){const g=new THREE.Group(),anims=[],put=(o,r,an)=>{const a=rp(0,6.28),d=rp(0,r);o.position.x+=Math.cos(a)*d;o.position.z+=Math.sin(a)*d;g.add(o);if(an)anims.push(an)};
const rock=new THREE.Mesh(sphG,mat(0x7A6E5E,{flatShading:true,roughness:1}));rock.scale.set(2.2,0.6,1.8);rock.position.y=-0.1;g.add(rock);
put(brain(CC[0],gl*0.6),1.5);put(brain(CC[2%CC.length],gl*0.6),2.5);const t=tubes(CC,gl);put(t,2.5);
const f=fanCoral(CC[1%CC.length],gl);f.rotation.y=rp(0,6.28);put(f,2.2,(m,T)=>{f.rotation.z=Math.sin(T*1.2+f.position.x)*0.08});
const a1=anemone(CC[(rnd(9))%CC.length],gl,true);put(a1.g,1.8,a1.anim);put(staghorn(CC[3%CC.length],gl),2.4);put(staghorn(CC[0],gl),2.4);
for(let i=0;i<2;i++){const s=seagrass(c1,c2,gl);put(s,3,(m,T)=>{s.rotation.z=Math.sin(T*1.4+i+s.position.x)*0.1})}put(starfish(),3);if(Math.random()<0.5)put(urchin(),3);
return{g,anim:(m,T)=>anims.forEach(f=>f(m,T))}}
function rockArch(gl){const g=new THREE.Group(),rm=mat(0x6E6A62,{flatShading:true,roughness:1}),a=new THREE.Mesh(new THREE.TorusGeometry(3,0.9,5,9,Math.PI),rm);a.scale.set(1,1.1,1.3);g.add(a);
for(let i=0;i<7;i++){const t=i/6*Math.PI,mo=new THREE.Mesh(sphG,wm([0x4E8A3A,0x6BAA4A][i%2],gl*0.5));mo.scale.set(0.6,0.25,0.8);mo.position.set(Math.cos(t)*3,Math.sin(t)*3.3+0.75,0);g.add(mo)}
[-3,3].forEach(x=>{const b=new THREE.Mesh(sphG,rm);b.scale.set(1.3,0.8,1.4);b.position.set(x,0.2,0);g.add(b)});return g}
function stingray(){const g=new THREE.Group(),r=makeManta();r.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHex()===0x2A3A55)o.material=mat(0x8A7A5A,{roughness:0.8,side:THREE.DoubleSide})});r.scale.setScalar(0.55);g.add(r);
const ph=rp(0,6),R=rp(2.5,4.5);return{g,anim:(m,T)=>{const a=T*0.35+ph;r.position.set(Math.cos(a)*R,0.25+Math.sin(T*1.5)*0.05,Math.sin(a)*R);r.rotation.y=-a;r.wings.forEach((w,k)=>w.rotation.z=(k?-1:1)*Math.sin(T*2.5+ph)*0.3);
 if(Math.random()<0.02)part(m.position.x+r.position.x*m.scale.x,0.2,m.position.z+r.position.z*m.scale.x,addM(0xE8D8B0),new THREE.Vector3(rp(-1,1),rp(0.5,1.5),rp(-1,1)),0.8,1.2,1)}}}
function decoJelly(gl){const g=new THREE.Group(),col=[0xBFF6FF,0xE0C8FF,0xFFD8F0][rnd(3)],d=new THREE.Mesh(new THREE.SphereGeometry(0.35,12,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:0.4+gl,transparent:true,opacity:0.45,side:THREE.DoubleSide,depthWrite:false}));g.add(d);
const ts=[];for(let i=0;i<5;i++){const t=new THREE.Mesh(G.tent,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.35,depthWrite:false}));t.scale.set(0.4,0.9,0.4);t.rotation.x=Math.PI;const a=i/5*6.28;t.position.set(Math.cos(a)*0.18,0,Math.sin(a)*0.18);g.add(t);ts.push(t)}
const sp=glowSp(col,1.4,0.35);g.add(sp);const w=new THREE.Group();w.add(g);const ph=rp(0,6),y0=rp(3,5);
return{g:w,anim:(m,T)=>{const p=Math.sin(T*2+ph);d.scale.set(1+p*0.12,1-p*0.18,1+p*0.12);g.position.y=y0+Math.sin(T*0.5+ph)*0.6+Math.max(0,p)*0.1;g.position.x=Math.sin(T*0.2+ph)*1.5;ts.forEach((t,k)=>t.rotation.z=Math.sin(T*2+k+ph)*0.2)}}}
function addCommon(g,zi){const k=(zi-1)%10,[c1,c2,gl]=WP[k],CC=CORAL[k],an=(x,z,o,f,sway)=>{addDecor(g,o,x,z,sway);if(f)decor[decor.length-1].anim=f};
scatter(14,(x,z)=>{const c=new THREE.Group(),an2=[];for(let i=0;i<3;i++){const kp=kelp(i===1?c2:c1,i===1?c1:c2,gl,7,rp(3,5.5));kp.root.position.set(i*0.45-0.45,0,rp(-0.35,0.35));c.add(kp.root);an2.push(chainAnim(kp.segs,0.09,kp.root))}an(x,z,c,(m,T)=>an2.forEach(f=>f(m,T)))});
scatter(28,(x,z)=>an(x,z,seagrass(c1,c2,gl),null,0.08));
scatter(6,(x,z,i)=>{const a=anemone(CC[i%CC.length],gl,i%2===0);an(x,z,a.g,a.anim)});
scatter(5,(x,z,i)=>{const f=fanCoral(CC[(i+1)%CC.length],gl);f.rotation.y=rp(0,6.28);an(x,z,f,null,0.06)});
scatter(4,(x,z,i)=>an(x,z,tubes(CC,gl)));scatter(4,(x,z,i)=>an(x,z,brain(CC[(i+2)%CC.length],gl*0.6)));
scatter(9,(x,z)=>{const r=reefPatch(CC,gl,c1,c2);r.g.rotation.y=rp(0,6.28);an(x,z,r.g,r.anim)});scatter(3,(x,z)=>{const r=rockArch(gl);r.rotation.y=rp(0,6.28);an(x,z,r)});
scatter(3,(x,z)=>{const s=stingray();an(x,z,s.g,s.anim)});scatter(7,(x,z)=>{const j=decoJelly(gl);an(x,z,j.g,j.anim)});
scatter(2,(x,z)=>{const w=wreck(gl);w.g.rotation.y=rp(0,6.28);an(x,z,w.g,w.anim);decor[decor.length-1].big=14});
scatter(4,(x,z)=>{const c=chestModel();c.lid.rotation.x=-rp(0.6,1.2);c.rotation.y=rp(0,6.28);an(x,z,c,twinkle(c,1))});
scatter(9,(x,z)=>{const c=coinPile(6+rnd(8));an(x,z,c,twinkle(c,0.3))});scatter(3,(x,z)=>{const b=goldBars();an(x,z,b,twinkle(b,0.4))});
scatter(10,(x,z)=>{const c=clam(gl);c.g.rotation.y=rp(0,6.28);an(x,z,c.g,c.anim)});
scatter(16,(x,z)=>an(x,z,starfish()));scatter(10,(x,z)=>an(x,z,urchin()));scatter(6,(x,z)=>an(x,z,vase()));
scatter(8,(x,z)=>{const c=crabMini();c.g.rotation.y=rp(0,6.28);an(x,z,c.g,c.anim)});scatter(6,(x,z)=>{const c=seahorse();an(x,z,c.g,c.anim)});scatter(5,(x,z)=>{const e=eel();an(x,z,e.g,e.anim)})}
// ---- Thêm loài cá ----
SMALL.push(()=>mkFish({len:1.1,w:0.38,h:0.6,top:0xC8452A,bands:[0.3,0.15,0,-0.15,-0.3],band:0xFFF2E0,fin:0xE8A080,dh:0.95,dw:0.45}),
()=>mkFish({len:0.8,w:0.22,h:1.1,top:0x2D5BD8,bands:[0.1,-0.15],band:0xFFE14D,fin:0xFFE14D,dh:0.9}),()=>mkFish({len:1,w:0.3,h:0.7,top:0x1E5BFF,belly:0x3A7BFF,fin:0xFFD23F,eye:0.1}),
()=>mkFish({len:0.9,w:0.4,h:0.45,top:0x00B4D8,spots:true,spotC:0xFF7A1A,fin:0xFF5A8A}),()=>mkFish({len:0.8,w:0.25,h:0.85,top:0xFFF5D0,bands:[0.15],band:0x222222,fin:0xFFD23F}));
MID.push(()=>mkFish({len:1.2,w:0.9,h:0.85,top:0x8A9A5A,belly:0xE8E8C8,spikes:true,spots:true,spotC:0x3a3a2a,fin:0x6A7A4A}),()=>mkFish({len:1.4,w:0.4,h:0.9,top:0x3A4A6A,belly:0xFFD23F,bands:[0],band:0xFFD23F,fin:0x2A3A5A}));
function makeHammer(){const g=makePred(0,false),h=new THREE.Mesh(G.box,mat(0x6B7B8C));h.scale.set(1.5,0.22,0.35);h.position.set(0,0.05,1.45);g.add(h);[-1,1].forEach(s=>{const e=ball(0.08,0x111111);e.position.set(s*0.75,0.1,1.5);g.add(e)});return g}
BIG.push(makeHammer,()=>{const g=makeManta();g.scale.setScalar(1);return g});
// ---- Cá voi khổng lồ bơi ngang qua ----
const whaleM=mkFish({len:1,w:0.42,h:0.34,top:0x2B3A55,belly:0x9FB0C8,fin:0x22304A,horiz:true,dorsal:false,eye:0.03,rough:0.8});normalize(whaleM,1);whaleM.scale.setScalar(whaleM.userData.k);
const whale=new THREE.Group();whale.add(whaleM);whale.visible=false;S.add(whale);const whaleSh=mkShadow();whaleSh.visible=false;
// ---- Tuyết biển (hạt trôi lơ lửng) ----
const SN=280,snP=new Float32Array(SN*3),snG=new THREE.BufferGeometry();for(let i=0;i<SN;i++){snP[i*3]=rp(-30,30);snP[i*3+1]=rp(0.5,12);snP[i*3+2]=rp(-30,30)}snG.setAttribute('position',new THREE.BufferAttribute(snP,3));
const snowM=new THREE.PointsMaterial({map:radT,size:0.35,transparent:true,opacity:0.6,depthWrite:false,blending:THREE.AdditiveBlending,color:0xDFF6FF}),snow=new THREE.Points(snG,snowM);snow.frustumCulled=false;S.add(snow);
const pShadow=mkShadow(),bShadow=mkShadow();bShadow.visible=false;
// ---- Kho báu & vàng có thể nhặt ----
let chests=[],coins=[],chestT=18,coinT=5,whaleT=20,whaleS=null,coinStreak=0,coinStreakT=0;
const sCoin=n=>{snd(1300+Math.min(n,10)*90,2200+Math.min(n,10)*120,0.09,'square',0.035);setTimeout(()=>snd(2000+Math.min(n,10)*90,2600,0.07,'sine',0.04),60)},sChest=()=>{seq([523,659,784,1047,1319,1568,2093],0.08,60);if(AC)noise(AC.currentTime,0.4,0.1,3000)};
function spawnChest(){const[x,z]=around(12+sz,18+sz*2,true),m=chestModel(),k=Math.max(1,sz*0.45);m.scale.setScalar(k*1.25);m.position.set(x,0,z);m.rotation.y=rp(0,6.28);S.add(m);chests.push({x,z,m,k,t:35,open:0})}
function spawnCoins(){const a0=P.hd+rp(-0.9,0.9),k=Math.max(1,sz*0.45),n=6+rnd(5),cv=rp(-0.12,0.12),d0=7+sz*1.5;for(let i=0;i<n;i++){const a=a0+cv*i,d=d0+i*1.5*k,x=P.x+Math.sin(a)*d,z=P.z+Math.cos(a)*d;
 const m=new THREE.Group(),c=new THREE.Mesh(G.coin,goldM);c.rotation.x=Math.PI/2;m.add(c);m.add(glowSp(0xFFD700,1.3,0.55));m.scale.setScalar(k*1.4);S.add(m);coins.push({x,z,m,k,t:22,ph:i*0.5})}}
// ---- Mũi tên chỉ hướng ở mép màn hình ----
const indPool=[];let indUsed=0;
function ind(x,y,z,cls,ic,dist){const[a,b]=scr(x,y,z),m=8;if(a>m&&a<100-m&&b>m+5&&b<100-m)return false;let d=indPool[indUsed];
if(!d){d=document.createElement('div');d.innerHTML='<b>➤</b><span></span><i></i>';lbls.appendChild(d);indPool.push(d)}indUsed++;
const W=wrap.clientWidth||1,H=wrap.clientHeight||1;let dx=(a-50)*W,dy=(b-50)*H;const kx=(50-m)*W/Math.abs(dx||1e-6),ky=(50-m-2)*H/Math.abs(dy||1e-6),k=Math.min(kx,ky);
const ex=50+dx*k/W,ey=50+dy*k/H;if(d._c!==cls){d.className='ind '+cls;d._c=cls}d.style.display='block';d.style.left=ex+'%';d.style.top=ey+'%';
d.firstChild.style.transform='rotate('+Math.atan2(dy,dx)+'rad) translateX(24px)';if(d._i!==ic){d.children[1].textContent=ic;d._i=ic}const t=dist?Math.round(dist)+'m':'';if(d._t!==t){d.children[2].textContent=t;d._t=t}return true}

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
function showLv(t,ms){lvB.innerHTML='<div>'+t+'</div>';lvB.style.opacity=1;lvB.style.transform='scale(1)';clearTimeout(showLv.t);showLv.t=setTimeout(()=>{lvB.style.opacity=0;lvB.style.transform='scale(0.8)'},ms||1700)}
const HEX=c=>'#'+c.toString(16).padStart(6,'0'),RB=[0xFF4D4D,0xFF9F1C,0xFFE14D,0x4DFF88,0x4DC3FF,0xB04DFF];
function firework(){const c=RB[rnd(6)],x=P.x+rp(-12,12),z=P.z-rp(6,14),y=rp(8,14);for(let i=0;i<40;i++){const a=Math.random()*6.28,e=Math.acos(2*Math.random()-1),sp=rp(4,7);part(x,y,z,addM(i%2?c:0xffffff),new THREE.Vector3(Math.sin(e)*Math.cos(a)*sp,Math.cos(e)*sp,Math.sin(e)*Math.sin(a)*sp),1.4,0.9,2)}snd(900,150,0.35,'triangle',0.05)}
// Nhãn số trên đầu các đàn
const lbPool=[];let lbUsed=0;
function label(txt,x,y,z,cls){let d=lbPool[lbUsed];if(!d){d=document.createElement('div');lbls.appendChild(d);lbPool.push(d)}lbUsed++;const[a,b,vis]=scr(x,y,z);if(!vis||a<-10||a>110||b<-10||b>110){d.style.display='none';return}
if(d._t!==txt){d.textContent=txt;d._t=txt}if(d._c!==cls){d.className='lb '+cls;d._c=cls}d.style.display='block';d.style.left=a+'%';d.style.top=b+'%'}


// ================= SKIN (màu hào quang) =================
const SKINS=[{n:'Nắng vàng',need:0,c:0xFFD36B},{n:'Ngọc bích',need:1000,c:0x1DE9B6},{n:'San hô hồng',need:2000,c:0xFF6FA8},{n:'Ánh trăng',need:4000,c:0xDDE6FF},{n:'Neon tím',need:6000,c:0xB04DFF},{n:'Cầu vồng',need:8000,c:-1},{n:'👑 Hoàng kim',need:0,win:1,c:0xFFC21E}];
let won=false;try{won=localStorage.getItem('fishWin')==='1'}catch(e){}
const MAXZ=20;
let skin=0;try{skin=+localStorage.getItem('fishSkin3')||0}catch(e){}if(!SKINS[skin]||best<SKINS[skin].need||(SKINS[skin].win&&!won))skin=0;
function renderSkins(){skE.innerHTML='<small>Màu hào quang (mở khoá bằng kỷ lục)</small>';SKINS.forEach((k,i)=>{const b=document.createElement('button'),ok=k.win?won:best>=k.need;b.textContent=ok?k.n:'🔒 '+(k.win?'Phá đảo':k.need);if(i===skin)b.className='on';
b.addEventListener('click',e=>{e.stopPropagation();if(!ok)return;skin=i;try{localStorage.setItem('fishSkin3',i)}catch(e){}renderSkins()});skE.appendChild(b)})}
const tmpC=new THREE.Color();
const skinC=()=>SKINS[skin].c<0?tmpC.setHSL((T*0.25)%1,1,0.6).getHex():SKINS[skin].c;

// ================= TRẠNG THÁI =================
const ZB=[350,1100,2200,3800,6000,9000,13000,18000,24000,32000];
const lapOf=z=>Math.ceil(z/10),bossAt=z=>z<=10?ZB[z-1]:32000+(z-10)*9000,bossHP=z=>Math.round((60+((z-1)%10)*38)*(1+0.5*(lapOf(z)-1)));
const P={x:0,z:0,vx:0,vz:0,hd:0,turn:0};
let sz=1,tier=0,score=0,zone=1,lives=3,running=false,paused=false,T=0,shake=0,inv=0,nextLife=3000,startBest=0,annBest=false,st={};
let npcs=[],boss=null,items=[],jellies=[],nets=[],whirls=[],hooks=[],shots=[],inks=[],fires=[],shocks=[],claws=[],bolts=[],decoy=null,trans=false;
let combo=0,comboT=0,chompT=0,hurtT=0,stunP=0,skCD=SKL.map(()=>0),skS='',hudS='',hudT=0,bubT=0,wakeT=0;
let vgT=0,bossWarned=false,dangerS=0,warnPrev=0,clearing=false,blinkT=0,dashT=0,puffT=0,vortexT=0,rageT=0,shieldT=0,magT=0,starT=0,dblT=0,slowT=0,inkSlow=0;
let spawnT=0,itemT=8,jellyT=16,netTm=22,whirlT=26,hookT=12,camH=12,joyV={x:0,y:0},keyV={x:0,y:0};
const gain=n=>{n=Math.round(n*(dblT>0?2:1));score+=n;return n};
const pR=()=>sz*0.5*(rageT>0?1.4:1)*(puffT>0?1.3:1);
const vp=()=>5+sz*0.55;
const eatK=()=>rageT>0?1.6:0.85;
function around(dmin,dmax,ahead){const a=ahead?P.hd+rp(-0.7,0.7):rp(0,6.28),d=rp(dmin,dmax);return[P.x+Math.sin(a)*d,P.z+Math.cos(a)*d]}
function disposeG(g){g.traverse(o=>{if(o.geometry&&o.geometry!==sphG&&o.geometry!==tinyG&&!o.isSprite&&!o.userData.keep)o.geometry.dispose()})}

// ================= NGƯỜI CHƠI =================
const pH=new THREE.Group();S.add(pH);let pIn=null,pModel=null,pLen=1.2;
const pGlow=glowSp(0xFFD36B,3,0.45);pGlow.userData.keep=1;pH.add(pGlow);
const pRing=new THREE.Mesh(new THREE.RingGeometry(0.85,1,48),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.5,side:THREE.DoubleSide,depthWrite:false}));pRing.rotation.x=-Math.PI/2;S.add(pRing);
const shieldB=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshBasicMaterial({color:0x6fd8ff,transparent:true,opacity:0.18,depthWrite:false}));shieldB.visible=false;S.add(shieldB);
// Vỏ gai khi phồng
const spikeShell=new THREE.Group();{const sm=mat(0xFFF2C0,{emissive:0x6a5a20});for(let i=0;i<34;i++){const e=Math.acos(1-2*(i+0.5)/34),a=i*2.4,v=new THREE.Vector3(Math.sin(e)*Math.cos(a),Math.cos(e),Math.sin(e)*Math.sin(a));
 const c=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.32,5),sm);c.position.copy(v).multiplyScalar(0.62);c.lookAt(v.clone().multiplyScalar(3));c.rotateX(Math.PI/2);spikeShell.add(c)}
 const sb=new THREE.Mesh(sphG,new THREE.MeshStandardMaterial({color:0xE8C547,transparent:true,opacity:0.35}));sb.scale.setScalar(0.6);spikeShell.add(sb)}spikeShell.visible=false;pH.add(spikeShell);
// Hào quang lửa cuồng long
const rageFx=glowSp(0xFF5A1A,5,0.6);rageFx.visible=false;rageFx.userData.keep=1;pH.add(rageFx);
function setForm(t){if(pIn){pH.remove(pIn);disposeG(pIn)}const f=FORMS[t];pModel=f.b();normalize(pModel,1);pIn=new THREE.Group();pModel.scale.setScalar(pModel.userData.k);pIn.add(pModel);pH.add(pIn);pLen=1.15+(f.len-1.2)*0.3}
// ================= CÁ NPC =================
const ringG2=new THREE.RingGeometry(0.8,1,36);ringG2.rotateX(-Math.PI/2);
const RM={ok:new THREE.MeshBasicMaterial({color:0x5CFF8A,transparent:true,opacity:0.55,depthWrite:false,side:THREE.DoubleSide}),eq:new THREE.MeshBasicMaterial({color:0xFFE14D,transparent:true,opacity:0.5,depthWrite:false,side:THREE.DoubleSide}),bad:new THREE.MeshBasicMaterial({color:0xFF4040,transparent:true,opacity:0.65,depthWrite:false,side:THREE.DoubleSide})};
function spawnNpc(far,grp){const r=Math.random(),big=boss?0.12:zone===1?0.16:0.26;let f,kind,b;
if(grp){f=grp.f*rp(0.85,1.15);kind=0;b=grp.b}else{if(r<1-big-0.14){f=sz*rp(0.3,0.75);kind=0}else if(r<1-big){f=sz*rp(0.88,1.12);kind=1}else{f=sz*rp(1.25,2.1);kind=2}
b=kind===0?(Math.random()<0.75?SMALL[rnd(SMALL.length)]:MID[rnd(MID.length)]):kind===1?MID[rnd(MID.length)]:BIG[rnd(BIG.length)]}
const m=b();normalize(m,1.2);m.scale.setScalar(m.userData.k);const g=new THREE.Group();g.add(m);const rg=new THREE.Mesh(ringG2,RM.ok);rg.userData.keep=1;S.add(rg);S.add(g);
const[x,z]=grp?[grp.x+rp(-2,2)*f,grp.z+rp(-2,2)*f]:far?around(camH*0.85+3,camH*1.15+4):around(6+sz,camH*1.3);const n={x,z,hd:grp?grp.hd:rp(0,6.28),sz:f,g,m,rg,stun:0,t:rp(0,6),turnT:0,sp:0,shy:Math.random()<0.65};if(grp){n.wh=grp.hd;n.turnT=rp(2,4)}g.scale.setScalar(f);npcs.push(n);
if(!grp&&kind===0&&Math.random()<0.45){const c=2+rnd(3);for(let k=0;k<c;k++)spawnNpc(far,{f,b,x,z,hd:n.hd})}return n}
function removeNpc(n){const i=npcs.indexOf(n);if(i>=0)npcs.splice(i,1);S.remove(n.g);S.remove(n.rg);disposeG(n.g)}
function animFish(m,t,spd,amp){if(m.tail)m.tail.rotation.y=Math.sin(t*(6+spd*2))*0.45*amp;if(m.fins)m.fins.forEach((f,i)=>f.rotation.x=Math.sin(t*5+i*3)*0.4);
if(m.segs)m.segs.forEach((s,k)=>{s.position.x=Math.sin(t*4-k*0.7)*0.12*k*amp});if(m.tents)m.tents.forEach((tt,k)=>{tt.rotation.x=Math.sin(t*3+k)*0.3;tt.rotation.z=Math.cos(t*2.5+k)*0.2});
if(m.wings)m.wings.forEach((w,k)=>w.rotation.z=(k?-1:1)*Math.sin(t*3)*0.5);if(m.dome)m.dome.scale.y=1+Math.sin(t*3)*0.15}

// ================= TRÙM =================
const trapM=new THREE.MeshBasicMaterial({color:0xFF2A2A,transparent:true,opacity:0.3,depthWrite:false,side:THREE.DoubleSide});
function spawnBoss(){const def=BOSSES[(zone-1)%BOSSES.length],m=def.b();normalize(m,1.2);m.scale.setScalar(m.userData.k);const g=new THREE.Group();g.add(m);S.add(g);
const fin=zone>=MAXZ,bs=Math.max(sz*(fin?2.9:2.3),3),hp=Math.round(bossHP(zone)*(fin?1.6:1)),[x,z]=around(camH*1.1,camH*1.3,true);
boss={x,z,hd:0,sz:bs,g,m,hp,max:hp,ab:fin?'all':def.ab,n:fin?def.n+' · TRÙM CUỐI':def.n,fin,state:'chase',stT:0,abT:3.5,hitT:0,daze:0,t:0,cur:''};g.scale.setScalar(bs);
sSiren();vgT=1.6;bbW.style.display='block';bbN.textContent='👑 '+boss.n;bbF.style.width='100%';
showLv('⚠️ TRÙM XUẤT HIỆN ⚠️<br><span style="font-size:24px">'+def.n+'</span><br><span style="font-size:14px">Húc vào <b>sườn hoặc đuôi</b> trùm · tránh miệng!</span>',2600)}
function bossCast(){const b=boss;let ab=b.ab;if(ab==='all')ab=['charge','ink','bubbles','lure','trail','sonar','whirl','claw','jellies'][rnd(9)];b.cur=ab;
const dx=P.x-b.x,dz=P.z-b.z,d=Math.hypot(dx,dz)||1;
if(ab==='charge'){b.state='wind';b.stT=0.8;b.hd=Math.atan2(dx,dz);ring(b.x,b.z,0xFF3344,b.sz*2,0.3,0.8);snd(80,160,0.8,'sawtooth',0.08);pop('⚠️',b.x,b.sz+2,b.z,'#FF5555',34)}
else if(ab==='ink'){for(let i=0;i<3;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:radT,color:0x0a0014,transparent:true,opacity:0,depthWrite:false}));const x=b.x+rp(-3,3),z=b.z+rp(-3,3);s.position.set(x,1.5,z);S.add(s);inks.push({x,z,r:5+b.sz*0.6,t:6,m:s})}
 const[nx,nz]=around(12,16);b.x=nx;b.z=nz;bubbles(nx,nz,20);if(AC)noise(AC.currentTime,0.6,0.2,400);pop('🦑 Phun mực!',P.x,3,P.z,'#C8A0FF',22)}
else if(ab==='bubbles'){for(let i=0;i<10;i++){const a=Math.atan2(dx,dz)+(i-4.5)*0.22,m=new THREE.Group(),c=ball(0.5,0x7FFFD0,{emissive:0x2ACB9A,emissiveIntensity:1,transparent:true,opacity:0.7});m.add(c);const gl=glowSp(0x7FFFD0,2.5,0.6);m.add(gl);m.position.set(b.x,1.5,b.z);m.scale.setScalar(Math.max(1,sz*0.5));S.add(m);
  shots.push({x:b.x,z:b.z,vx:Math.sin(a)*(9+sz),vz:Math.cos(a)*(9+sz),t:3,m,r:0.5*Math.max(1,sz*0.5)})}snd(400,900,0.3,'sine',0.08)}
else if(ab==='lure'){b.state='lure';b.stT=2.2;snd(300,600,2,'sine',0.05);pop('✨ Mồi nhử!',b.x,b.sz+2,b.z,'#7FFFD0',22)}
else if(ab==='trail'){b.state='trail';b.stT=3.5;b.trT=0}
else if(ab==='sonar'){shocks.push({x:b.x,z:b.z,r:b.sz*0.5,v:16+sz,t:2.2,hit:false});ring(b.x,b.z,0x9FE8FF,b.sz,0.5,0.5);snd(1500,400,0.6,'sine',0.08)}
else if(ab==='whirl'){for(let i=0;i<2;i++){const[x,z]=around(5+sz,10+sz*1.5),m=makeWhirl();m.scale.setScalar(Math.max(1,sz*0.4));m.position.set(x,0,z);S.add(m);whirls.push({x,z,m,t:7,r:8*Math.max(1,sz*0.4)})}pop('🌀 Xoáy nước!',P.x,3,P.z,'#7FDBFF',22)}
else if(ab==='claw'){b.state='claw';b.stT=0.9;b.hd=Math.atan2(dx,dz);const R=b.sz*2.4,m=new THREE.Mesh(new THREE.CircleGeometry(R,24,-0.75,1.5),trapM);m.rotation.x=-Math.PI/2;m.position.set(b.x,0.25,b.z);m.rotation.z=b.hd-Math.PI/2;S.add(m);claws.push({m,x:b.x,z:b.z,hd:b.hd,R,t:0.9});snd(200,100,0.9,'square',0.05)}
else if(ab==='jellies'){for(let i=0;i<5;i++){const a=i/5*6.28,m=makeJelly(),x=P.x+Math.cos(a)*(7+sz),z=P.z+Math.sin(a)*(7+sz);m.position.set(x,1.6,z);m.scale.setScalar(Math.max(1,sz*0.45));S.add(m);jellies.push({x,z,m,ph:rp(0,6),t:12,r:0.9*Math.max(1,sz*0.45),cd:0})}pop('🪼 Bầy sứa!',P.x,3,P.z,'#FF8FE8',22)}}
function hitBoss(dmg,x,z,txt){if(!boss||boss.hitT>0)return;boss.hitT=0.5;boss.hp-=dmg;sRam();shake=Math.max(shake,0.4);burst(x,z,0xFFE36B,14,1.2,boss.sz*0.6);ring(x,z,0xFFE36B,boss.sz*1.5,1,0.5);pop((txt||'💥')+' -'+Math.round(dmg),x,boss.sz+2,z,'#FFE36B',26);
bbF.style.width=Math.max(0,boss.hp/boss.max*100)+'%';if(boss.hp<=0)killBoss()}
function killBoss(){const b=boss;boss=null;clearing=true;st.bosses++;bbW.style.display='none';S.remove(b.g);sEatBig();flash('#FFE36B',0.5);shake=0.8;
for(let i=0;i<70;i++){const a=rp(0,6.28),e=rp(0.2,1.4),v=rp(5,12);part(b.x,b.sz*0.6,b.z,addM(RB[i%6]),new THREE.Vector3(Math.cos(a)*v*Math.sin(e),Math.cos(e)*v,Math.sin(a)*v*Math.sin(e)),rp(1,2),0.8,2)}
bubbles(b.x,b.z,40);ring(b.x,b.z,0xFFE36B,b.sz*4,0.5,1);ring(b.x,b.z,0xffffff,b.sz*3,0.5,0.8);const g=gain(400*zone);pop('👑 HẠ GỤC TRÙM! +'+g,b.x,b.sz+3,b.z,'#FFE36B',28);
for(let k=0;k<6;k++)setTimeout(firework,k*220);growBy(1.12);clearHaz();if(b.fin||zone>=MAXZ){setTimeout(()=>{if(running)victory()},1800);return}setTimeout(()=>{if(running)goNextZone()},1600)}
function clearHaz(){[...shots,...inks,...claws,...jellies,...whirls].forEach(o=>S.remove(o.m));shots=[];inks=[];claws=[];jellies=[];whirls=[];fires.forEach(f=>S.remove(f.m));fires=[];shocks=[]}

// ================= CHUYỂN CẢNH =================
function goNextZone(){trans=true;trE.classList.add('on');sZone();snd(200,60,1.5,'sine',0.1);
setTimeout(()=>{if(!running)return;zone++;clearing=false;lvE.textContent=zone+'/'+MAXZ;setZoneX(zone);npcs.slice().forEach(removeNpc);[...items,...nets,...hooks,...chests,...coins].forEach(o=>S.remove(o.m));items=[];nets=[];hooks=[];chests=[];coins=[];bossWarned=false;clearHaz();
 for(let i=0;i<10;i++)spawnNpc(false);const Z=ZONES[(zone-1)%ZONES.length];
 showLv((zone===MAXZ?'🔥 VÙNG CUỐI 🔥':'Vùng '+zone+'/'+MAXZ)+'<br><span style="font-size:28px">'+Z.n+(zone>10?' 🌙':'')+'</span><br><span style="font-size:14px">Trùm xuất hiện ở '+bossAt(zone)+' điểm'+(Z.dark?'<br>🔦 Tối quá, cẩn thận!':'')+(zone===11?'<br>🌙 Đại dương về đêm: trùm mạnh hơn!':'')+'</span>',2800)},900);
setTimeout(()=>{trE.classList.remove('on');trans=false},1900)}

// ================= TIẾN HOÁ =================
function growBy(k){sz=Math.min(12,sz*k)}
function evolve(){tier++;const f=FORMS[tier],k=SKL[tier];sZone();setTimeout(()=>seq([523,659,784,1047,1319,1568,2093],0.07,55),200);flash('#ffffff',0.6);shake=0.5;inv=Math.max(inv,2);
for(let i=0;i<60;i++){const a=i*0.5,r=sz*(0.6+i*0.03);part(P.x+Math.cos(a)*r,0.5+i*0.06*sz,P.z+Math.sin(a)*r,addM(RB[i%6]),new THREE.Vector3(-Math.sin(a)*3,rp(2,5),Math.cos(a)*3),rp(0.8,1.6)*Math.max(1,sz*0.4),0.9,0)}
for(let i=0;i<4;i++)setTimeout(firework,i*200);ring(P.x,P.z,0xFFE36B,sz*5,0.5,1);ring(P.x,P.z,0xffffff,sz*3,0.5,0.7);setForm(tier);growBy(1.08);evoT=1;renderSkills();
showLv('✨ TIẾN HOÁ! ✨<br><span style="font-size:28px">'+f.n+'</span><br><span style="font-size:15px">Mở kỹ năng '+k.e+' <b>'+k.n+'</b><br>'+k.d+'</span>',3000)}
let evoT=0;

// ================= MẠNG & SÁT THƯƠNG =================
const prot=()=>inv>0||starT>0||rageT>0||puffT>0;
function hurt(src,x,z){if(trans)return false;if(inv>0||starT>0||rageT>0)return false;if(puffT>0){pop('🐡 Gai!',x,2.5,z,'#FFF2C0',20);return false}
if(shieldT>0){shieldT=0;sZap();ring(P.x,P.z,0x6fd8ff,sz*3,1,0.6);burst(P.x,P.z,0x6fd8ff,20,1.2,1+sz*0.4);inv=1.2;pop('🛡️ Vỡ khiên!',P.x,3,P.z,'#9FE8FF',22);return true}
lives--;lfE.textContent='❤️'+Math.max(lives,0);sHurt();flash('#E24B4A',0.45);shake=0.7;hurtT=0.7;combo=0;burst(P.x,P.z,0xFF5A5A,24,1.3,1+sz*0.4);
if(lives<=0){die();return true}pop('-1 ❤️ '+(src||''),P.x,3,P.z,'#ff8080',24);inv=3;blinkT=3;sz=Math.max(1,sz*0.85);
if(x!==undefined){const dx=P.x-x,dz=P.z-z,d=Math.hypot(dx,dz)||1;P.vx=dx/d*vp()*1.6;P.vz=dz/d*vp()*1.6}return true}
function gainLife(txt){lives=Math.min(9,lives+1);lfE.textContent='❤️'+lives;sLife();flash('#FF4F7B',0.3);pop(txt,P.x,3,P.z,'#FF8FB1',24);for(let i=0;i<12;i++)part(P.x,1+sz*0.5,P.z,addM(0xFF4F7B),new THREE.Vector3(rp(-2,2),rp(3,6),rp(-2,2)),1,1,2)}
function eatNpc(n){const g=gain((15*n.sz+8)*Math.min(Math.max(combo,1),6));combo++;comboT=2.5;st.eaten++;chompT=0.25;
sz=Math.min(12,Math.sqrt(sz*sz+n.sz*n.sz*0.1));sBite();sAbsorb(combo);bubbles(n.x,n.z,6);burst(n.x,n.z,skinC(),8,0.7,1+n.sz*0.4);
pop('+'+g+(combo>1?' x'+Math.min(combo,6):''),n.x,2+n.sz,n.z,combo>3?'#FFE36B':'#fff',combo>3?26:20);removeNpc(n)}

// ================= KỸ NĂNG =================
function renderSkills(){skE2.innerHTML='';for(let i=0;i<=tier;i++){const b=document.createElement('button');b.innerHTML=SKL[i].e+'<i></i>';b.title=SKL[i].n;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();useSkill(i)});skE2.appendChild(b)}skS=''}
function makeBolt(x1,z1,x2,z2,y2){const pts=[],n=12;for(let i=0;i<=n;i++){const t=i/n,j=i&&i<n;pts.push(new THREE.Vector3(x1+(x2-x1)*t+(j?rp(-1,1):0),1.5+(1-Math.abs(t-0.5)*2)*4+(y2||1)*t+(j?rp(-0.7,0.7):0),z1+(z2-z1)*t+(j?rp(-1,1):0)))}
const m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xE0FFFF,transparent:true,blending:THREE.AdditiveBlending}));S.add(m);bolts.push({m,t:0.35})}
function streak(x,y,z,hd,c){part(x,y,z,addM(c),new THREE.Vector3(0,0,0),1,2.5,0,streakG);parts[parts.length-1].rotation.y=hd}
const streakG=new THREE.BoxGeometry(0.06,0.06,1.6);
function useSkill(i){if(!running||paused||trans||i>tier||skCD[i]>0)return;const k=SKL[i],R0=10+sz*1.5;
if(k.id==='bolt'){const tg=[];if(boss&&Math.hypot(boss.x-P.x,boss.z-P.z)<R0*2.5)tg.push(boss);npcs.filter(n=>n.sz>=sz*0.85&&Math.hypot(n.x-P.x,n.z-P.z)<R0*2).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,3).forEach(n=>tg.push(n));
 if(!tg.length){pop('Không có mục tiêu gần',P.x,2.5,P.z,'#FFB0B0',18);return}
 tg.forEach(t=>{for(let j=0;j<3;j++)makeBolt(P.x,P.z,t.x,t.z,t.sz*0.5);burst(t.x,t.z,0xCFF6FF,16,1.2,1+t.sz*0.4);ring(t.x,t.z,0xCFF6FF,t.sz*2.5,0.6,0.4);
  if(t===boss){boss.hitT=0;hitBoss(20+tier*4,t.x,t.z,'🔱');if(boss)boss.daze=Math.max(boss.daze,1)}else{t.sz*=0.6;t.g.scale.setScalar(t.sz);t.stun=2;pop('🔱 Thu nhỏ!',t.x,2+t.sz,t.z,'#CFF6FF',20)}});
 sZap();setTimeout(sZap,80);setTimeout(sZap,160);snd(80,30,0.5,'sawtooth',0.12);flash('#CFF6FF',0.35);shake=0.4}
skCD[i]=k.cd;
if(k.id==='dash'){dashT=0.75;inv=Math.max(inv,0.4);const a=P.hd;P.vx=Math.sin(a)*vp()*2.6;P.vz=Math.cos(a)*vp()*2.6;snd(200,1400,0.3,'triangle',0.09);if(AC)noise(AC.currentTime,0.3,0.1,2000);ring(P.x,P.z,0x7FFFFF,sz*2.5,0.4,0.4);
 for(let j=0;j<12;j++)part(P.x+rp(-1,1)*sz*0.5,0.2,P.z+rp(-1,1)*sz*0.5,addM(0xE8D8B0),new THREE.Vector3(rp(-2,2),rp(1,3),rp(-2,2)),rp(0.8,1.5)*Math.max(1,sz*0.4),1.2,3)}
else if(k.id==='bubble'){const R=R0*1.3;npcs.forEach(n=>{if(Math.hypot(n.x-P.x,n.z-P.z)<R+n.sz)n.stun=3});if(boss&&Math.hypot(boss.x-P.x,boss.z-P.z)<R+boss.sz){boss.daze=Math.max(boss.daze,2.5);boss.state='chase';pop('😵 Trùm choáng!',boss.x,boss.sz+2,boss.z,'#CFF6FF',22)}
 for(let j=0;j<50;j++){const a=rp(0,6.28),r=rp(1,R);bubbles(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,1)}for(let r=3;r<=R;r+=4)setTimeout(()=>ring(P.x,P.z,0xCFF6FF,r*2,0.6,0.6),r*20);snd(600,200,0.5,'sine',0.1);seq([1200,1500,1800],0.05,50);pop('🫧 BOM BONG BÓNG!',P.x,3,P.z,'#CFF6FF',24)}
else if(k.id==='puff'){puffT=3;snd(200,700,0.4,'triangle',0.1);ring(P.x,P.z,0xFFF2C0,sz*3,1,0.5);pop('🐡 PHỒNG GAI!',P.x,3,P.z,'#FFF2C0',24);
 npcs.forEach(n=>{const dx=n.x-P.x,dz=n.z-P.z,d=Math.hypot(dx,dz)||1;if(d<sz*2.5&&n.sz>sz*eatK()){n.x+=dx/d*4;n.z+=dz/d*4;n.stun=1.5}})}
else if(k.id==='vortex'){vortexT=3;snd(300,900,0.8,'sine',0.08);snd(150,450,1.2,'sawtooth',0.04);pop('🌀 LỐC HÚT!',P.x,3,P.z,'#7FDBFF',24)}
else if(k.id==='wave'){const R=R0*1.6;npcs.forEach(n=>{const dx=n.x-P.x,dz=n.z-P.z,d=Math.hypot(dx,dz)||1;if(d<R&&n.sz>sz*eatK()){n.x=P.x+dx/d*(R+3);n.z=P.z+dz/d*(R+3);n.stun=2}});
 if(boss&&Math.hypot(boss.x-P.x,boss.z-P.z)<R+boss.sz){const dx=boss.x-P.x,dz=boss.z-P.z,d=Math.hypot(dx,dz)||1;boss.x+=dx/d*8;boss.z+=dz/d*8;boss.state='chase';boss.hitT=0;hitBoss(10+tier*2,boss.x,boss.z,'🌊')}
 nets.forEach(n=>{if(Math.hypot(n.x-P.x,n.z-P.z)<R+8){n.hit=true;n.t=Math.min(n.t,1)}});jellies.forEach(j=>{if(Math.hypot(j.x-P.x,j.z-P.z)<R){burst(j.x,j.z,0xFF6FD8,8);j.t=0}});shots.forEach(s=>s.t=0);inks.forEach(s=>s.t=Math.min(s.t,0.5));fires.forEach(f=>f.t=Math.min(f.t,0.3));
 for(let r=4;r<=R;r+=4)setTimeout(()=>ring(P.x,P.z,0x5CC8FF,r*2,0.5,0.7),r*15);for(let j=0;j<40;j++){const a=j/40*6.28;part(P.x,0.5,P.z,addM(0xBFEFFF),new THREE.Vector3(Math.cos(a)*R,rp(1,3),Math.sin(a)*R),rp(1,1.8)*Math.max(1,sz*0.3),1.3,1)}
 if(AC)noise(AC.currentTime,0.9,0.3,200);snd(150,60,0.8,'sine',0.15);shake=0.6;flash('#5CC8FF',0.3);pop('🌊 SÓNG THẦN!',P.x,3,P.z,'#5CC8FF',26)}
else if(k.id==='decoy'){if(decoy){S.remove(decoy.m)}const m=FORMS[tier].b();normalize(m,1.2);m.scale.setScalar(m.userData.k);const gm=new THREE.MeshBasicMaterial({color:0x9FE8FF,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false});
 m.traverse(o=>{if(o.isMesh)o.material=gm});const g=new THREE.Group();g.add(m);g.add(glowSp(0x9FE8FF,3,0.5));g.scale.setScalar(sz*pLen/1.2);const hd=P.hd+Math.PI*rp(0.7,1.3),x=P.x,z=P.z;g.position.set(x,1+sz*0.45,z);S.add(g);
 decoy={x,z,t:6,m:g,hd,gm};snd(800,400,0.4,'sine',0.07);pop('👥 ẢO ẢNH!',x,3,z,'#9FE8FF',22);for(let j=0;j<20;j++)part(x,1,z,addM(0x9FE8FF),new THREE.Vector3(rp(-3,3),rp(1,4),rp(-3,3)),1,1.2,1)}
else if(k.id==='rage'){rageT=8;snd(60,200,0.8,'sawtooth',0.14);setTimeout(()=>snd(90,300,0.6,'sawtooth',0.1),300);flash('#FF5A3A',0.5);shake=0.8;ring(P.x,P.z,0xFF5A3A,sz*5,0.5,0.8);ring(P.x,P.z,0xFFE36B,sz*3.5,0.5,0.6);
 showLv('🐲 CUỒNG LONG! 🐲<br><span style="font-size:15px">8 giây bất tử · nuốt mọi thứ</span>',1600)}}

// ================= VẬT PHẨM & BẪY =================
PW.pearl={c:0xFFFFFF,e:'🦪',n:'Ngọc trai!'};delete PW.food;
PW.pearl.tex=canvasTex(128,128,g=>{g.font='86px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('🦪',64,70)});PW.pearl.om=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.3,depthWrite:false});
POOL.length=0;POOL.push('shield','magnet','star','double','slow','pearl','pearl','shield','double','heart','magnet');
function spawnItem(){const k=POOL[rnd(POOL.length)],m=makePower(k);const[x,z]=around(8+sz,14+sz*2,true);const s=Math.max(1,sz*0.45);m.scale.setScalar(s);m.position.set(x,1.4*s,z);S.add(m);items.push({x,z,k,m,t:18,s})}
function takeItem(it){const p=PW[it.k];sPower();flash(HEX(p.c),0.25);ring(it.x,it.z,p.c,it.s*5,0.5,0.6);burst(it.x,it.z,p.c,16,1,it.s*1.4);pop(p.e+' '+p.n,it.x,3+sz,it.z,HEX(p.c),22);
if(it.k==='shield')shieldT=12;else if(it.k==='magnet')magT=8;else if(it.k==='star')starT=6;else if(it.k==='double')dblT=12;else if(it.k==='slow')slowT=7;else if(it.k==='heart')gainLife('+1 ❤️');else if(it.k==='pearl'){const g=gain(100*zone);pop('+'+g,it.x,2+sz,it.z,'#fff',22);for(let i=0;i<20;i++)part(it.x,1,it.z,addM(i%2?0xffffff:0xFFE9F0),new THREE.Vector3(rp(-3,3),rp(2,6),rp(-3,3)),1,1,2)}}
function spawnJellies(){const[cx,cz]=around(12+sz,18+sz*2,true),k=Math.max(1,sz*0.45);for(let i=0;i<4;i++){const m=makeJelly(),x=cx+rp(-5,5)*k,z=cz+rp(-5,5)*k;m.position.set(x,1.6*k,z);m.scale.setScalar(rp(0.9,1.2)*k);S.add(m);jellies.push({x,z,m,ph:rp(0,6),t:28,r:0.9*k,cd:0})}}
function spawnNet(){const a=P.hd+(Math.random()<0.5?1:-1)*Math.PI/2,k=Math.max(1,sz*0.4),d=22*k,m=makeNet();m.scale.setScalar(k);const x=P.x+Math.sin(a)*d+Math.sin(P.hd)*10*k,z=P.z+Math.cos(a)*d+Math.cos(P.hd)*10*k;m.position.set(x,0,z);m.rotation.y=a;S.add(m);
nets.push({x,z,vx:-Math.sin(a)*4.5*k,vz:-Math.cos(a)*4.5*k,a,m,t:12,k,hit:false});pop('🕸️ Lưới!',P.x,3,P.z,'#FFD0A0',20)}
function spawnWhirl(){const[x,z]=around(14+sz,20+sz*2,true),m=makeWhirl(),k=Math.max(1,sz*0.4);m.scale.setScalar(k);m.position.set(x,0,z);S.add(m);whirls.push({x,z,m,t:18,r:8*k})}
function makeHook(){const g=new THREE.Group(),ln=cyl(0.02,0.02,40,0xDDDDDD,{transparent:true,opacity:0.6});ln.position.y=21;g.add(ln);const h=new THREE.Mesh(new THREE.TorusGeometry(0.25,0.05,6,12,Math.PI*1.4),mat(0xC0C8D0,{metalness:0.8,roughness:0.2}));h.position.y=0.9;g.add(h);
const w=new THREE.Group();for(let i=0;i<4;i++){const s=ball(0.13,0xFF5A8A);s.position.set(Math.sin(i)*0.08,0.6-i*0.13,0);w.add(s)}g.add(w);g.worm=w;const gl=glowSp(0xFF8AB0,1.6,0.5);gl.position.y=0.4;g.add(gl);return g}
function spawnHook(){const[x,z]=around(8+sz,14+sz*1.5,true),m=makeHook(),k=Math.max(1,sz*0.5);m.scale.setScalar(k);m.position.set(x,1.2*k,z);S.add(m);hooks.push({x,z,m,t:14,k,y:30,ph:rp(0,6)})}

// ================= BẮT ĐẦU / KẾT THÚC =================
function clearAll(){npcs.slice().forEach(removeNpc);[...chests,...coins].forEach(o=>S.remove(o.m));chests=[];coins=[];whaleS=null;whale.visible=false;whaleSh.visible=false;if(boss){S.remove(boss.g);boss=null}[...items,...nets,...hooks].forEach(o=>S.remove(o.m));items=[];nets=[];hooks=[];clearHaz();bolts.forEach(b=>S.remove(b.m));bolts=[];if(decoy){S.remove(decoy.m);decoy=null}
parts.forEach(p=>S.remove(p));parts.length=0;fx.forEach(f=>S.remove(f.m));fx.length=0;wrap.querySelectorAll('.pp').forEach(d=>d.remove());bbW.style.display='none'}
function reset(){clearAll();clearing=false;bossWarned=false;chestT=18;coinT=4;whaleT=15;vgT=0;dashT=puffT=vortexT=rageT=shieldT=magT=starT=dblT=slowT=inkSlow=0;tier=0;sz=1;skCD=SKL.map(()=>0);setForm(0);renderSkills();
P.x=0;P.z=0;P.vx=0;P.vz=0;P.hd=Math.PI;score=0;zone=1;lives=3;inv=2;nextLife=3000;combo=0;startBest=best;annBest=false;trans=false;camH=12;
st={eaten:0,bosses:0};spawnT=0;itemT=7;jellyT=16;netTm=24;whirlT=28;hookT=12;sc.textContent=0;lvE.textContent='1/'+MAXZ;lfE.textContent='❤️3';pwE.innerHTML='';hudS='';setZoneX(1);for(let i=0;i<12;i++)spawnNpc(false)}
function start(){unlockAudio();reset();paused=false;ov.style.display='none';psB.style.display='block';skE2.style.display='flex';running=true;
showLv('Vùng 1<br><span style="font-size:28px">'+ZONES[0].n+'</span><br><span style="font-size:14px">Ăn cá vòng <b style="color:#8BFFB0">XANH</b> · né cá vòng <b style="color:#FF7A7A">ĐỎ</b></span>',2600)}
function saveBest(){try{localStorage.setItem('fishBest3',best)}catch(e){}}
function die(){running=false;lvB.style.opacity=0;sDie();saveBest();skE2.style.display='none';bbW.style.display='none';
const nb=score>startBest&&score>0,un=SKINS.filter(k=>k.need>startBest&&k.need<=best).map(k=>k.n);
msg.innerHTML=(nb?'🎉 KỶ LỤC MỚI! 🎉':'Chuyến phiêu lưu kết thúc!')+'<br><b style="font-size:32px">'+score+'</b> điểm · tới '+ZONES[(zone-1)%ZONES.length].n+'<br><small>🧬 Tiến hoá: '+FORMS[tier].n+'<br>🐟 Đã ăn: '+st.eaten+' cá · 👑 Hạ trùm: '+st.bosses+(un.length?'<br>🎨 Mở khoá màu: '+un.join(', '):'')+'</small>';
if(nb)for(let i=0;i<3;i++)setTimeout(firework,i*250);renderSkins();skE.style.display='flex';psB.style.display='none';stB.textContent='Chơi lại';ov.style.display='flex'}
function pause(){if(!running||paused)return;paused=true;msg.innerHTML='Tạm dừng ⏸';skE.style.display='none';stB.textContent='Tiếp tục';ov.style.display='flex';psB.style.display='none'}
function resume(){paused=false;ov.style.display='none';psB.style.display='block';last=performance.now()}

// ================= ĐIỀU KHIỂN =================
stB.onclick=e=>{e.stopPropagation();if(paused)resume();else start()};
psB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
const keys={};document.addEventListener('keydown',e=>{keys[e.key]=1;const si='12345678'.indexOf(e.key);if(si>=0)useSkill(si);if(e.key===' '){e.preventDefault();useSkill(0)}if(e.key.startsWith('Arrow'))e.preventDefault()});document.addEventListener('keyup',e=>{keys[e.key]=0});

// ================= ĐẠI DƯƠNG VỀ ĐÊM (vùng 11-20) =================
const dk=(h,k)=>'#'+new THREE.Color(h).multiplyScalar(k).getHexString();
function setZoneX(z){setZone(z);if(z<=10)return;const Z=curZ;if(!Z.nskyT)Z.nskyT=skyTex(dk(Z.sky[0],0.35),dk(Z.sky[1],0.4));S.background=Z.nskyT;
if(Z.dark)return;S.fog.color.multiplyScalar(0.6);hemi.intensity*=0.75;sun.intensity*=0.55;lamp.intensity=Math.max(lamp.intensity,1.8);causM.opacity*=0.6}
// ================= PHÁ ĐẢO =================
function victory(){running=false;won=true;try{localStorage.setItem('fishWin','1')}catch(e){}saveBest();skE2.style.display='none';bbW.style.display='none';lvB.style.opacity=0;
seq([523,659,784,1047,784,1047,1319,1568,2093],0.09,110);for(let i=0;i<18;i++)setTimeout(firework,i*260);flash('#FFE36B',0.6);
showLv('🏆 PHÁ ĐẢO! 🏆<br><span style="font-size:20px">Chúa tể đại dương!</span>',3200);
setTimeout(()=>{const nb=score>startBest;msg.innerHTML='🏆 <b style="font-size:24px">PHÁ ĐẢO ĐẠI DƯƠNG!</b> 🏆<br>Bạn đã chinh phục cả 20 vùng biển<br><b style="font-size:32px">'+score+'</b> điểm'+(nb?' · 🎉 Kỷ lục mới!':'')+
'<br><small>🧬 '+FORMS[tier].n+' · ❤️ còn '+lives+'<br>🐟 Đã ăn: '+st.eaten+' cá · 👑 Hạ trùm: '+st.bosses+' · 💰 Rương: '+(st.chests||0)+'<br>🎨 Đã mở màu hào quang <b>👑 Hoàng kim</b></small>';
renderSkins();skE.style.display='flex';psB.style.display='none';stB.textContent='Chơi lại';ov.style.display='flex'},3600)}

let jId=null,jx=0,jy=0;
wrap.addEventListener('touchstart',e=>{if(e.target.closest('button')||!running||paused)return;const t=e.changedTouches[0];jId=t.identifier;const r=wrap.getBoundingClientRect();jx=t.clientX;jy=t.clientY;joy.style.left=(jx-r.left)+'px';joy.style.top=(jy-r.top)+'px';joy.style.display='block';knob.style.transform='translate(0,0)';joyV.x=joyV.y=0},{passive:true});
document.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===jId){let dx=t.clientX-jx,dy=t.clientY-jy;const d=Math.hypot(dx,dy),m=50;if(d>m){dx*=m/d;dy*=m/d}knob.style.transform='translate('+dx+'px,'+dy+'px)';joyV.x=dx/m;joyV.y=dy/m}},{passive:false});
document.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===jId){jId=null;joy.style.display='none';joyV.x=joyV.y=0}});
let mDown=false;wrap.addEventListener('mousedown',e=>{if(e.target.closest('button')||!running)return;mDown=true;jx=e.clientX;jy=e.clientY});document.addEventListener('mousemove',e=>{if(!mDown)return;let dx=e.clientX-jx,dy=e.clientY-jy;const d=Math.hypot(dx,dy),m=50;if(d>m){dx*=m/d;dy*=m/d}joyV.x=dx/m;joyV.y=dy/m});document.addEventListener('mouseup',()=>{mDown=false;joyV.x=joyV.y=0});


// ================= KHỞI TẠO SINH VẬT NỀN =================
{const AC3=[[0xBFD8E8,0x8FB8D0],[0xFFE14D,0xFFC21E],[0xFF9FD0,0xFF6FA8]];for(let i=0;i<AMB;i++){const s=Math.floor(i/30);ambIM.setColorAt(i,tmpC.setHex(AC3[s][i%2]))}ambIM.instanceColor.needsUpdate=true}
pGlow.material=pGlow.material.clone();
reset();running=false;renderSkins();skE2.style.display='none';

// ================= VÒNG LẶP =================
let last=performance.now(),camX=0,camZ=0,ventT=1;
const wrapA=a=>Math.atan2(Math.sin(a),Math.cos(a));
function loop(now){const dt=Math.min((now-last)/1000,0.05);last=now;T+=dt;const act=running&&!paused;lbUsed=0;
const es=slowT>0?0.45:1,V=vp(),K=Math.max(1,sz*0.45);
if(act){
// ---- Di chuyển ----
keyV.x=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0);keyV.y=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);
let ix=joyV.x+keyV.x,iz=joyV.y+keyV.y;const im=Math.min(1,Math.hypot(ix,iz));
const vmax=V*(starT>0?1.25:1)*(rageT>0?1.2:1)*(inkSlow>0?0.5:1)*(stunP>0?0.35:1);
if(dashT>0){dashT-=dt;let a=P.hd;if(im>0.05){const ta=Math.atan2(ix,iz);a=P.hd+wrapA(ta-P.hd)*Math.min(1,dt*5)}P.vx+=(Math.sin(a)*V*2.6-P.vx)*Math.min(1,dt*8);P.vz+=(Math.cos(a)*V*2.6-P.vz)*Math.min(1,dt*8)}
else if(im>0.05){const d=Math.hypot(ix,iz);P.vx+=(ix/d*vmax*im-P.vx)*Math.min(1,dt*4);P.vz+=(iz/d*vmax*im-P.vz)*Math.min(1,dt*4)}else{P.vx*=1-Math.min(1,dt*1.6);P.vz*=1-Math.min(1,dt*1.6)}
whirls.forEach(w=>{const dx=w.x-P.x,dz=w.z-P.z,d=Math.hypot(dx,dz);if(d<w.r&&d>0.3&&rageT<=0){P.vx+=dx/d*dt*V*1.6+dz/d*dt*V*0.8;P.vz+=dz/d*dt*V*1.6-dx/d*dt*V*0.8}});
if(boss&&boss.state==='lure'&&boss.daze<=0){const dx=boss.x-P.x,dz=boss.z-P.z,d=Math.hypot(dx,dz)||1;P.vx+=dx/d*dt*V*1.7;P.vz+=dz/d*dt*V*1.7;if(Math.random()<0.5)part(P.x+rp(-1,1),1+sz*0.4,P.z+rp(-1,1),addM(0x7FFFD0),new THREE.Vector3(dx/d*8,0,dz/d*8),0.8,1.2,0)}
P.x+=P.vx*dt;P.z+=P.vz*dt;const sp=Math.hypot(P.vx,P.vz);
if(sp>0.4){const th=Math.atan2(P.vx,P.vz),da=wrapA(th-P.hd),r=da*Math.min(1,dt*7);P.hd+=r;P.turn+=((r/dt)-P.turn)*Math.min(1,dt*6)}else P.turn*=0.9;
// ---- Bộ đếm ----
for(let k=0;k<skCD.length;k++)if(skCD[k]>0)skCD[k]-=dt;
if(puffT>0)puffT-=dt;if(vortexT>0)vortexT-=dt;if(rageT>0){rageT-=dt;if(rageT<=0)pop('Hết cuồng long',P.x,3,P.z,'#FFB0B0',18)}
if(shieldT>0)shieldT-=dt;if(magT>0)magT-=dt;if(starT>0)starT-=dt;if(dblT>0)dblT-=dt;if(slowT>0)slowT-=dt;if(inkSlow>0)inkSlow-=dt;
if(inv>0)inv-=dt;if(hurtT>0)hurtT-=dt;if(chompT>0)chompT-=dt;if(stunP>0)stunP-=dt;if(evoT>0)evoT-=dt;if(blinkT>0)blinkT-=dt;if(comboT>0){comboT-=dt;if(comboT<=0)combo=0}
while(score>=nextLife){nextLife+=3000;gainLife('🎁 +1 ❤️')}
if(tier<FORMS.length-1&&score>=TIERS[tier+1])evolve();
if(!boss&&!trans&&!clearing&&score>=bossAt(zone))spawnBoss();
if(score>best){best=score;bs.textContent=best;if(!annBest&&startBest>0){annBest=true;pop('🏆 KỶ LỤC MỚI!',P.x,4,P.z,'#FFE36B',26);seq([784,988,1175,1568],0.06,60)}}
// ---- Sinh ----
const nT=19+Math.min(zone,8)-(boss?6:0);spawnT-=dt;if(!trans&&npcs.length<nT&&spawnT<=0){spawnNpc(true);spawnT=0.35}
if(!trans){itemT-=dt;if(itemT<=0){spawnItem();itemT=rp(8,12)}
hookT-=dt;if(hookT<=0){spawnHook();hookT=rp(13,19)}
if(zone>=2){jellyT-=dt;if(jellyT<=0){spawnJellies();jellyT=rp(15,21)}}
if(zone>=3&&!boss){netTm-=dt;if(netTm<=0){spawnNet();netTm=rp(20,28)}}
if(zone>=4){whirlT-=dt;if(whirlT<=0){spawnWhirl();whirlT=rp(22,30)}}}
// ---- Cá NPC ----
const R0=10+sz*1.5,ek=eatK();
for(let i=npcs.length-1;i>=0;i--){const n=npcs[i];if(!n)continue;n.t+=dt;let dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz)||0.01;
 if(d>camH*1.8+14){removeNpc(n);continue}
 const edible=n.sz<sz*ek,danger=!edible&&n.sz>sz*1.15;n.rg.material=edible?RM.ok:danger?RM.bad:RM.eq;
 let th=n.hd,spd=0;
 n.ch=false;if(n.stun>0){n.stun-=dt;n.g.rotation.z=Math.sin(T*12)*0.4;if(Math.random()<dt*4)part(n.x+rp(-0.5,0.5)*n.sz,1+n.sz,n.z,addM(0xFFE14D),new THREE.Vector3(0,1.5,0),0.7,1.5,0)}
 else{n.g.rotation.z*=0.9;
  if(vortexT>0&&edible&&d<R0*1.7){th=Math.atan2(dx,dz)+0.6;spd=V*2.2;n.x+=dx/d*V*2*dt;n.z+=dz/d*V*2*dt}
  else if(edible&&n.shy&&d<4+sz*1.6){th=Math.atan2(-dx,-dz);spd=V*0.55}
  else if(danger&&rageT<=0){const tg=decoy||P,tx=tg.x-n.x,tz=tg.z-n.z;if(Math.hypot(tx,tz)<9+n.sz*2.5){th=Math.atan2(tx,tz);spd=V*0.78;n.ch=true}}
  if(!spd){n.turnT-=dt;if(n.turnT<=0){n.wh=rp(0,6.28);n.turnT=rp(2,4)}th=n.wh===undefined?n.hd:n.wh;spd=V*0.3}
  if(magT>0&&edible&&d<14+sz*2){n.x+=dx/d*V*1.5*dt;n.z+=dz/d*V*1.5*dt}
  n.hd+=wrapA(th-n.hd)*Math.min(1,dt*3);n.sp+=(spd-n.sp)*Math.min(1,dt*2.5);n.x+=Math.sin(n.hd)*n.sp*dt*es;n.z+=Math.cos(n.hd)*n.sp*dt*es}
 dx=P.x-n.x;dz=P.z-n.z;d=Math.hypot(dx,dz)||0.01;const rr=pR()+n.sz*0.45;
 if(d<rr&&!trans){if(edible){eatNpc(n);continue}
  if(danger){if(puffT>0||starT>0||inv>0){if(puffT>0||starT>0){n.stun=2;burst(n.x,n.z,0xFFF2C0,8,0.8,1+n.sz*0.4)}n.x-=dx/d*3;n.z-=dz/d*3}
   else{n.biteT=0.4;hurt('🦈',n.x,n.z);n.x-=dx/d*4;n.z-=dz/d*4}}
  else{const push=(rr-d)*0.5;n.x-=dx/d*push;n.z-=dz/d*push;P.x+=dx/d*push;P.z+=dz/d*push}}
 n.g.position.set(n.x,0.9+n.sz*0.45+Math.sin(n.t*2)*0.08*n.sz,n.z);n.g.rotation.y=n.hd;n.m.rotation.y=Math.sin(n.t*(4+n.sp*0.5))*0.1;animFish(n.m,n.t,n.sp,1);
 n.rg.position.set(n.x,0.12,n.z);n.rg.scale.setScalar(n.sz*0.75);n.rg.visible=d<camH*1.6}
// ---- Trùm ----
if(boss){const b=boss;b.t+=dt;if(b.hitT>0)b.hitT-=dt;const tg=decoy||P;let dx=tg.x-b.x,dz=tg.z-b.z;let spd=0;
 if(b.daze>0){b.daze-=dt;b.g.rotation.z=Math.sin(T*8)*0.25;if(Math.random()<dt*6){const a=T*6;part(b.x+Math.cos(a)*b.sz*0.6,b.sz*1.3,b.z+Math.sin(a)*b.sz*0.6,addM(0xFFE14D),new THREE.Vector3(0,0.5,0),1.2*K,1.5,0)}}
 else{b.g.rotation.z*=0.9;
  if(b.state==='chase'){b.hd+=wrapA(Math.atan2(dx,dz)-b.hd)*Math.min(1,dt*2);spd=V*0.56;if(!trans){b.abT-=dt;if(b.abT<=0){b.abT=Math.max(2.6,rp(4,5.5)-Math.min(zone,8)*0.18);bossCast()}}}
  else if(b.state==='wind'){b.stT-=dt;b.hd+=wrapA(Math.atan2(P.x-b.x,P.z-b.z)-b.hd)*Math.min(1,dt*4);b.g.position.x+=(Math.random()-0.5)*0.3;if(b.stT<=0){b.state='dash';b.stT=1.1;snd(100,40,0.5,'sawtooth',0.12)}}
  else if(b.state==='dash'){b.stT-=dt;spd=V*2.6;if(Math.random()<0.7)streak(b.x+rp(-1,1)*b.sz*0.4,1+b.sz*0.4,b.z+rp(-1,1)*b.sz*0.4,b.hd,0xFF8A8A);if(b.stT<=0){b.state='chase';b.daze=2;pop('😵 Choáng!',b.x,b.sz+2,b.z,'#FFE36B',22)}}
  else if(b.state==='lure'){b.stT-=dt;spd=V*0.15;if(b.stT<=0)b.state='chase'}
  else if(b.state==='trail'){b.stT-=dt;b.hd+=wrapA(Math.atan2(dx,dz)-b.hd)*Math.min(1,dt*2);spd=V*0.85;b.trT-=dt;if(b.trT<=0){b.trT=0.22;const m=glowSp(0xFF5A00,b.sz*1.4,0.7),x=b.x-Math.sin(b.hd)*b.sz*0.6,z=b.z-Math.cos(b.hd)*b.sz*0.6;m.position.set(x,0.4,z);S.add(m);fires.push({x,z,r:b.sz*0.45,t:4,m})}if(b.stT<=0)b.state='chase'}
  else if(b.state==='claw'){b.stT-=dt;if(b.stT<=0)b.state='chase'}
  b.x+=Math.sin(b.hd)*spd*dt*es;b.z+=Math.cos(b.hd)*spd*dt*es}
 const px=P.x-b.x,pz=P.z-b.z,pd=Math.hypot(px,pz)||0.01,rr=pR()+b.sz*0.5;
 if(pd<rr&&!trans){const front=Math.cos(Math.atan2(px,pz)-b.hd)>0.55;const dmg=(8+tier*3)*(dashT>0?2:1)*(rageT>0?2:1)*(b.daze>0?1.5:1);
  if(b.daze>0||!front||rageT>0||starT>0||puffT>0){if(b.hitT<=0)hitBoss(dmg*(puffT>0&&front?0.6:1),b.x+px/pd*b.sz*0.5,b.z+pz/pd*b.sz*0.5,!front?'💥 Húc sườn!':'💥')}
  else hurt('👑',b.x,b.z);
  if(boss){P.vx=px/pd*V*1.5;P.vz=pz/pd*V*1.5;P.x=b.x+px/pd*rr;P.z=b.z+pz/pd*rr;if(b.state==='dash'){b.state='chase';b.daze=Math.max(b.daze,1.2)}}}
 if(boss){b.g.position.set(b.x,0.9+b.sz*0.45+Math.sin(b.t*1.5)*0.1*b.sz,b.z);b.g.rotation.y=b.hd;animFish(b.m,b.t,spd,1.3);if(b.m.aura)b.m.aura.rotation.z+=dt;
  if(Math.random()<dt*3)bubbles(b.x,b.z,1);if(b.state==='wind'&&Math.random()<0.5)part(b.x+rp(-1,1)*b.sz,0.3,b.z+rp(-1,1)*b.sz,addM(0xFF3344),new THREE.Vector3(0,3,0),K,1.5,0)}}
// ---- Đòn của trùm ----
for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.t-=dt;s.x+=s.vx*dt*es;s.z+=s.vz*dt*es;s.m.position.set(s.x,1.5*K,s.z);s.m.rotation.y+=dt*3;
 if(Math.hypot(s.x-P.x,s.z-P.z)<pR()+s.r&&!trans){hurt('🫧',s.x,s.z);s.t=0;bubbles(s.x,s.z,8)}if(s.t<=0){S.remove(s.m);shots.splice(i,1)}}
for(let i=inks.length-1;i>=0;i--){const s=inks[i];s.t-=dt;const op=Math.min(0.88,Math.min((6-s.t)*2,s.t));s.m.material.opacity=Math.max(0,op);s.m.scale.setScalar(s.r*2.4*(1+Math.sin(T+i)*0.05));
 if(Math.hypot(s.x-P.x,s.z-P.z)<s.r&&rageT<=0)inkSlow=0.25;if(s.t<=0){S.remove(s.m);s.m.material.dispose();inks.splice(i,1)}}
for(let i=fires.length-1;i>=0;i--){const f=fires[i];f.t-=dt;f.m.material.opacity=0.7*Math.min(1,f.t);f.m.scale.setScalar(f.r*3*(1+Math.sin(T*10+i)*0.12));if(Math.random()<dt*4)part(f.x+rp(-1,1)*f.r,0.3,f.z+rp(-1,1)*f.r,addM(Math.random()<0.5?0xFF7A1A:0xFFD23F),new THREE.Vector3(0,rp(2,4),0),rp(0.5,1)*K,1.2,-0.5);
 if(Math.hypot(f.x-P.x,f.z-P.z)<f.r+pR()*0.5&&!trans)hurt('🔥',f.x,f.z);if(f.t<=0){S.remove(f.m);fires.splice(i,1)}}
for(let i=shocks.length-1;i>=0;i--){const s=shocks[i];s.t-=dt;s.r+=s.v*dt;if(!s.m){s.m=new THREE.Mesh(new THREE.RingGeometry(0.92,1,64),new THREE.MeshBasicMaterial({color:0x9FE8FF,transparent:true,opacity:0.8,side:THREE.DoubleSide,depthWrite:false}));s.m.rotation.x=-Math.PI/2;S.add(s.m)}
 s.m.position.set(s.x,0.6,s.z);s.m.scale.setScalar(s.r);s.m.material.opacity=0.8*Math.min(1,s.t);const pd=Math.hypot(P.x-s.x,P.z-s.z);
 if(!s.hit&&Math.abs(pd-s.r)<pR()+0.6&&dashT<=0&&!trans){s.hit=true;hurt('🔊',s.x,s.z)}if(s.t<=0){S.remove(s.m);s.m.geometry.dispose();shocks.splice(i,1)}}
for(let i=claws.length-1;i>=0;i--){const c=claws[i];c.t-=dt;trapM.opacity=0.2+Math.abs(Math.sin(T*14))*0.3;if(boss){c.m.position.set(boss.x,0.25,boss.z);c.x=boss.x;c.z=boss.z}
 if(c.t<=0){const dx=P.x-c.x,dz=P.z-c.z,d=Math.hypot(dx,dz);if(d<c.R+pR()&&Math.abs(wrapA(Math.atan2(dx,dz)-c.hd))<0.8&&!trans)hurt('🦀',c.x,c.z);
  for(let j=0;j<20;j++){const a=c.hd+rp(-0.75,0.75),r=rp(0.3,1)*c.R;part(c.x+Math.sin(a)*r,0.5,c.z+Math.cos(a)*r,addM(0xFF5A3A),new THREE.Vector3(0,rp(2,5),0),K,1.4,2)}sRam();shake=Math.max(shake,0.4);S.remove(c.m);c.m.geometry.dispose();claws.splice(i,1)}}
// ---- Bẫy ----
for(let i=whirls.length-1;i>=0;i--){const w=whirls[i];w.t-=dt;w.m.disc.rotation.z+=dt*3;w.m.disc.material.opacity=0.55*Math.min(1,w.t,(20-w.t));if(Math.random()<dt*8){const a=rp(0,6.28),r=w.r*rp(0.5,1);part(w.x+Math.cos(a)*r,0.6,w.z+Math.sin(a)*r,addM(0xCFF6FF),new THREE.Vector3(-Math.cos(a)*4-Math.sin(a)*4,0.5,-Math.sin(a)*4+Math.cos(a)*4),0.6*K,1.2,0,bubG)}
 if(w.t<=0){S.remove(w.m);whirls.splice(i,1)}}
for(let i=jellies.length-1;i>=0;i--){const j=jellies[i];j.t-=dt;j.ph+=dt;if(j.cd>0)j.cd-=dt;j.m.position.set(j.x,(1.6+Math.sin(j.ph*1.5)*0.4)*K,j.z);j.m.dome.scale.y=1+Math.sin(j.ph*3)*0.2;j.x+=Math.sin(j.ph*0.4)*dt*0.6;
 if(Math.hypot(j.x-P.x,j.z-P.z)<pR()+j.r&&j.cd<=0&&!trans){j.cd=2;if(rageT>0||starT>0){pop('+'+gain(30*zone),j.x,3,j.z,'#FF8FE8',20);burst(j.x,j.z,0xFF6FD8,14,1,1.5*K);j.t=0}
  else if(!prot()&&shieldT<=0){sz=Math.max(1,sz*0.93);stunP=0.9;sZap();flash('#FF6FD8',0.3);pop('⚡ Sứa chích! Teo nhỏ',P.x,3,P.z,'#FF8FE8',20);for(let k=0;k<12;k++)part(P.x,1+sz*0.4,P.z,addM(0xFF9FF0),new THREE.Vector3(rp(-4,4),rp(0,3),rp(-4,4)),0.8,2,0)}
  else if(shieldT>0){shieldT=Math.max(0,shieldT-3);sZap()}}
 if(j.t<=0){S.remove(j.m);jellies.splice(i,1)}}
for(let i=nets.length-1;i>=0;i--){const n=nets[i];n.t-=dt;n.x+=n.vx*dt*es;n.z+=n.vz*dt*es;n.m.position.set(n.x,n.hit?-(1-Math.max(0,n.t))*2:0,n.z);n.m.plane.material.opacity=n.hit?Math.max(0,n.t):1;
 if(!n.hit&&!trans){const wx=P.x-n.x,wz=P.z-n.z,c=Math.cos(n.a),s=Math.sin(n.a),lx=wx*c-wz*s,lz=wx*s+wz*c;
  if(Math.abs(lx)<8*n.k+pR()*0.5&&Math.abs(lz)<4*n.k+pR()*0.5){n.hit=true;n.t=Math.min(n.t,1);
   if(dashT>0||starT>0||rageT>0||tier>=5){sNet();const g=gain(60*zone);pop('✂️ Xé toạc lưới! +'+g,P.x,3,P.z,'#FFD0A0',22);burst(P.x,P.z,0xEDE6D6,24,1.3,1+sz*0.4)}
   else{sNet();hurt('🕸️',n.x,n.z)}}}
 if(n.t<=0){S.remove(n.m);nets.splice(i,1)}}
for(let i=hooks.length-1;i>=0;i--){const h=hooks[i];h.t-=dt;h.ph+=dt;h.m.worm.rotation.z=Math.sin(h.ph*5)*0.4;h.m.rotation.z=Math.sin(h.ph)*0.05;
 if(h.caught){h.m.position.y+=dt*12*h.k}else if(h.t<2)h.m.position.y+=dt*8*h.k;
 else if(Math.hypot(h.x-P.x,h.z-P.z)<pR()+0.6*h.k&&!trans){
  if(tier>=4||rageT>0||starT>0){const g=gain(150*zone);pop('💪 Giật đứt lưỡi câu! +'+g,P.x,3,P.z,'#FFE36B',22);sRam();burst(h.x,h.z,0xC0C8D0,14,1,1+sz*0.4);h.t=0}
  else if(hurt('🎣',h.x,h.z)){h.caught=true;h.t=1.5;for(let k=0;k<14;k++)part(h.x,1,h.z,addM(0xCFF6FF),new THREE.Vector3(rp(-1,1),rp(6,10),rp(-1,1)),1,1,-1,bubG)}}
 if(h.t<=0){S.remove(h.m);hooks.splice(i,1)}}
for(let i=items.length-1;i>=0;i--){const it=items[i];it.t-=dt;const dx=P.x-it.x,dz=P.z-it.z,d=Math.hypot(dx,dz)||0.01;if(magT>0&&d<16+sz*2){it.x+=dx/d*V*1.8*dt;it.z+=dz/d*V*1.8*dt}
 it.m.position.set(it.x,(1.4+Math.sin(T*2.5+i)*0.3)*it.s,it.z);it.m.rotation.y+=dt*1.5;if(it.t<3)it.m.visible=Math.floor(T*8)%2===0;
 if(d<pR()+it.s*0.9){takeItem(it);it.t=0}if(it.t<=0){S.remove(it.m);items.splice(i,1)}}
if(decoy){decoy.t-=dt;decoy.x+=Math.sin(decoy.hd)*dt*V*0.6;decoy.z+=Math.cos(decoy.hd)*dt*V*0.6;decoy.m.position.set(decoy.x,1+sz*0.45,decoy.z);decoy.m.rotation.y=decoy.hd;decoy.gm.opacity=0.25+Math.abs(Math.sin(T*6))*0.3;
 if(decoy.t<=0){S.remove(decoy.m);bubbles(decoy.x,decoy.z,12);decoy=null}}
// ---- Kho báu, đồng vàng, cá voi ----
if(!trans){chestT-=dt;if(chestT<=0){spawnChest();chestT=rp(22,32)}coinT-=dt;if(coinT<=0){spawnCoins();coinT=rp(9,14)}}
whaleT-=dt;if(whaleT<=0&&!whaleS){whaleT=rp(35,55);const a=rp(0,6.28),side=Math.random()<0.5?1:-1,k=Math.max(1,camH/14);whaleS={x:P.x-Math.sin(a)*40*k+Math.cos(a)*side*rp(7,11)*k,z:P.z-Math.cos(a)*40*k-Math.sin(a)*side*rp(7,11)*k,hd:a,t:13,k};whale.visible=whaleSh.visible=true;snd(140,90,2.2,'sine',0.07);setTimeout(()=>snd(110,70,2,'sine',0.05),900)}
if(coinStreakT>0){coinStreakT-=dt;if(coinStreakT<=0)coinStreak=0}
for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.t-=dt;const dx=P.x-c.x,dz=P.z-c.z,d=Math.hypot(dx,dz)||0.01;if(magT>0&&d<16+sz*2){c.x+=dx/d*V*2*dt;c.z+=dz/d*V*2*dt}
 c.m.position.set(c.x,(1.2+Math.sin(T*3+c.ph)*0.2)*c.k,c.z);c.m.rotation.y+=dt*4;if(c.t<3)c.m.visible=Math.floor(T*8)%2===0;
 if(d<pR()+0.7*c.k){coinStreak++;coinStreakT=1.5;const g=gain(10*zone*Math.min(coinStreak,5));sCoin(coinStreak);pop('+'+g,c.x,2+sz,c.z,'#FFD700',18);for(let k=0;k<8;k++)part(c.x,1.2*c.k,c.z,addM(k%2?0xFFD700:0xFFF6C0),new THREE.Vector3(rp(-2,2),rp(2,5),rp(-2,2)),0.8*c.k,1.5,4);c.t=0}
 if(c.t<=0){S.remove(c.m);coins.splice(i,1)}}
for(let i=chests.length-1;i>=0;i--){const c=chests[i];c.t-=dt;if(c.open>0){c.open+=dt;c.m.lid.rotation.x=-Math.min(1.3,c.open*4);c.m.glow.scale.setScalar(3+c.open*3);
  if(c.open<1.2&&Math.random()<0.8)part(c.x,0.9*c.k,c.z,addM(Math.random()<0.7?0xFFD700:RB[rnd(6)]),new THREE.Vector3(rp(-3,3),rp(6,11),rp(-3,3)),rp(0.8,1.4)*c.k,1.1,9,G.coin);if(c.open>3)c.t=0}
 else{c.m.glow.material.opacity;c.m.lid.rotation.x=-Math.abs(Math.sin(T*3))*0.08;if(Math.random()<dt*3)part(c.x+rp(-0.6,0.6)*c.k,1*c.k,c.z,addM(0xFFF6C0),new THREE.Vector3(0,1.5,0),0.6*c.k,1.5,0);
  if(Math.hypot(P.x-c.x,P.z-c.z)<pR()+1.1*c.k&&!trans){c.open=0.01;c.t=10;const g=gain(250*zone);st.chests=(st.chests||0)+1;sChest();flash('#FFD700',0.35);shake=Math.max(shake,0.3);ring(c.x,c.z,0xFFD700,c.k*6,0.4,0.9);
   pop('💰 KHO BÁU! +'+g,c.x,3+sz,c.z,'#FFD700',28);if(Math.random()<0.35){const k=['star','shield','magnet','double'][rnd(4)];const it={x:c.x,z:c.z,k,s:1};takeItem(it)}}}
 if(c.t<=0){S.remove(c.m);chests.splice(i,1)}}
if(whaleS){const w=whaleS;w.t-=dt;w.x+=Math.sin(w.hd)*7*w.k*dt;w.z+=Math.cos(w.hd)*7*w.k*dt;const y=camH*0.18+2.5;whale.position.set(w.x,y,w.z);whale.rotation.y=w.hd;whale.rotation.z=Math.sin(T*0.8)*0.05;whale.scale.setScalar(9*w.k);
 if(whaleM.tail)whaleM.tail.rotation.x=Math.sin(T*1.8)*0.35;whaleSh.position.set(w.x,0.08,w.z);whaleSh.scale.set(5*w.k,1,10*w.k);whaleSh.rotation.y=w.hd;if(Math.random()<dt*6)bubbles(w.x+rp(-3,3)*w.k,w.z+rp(-3,3)*w.k,1);
 if(w.t<=0){whaleS=null;whale.visible=whaleSh.visible=false}}
// ---- Cảnh báo nguy hiểm ----
{let warn=0;npcs.forEach(n=>{if(n.ch){const d=Math.hypot(n.x-P.x,n.z-P.z);warn=Math.max(warn,1-d/(10+n.sz*2.5))}});
 if(boss&&!clearing){const d=Math.hypot(boss.x-P.x,boss.z-P.z);warn=Math.max(warn,(1-d/(boss.sz*4+10))*1.1);if(boss.state==='wind'||boss.state==='claw'||boss.state==='lure')warn=Math.max(warn,0.9)}
 shots.forEach(s=>{const d=Math.hypot(s.x-P.x,s.z-P.z);if(d<8+sz)warn=Math.max(warn,0.7)});
 if(warn>0.45&&warnPrev<=0.45&&dangerS<=0&&!prot()){dangerS=2.5;snd(880,660,0.12,'square',0.04);setTimeout(()=>snd(880,660,0.12,'square',0.04),160)}if(dangerS>0)dangerS-=dt;warnPrev=warn;
 let vo=Math.max(0,warn)*0.55*(0.75+Math.sin(T*10)*0.25);if(lives===1)vo=Math.max(vo,0.18+Math.sin(T*4)*0.1);if(vgT>0){vgT-=dt;vo=Math.max(vo,0.6)}if(prot())vo*=0.4;vg.style.opacity=vo.toFixed(2)}
if(!boss&&!bossWarned&&!clearing&&score>=bossAt(zone)*0.85){bossWarned=true;pop('⚠️ Trùm sắp xuất hiện!',P.x,4,P.z,'#FF8080',24);sSiren()}
// ---- HUD ----
hudT-=dt;if(hudT<=0){hudT=0.15;sc.textContent=score;
 let h='<span>'+FORMS[tier].n.split(' ')[0]+' '+(tier<FORMS.length-1?Math.max(0,Math.floor((score-TIERS[tier])/(TIERS[tier+1]-TIERS[tier])*100))+'%':'MAX')+'</span>';if(combo>1)h+='<span>🔥 x'+Math.min(combo,6)+'</span>';
 [['🛡️',shieldT],['🧲',magT],['⭐',starT],['x2',dblT],['⏳',slowT],['🐡',puffT],['🐲',rageT]].forEach(([e,t])=>{if(t>0)h+='<span>'+e+' '+Math.ceil(t)+'s</span>'});if(h!==hudS){hudS=h;pwE.innerHTML=h}
 const ss=skCD.slice(0,tier+1).map(c=>c>0?Math.ceil(c*4):0).join(',');if(ss!==skS){skS=ss;[...skE2.children].forEach((b,i)=>{const p=skCD[i]>0?skCD[i]/SKL[i].cd*100:0;b.style.setProperty('--p',p+'%');b.classList.toggle('rd',skCD[i]<=0)})}}
}
// ================= HIỆU ỨNG NGƯỜI CHƠI =================
{const sp=Math.hypot(P.vx,P.vz),V2=V,f=Math.min(1.5,sp/V2),col=skinC();
const base=sz*pLen*(rageT>0?1.4:1)*(1+(evoT>0?Math.sin(evoT*25)*0.15*evoT:0));pH.scale.setScalar(base);
pH.position.set(P.x,1+sz*0.45+Math.sin(T*2)*0.06*sz,P.z);pH.rotation.y=P.hd;
const c=chompT>0?Math.sin(chompT/0.25*Math.PI):0;pIn.scale.set(1+c*0.22,1-c*0.15,1-c*0.12);
pIn.rotation.y=hurtT>0?(0.7-hurtT)*16:Math.sin(T*(5+sp*0.6))*0.07*(0.3+f);pIn.rotation.z=Math.max(-0.6,Math.min(0.6,-P.turn*0.22));pIn.position.y=0;
pIn.visible=!(blinkT>0&&Math.floor(T*12)%2);animFish(pModel,T,sp,0.4+f);
pGlow.material.color.setHex(col);pGlow.material.opacity=0.35+(starT>0?0.3:0)+Math.sin(T*3)*0.08;pGlow.scale.setScalar(2.4+(starT>0?1:0));
pRing.position.set(P.x,0.1,P.z);pRing.scale.setScalar(pR()*1.7);pRing.material.color.setHex(col);pRing.material.opacity=0.35+Math.sin(T*4)*0.12;
spikeShell.visible=puffT>0;if(puffT>0){spikeShell.rotation.y+=dt*2;spikeShell.scale.setScalar(1+Math.sin(T*12)*0.06)}
rageFx.visible=rageT>0;if(rageT>0){rageFx.scale.setScalar(3+Math.sin(T*14)*0.5);rageFx.material.opacity=0.5+Math.sin(T*9)*0.2}
shieldB.visible=shieldT>0;if(shieldT>0){shieldB.position.copy(pH.position);shieldB.scale.setScalar(pR()*2.2*(1+Math.sin(T*5)*0.04));shieldB.material.opacity=shieldT<2?(Math.floor(T*8)%2?0.05:0.2):0.18}
if(act){const bx=P.x-Math.sin(P.hd)*sz*0.6,bz=P.z-Math.cos(P.hd)*sz*0.6,by=1+sz*0.45;
 bubT-=dt;if(sp>1&&bubT<=0){bubT=0.22-Math.min(0.17,f*0.12);part(bx+rp(-0.2,0.2)*sz,by,bz+rp(-0.2,0.2)*sz,addM(0xDFF8FF),new THREE.Vector3(rp(-0.4,0.4),rp(1.5,2.5),rp(-0.4,0.4)),rp(0.6,1.1)*K,0.7,-0.6,bubG)}
 wakeT-=dt;if(sp>V2*0.55&&wakeT<=0){wakeT=0.45;ring(bx,bz,col,sz*0.9,0.15,0.5)}
 if(dashT>0){for(let k=0;k<2;k++)streak(P.x+rp(-1,1)*sz*0.6,by+rp(-0.5,0.5)*sz,P.z+rp(-1,1)*sz*0.6,P.hd,col);part(bx,by,bz,addM(col),new THREE.Vector3(0,0,0),sz*0.9,3,0,sphG);if(Math.random()<0.3)part(P.x,0.2,P.z,addM(0xE8D8B0),new THREE.Vector3(rp(-2,2),rp(1,2),rp(-2,2)),K,1.5,2)}
 if(rageT>0&&Math.random()<0.8)part(P.x+rp(-1,1)*sz*0.7,by+rp(-0.5,0.5)*sz,P.z+rp(-1,1)*sz*0.7,addM(Math.random()<0.5?0xFF5A1A:0xFFD23F),new THREE.Vector3(rp(-0.5,0.5),rp(3,6),rp(-0.5,0.5)),rp(0.6,1.2)*K,1.4,-0.5);
 if(starT>0&&Math.random()<0.6)part(P.x+rp(-1,1)*sz,by+rp(0,1)*sz,P.z+rp(-1,1)*sz,addM(RB[rnd(6)]),new THREE.Vector3(0,1,0),0.7*K,1.5,0);
 if(vortexT>0){const R=R0x();for(let k=0;k<3;k++){const a=T*7+k*2.09,r=R*((T*1.5+k*0.33)%1);part(P.x+Math.cos(a)*r,0.8,P.z+Math.sin(a)*r,addM(0x9FE8FF),new THREE.Vector3(-Math.cos(a)*6-Math.sin(a)*8,0.5,-Math.sin(a)*6+Math.cos(a)*8),0.9*K,1.4,0)}}
 if(magT>0&&Math.random()<0.4){const a=rp(0,6.28),r=12+sz*2;part(P.x+Math.cos(a)*r,1,P.z+Math.sin(a)*r,addM(0xFF8080),new THREE.Vector3(-Math.cos(a)*r*1.2,0,-Math.sin(a)*r*1.2),0.5*K,1.2,0)}
 if(stunP>0&&Math.random()<0.5)part(P.x+rp(-0.5,0.5)*sz,by+sz*0.6,P.z,addM(0xFF9FF0),new THREE.Vector3(0,1,0),0.6*K,2,0)}}
// ================= THẾ GIỚI =================
const camK=camH/14;
ambS.forEach((s,si)=>{s.a+=s.sp*dt*0.35;const cx=P.x+Math.cos(s.a)*s.r*camK,cz=P.z+Math.sin(s.a)*s.r*camK,hd=Math.atan2(-Math.sin(s.a)*Math.sign(s.sp),Math.cos(s.a)*Math.sign(s.sp));
 if(!s.off)s.off=new Float32Array(60);for(let i=0;i<30;i++){const idx=si*30+i;let ox=Math.sin(i*2.4)*1.4*camK,oz=Math.cos(i*1.7)*1.4*camK;{const fx=cx+ox+s.off[i*2]-P.x,fz=cz+oz+s.off[i*2+1]-P.z,fd=Math.hypot(fx,fz)||0.01,FR=2.5+sz*1.2;if(fd<FR){s.off[i*2]+=fx/fd*(FR-fd)*dt*6;s.off[i*2+1]+=fz/fd*(FR-fd)*dt*6}s.off[i*2]*=1-dt*0.5;s.off[i*2+1]*=1-dt*0.5;ox+=s.off[i*2];oz+=s.off[i*2+1]}dm.position.set(cx+ox+Math.sin(T*1.3+i)*0.3,(s.y+Math.sin(i*3.1)*0.8)*Math.max(1,camK*0.7)+Math.sin(T*2+i)*0.15,cz+oz);
  dm.rotation.set(0,hd+Math.sin(T*8+i)*0.15,0);dm.scale.setScalar(0.2*Math.max(1,camK*0.6));dm.updateMatrix();ambIM.setMatrixAt(idx,dm.matrix)}});ambIM.instanceMatrix.needsUpdate=true;
critters.forEach((c,i)=>{c.a+=c.sp*dt;const r=c.r*camK,x=P.x+Math.cos(c.a)*r,z=P.z+Math.sin(c.a)*r;c.m.position.set(x,(c.y+Math.sin(T*0.7+c.ph))*Math.max(1,camK*0.7),z);c.m.rotation.y=Math.atan2(-Math.sin(c.a)*Math.sign(c.sp),Math.cos(c.a)*Math.sign(c.sp));
 c.m.scale.setScalar((i===1?1.1:1.5)*Math.max(1,camK*0.6));c.m.wings.forEach((w,k)=>{if(w.children.length===1&&c.m.wings.length===2)w.rotation.z=(k?-1:1)*Math.sin(T*1.6+c.ph)*0.35;else w.rotation.y=Math.sin(T*2.2+k*1.6)*0.5})});
floor.position.set(P.x,0,P.z);if(floorM.map){floorM.map.offset.set(P.x/FLOOR*FREP,-P.z/FLOOR*FREP)}caus.position.set(P.x,0.03,P.z);causT.offset.set(P.x/FLOOR*40+T*0.02,-P.z/FLOOR*40+T*0.015);if(curZ)causM.opacity=curZ.caus*(zone>10?0.6:1)*(0.55+Math.sin(T*1.3)*0.15);
const cullX=camH*0.75+9,cullZ=camH*1.15+9;decor.forEach(d=>{const m=d.m;if(m.position.x-P.x>DD)m.position.x-=2*DD;else if(m.position.x-P.x<-DD)m.position.x+=2*DD;if(m.position.z-P.z>DD)m.position.z-=2*DD;else if(m.position.z-P.z<-DD)m.position.z+=2*DD;if(d.sway)m.rotation.z=Math.sin(T*d.s+m.position.x)*d.sway;const vis=Math.abs(m.position.x-camX)<cullX+(d.big||0)&&Math.abs(m.position.z-camZ)<cullZ+(d.big||0);m.visible=vis;if(d.anim&&vis)d.anim(m,T,d)});
{const pa=snG.attributes.position.array,W2=30*Math.max(1,camK*0.8),Hh=Math.min(camH-2,14*Math.max(1,camK*0.6));for(let i=0;i<SN;i++){const j=i*3;pa[j]+=Math.sin(T*0.5+i)*dt*0.3;pa[j+1]-=dt*(0.15+(i%5)*0.05);pa[j+2]+=Math.cos(T*0.4+i)*dt*0.3;
 if(pa[j]-camX>W2)pa[j]-=2*W2;else if(pa[j]-camX<-W2)pa[j]+=2*W2;if(pa[j+2]-camZ>W2)pa[j+2]-=2*W2;else if(pa[j+2]-camZ<-W2)pa[j+2]+=2*W2;if(pa[j+1]<0.3)pa[j+1]=Hh}snG.attributes.position.needsUpdate=true;snowM.size=0.3*Math.max(1,camK*0.7);snowM.color.setHex(curZ&&curZ.dark?0xFFB0A0:0xDFF6FF)}
pShadow.position.set(P.x,0.07,P.z);pShadow.scale.setScalar(pR()*2.4);if(boss){bShadow.visible=true;bShadow.position.set(boss.x,0.07,boss.z);bShadow.scale.setScalar(boss.sz*1.4)}else bShadow.visible=false;
rays.forEach((r,i)=>{r.m.position.set(P.x+r.ox,25,P.z+r.oz);r.m.material.opacity=(curZ?curZ.rays:0)*(0.7+Math.sin(T*0.6+i)*0.3)});
if(curZ&&act){const a=curZ.amb,rate=a==='snow'?18:a==='bubble'?8:12,W=camH*1.1;if(Math.random()<dt*rate&&parts.length<420){const x=P.x+rp(-W,W),z=P.z+rp(-W,W*0.6);
 if(a==='bubble')part(x,0.2,z,addM(0xCFF6FF),new THREE.Vector3(0,rp(1.5,2.5),0),rp(0.6,1.2),0.25,-0.2,bubG);
 else if(a==='plankton')part(x,rp(0.5,4),z,addM(0xB8FF8A),new THREE.Vector3(rp(-0.3,0.3),rp(-0.2,0.2),rp(-0.3,0.3)),rp(0.4,0.7),0.35,0);
 else if(a==='spore')part(x,rp(0.5,4),z,addM([0xFF4FD8,0x00E5FF][rnd(2)]),new THREE.Vector3(0,rp(0.3,0.8),0),rp(0.4,0.8),0.3,0);
 else if(a==='glow')part(x,rp(0.5,4),z,addM([0x00E5FF,0x7CFF6B][rnd(2)]),new THREE.Vector3(rp(-0.2,0.2),0,rp(-0.2,0.2)),rp(0.5,0.9),0.3,0);
 else if(a==='ember')part(x,0.2,z,addM([0xFF7A1A,0xFFD23F][rnd(2)]),new THREE.Vector3(0,rp(1.5,3),0),rp(0.4,0.8),0.4,-0.5);
 else if(a==='snow')part(x,rp(8,12),z,addM(0xffffff),new THREE.Vector3(rp(-0.3,0.3),-rp(1,1.6),0),rp(0.4,0.7),0.13,0);
 else if(a==='redglow')part(x,rp(0.3,3),z,addM(0xFF3A1A),new THREE.Vector3(0,rp(0.3,0.8),0),rp(0.4,0.8),0.35,0);
 else if(a==='cosmic')part(x,rp(0.5,5),z,addM(RB[rnd(6)]),new THREE.Vector3(rp(-0.3,0.3),rp(0.2,0.6),rp(-0.3,0.3)),rp(0.4,0.9),0.3,0);
 else part(x,rp(0.5,4),z,addM(0xFFD700),new THREE.Vector3(0,rp(0.3,0.8),0),rp(0.4,0.8),0.35,0)}
 // Cột bong bóng từ khe đáy biển
 ventT-=dt;if(ventT<=0&&parts.length<400){ventT=rp(0.8,1.6);const x=P.x+rp(-W,W)*0.8,z=P.z+rp(-W,W*0.5)*0.8;for(let k=0;k<7;k++)part(x+rp(-0.3,0.3),0.2+k*0.5,z+rp(-0.3,0.3),addM(0xDFF8FF),new THREE.Vector3(rp(-0.2,0.2),rp(2,3.5),rp(-0.2,0.2)),rp(0.5,1.1),0.3,-0.3,bubG)}}
for(let i=bolts.length-1;i>=0;i--){const b=bolts[i];b.t-=dt;b.m.material.opacity=b.t/0.35;if(b.t<=0){S.remove(b.m);b.m.geometry.dispose();bolts.splice(i,1)}}
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.v.y-=p.grav*dt;p.position.addScaledVector(p.v,dt);p.life-=dt*p.decay;p.scale.setScalar(Math.max(p.life*p.s0,0.01));if(p.life<=0){S.remove(p);parts.splice(i,1)}}
for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.life-=dt;const q=1-f.life/f.max;f.m.scale.setScalar(f.g0+(f.g1-f.g0)*q);f.m.material.opacity=f.op*(1-q);if(f.life<=0){S.remove(f.m);f.m.material.dispose();fx.splice(i,1)}}
indUsed=0;if(act){if(boss)ind(boss.x,boss.sz,boss.z,'boss','👑',Math.hypot(boss.x-P.x,boss.z-P.z));
 chests.forEach(c=>{if(!c.open)ind(c.x,1,c.z,'gold','💰',Math.hypot(c.x-P.x,c.z-P.z))});
 npcs.forEach(n=>{if(n.ch){if(!ind(n.x,1+n.sz,n.z,'bad','❗',0))label('❗',n.x,1.6+n.sz*1.1,n.z,'bad')}});
 nets.forEach(n=>{if(!n.hit&&!ind(n.x,1,n.z,'warn','🕸️',0))label('⚠️',n.x,3*n.k,n.z,'bad')});
 hooks.forEach(h=>{if(!h.caught)label('🎣',h.x,(2.2)*h.k,h.z,'bad')});
 if(boss&&(boss.state==='wind'||boss.state==='claw'))label('⚠️',boss.x,boss.sz*1.8,boss.z,'boss')}
for(let i=indUsed;i<indPool.length;i++)indPool[i].style.display='none';
for(let i=lbUsed;i<lbPool.length;i++)lbPool[i].style.display='none';
// Camera: cá càng lớn càng kéo xa, nhìn trước theo hướng bơi
const tH=Math.min(46,11+sz*2.5+(boss?4:0)+(rageT>0?3:0));camH+=(tH-camH)*Math.min(1,dt*1.5);if(shake>0)shake=Math.max(0,shake-dt);
camX+=(P.x+P.vx*0.3-camX)*Math.min(1,dt*3);camZ+=(P.z+P.vz*0.3-camZ)*Math.min(1,dt*3);
S.fog.near=camH*0.55;S.fog.far=camH*(curZ&&curZ.dark?1.6:2.3)+8;
const sk=shake*Math.max(1,sz*0.3);cam.position.set(camX+(Math.random()-0.5)*sk,camH+(Math.random()-0.5)*sk,camZ+camH*0.55);cam.lookAt(camX,0,camZ-camH*0.05);
sun.position.set(P.x+10,30,P.z+8);sun.target.position.set(P.x,0,P.z);lamp.position.set(P.x,4+sz,P.z);lamp.distance=20+camH;
R.render(S,cam);requestAnimationFrame(loop)}
const R0x=()=>(10+sz*1.5)*1.7;
requestAnimationFrame(loop);
