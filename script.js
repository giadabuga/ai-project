// Filter the everyday examples by topic.
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.use-card');
const hint = document.querySelector('.filter-hint');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.toggle('active', item === button));
  const category = button.dataset.filter;
  let count = 0;
  cards.forEach(card => {
    const show = category === 'all' || card.dataset.category.split(' ').includes(category);
    card.classList.toggle('hidden', !show);
    if (show) count++;
  });
  hint.textContent = category === 'all' ? 'Showing all six areas.' : `Showing ${count} example${count === 1 ? '' : 's'} in ${button.textContent.toLowerCase()}.`;
}));

// Risk cards open and close with a click or keyboard activation.
document.querySelectorAll('.risk-item').forEach(item => item.addEventListener('click', () => {
  item.setAttribute('aria-expanded', String(item.getAttribute('aria-expanded') !== 'true'));
}));

// The timeline is an interactive scenario explorer, not a forecast.
const scenarios = [
  {year:'2026',label:'TODAY / TOOLS',title:'AI becomes a daily assistant.',text:'People use AI to draft, search, learn, create, and automate small tasks. Accuracy, privacy, and review remain important.',watch:'Trust · data · human review',color:['#37e5ff','#9d52ff','#ff4fa3']},
  {year:'2030',label:'NEAR FUTURE / INTEGRATION',title:'AI may be built into more services.',text:'Some workplaces, schools, and public services could use AI more deeply. Good design should show when AI is involved and allow people to ask for human help.',watch:'Access · fairness · transparency',color:['#7cffb2','#37e5ff','#ffb24d']},
  {year:'2035',label:'POSSIBLE FUTURE / COLLABORATION',title:'Human and AI teams could change work.',text:'AI might handle more routine analysis while people focus on creative direction, relationships, and complex decisions. New skills and human oversight will matter.',watch:'Skills · accountability · agency',color:['#ff4fa3','#ffb24d','#7d6bff']},
  {year:'2040+',label:'OPEN QUESTION / MANY PATHS',title:'The outcome depends on our choices.',text:'AI could help address big challenges or amplify inequality, security threats, and resource pressure. Strong safeguards and resilient infrastructure will be essential.',watch:'Governance · security · energy',color:['#7d6bff','#7cffb2','#ff4fa3']}
];
const rail = document.getElementById('timelineRail');
const knob = document.getElementById('railKnob');
const fill = document.getElementById('railFill');
let currentStep = 0;
let dragging = false;
function setTimeline(step) {
  currentStep = Math.max(0, Math.min(3, Math.round(step)));
  const item = scenarios[currentStep];
  const percent = (currentStep / 3) * 100;
  rail.setAttribute('aria-valuenow', String(currentStep));
  rail.setAttribute('aria-valuetext', item.year);
  knob.style.left = `${percent}%`;
  fill.style.width = `${percent}%`;
  document.getElementById('timelineYear').textContent = item.year;
  document.getElementById('timelineLabel').textContent = item.label;
  document.getElementById('timelineTitle').textContent = item.title;
  document.getElementById('timelineText').textContent = item.text;
  document.getElementById('timelineWatch').textContent = item.watch;
  const art = document.getElementById('timelineArt');
  art.style.setProperty('--glow-a', item.color[0]);
  art.style.setProperty('--glow-b', item.color[1]);
  art.style.setProperty('--glow-c', item.color[2]);
  art.setAttribute('aria-label', `Abstract glowing AI graphic for scenario ${item.year}`);
  rail.querySelectorAll('[data-year]').forEach((button, index) => button.classList.toggle('selected', index === currentStep));
}
function stepFromPointer(event) {
  const rect = rail.getBoundingClientRect();
  const padding = 14;
  const x = Math.max(padding, Math.min(rect.width - padding, event.clientX - rect.left));
  return Math.round(((x - padding) / (rect.width - padding * 2)) * 3);
}
rail.addEventListener('pointerdown', event => {
  if (event.target.closest('.rail-points button')) return;
  dragging = true;
  rail.setPointerCapture(event.pointerId);
  setTimeline(stepFromPointer(event));
});
rail.addEventListener('pointermove', event => {
  if (dragging) setTimeline(stepFromPointer(event));
});
function stopDrag() { dragging = false; }
rail.addEventListener('pointerup', stopDrag);
rail.addEventListener('pointercancel', stopDrag);
rail.addEventListener('lostpointercapture', stopDrag);
rail.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); setTimeline(currentStep + 1); }
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); setTimeline(currentStep - 1); }
  else if (event.key === 'Home') { event.preventDefault(); setTimeline(0); }
  else if (event.key === 'End') { event.preventDefault(); setTimeline(3); }
});
rail.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click', () => setTimeline(Number(button.dataset.year))));
setTimeline(0);


