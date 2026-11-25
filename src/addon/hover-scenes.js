/* Main page: animated background per climate risk while a topic button is hovered / focused */
(function(){
var hero=document.getElementById('hero'),wrap=hero&&hero.querySelector('.wrap');if(!hero||!wrap)return;
function wave(y,a,len){var d='M-400 '+y;for(var x=-400;x<2400;x+=len)d+=' q'+(len/4)+' '+(-a)+' '+(len/2)+' 0 t'+(len/2)+' 0';return d+' L2400 1000 L-400 1000Z'}
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var V='viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"';
var FL='<svg '+V+'><defs><linearGradient id="hfw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d7ea4"/><stop offset="1" stop-color="#0b2b40"/></linearGradient>'+
 '<pattern id="hrp" width="60" height="240" patternUnits="userSpaceOnUse"><line x1="30" y1="0" x2="22" y2="44" stroke="#dfeefa" stroke-opacity=".75" stroke-width="1.6"/><line x1="8" y1="120" x2="2" y2="152" stroke="#dfeefa" stroke-opacity=".55" stroke-width="1.2"/></pattern>'+
 '<pattern id="hrp2" width="40" height="160" patternUnits="userSpaceOnUse"><line x1="20" y1="10" x2="15" y2="38" stroke="#fff" stroke-opacity=".4" stroke-width="1"/></pattern></defs>'+
 '<rect width="1600" height="900" fill="#071e2c" opacity=".38"/>'+
 '<g class="bolt"><rect width="1600" height="900" fill="#e8f2ff" opacity=".18"/><polyline points="1190,0 1150,150 1200,160 1120,330 1170,335 1080,520" fill="none" stroke="#f4f9ff" stroke-width="5" stroke-linejoin="round"/><polyline points="1190,0 1150,150 1200,160 1120,330 1170,335 1080,520" fill="none" stroke="#9cc8ff" stroke-width="16" stroke-opacity=".35"/></g>'+
 '<g transform="rotate(14 800 450)"><rect class="rain" x="-400" y="-500" width="2400" height="1900" fill="url(#hrp)"/><rect class="rain b" x="-400" y="-500" width="2400" height="1900" fill="url(#hrp2)"/></g>'+
 '<g class="rise">'+
  '<g fill="#173041" opacity=".92"><path d="M120 640 v-70 l60-48 60 48 v70z"/><rect x="150" y="585" width="22" height="26" fill="#d9a441" opacity=".7"/><path d="M330 650 v-55 l45-36 45 36 v55z"/><path d="M1240 650 v-80 l70-55 70 55 v80z"/><rect x="1290" y="590" width="26" height="28" fill="#d9a441" opacity=".7"/><path d="M1450 655 v-50 l40-32 40 32 v50z"/>'+
  '<circle cx="560" cy="600" r="42"/><circle cx="600" cy="585" r="34"/><rect x="574" y="600" width="10" height="60"/><circle cx="1040" cy="605" r="38"/><circle cx="1075" cy="592" r="30"/><rect x="1052" y="605" width="9" height="55"/><rect x="760" y="560" width="8" height="110"/><rect x="720" y="560" width="90" height="6"/></g>'+
  '<path class="w3" d="'+wave(628,9,200)+'" fill="#4c8db2" opacity=".75"/>'+
  '<g class="bob"><rect x="860" y="626" width="120" height="14" rx="7" fill="#5b3c22"/></g><g class="bob" style="animation-delay:-1.4s"><rect x="420" y="630" width="26" height="34" rx="5" fill="#c0392b"/></g>'+
  '<path class="w2" d="'+wave(652,12,260)+'" fill="#2f6f95" opacity=".88"/>'+
  '<path class="w1" d="'+wave(690,14,320)+'" fill="url(#hfw)"/>'+
  '<g class="shimmer" stroke="#cfe6f5" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"><line x1="200" y1="740" x2="300" y2="740"/><line x1="620" y1="770" x2="760" y2="770"/><line x1="1100" y1="750" x2="1220" y2="750"/><line x1="380" y1="820" x2="520" y2="820"/><line x1="900" y1="830" x2="1060" y2="830"/></g>'+
 '</g></svg>';
var rays='';for(var i=0;i<16;i++)rays+='<path d="M-9 -112 L9 -112 L0 -190Z" fill="#ffd27a" opacity=".75" transform="rotate('+(i*22.5)+')"/>';
var heat='';for(var k=0;k<7;k++){var x=120+k*220;heat+='<path class="heat" style="animation-delay:'+(k*.45)+'s" d="M'+x+' 690 q14 -18 0 -36 q-14 -18 0 -36 q14 -18 0 -36" fill="none" stroke="#fff1c9" stroke-width="2.5" stroke-linecap="round"/>'}
var dust='';for(var k2=0;k2<6;k2++)dust+='<ellipse class="dust" style="animation-delay:'+(-k2*1.9)+'s;animation-duration:'+(9+k2*2)+'s" cx="0" cy="'+(560+k2*40)+'" rx="'+(120+k2*30)+'" ry="18" fill="#e0b27a" opacity=".22"/>';
var DR='<svg '+V+'><defs><radialGradient id="hsg"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc35c" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a2e" stop-opacity="0"/></radialGradient>'+
 '<linearGradient id="hdo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb14a" stop-opacity=".38"/><stop offset=".6" stop-color="#d9822b" stop-opacity=".22"/><stop offset="1" stop-color="#6b3a12" stop-opacity=".45"/></linearGradient>'+
 '<linearGradient id="hdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9935a"/><stop offset="1" stop-color="#7d4f27"/></linearGradient></defs>'+
 '<rect width="1600" height="900" fill="url(#hdo)"/>'+
 '<g transform="translate(1260 190)"><circle class="glow" r="330" fill="url(#hsg)"/><g class="sun">'+rays+'</g><circle r="78" fill="#ffe08a"/><circle r="78" fill="#fff6d6" opacity=".5"/></g>'+
 heat+dust+
 '<g class="ground"><path d="M-400 700 Q200 670 800 690 T2000 680 L2000 1000 L-400 1000Z" fill="url(#hdg)"/>'+
  '<g class="crk" fill="none" stroke="#4d2c12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M40 720 l60 40 l-20 50 l70 40 l10 60"/><path d="M100 760 l90 -10 l60 40"/><path d="M380 710 l-30 60 l60 30 l-20 70 l50 40"/><path d="M410 800 l80 10 l40 -40"/><path d="M700 700 l40 70 l-50 40 l30 90"/><path d="M740 770 l100 -20 l50 50 l90 -10"/><path d="M1020 705 l-20 80 l70 30 l-10 80"/><path d="M1090 815 l90 20 l40 -50"/><path d="M1320 700 l30 60 l-60 50 l40 90"/><path d="M1350 760 l110 10 l60 60"/></g>'+
  '<g fill="#3e2714"><path d="M300 700 l6 -120 l-30 -50 m36 20 l40 -60 m-44 110 l-50 -40" stroke="#3e2714" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M300 700 l6 -120" stroke="#3e2714" stroke-width="14" fill="none"/>'+
  '<path d="M900 698 l-6 -26 m10 26 l2 -30 m8 30 l10 -24" stroke="#8d6a3c" stroke-width="3" fill="none"/><path d="M1160 700 l-5 -22 m9 22 l3 -26 m7 26 l9 -20" stroke="#8d6a3c" stroke-width="3" fill="none"/></g></g>'+
 '</svg>';
var sky='<g fill="#3f3a35">';[[120,600,70,110],[200,560,50,150],[260,620,90,90],[370,590,60,120],[450,640,120,70],[600,600,60,110],[680,630,90,80],[1000,610,80,100],[1090,570,55,140],[1160,620,100,90],[1290,600,70,110],[1380,640,130,70],[1520,590,60,120]].forEach(function(b){sky+='<rect x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+(b[3]+200)+'"/>'});
sky+='<rect x="520" y="470" width="26" height="240"/><rect x="580" y="500" width="22" height="210"/><rect x="1225" y="480" width="26" height="230"/><rect x="1440" y="510" width="22" height="200"/></g>';
var puffs='';[[533,465],[591,495],[1238,475],[1451,505]].forEach(function(c,n){for(var q=0;q<3;q++)puffs+='<circle class="puff" style="animation-delay:'+(n*.7+q*2)+'s" cx="'+c[0]+'" cy="'+c[1]+'" r="22" fill="#9a8f82"/>'});
var AIR='<svg '+V+'><defs><filter id="hsn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0022 0.006" numOctaves="4" seed="7"/><feColorMatrix values="0 0 0 0 .52  0 0 0 0 .47  0 0 0 0 .40  0 0 0 1.6 -.55"/></filter>'+
 '<linearGradient id="hah" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d7264" stop-opacity=".55"/><stop offset=".55" stop-color="#9b8c76" stop-opacity=".5"/><stop offset="1" stop-color="#4a4139" stop-opacity=".7"/></linearGradient>'+
 '<radialGradient id="has"><stop offset="0" stop-color="#ffb07a" stop-opacity=".9"/><stop offset=".4" stop-color="#e5794a" stop-opacity=".45"/><stop offset="1" stop-color="#e5794a" stop-opacity="0"/></radialGradient></defs>'+
 '<rect width="1600" height="900" fill="url(#hah)"/>'+
 '<g class="rsun" transform="translate(1120 230)"><circle r="190" fill="url(#has)"/><circle r="54" fill="#f2a37a" opacity=".8"/></g>'+
 '<g class="smog b" style="will-change:transform"><rect x="0" y="80" width="3200" height="520" filter="url(#hsn)" opacity=".8"/></g>'+
 sky+puffs+
 '<g class="smog" style="will-change:transform"><rect x="0" y="380" width="3200" height="520" filter="url(#hsn)" opacity=".9"/></g>'+
 '<rect y="640" width="1600" height="260" fill="#5b5248" opacity=".35"/></svg><canvas></canvas>';
/* stock video per risk (Pexels License, free for commercial use). On the website it is served through the
   site's own /media/ path; elsewhere straight from Pexels. Until a video can play, the animated drawing shows. */
var VID={flood:['https://videos.pexels.com/video-files/18153515/18153515-hd_1280_720_25fps.mp4','WA_ Films'],
 drought:['https://videos.pexels.com/video-files/37533724/15903360_1280_720_30fps.mp4','Philipp Kappler'],
 air:['https://videos.pexels.com/video-files/31370255/13386245_1280_720_24fps.mp4','Usman AbdulrasheedGambo']};
var SAME=/(^|\.)vercel\.app$|^localhost$/.test(location.hostname);
function vtag(k){return '<video class="hv" muted loop playsinline preload="none" data-src="'+(SAME?'/media/'+k+'.mp4':VID[k][0])+'"></video><div class="vshade"></div><span class="vcr">Video: '+VID[k][1]+' / Pexels</span>'}
var fx=document.createElement('div');fx.className='hfx';fx.setAttribute('aria-hidden','true');
fx.innerHTML='<div class="hs hs-fl" data-k="flood">'+vtag('flood')+FL+'</div><div class="hs hs-dr" data-k="drought">'+vtag('drought')+DR+'</div><div class="hs hs-air" data-k="air">'+vtag('air')+AIR+'</div>';
hero.insertBefore(fx,wrap);
var VS=[].slice.call(fx.querySelectorAll('video.hv'));
VS.forEach(function(v){v.addEventListener('playing',function(){v.parentNode.classList.add('vid')});v.addEventListener('error',function(){v.parentNode.classList.remove('vid')})});
function warm(){if(RM)return;VS.forEach(function(v){if(!v.src){v.src=v.getAttribute('data-src');v.preload='auto';v.load()}})}
function playK(k){VS.forEach(function(v){var on=v.parentNode.getAttribute('data-k')===k;if(on&&!RM){if(!v.src){v.src=v.getAttribute('data-src');v.load()}var p=v.play();if(p&&p.catch)p.catch(function(){})}else if(!v.paused)v.pause()})}
var btRow=document.getElementById('bt');if(btRow){btRow.addEventListener('mouseenter',warm);btRow.addEventListener('focusin',warm)}
setTimeout(function(){if('requestIdleCallback' in window)requestIdleCallback(warm);else warm()},4000);
/* PM2.5 particles for the air scene */
var cv=fx.querySelector('.hs-air canvas'),cx=cv.getContext('2d'),P=[],raf=0;
function sizeP(){var r=hero.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);P=[];for(var i=0;i<Math.round(r.width*r.height/5200);i++)P.push([Math.random()*r.width,Math.random()*r.height,.15+Math.random()*.55,(Math.random()-.5)*.25,.6+Math.random()*2.2,.15+Math.random()*.45])}
function tick(){var w=cv.width,h=cv.height,r=hero.getBoundingClientRect();cx.clearRect(0,0,r.width,r.height);P.forEach(function(p){p[0]+=p[2];p[1]+=p[3];if(p[0]>r.width+5)p[0]=-5;if(p[1]<-5)p[1]=r.height;if(p[1]>r.height+5)p[1]=0;cx.beginPath();cx.arc(p[0],p[1],p[4],0,6.283);cx.fillStyle='rgba(70,60,50,'+p[5]+')';cx.fill()});raf=requestAnimationFrame(tick)}
function startP(){if(raf)return;sizeP();if(RM){tick();cancelAnimationFrame(raf);raf=0;return}tick()}
function stopP(){cancelAnimationFrame(raf);raf=0}
var tm=0;
function set(k){clearTimeout(tm);if(document.body.classList.contains('onfl')||hero.classList.contains('flood'))k=null;
 if(k)hero.setAttribute('data-hv',k);else hero.removeAttribute('data-hv');playK(k);if(k==='air')startP();else tm=setTimeout(stopP,1000)}
document.querySelectorAll('#bt .topic').forEach(function(b){var k=b.getAttribute('data-k');
 b.addEventListener('mouseenter',function(){set(k)});b.addEventListener('focus',function(){set(k)});
 b.addEventListener('mouseleave',function(){tm=setTimeout(function(){set(null)},200)});b.addEventListener('blur',function(){set(null)});
 b.addEventListener('click',function(){set(null)})});
addEventListener('hashchange',function(){set(null)});
addEventListener('resize',function(){if(raf)sizeP()});
})();