// Animated 3D particle orb. All other version 3 page content and styling remain untouched.
(function(){
 const canvas=document.getElementById('movingAIOrb');
 if(!canvas) return;
 const ctx=canvas.getContext('2d');
 let w=0,h=0,t=0,raf;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function resize(){
   const rect=canvas.getBoundingClientRect();
   const dpr=Math.min(window.devicePixelRatio||1,2);w=rect.width;h=rect.height;
   canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));
   ctx.setTransform(dpr,0,0,dpr,0,0);
 }
 function draw(){
   t+=reduced?0.002:0.018;ctx.clearRect(0,0,w,h);
   const cx=w/2,cy=h/2,radius=Math.min(w,h)*.40;
   const dots=[];
   const rows=34,cols=58,rot=t*.48;
   for(let row=0;row<=rows;row++){
     const lat=-Math.PI/2+row/rows*Math.PI;
     for(let col=0;col<cols;col++){
       const lon=col/cols*Math.PI*2;
       // Multi-frequency deformation makes the surface wobble like soft futuristic jelly.
       const pulse=Math.sin(t*1.35+lat*2.4+lon*1.7);
       const waveA=Math.sin(lon*3.2-t*1.9)*Math.cos(lat*4.1+t*1.25);
       const waveB=Math.sin(lon*2.1+t*1.4+lat*3.3);
       const waveC=Math.cos(lon*5.0-t*1.15)*Math.sin(lat*2.2+t*1.8);
       const deform=1+.30*waveA+.17*waveB+.12*waveC+.10*pulse;
       const x=Math.cos(lat)*Math.cos(lon+rot)*deform*(1+.10*Math.sin(t*1.35+lat*2.1)) + .12*Math.sin(t*1.1+lat*2.7);
       const y=Math.sin(lat)*deform*(1+.13*Math.cos(t*1.25+lon*2.3)) + .10*Math.sin(lon*2.2+t*1.6)*Math.cos(lat);
       const z=Math.cos(lat)*Math.sin(lon+rot)*deform*(1+.11*Math.sin(t*1.55+lat*3.2)) + .08*Math.cos(lon*3+t*1.4);
       const persp=2.3/(2.3-z*.55);
       dots.push({x:cx+x*radius*persp,y:cy+y*radius*persp,z,lat,lon});
     }
   }
   const glow=ctx.createRadialGradient(cx*.92,cy*.78,2,cx,cy,radius*1.45);
   glow.addColorStop(0,'rgba(87,230,255,.18)');glow.addColorStop(.38,'rgba(140,83,255,.13)');glow.addColorStop(.72,'rgba(255,83,190,.08)');glow.addColorStop(1,'rgba(255,170,95,0)');
   ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   dots.sort((a,b)=>a.z-b.z);
   for(const p of dots){
     const depth=(p.z+1)/2;
     const hue=(190+(p.lon/(Math.PI*2))*165+Math.sin(t+p.lat*4)*25+360)%360;
     const size=.45+depth*1.45;
     ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);
     ctx.fillStyle=`hsla(${hue},100%,${68+depth*20}%,${.20+depth*.78})`;ctx.fill();
   }
   // shimmering curved traces give the particle orb a fluid dimensional feel
   ctx.lineWidth=.45;ctx.strokeStyle='rgba(205,220,255,.28)';
   for(let k=0;k<7;k++){
     const y=cy+(k-3)*radius*.22;ctx.beginPath();
     ctx.ellipse(cx,y,radius*(.72+Math.sin(t+k)*.06),radius*(.12+Math.abs(k-3)*.035),t*.25+k*.18,0,Math.PI*2);ctx.stroke();
   }
   if(!reduced) raf=requestAnimationFrame(draw);
 }
 resize();draw();window.addEventListener('resize',resize,{passive:true});
})();
