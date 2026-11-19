/* SCGP Climate — Drought / Air quality & Heat pages (preview add-on, snapshot data) */
(function(){
var TH=function(){return (window.LANG||'en')==='th'};
function X(th,en){return TH()?th:en}
var NAMES=["Wanglasa Complex","Banpong Complex","Vexcel Pack","Precision Print","Thai Cane Paper Tha Muang","Thai Cane Paper Prachinburi","TCG Navanakorn (TCNK)","TCG Ratchaburi (TCRB)","TCG Samut Prakarn (TCSP)","TCG Pathumthani (TCPT)","TCG Songkhla (TCS)","TCG Chonburi (TCCB)","TCG Prachinburi (TCPB)","TCG Saraburi (TCSB)","TCG Kamphaeng Phet (TCKP)","Thai Containers Khonkaen (TCKK)","Thai Containers Rayong (TCRY)","Orient Containers Samutsakorn (OCSS)","Orient Containers Omnoi (OCKB)","Orient Containers Nakorn Pathom (OCNP)","Phoenix Pulp & Paper","Thai Paper","The Siam Forestry","Prepack Samutsakorn","Prepack Samut Songkhram","Prepack Rayong","Tawana Container","Conimex","Vina Kraft Paper","Vina Corrugated – Ho Chi Minh","Vina Corrugated – Hai Duong","Vina Corrugated – Binh Duong","PT Indoris Printingdo","PT Indocorr Cikarang","Interpress Printers (MY)","PT Primacorr Mandiri","PT Fajar Surya Wisesa","Tin Thanh Packing","PT Intan Ustrix","PT Rapipack Asritama","PT Bahana Buana Box","Starprint Vietnam","PT Prokemas Adhikari Kreasi","United Pulp & Paper (PH)","PT Dayasa Aria Prima"];
var LL=[[13.9512,99.7105],[13.85025,99.84843],[13.07022,101.17659],[13.55735,100.34054],[13.94778,99.67155],[13.94709,101.8158],[14.12545,100.59471],[13.7182,99.90102],[13.54406,100.6635],[13.97273,100.47416],[7.13117,100.30778],[13.15587,100.98626],[13.9021,101.56906],[14.58907,100.97515],[16.28661,99.67244],[16.17448,102.75758],[12.97962,101.11652],[13.5658,100.21387],[13.68223,100.28214],[13.66903,100.08574],[16.70259,102.74975],[13.56748,100.2127],[14.08672,99.70371],[13.5563,100.34126],[13.43898,99.94849],[12.87622,101.12384],[13.55868,100.66847],[13.70859,100.79886],[11.09776,106.65057],[10.7173,106.94432],[21.4843,106.30748],[10.79254,106.71743],[-6.21683,106.49516],[-6.30958,107.16409],[3.08738,101.45433],[-6.21427,106.5323],[-6.27303,107.12116],[21.57395,105.99058],[-7.13865,112.62089],[-6.3399,107.13669],[-6.92632,110.55821],[10.9404,106.889],[-6.26578,107.13358],[15.00423,120.79058],[-7.36792,112.60461]];
var FLAG={th:'<svg class="fg" viewBox="0 0 60 60"><rect width="60" height="60" fill="#a51931"/><rect y="10" width="60" height="40" fill="#fff"/><rect y="20" width="60" height="20" fill="#2d2a4a"/></svg>',
 vn:'<svg class="fg" viewBox="0 0 60 60"><rect width="60" height="60" fill="#da251d"/><polygon points="30,13 34.3,26.1 48.1,26.1 36.9,34.3 41.2,47.4 30,39.3 18.8,47.4 23.1,34.3 11.9,26.1 25.7,26.1" fill="#ff0"/></svg>',
 ph:'<svg class="fg" viewBox="0 0 60 60"><rect width="60" height="30" fill="#0038a8"/><rect y="30" width="60" height="30" fill="#ce1126"/><polygon points="0,0 0,60 52,30" fill="#fff"/><circle cx="15" cy="30" r="6" fill="#fcd116"/></svg>',
 id:'<svg class="fg" viewBox="0 0 60 60"><rect width="60" height="30" fill="#e70011"/><rect y="30" width="60" height="30" fill="#fff"/></svg>',
 my:'<svg class="fg" viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/><g fill="#cc0001"><rect y="0" width="60" height="8.6"/><rect y="17.2" width="60" height="8.6"/><rect y="34.3" width="60" height="8.6"/><rect y="51.4" width="60" height="8.6"/></g><rect width="30" height="34" fill="#010066"/><circle cx="13" cy="17" r="8" fill="#fc0"/><circle cx="16" cy="17" r="7" fill="#010066"/></svg>',
 all:'<svg class="fg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#1e6f8c"/><path d="M8 30h44M30 8c-9 9-9 35 0 44M30 8c9 9 9 35 0 44" stroke="#fff" stroke-width="3" fill="none"/></svg>'};
var ZONES=[
 {k:'all',th:'ทุกพื้นที่',en:'All locations',f:'all',s:null,c:[108,7],z:4.2},
 {k:'mk',th:'ลุ่มน้ำแม่กลอง',en:'Mae Krong Basin',f:'th',s:[0,1,4,7,19,22,24],d:['ศรีนครินทร์','วชิราลงกรณ'],c:[99.8,13.8],z:30},
 {k:'cp',th:'ลุ่มน้ำเจ้าพระยา',en:'Chaopaya Basin',f:'th',s:[3,6,8,9,13,14,17,18,21,23,26,27],d:['ภูมิพล','สิริกิติ์','แควน้อยบำรุงแดน','ป่าสักชลสิทธิ์'],c:[100.3,14.6],z:11},
 {k:'ch',th:'ลุ่มน้ำชี',en:'Chee Basin',f:'th',s:[15,20],d:['อุบลรัตน์','ลำปาว'],c:[102.75,16.45],z:30},
 {k:'bp',th:'ลุ่มน้ำบางปะกง',en:'Bangpakong Basin',f:'th',s:[5,12],d:['อ่างฯ พระปรง','อ่างฯ คลองพระสะทึง','ขุนด่านปราการชล'],c:[101.7,13.92],z:34},
 {k:'ea',th:'ภาคตะวันออก',en:'Eastern Seaboard',f:'th',s:[2,11,16,25],d:['หนองปลาไหล','ประแสร์','บางพระ','คลองสียัด'],c:[101.1,13.0],z:34},
 {k:'so',th:'ภาคใต้',en:'Southern Thailand',f:'th',s:[10],c:[100.3,7.13],z:30},
 {k:'vn',th:'เวียดนาม',en:'Vietnam',f:'vn',s:[28,29,30,31,37,41],c:[106.5,15.8],z:6},
 {k:'id',th:'อินโดนีเซีย',en:'Indonesia',f:'id',s:[32,33,35,36,38,39,40,42,44],c:[109.5,-6.7],z:7},
 {k:'ph',th:'ฟิลิปปินส์',en:'Philippines',f:'ph',s:[43],c:[120.8,15],z:30},
 {k:'my',th:'มาเลเซีย',en:'Malaysia',f:'my',s:[34],c:[101.45,3.09],z:30}];
var DAMEN={'ศรีนครินทร์':'Srinagarind','วชิราลงกรณ':'Vajiralongkorn','ภูมิพล':'Bhumibol','สิริกิติ์':'Sirikit','แควน้อยบำรุงแดน':'Khwae Noi','ป่าสักชลสิทธิ์':'Pasak Jolasid','อุบลรัตน์':'Ubol Ratana','ลำปาว':'Lam Pao','ขุนด่านปราการชล':'Khun Dan Prakan Chon','อ่างฯ พระปรง':'Phra Prong res.','อ่างฯ คลองพระสะทึง':'Khlong Phra Sathueng res.','หนองปลาไหล':'Nong Pla Lai','ประแสร์':'Prasae','คลองสียัด':'Khlong Si Yat','บางพระ':'Bang Phra'};
function damName(n){return TH()?(n.indexOf('อ่าง')===0?n:'เขื่อน'+n):(DAMEN[n]||n)}
var MTH=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'],MEN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var META={live:false,today:'2026-11-19',pmDays:['2026-11-12','2026-11-13','2026-11-14','2026-11-15','2026-11-16','2026-11-17','2026-11-18','2026-11-19','2026-11-20','2026-11-21','2026-11-22','2026-11-23'],hiDays:[],months:['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11'],eraEnd:'2026-11-12',damsDate:'2026-11-18',asOf:'2026-11-19T02:00:00Z'};for(var q=5;q<=25;q++)META.hiDays.push('2026-11-'+(q<10?'0':'')+q);
var DPM,TPM,DHI,THI,MON_TH,MON_EN;
function dm(d){var m=+d.slice(5,7)-1;return +d.slice(8,10)+' '+(TH()?MTH[m]:MEN[m])}
function dshort(d){return String(+d.slice(8,10))}
function ym(m,k,last){var i=+m.slice(5,7)-1;return (TH()?MTH[i]:MEN[i])+(last?'*':'')}
function nums(s){return s.split(' ').map(Number)}
var D;function setData(RAW,A4T,DAMS_,M){if(M)META=M;DAMS=DAMS_;DPM=META.pmDays.map(dshort);TPM=META.pmDays.indexOf(META.today);if(TPM<0)TPM=7;DHI=META.hiDays.map(dshort);THI=META.hiDays.indexOf(META.today);if(THI<0)THI=14;
 D=RAW.split('\n').map(function(l,i){var f=l.split('|');return {i:i,name:NAMES[i],lat:LL[i][0],lng:LL[i][1],pm:+f[0],aqi:+f[1],pmd:nums(f[2]),feel:+f[3],hi:nums(f[4]),rain30:+f[5],et30:+f[6],rain7:+f[7],sm:+f[8],m12:f[9].split(' ').map(function(x){return x.split('/').map(Number)}),r30:nums(f[10]),r90:nums(f[11]),dry:+f[12],a4:null}});
(A4T||'').split('\n').forEach(function(l,i){if(!l||!D[i])return;var f=l.split('|');D[i].a4={id:f[0],n:f[1],p:f[2],km:+f[3],pm:+f[4],aqi:+f[5],t:f[6]}})}
setData(RAW,A4T,DAMS,null);
function zoneOf(i){for(var z=1;z<ZONES.length;z++)if(ZONES[z].s.indexOf(i)>=0)return ZONES[z];return ZONES[0]}
function zn(z){return TH()?z.th:z.en}
function cl(x,a,b){return Math.max(a,Math.min(b,x))}
function okd(n){var v=DAMS[n];return !!(v&&v[1]!=null)}
function damMin(z){if(!z.d)return null;var m=1e9;z.d.filter(okd).forEach(function(n){var v=DAMS[n];if(v[1]<m)m=v[1]});return m<1e9?m:null}
function drought(s){var z=zoneOf(s.i),dm=damMin(z),s1=100-s.r90[3],wb=s.rain30-s.et30,s2=cl(-wb/150*100,0,100),s4=cl(s.dry/30*100,0,100),s3=dm==null?null:cl((80-dm)/50*100,0,100);
 var sc=s3==null?(s1*.5+s2*.35+s4*.15):(s1*.4+s2*.25+s3*.25+s4*.1);return {sc:Math.round(sc),wb:wb,dm:dm,p90:Math.round(s.r90[0]/s.r90[1]*100)}}
var DLV=[[30,'ปกติ','Normal','#2e9d5b'],[50,'เฝ้าระวัง','Watch','#e2a400'],[70,'เสี่ยง','High','#f07b1d'],[101,'วิกฤต','Critical','#d7263d']];
var PLV=[[15.05,'ดีมาก','Very good','#2d8fd5'],[25.05,'ดี','Good','#2e9d5b'],[37.55,'ปานกลาง','Moderate','#e2a400'],[75.05,'เริ่มมีผลต่อสุขภาพ','Unhealthy (sensitive)','#f07b1d'],[1e9,'มีผลต่อสุขภาพ','Unhealthy','#d7263d']];
var HLV=[[27,'ปกติ','Normal','#2e9d5b'],[33,'เฝ้าระวัง','Caution','#e2a400'],[42,'เตือนภัย','Warning','#f07b1d'],[52,'อันตราย','Danger','#d7263d'],[1e9,'อันตรายมาก','Extreme danger','#7b2cbf']];
function lv(L,v){for(var k=0;k<L.length;k++)if(v<L[k][0])return L[k];return L[L.length-1]}
function ln(l){return TH()?l[1]:l[2]}
function pmOf(s){return s.a4?s.a4.pm:s.pm}
var PAGE='dr',ZONE=ZONES[0],SEL=0,LAYER='pm',CH={},PT=null;
function ch(id){var e=document.getElementById(id);if(!e)return null;var c=echarts.getInstanceByDom(e)||echarts.init(e);CH[id]=c;return c}
function $(id){return document.getElementById(id)}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ---------- layout ---------- */
var sec=document.createElement('section');sec.className='fp dp';sec.id='dp';sec.hidden=true;
sec.innerHTML='<button type="button" class="back" id="dbk"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span id="dbkt">Main Page</span></button><h2 class="fp-t" id="dpt"></h2>'+
 '<div class="dfeed" id="dfeed"></div>'+
 '<div class="fp-g">'+
 '<article class="bx"><div class="bh"><span class="no">1</span><h3>SCGP Locations</h3></div><div class="dlay"><div class="dmw"><div id="dmap"></div><div class="dst" id="dst"></div><div class="dly" id="dly"></div><div class="dlg" id="dlg"></div></div><div class="dside"><div class="dzs" id="dzs"></div><div class="drk" id="drk"></div></div></div></article>'+
 '<article class="bx"><div class="bh"><span class="no">2</span><h3>Risk trigger point</h3></div><div class="dtabs" id="dtabs"></div><div class="dscn" id="dscn"></div><div class="dact" id="dact"></div><div class="dkp" id="dkp"></div></article>'+
 '<article class="bx"><div class="bh"><span class="no">3</span><h3 id="b3t"></h3></div><div class="dg2" id="dg2"></div></article>'+
 '<article class="bx"><div class="bh"><span class="no">4</span><h3 id="b4t"></h3></div><div class="dtw"><table class="dsrc" id="dsrc"></table></div></article>'+
 '</div>';
var fp=$('fp');fp.parentNode.insertBefore(sec,fp.nextSibling);
var hero=$('hero');
function openPage(k){PAGE=k;document.body.classList.add('onfl');hero.classList.add('flood');fp.hidden=true;sec.hidden=false;scrollTo(0,0);render()}
function closePage(){sec.hidden=true;stopParticles()}
$('dbk').onclick=function(){try{location.hash='home'}catch(e){}closePage();document.body.classList.remove('onfl');hero.classList.remove('flood')};
document.querySelectorAll('.topic').forEach(function(b){var k=b.dataset.k;if(k!=='drought'&&k!=='air')return;b.onclick=function(){try{location.hash=k==='drought'?'drought':'air-quality'}catch(e){}route()}});
function route(){var h=location.hash;if(h==='#drought')openPage('dr');else if(h==='#air-quality')openPage('air');else if(!sec.hidden)closePage()}
addEventListener('hashchange',route);
var oAL=window.applyLang;if(oAL){window.applyLang=function(){oAL.apply(this,arguments);if(!sec.hidden)render()};applyLang=window.applyLang}

/* ---------- feed ---------- */
function asof(){var d=new Date(META.asOf);if(isNaN(d))return '';var b=new Date(d.getTime()+7*3600e3).toISOString();return dm(b.slice(0,10))+' '+b.slice(11,16)}
function feed(){var items;
 if(PAGE==='dr'){items=D.map(function(s){var d=drought(s);return [d.sc,s.name,X('ดัชนีภัยแล้ง ','Drought index ')+d.sc,lv(DLV,d.sc)[3]]}).sort(function(a,b){return b[0]-a[0]}).slice(0,10);
  Object.keys(DAMS).filter(okd).forEach(function(n){var v=DAMS[n];items.push([0,damName(n),v[1].toFixed(1)+'%',v[1]<50?'#f07b1d':'#2d8fd5'])})}
 else items=D.map(function(s){var p=pmOf(s);return [p,s.name,'PM2.5 '+p+' · HI '+s.hi[THI]+'°C',lv(PLV,p)[3]]}).sort(function(a,b){return b[0]-a[0]}).slice(0,16);
 var row=items.map(function(x){return '<span><i style="background:'+x[3]+'"></i>'+esc(x[1])+'<b>'+esc(x[2])+'</b></span>'}).join('');
 $('dfeed').innerHTML='<span class="wdot'+(META.live?' on':'')+'"></span><span class="wtag'+(META.live?' on':'')+'">'+(META.live?'LIVE':'SNAPSHOT')+'</span><div class="dti"><b>'+X('Climate data · ','Climate data · ')+(PAGE==='dr'?X('ภัยแล้ง','Drought'):X('คุณภาพอากาศและความร้อน','Air quality & Heat'))+'</b><small>'+(META.live?X('ข้อมูล ณ ','Data as of ')+asof()+X(' · อัปเดตทุก 30 นาที',' · refreshes every 30 min'):X('ข้อมูลสำรอง ณ ','Fallback snapshot ')+asof()+X(' · กำลังเชื่อมต่อข้อมูลสด…',' · connecting to live data…'))+'</small></div><div class="dtk"><div class="dtr">'+row+row+'</div></div>'}

/* ---------- box 1: map ---------- */
function colorOf(s){if(PAGE==='dr')return lv(DLV,drought(s).sc)[3];return LAYER==='pm'?lv(PLV,pmOf(s))[3]:lv(HLV,s.hi[THI])[3]}
function tip(s){var z=zoneOf(s.i),h='<b>'+esc(s.name)+'</b><br><span style="opacity:.8">'+zn(z)+'</span><br>';
 if(PAGE==='dr'){var d=drought(s),l=lv(DLV,d.sc);h+=X('ดัชนีภัยแล้ง ','Drought index ')+'<b style="color:'+l[3]+'">'+d.sc+' · '+ln(l)+'</b><br>'+X('ฝน 90 วัน ','Rain 90 d ')+d.p90+X('% ของค่าปกติ','% of normal')+'<br>'+X('สมดุลน้ำ 30 วัน ','Water balance 30 d ')+Math.round(d.wb)+' mm'+(d.dm!=null?'<br>'+X('อ่างฯ ในลุ่มน้ำ ต่ำสุด ','Lowest basin reservoir ')+d.dm.toFixed(0)+'%':'')}
 else{var p=pmOf(s),pl=lv(PLV,p),hl=lv(HLV,s.hi[THI]);h+='PM2.5 <b style="color:'+pl[3]+'">'+p+' µg/m³ · '+ln(pl)+'</b><br><small>'+(s.a4?'Air4Thai '+esc(s.a4.n)+' · '+s.a4.km+' km':'CAMS model')+'</small><br>'+X('ดัชนีความร้อนวันนี้ ','Heat index today ')+'<b style="color:'+hl[3]+'">'+s.hi[THI]+'°C · '+ln(hl)+'</b>'}
 return h+'<br><span style="opacity:.7;font-size:10px">'+X('คลิกเพื่อดูรายละเอียด','Click for details')+'</span>'}
function drawMap(){var c=ch('dmap');if(!c)return;
 c.setOption({tooltip:{trigger:'item',confine:true,backgroundColor:'rgba(20,56,79,.95)',textStyle:{fontSize:11},extraCssText:'border-radius:8px',formatter:function(p){return p.seriesType==='scatter'?tip(D[p.value[2]]):''}},
  geo:{map:'world',roam:true,center:ZONE.c,zoom:ZONE.z,scaleLimit:{min:1.5,max:90},itemStyle:{areaColor:'#ffffff',borderColor:'#c5d0d8',borderWidth:.6},emphasis:{itemStyle:{areaColor:'#f2f6f8'},label:{show:false}},label:{show:false}},
  series:[{type:'scatter',coordinateSystem:'geo',symbol:'pin',animationDurationUpdate:600,symbolSize:function(v){return v[2]===SEL?36:24},
   data:D.map(function(s){return {name:s.name,value:[s.lng,s.lat,s.i],itemStyle:{color:colorOf(s),borderColor:'#fff',borderWidth:1.2,shadowBlur:4,shadowColor:'rgba(20,56,79,.35)'}}}),z:3}]},true);
 c.off('click');c.on('click',function(p){if(p.seriesType==='scatter')pick(p.value[2],true)})}
function stats(){var hi=0,wa=0;D.forEach(function(s){if(PAGE==='dr'){var v=drought(s).sc;if(v>=50)hi++;else if(v>=30)wa++}else{if(pmOf(s)>37.5)hi++;if(s.hi[THI]>=42)wa++}});
 $('dst').innerHTML='<div><b class="cu" data-v="45">45</b>Sites</div>'+(PAGE==='dr'?'<div><b style="color:#e2a400" class="cu" data-v="'+wa+'">'+wa+'</b>Watch</div><div><b style="color:#d7263d" class="cu" data-v="'+hi+'">'+hi+'</b>High risk</div>':'<div><b style="color:#f07b1d" class="cu" data-v="'+hi+'">'+hi+'</b>PM2.5 &gt;37.5</div><div><b style="color:#d7263d" class="cu" data-v="'+wa+'">'+wa+'</b>Heat ≥42°C</div>')+'<div><b>5</b>Countries</div>';
 var L=PAGE==='dr'?DLV:(LAYER==='pm'?PLV:HLV);$('dlg').innerHTML=L.map(function(l){return '<span><i style="background:'+l[3]+'"></i>'+ln(l)+'</span>'}).join('');
 $('dly').style.display=PAGE==='dr'?'none':'flex';$('dly').innerHTML='<button data-l="pm" aria-pressed="'+(LAYER==='pm')+'">PM2.5</button><button data-l="hi" aria-pressed="'+(LAYER==='hi')+'">Heat index</button>';
 $('dly').querySelectorAll('button').forEach(function(b){b.onclick=function(){LAYER=b.dataset.l;stats();drawMap();rank()}})}
function zones(){var h='';ZONES.forEach(function(z,k){var n=0;(z.s||D.map(function(s){return s.i})).forEach(function(i){var s=D[i];if(PAGE==='dr'?drought(s).sc>=50:pmOf(s)>37.5)n++});
  h+='<button type="button" class="dzb" data-k="'+k+'" aria-pressed="'+(z===ZONE)+'">'+FLAG[z.f]+'<span>'+zn(z)+'</span>'+(n?'<em style="background:'+(PAGE==='dr'?'#f07b1d':'#f07b1d')+'">'+n+'</em>':'')+'</button>'});
 $('dzs').innerHTML=h;$('dzs').querySelectorAll('.dzb').forEach(function(b){b.onclick=function(){ZONE=ZONES[+b.dataset.k];if(ZONE.s)SEL=topOf(ZONE.s);zones();drawMap();rank();box2();box3()}})}
function score(s){return PAGE==='dr'?drought(s).sc:(LAYER==='pm'?pmOf(s):s.hi[THI])}
function topOf(ids){return ids.slice().sort(function(a,b){return score(D[b])-score(D[a])})[0]}
function rank(){var ids=ZONE.s||D.map(function(s){return s.i});var rows=ids.map(function(i){return {i:i,v:score(D[i])}}).sort(function(a,b){return b.v-a.v});
 var L=PAGE==='dr'?DLV:(LAYER==='pm'?PLV:HLV);
 $('drk').innerHTML='<div style="font-weight:700;margin:2px 4px 4px">'+(PAGE==='dr'?X('เรียงตามดัชนีภัยแล้ง','Ranked by drought index'):LAYER==='pm'?X('เรียงตาม PM2.5 (µg/m³)','Ranked by PM2.5 (µg/m³)'):X('เรียงตามดัชนีความร้อน (°C)','Ranked by heat index (°C)'))+'</div>'+rows.map(function(r){return '<div class="r'+(r.i===SEL?' on':'')+'" data-i="'+r.i+'"><span>'+esc(D[r.i].name)+'</span><span class="dpl" style="background:'+lv(L,r.v)[3]+'">'+r.v+'</span></div>'}).join('');
 $('drk').querySelectorAll('.r').forEach(function(r){r.onclick=function(){pick(+r.dataset.i,true)}})}
function pick(i,scroll){SEL=i;var z=zoneOf(i);if(ZONE.s&&ZONE.s.indexOf(i)<0){ZONE=z;zones()}drawMap();rank();box2();box3();if(scroll){var b=sec.querySelectorAll('.bx')[1];if(b&&innerWidth<820)b.scrollIntoView({behavior:'smooth'})}}

/* ---------- box 2: scene ---------- */
function bub(x,y,v,u,lab,col,left,pd,tipT){var lx=left?x-40:x+40,an=left?'end':'start';
 return '<g class="bub'+(pd?' pd':'')+'"><title>'+esc(tipT||lab)+'</title><circle class="ring" cx="'+x+'" cy="'+y+'" r="33" stroke="'+(col||'#c3ced6')+'" stroke-dasharray="207" stroke-dashoffset="207"><animate attributeName="stroke-dashoffset" from="207" to="0" dur="1.2s" fill="freeze"/></circle><circle class="o" cx="'+x+'" cy="'+y+'" r="27"/><text class="v" x="'+x+'" y="'+(y+4)+'" text-anchor="middle">'+v+'</text><text class="u" x="'+x+'" y="'+(y+15)+'" text-anchor="middle">'+(u||'')+'</text>'+
  lab.split('\n').map(function(t,k){return '<text class="lb" x="'+lx+'" y="'+(y-4+k*12)+'" text-anchor="'+an+'">'+esc(t)+'</text>'}).join('')+'</g>'}
function waveP(y,amp,x0,w){var d='M'+x0+' '+y;for(var x=x0;x<x0+w+400;x+=100)d+=' q25 '+(-amp)+' 50 0 t50 0';return d+' L'+(x0+w+400)+' '+(y+200)+' L'+x0+' '+(y+200)+' Z'}
function sceneDr(s){var d=drought(s),z=zoneOf(s.i),dams=(z.d||[]).filter(okd),dn=dams.length?dams.reduce(function(a,b){return DAMS[a][1]<=DAMS[b][1]?a:b}):null,dp=dn?DAMS[dn][1]:null;
 var dryK=cl(1-s.sm/38,0,1),crack=cl(.15+dryK,0,1),wl=dp==null?330:330-74*cl(dp,0,110)/110,rainO=cl(s.rain7/25,0,1);
 var leaf=s.sm>=28?'#3f9b4f':s.sm>=20?'#9bb24a':'#c49a3a';
 var g='<svg class="sc" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8ec"/><stop offset="1" stop-color="'+(d.sc>=50?'#f8d9a6':'#eaf2f6')+'"/></linearGradient><clipPath id="dbas"><path d="M600 252 L960 252 L930 332 L630 332 Z"/></clipPath><linearGradient id="dwat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9df"/><stop offset="1" stop-color="#1e6f8c"/></linearGradient></defs>'+
 '<rect width="1000" height="400" fill="url(#dsky)"/>'+
 '<g transform="translate(120 92)"><g class="dsun">'+[0,30,60,90,120,150,180,210,240,270,300,330].map(function(a){return '<line x1="0" y1="-46" x2="0" y2="-60" stroke="#f6a723" stroke-width="5" stroke-linecap="round" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="36" fill="#f9c74f"/><circle r="36" fill="#f6a723" opacity="'+(0.2+0.6*d.sc/100).toFixed(2)+'"/></g>'+
 '<g opacity="'+(0.35+0.65*rainO).toFixed(2)+'" transform="translate(760 70)"><ellipse cx="0" cy="0" rx="58" ry="24" fill="#c9d6de"/><ellipse cx="-34" cy="8" rx="34" ry="18" fill="#d8e2e8"/><ellipse cx="38" cy="10" rx="36" ry="18" fill="#d8e2e8"/>'+(s.rain7>=1?[-40,-15,10,35,-28,22].map(function(x,k){return '<line class="ddrop" style="animation-delay:'+(k*.18)+'s" x1="'+x+'" y1="30" x2="'+(x-4)+'" y2="42" stroke="#2d8fd5" stroke-width="2.4" stroke-linecap="round"/>'}).join(''):'')+'</g>'+
 '<path d="M0 270 Q120 220 260 250 T560 240 T1000 230 L1000 330 L0 330 Z" fill="#efe3cd"/>'+
 [0,1,2].map(function(k){return '<path class="dshim" style="animation-delay:'+(k*.9)+'s" d="M'+(260+k*60)+' 245 q8 -8 0 -16 q-8 -8 0 -16" stroke="#f0b35a" stroke-width="2" fill="none"/>'}).join('')+
 '<line x1="0" y1="318" x2="1000" y2="318" stroke="#b9a68a" stroke-width="2" stroke-dasharray="14 10"/>'+
 '<g class="dcar"><rect x="0" y="292" width="62" height="20" rx="4" fill="#2d8fd5"/><rect x="0" y="286" width="44" height="14" rx="7" fill="#7cc0ec"/><rect x="62" y="296" width="20" height="16" rx="3" fill="#14384f"/><circle cx="14" cy="314" r="6" fill="#333"/><circle cx="68" cy="314" r="6" fill="#333"/><text x="22" y="297" font-size="8" fill="#fff" font-weight="700">H₂O</text></g>'+
 '<g transform="translate(250 175)"><rect x="0" y="60" width="150" height="85" fill="#9fb0bc"/><path d="M0 60 L30 40 L30 60 L60 40 L60 60 L90 40 L90 60 Z" fill="#8a9ca8"/><rect x="110" y="0" width="16" height="60" fill="#7d8f9b"/><rect x="110" y="8" width="16" height="6" fill="#d7263d"/>'+
  [0,1,2,3].map(function(k){return '<rect x="'+(12+k*32)+'" y="80" width="18" height="14" fill="#e6edf2"/>'}).join('')+'<rect x="60" y="110" width="30" height="35" fill="#5e7180"/>'+
  '<g transform="translate(168 70)"><rect x="0" y="0" width="46" height="62" rx="8" fill="#eef2f5" stroke="#8a9ca8" stroke-width="2"/><rect x="2" y="30" width="42" height="30" rx="6" fill="#7cc0ec" opacity=".45"/><rect x="20" y="62" width="6" height="13" fill="#8a9ca8"/></g></g>'+
 '<path d="M600 252 L960 252 L930 332 L630 332 Z" fill="#d9c4a0"/>'+
 '<g clip-path="url(#dbas)"><rect class="dfl" x="600" y="'+wl.toFixed(1)+'" width="360" height="'+(340-wl).toFixed(1)+'" fill="url(#dwat)"/>'+(dp!=null?'<path class="dwave" d="'+waveP(wl-2,5,600,360)+'" fill="#5aa9df" opacity=".8"/><path class="dwave r" d="'+waveP(wl,4,560,400)+'" fill="#7cc0ec" opacity=".45"/>':'')+'</g>'+
 '<path d="M958 230 L990 230 L1000 334 L940 334 Z" fill="#a9b6bf"/>'+
 '<rect x="0" y="330" width="1000" height="70" fill="#c49a66"/><rect x="0" y="330" width="1000" height="8" fill="#b08654"/>'+
 '<g class="dcrk" stroke="#7a5631" stroke-width="2" fill="none" opacity="'+crack.toFixed(2)+'"><path d="M40 345 l20 14 l-6 18 l22 12"/><path d="M140 340 l-10 20 l18 10 l-4 22"/><path d="M220 350 l26 6 l8 20"/><path d="M420 344 l-14 18 l20 14 l-8 16"/><path d="M520 352 l30 10 l-6 22"/><path d="M700 342 l12 22 l-18 16"/><path d="M820 350 l24 8 l6 24"/><path d="M900 344 l-16 22 l20 18"/></g>'+
 [40,80,120,160,200].map(function(x,k){return '<g class="dleaf" style="animation-delay:'+(k*.3)+'s"><path d="M'+x+' 330 L'+x+' 300" stroke="'+leaf+'" stroke-width="3"/><path d="M'+x+' 312 q-14 -6 -18 -18 q14 2 18 14 M'+x+' 306 q14 -6 18 -18 q-14 2 -18 14" fill="'+leaf+'"/></g>'}).join('');
 var l90=lv(DLV,d.p90<70?80:d.p90<85?60:d.p90<100?40:10),lwb=lv(DLV,d.wb<-100?80:d.wb<-50?60:d.wb<0?40:10),lsm=lv(DLV,s.sm<15?80:s.sm<22?60:s.sm<28?40:10),ldy=lv(DLV,s.dry>=21?80:s.dry>=14?60:s.dry>=7?40:10);
 g+=bub(470,62,d.p90+'%',X('ของค่าปกติ','of normal'),X('ฝนสะสม 90 วัน\nเทียบค่าปกติ','Rain 90 days\nvs normal'),l90[3],false,false,X('ฝน 90 วัน ','90-day rain ')+s.r90[0]+' mm / '+X('ค่าเฉลี่ย ','normal ')+s.r90[1]+' mm (ERA5 2011–2025)');
 g+=bub(275,150,(d.wb>0?'+':'')+Math.round(d.wb),'mm',X('สมดุลน้ำ 30 วัน\nฝน − ET₀','Water balance\n30 d rain − ET₀'),lwb[3],false,false,X('ฝน ','Rain ')+s.rain30+' − ET₀ '+s.et30+' mm');
 g+=bub(880,150,s.rain7,'mm',X('ฝนคาดการณ์\n7 วัน','Rain forecast\nnext 7 d'),'#2d8fd5',true,false,'Open-Meteo forecast · 7 d');
 g+=bub(330,372-10,s.sm+'%','vol',X('ความชื้นในดิน\n9–27 ซม.','Soil moisture\n9–27 cm'),lsm[3],false,false,X('แบบจำลอง Open-Meteo','Open-Meteo model'));
 g+=bub(100,232,s.dry,X('วัน','days'),X('ฝนทิ้งช่วง','Dry spell'),ldy[3],false,false,X('จำนวนวันติดกันที่ฝน < 1 มม.','Consecutive days < 1 mm'));
 g+=dp!=null?bub(780,212,dp.toFixed(0)+'%',X('ความจุ','storage'),damName(dn),lv(DLV,dp<30?80:dp<50?60:dp<80?40:10)[3],true,false,X('กรมชลประทาน '+dm(META.damsDate)+' · ปริมาณน้ำ ','RID '+dm(META.damsDate)+' · volume ')+DAMS[dn][0]+X(' ล้าน ลบ.ม.',' MCM')):bub(780,212,'N/A','',X('อ่างเก็บน้ำต้นน้ำ','Upstream reservoir'),null,true,true,X('ยังไม่มีแหล่งข้อมูลเปิด','No open source yet'));
 g+=bub(470,190,'—',X('วัน','days'),X('น้ำดิบสำรอง\nในโรงงาน','Raw water stock\nin plant'),null,false,true,X('รอข้อมูลจาก Engineering/Utility','Pending Engineering/Utility data'));
 return g+'</svg>'}
function sceneAir(s){var p=pmOf(s),pl=lv(PLV,p),h=s.hi[THI],hl=lv(HLV,h),hz=cl(p/110,.04,.55),th=cl((h-20)/36,0,1)*220;
 var g='<svg class="sc" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="asky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3eef6"/><stop offset="1" stop-color="#fbf6ec"/></linearGradient></defs>'+
 '<rect width="1000" height="400" fill="url(#asky)"/>'+
 '<g transform="translate(120 92)"><g class="dsun">'+[0,30,60,90,120,150,180,210,240,270,300,330].map(function(a){return '<line x1="0" y1="-46" x2="0" y2="-60" stroke="'+hl[3]+'" stroke-width="5" stroke-linecap="round" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="36" fill="#f9c74f"/><circle r="36" fill="'+hl[3]+'" opacity=".35"/></g>'+
 '<g fill="#c8d2da">'+[[560,200,40,130],[605,170,34,160],[645,215,46,115],[700,185,30,145],[735,225,40,105]].map(function(b){return '<rect x="'+b[0]+'" y="'+b[1]+'" width="'+b[2]+'" height="'+b[3]+'"/>'}).join('')+'</g>'+
 '<g transform="translate(250 150)"><rect x="0" y="90" width="230" height="90" fill="#9fb0bc"/><path d="M0 90 L40 62 L40 90 L80 62 L80 90 L120 62 L120 90 Z" fill="#8a9ca8"/><rect x="150" y="10" width="18" height="80" fill="#7d8f9b"/><rect x="190" y="30" width="16" height="60" fill="#7d8f9b"/><rect x="150" y="18" width="18" height="6" fill="#d7263d"/><rect x="190" y="38" width="16" height="6" fill="#d7263d"/>'+
  [0,1,2,3,4].map(function(k){return '<rect x="'+(14+k*42)+'" y="112" width="22" height="16" fill="#e6edf2"/>'}).join('')+'<rect x="96" y="140" width="34" height="40" fill="#5e7180"/>'+
  [0,1,2].map(function(k){return '<circle class="dsmk" style="animation-delay:'+(k*1.6)+'s" cx="159" cy="4" r="12" fill="#b0aaa0"/><circle class="dsmk" style="animation-delay:'+(k*1.6+.8)+'s" cx="198" cy="24" r="10" fill="#c2bcb2"/>'}).join('')+'</g>'+
 '<rect x="0" y="330" width="1000" height="70" fill="#9aa7b0"/><line x1="0" y1="352" x2="1000" y2="352" stroke="#fff" stroke-width="2" stroke-dasharray="20 14"/>'+
 '<g class="dcar"><rect x="0" y="334" width="58" height="16" rx="5" fill="#1e6f8c"/><rect x="12" y="324" width="30" height="12" rx="5" fill="#7cc0ec"/><circle cx="12" cy="352" r="5" fill="#333"/><circle cx="46" cy="352" r="5" fill="#333"/></g>'+
 '<g transform="translate(560 262)"><circle cx="12" cy="8" r="9" fill="#f2c9a0"/><path d="M1 6 q11 -16 22 0 Z" fill="#f6b73c"/><rect x="2" y="18" width="20" height="30" rx="5" fill="#f07b1d"/><rect x="4" y="48" width="7" height="20" fill="#14384f"/><rect x="13" y="48" width="7" height="20" fill="#14384f"/>'+
  [0,1].map(function(k){return '<path class="dshim" style="animation-delay:'+(k*1.2)+'s" d="M'+(30+k*12)+' 20 q6 -6 0 -12 q-6 -6 0 -12" stroke="'+hl[3]+'" stroke-width="2" fill="none"/>'}).join('')+'</g>'+
 '<rect width="1000" height="330" fill="#a39582" opacity="'+hz.toFixed(2)+'"/>'+
 '<g transform="translate(930 0)"><rect x="-12" y="70" width="24" height="230" rx="12" fill="#fff" stroke="#14384f" stroke-width="2"/><rect class="dfl" id="dthf" x="-6" y="'+(296)+'" width="12" height="0" rx="6" fill="'+hl[3]+'"/><circle cx="0" cy="312" r="22" fill="'+hl[3]+'" stroke="#14384f" stroke-width="2"/>'+
  [[27,'27'],[33,'33'],[42,'42'],[52,'52']].map(function(t){var y=296-cl((t[0]-20)/36,0,1)*220;return '<line x1="12" y1="'+y+'" x2="22" y2="'+y+'" stroke="#14384f"/><text x="26" y="'+(y+4)+'" font-size="10" fill="#14384f">'+t[1]+'</text>'}).join('')+'</g>';
 var mx=Math.max.apply(null,s.pmd.slice(TPM+1)),hx=Math.max.apply(null,s.hi.slice(THI+1));
 g+=s.a4?bub(230,210,s.a4.pm,'µg/m³',X('PM2.5 สถานีวัด\n'+s.a4.p+' '+s.a4.km+' กม.','PM2.5 station\n'+s.a4.km+' km away'),pl[3],false,false,'Air4Thai '+s.a4.n+' · '+s.a4.t+' · AQI(TH) '+s.a4.aqi):bub(230,210,'N/A','',X('PM2.5 สถานีวัด','PM2.5 station'),null,false,true,X('วางแผน: OpenAQ (ขอคีย์)','Planned: OpenAQ (API key)'));
 g+=bub(330,62,s.pm,'µg/m³',X('PM2.5 แบบจำลอง\nCAMS','PM2.5 model\nCAMS'),lv(PLV,s.pm)[3],false,false,'Copernicus CAMS · US AQI '+s.aqi);
 g+=bub(560,62,mx,'µg/m³',X('PM2.5 สูงสุด\n4 วันข้างหน้า','PM2.5 max\nnext 4 days'),lv(PLV,mx)[3],false,false,'CAMS forecast · 4 d');
 g+=bub(845,120,h,'°C',X('ดัชนีความร้อน\nวันนี้','Heat index\ntoday'),hl[3],true,false,X('เกณฑ์กรมอุตุนิยมวิทยา','TMD thresholds'));
 g+=bub(845,230,hx,'°C',X('สูงสุด\n6 วันข้างหน้า','Max next\n6 days'),lv(HLV,hx)[3],true,false,'Open-Meteo forecast');
 g+=bub(470,300,s.feel,'°C',X('อุณหภูมิที่รู้สึกได้\nขณะนี้','Feels like\nnow'),lv(HLV,s.feel)[3],false,false,'09:00');
 PT={n:Math.round(cl(p,3,120)*3),th:th};
 return g+'</svg>'}
var raf=0;function stopParticles(){cancelAnimationFrame(raf);raf=0}
function particles(){stopParticles();var cv=$('dpcv');if(!cv||!PT)return;var sv=cv.parentNode.querySelector('svg.sc');cv.style.width=sv.getBoundingClientRect().width+'px';cv.style.height=sv.getBoundingClientRect().height+'px';var r=cv.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dpr;cv.height=r.height*dpr;var x=cv.getContext('2d');x.scale(dpr,dpr);
 var P=[];for(var i=0;i<PT.n;i++)P.push([Math.random()*r.width,Math.random()*r.height*.82,.2+Math.random()*.6,(Math.random()-.5)*.2,.8+Math.random()*2.2]);
 var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function f(){x.clearRect(0,0,r.width,r.height);P.forEach(function(p){p[0]+=p[2];p[1]+=p[3];if(p[0]>r.width)p[0]=-4;if(p[1]<0||p[1]>r.height*.82)p[3]=-p[3];x.beginPath();x.arc(p[0],p[1],p[4],0,6.283);x.fillStyle='rgba(110,96,80,.45)';x.fill()});if(!rm&&!sec.hidden)raf=requestAnimationFrame(f)}f()}
function countUp(root){root.querySelectorAll('.cu').forEach(function(e){var t=parseFloat(e.dataset.v),dec=(e.dataset.v.split('.')[1]||'').length,st=null,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(isNaN(t)||rm)return;
 function f(ts){if(!st)st=ts;var k=Math.min(1,(ts-st)/1100),v=t*(1-Math.pow(1-k,3));e.textContent=(t>0&&e.dataset.p?'+':'')+v.toFixed(dec);if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)})}
function kp(o){var c=o.l?o.l[3]:'#c3ced6';return '<div class="dk'+(o.pd?' pd':'')+'" style="--c:'+c+'" title="'+esc(o.tip||'')+'"><small>'+o.t+'</small><b'+(o.n!=null?' class="cu" data-v="'+o.n+'"'+(o.plus?' data-p="1"':''):'')+'>'+o.v+'</b><u>'+(o.u||'')+'</u>'+(o.l?'<span class="lv" style="background:'+c+'">'+ln(o.l)+'</span>':'')+(o.bar!=null?'<div class="bar"><i data-w="'+cl(o.bar,2,100)+'" style="background:'+c+'"></i></div>':'')+'<span class="src">'+o.src+'</span></div>'}
function gauge(id,v,max,L,name,unit){var c=ch(id);if(!c)return;var stops=[];L.forEach(function(l,k){stops.push([Math.min(1,(k===L.length-1?max:l[0])/max),l[3]])});
 c.setOption({series:[{type:'gauge',min:L===HLV?20:0,max:max,radius:'92%',center:['50%','58%'],startAngle:200,endAngle:-20,splitNumber:4,
  axisLine:{lineStyle:{width:10,color:L===HLV?HLV.map(function(l){return [Math.min(1,(Math.min(l[0],max)-20)/(max-20)),l[3]]}):stops}},axisTick:{show:false},splitLine:{length:10,lineStyle:{color:'#fff',width:2}},axisLabel:{fontSize:8,color:'#4a6a82',distance:-24},
  pointer:{width:4,length:'62%'},itemStyle:{color:'#14384f'},title:{offsetCenter:[0,'42%'],fontSize:9,color:'#4a6a82'},detail:{offsetCenter:[0,'72%'],fontSize:16,fontWeight:700,color:'#14384f',formatter:'{value}'+unit},
  animationDuration:1600,animationEasing:'elasticOut',data:[{value:v,name:name}]}]},true)}
function box2(){var ids=ZONE.s||ZONE.s===null&&D.map(function(s){return s.i}).sort(function(a,b){return score(D[b])-score(D[a])}).slice(0,8);if(ids.indexOf(SEL)<0)ids=[SEL].concat(ids.slice(0,7));
 var L=PAGE==='dr'?DLV:PLV;$('dtabs').innerHTML=ids.map(function(i){return '<button type="button" class="dtab" data-i="'+i+'" aria-pressed="'+(i===SEL)+'"><i style="background:'+colorOf(D[i])+'"></i>'+esc(D[i].name)+'</button>'}).join('');
 $('dtabs').querySelectorAll('.dtab').forEach(function(b){b.onclick=function(){pick(+b.dataset.i)}});
 var s=D[SEL],z=zoneOf(SEL),nm=s.name.split(' '),first=nm.slice(0,Math.ceil(nm.length/2)).join(' '),rest=nm.slice(Math.ceil(nm.length/2)).join(' ');
 $('dscn').innerHTML='<div class="stl"><span>'+esc(first)+'</span> '+esc(rest)+'<small>'+zn(z)+' · '+s.lat.toFixed(3)+', '+s.lng.toFixed(3)+'<i class="swp"> · '+X('ปัดซ้าย-ขวาเพื่อดูภาพ','swipe to explore')+' ⟷</i></small></div>'+(PAGE==='dr'?sceneDr(s):sceneAir(s))+(PAGE==='air'?'<canvas id="dpcv"></canvas>':'');
 setTimeout(function(){var f=$('dthf');if(f&&PT){f.setAttribute('y',296-PT.th);f.setAttribute('height',PT.th+10)}},60);
 if(PAGE==='air')setTimeout(particles,30);else stopParticles();
 var k='',a='';
 if(PAGE==='dr'){var d=drought(s),l=lv(DLV,d.sc),i=DLV.indexOf(l);
  var acts=[[X('ติดตามรายสัปดาห์','Monitor weekly'),X('ทบทวนแผนสำรองน้ำก่อนฤดูแล้ง (ธ.ค.–พ.ค.)','Review water contingency plan before dry season (Dec–May)')],[X('ตรวจสอบน้ำดิบสำรองและสัญญาซื้อน้ำ','Check raw-water stock and supply contracts'),X('ประสานโครงการชลประทาน / กปภ. ในพื้นที่','Coordinate with local irrigation office / PWA'),X('เตรียมมาตรการลดการใช้น้ำ','Prepare water-saving measures')],[X('เปิดแผน BCM ด้านน้ำ ระดับ 1','Activate water BCM plan level 1'),X('จัดหาแหล่งน้ำสำรอง / รถน้ำ','Secure backup water / tankers'),X('รายงานผู้บริหารทุกสัปดาห์','Weekly report to management')],[X('เปิดแผน BCM ด้านน้ำ ระดับ 2','Activate water BCM plan level 2'),X('ลดกำลังผลิตส่วนที่ใช้น้ำมาก','Reduce water-intensive production'),X('ประสาน ปภ. / จังหวัด ทุกวัน','Daily coordination with DDPM / province')]][i];
  a='<div class="dgau" id="dgA"></div><div class="tx" style="border-left-color:'+l[3]+'"><b>'+X('ระดับ ','Level: ')+ln(l)+X(' — แนวทางปฏิบัติ (ตัวอย่าง)',' — suggested actions (example)')+'</b><ul><li>'+acts.join('</li><li>')+'</li></ul><div class="nt">'+X('ดัชนี = ฝน 90 วันเทียบสถิติ 15 ปี 40% + สมดุลน้ำ 30 วัน 25% + อ่างฯ ในลุ่มน้ำ 25% + ฝนทิ้งช่วง 10% (น้ำหนักปรับได้)','Index = 90-day rain vs 15-yr record 40% + 30-day water balance 25% + basin reservoirs 25% + dry spell 10% (weights adjustable)')+'</div></div>';
  k+=kp({t:X('ฝนสะสม 30 วัน','Rain, last 30 days'),v:Math.round(s.rain30),n:Math.round(s.rain30),u:'mm',l:lv(DLV,s.r30[0]<s.r30[1]*.7?60:10),bar:s.rain30/3,src:'ERA5 / Open-Meteo',tip:X('ค่าเฉลี่ย 30 วันช่วงเดียวกัน ','Normal for the same 30 days ')+s.r30[1]+' mm'});
  k+=kp({t:X('ET₀ การคายระเหย 30 วัน','Evapotranspiration ET₀, 30 d'),v:Math.round(s.et30),n:Math.round(s.et30),u:'mm',bar:s.et30/2,src:'Open-Meteo · FAO-56'});
  k+=kp({t:X('ค่า z ฝน 90 วัน (SPI โดยประมาณ)','90-day rain z-score (≈SPI)'),v:s.r90[2],u:'σ',l:lv(DLV,s.r90[2]<=-1.5?80:s.r90[2]<=-1?60:s.r90[2]<-.5?40:10),bar:50+s.r90[2]*20,src:'ERA5 2011–2025',tip:X('อันดับเปอร์เซ็นไทล์ ','Percentile ')+s.r90[3]});
  k+=kp({t:X('อันดับฝน 90 วันใน 16 ปี','90-day rain percentile (16 yrs)'),v:s.r90[3],n:s.r90[3],u:'pct',bar:s.r90[3],l:lv(DLV,100-s.r90[3]),src:'ERA5'});
  (z.d||[]).filter(okd).forEach(function(n){var v=DAMS[n];k+=kp({t:damName(n),v:v[1].toFixed(1),n:v[1].toFixed(1),u:'%',l:lv(DLV,v[1]<30?80:v[1]<50?60:v[1]<80?40:10),bar:v[1],src:X('กรมชลประทาน ','RID ')+dm(META.damsDate),tip:X('ปริมาณน้ำ ','Volume ')+v[0]+' MCM · in '+(v[2]==null?'–':v[2])+' / out '+v[3]+' MCM/d'})});
  var salty=[3,8,17,18,21,23,24,26].indexOf(SEL)>=0;
  k+=kp({pd:1,t:X('ความเค็มน้ำดิบ','Raw-water salinity')+(salty?X(' (ใกล้ปากแม่น้ำ)',' (estuary site)'):''),v:'—',u:'g/l',src:X('วางแผน: กปน. สำแล / กรมชลประทาน','Planned: MWA Samlae / RID'),tip:X('เกณฑ์ประปา 0.50 g/l','Tap-water limit 0.50 g/l')});
  k+=kp({pd:1,t:X('ประกาศเขตภัยแล้ง (ปภ.)','Drought declaration (DDPM)'),v:'—',src:X('วางแผน: disaster.go.th','Planned: disaster.go.th')});
 }else{var p=pmOf(s),pl=lv(PLV,p),h=s.hi[THI],hl=lv(HLV,h),lvl=cl(Math.max(PLV.indexOf(pl)-1,HLV.indexOf(hl)),0,4),col=['#2e9d5b','#e2a400','#f07b1d','#d7263d','#7b2cbf'][lvl];
  var aa=[X('ทำงานกลางแจ้งได้ตามปกติ','Normal outdoor work'),X('ดื่มน้ำบ่อย พักในที่ร่ม ติดตามค่าทุกชั่วโมง','Hydrate, shaded breaks, hourly checks'),X('ลดงานกลางแจ้ง 11:00–15:00 น. · แจกหน้ากาก N95 กลุ่มเสี่ยง','Limit outdoor work 11:00–15:00 · N95 for sensitive groups'),X('งดงานหนักกลางแจ้ง · หมุนเวียนคน · ห้องพักเย็น','Stop heavy outdoor work · rotate crews · cool rest rooms'),X('หยุดงานกลางแจ้ง · เปิดแผน BCM','Stop outdoor work · activate BCM')][lvl];
  a='<div class="dgau" id="dgA"></div><div class="dgau" id="dgB"></div><div class="tx" style="border-left-color:'+col+'"><b>'+X('แนวทางความปลอดภัยในที่ทำงาน (ตัวอย่าง)','Workplace safety guidance (example)')+'</b><ul><li>'+aa+'</li><li>PM2.5: '+ln(pl)+' · '+X('ดัชนีความร้อน: ','Heat index: ')+ln(hl)+'</li></ul><div class="nt">'+X('เกณฑ์ PM2.5 ตามกรมควบคุมมลพิษ (24 ชม. 37.5 µg/m³) · ดัชนีความร้อนตามกรมอุตุนิยมวิทยา','PM2.5 bands: Pollution Control Dept (24-h std 37.5 µg/m³) · Heat index bands: Thai Meteorological Dept')+'</div></div>';
  k+=kp({t:'US AQI (CAMS)',v:s.aqi,n:s.aqi,l:lv(PLV,s.aqi<=50?10:s.aqi<=100?30:s.aqi<=150?50:90),bar:s.aqi/2,src:'Open-Meteo / CAMS'});
  if(s.a4)k+=kp({t:'AQI '+X('ประเทศไทย','Thailand')+' · '+s.a4.id,v:s.a4.aqi,n:s.a4.aqi,l:lv(PLV,s.a4.aqi<=25?10:s.a4.aqi<=50?20:s.a4.aqi<=100?30:s.a4.aqi<=200?50:90),bar:s.a4.aqi/2,src:'Air4Thai · '+s.a4.t,tip:s.a4.n});
  var avg=Math.round(s.pmd.slice(0,TPM).reduce(function(a,b){return a+b},0)/TPM);k+=kp({t:X('PM2.5 เฉลี่ย 7 วันที่ผ่านมา','PM2.5 7-day average'),v:avg,n:avg,u:'µg/m³',l:lv(PLV,avg),bar:avg,src:'CAMS'});
  var dd=s.hi.slice(THI+1).filter(function(v){return v>=42}).length;k+=kp({t:X('จำนวนวัน HI ≥ 42°C (6 วันข้างหน้า)','Days with HI ≥ 42°C (next 6)'),v:dd,n:dd,u:X('วัน','days'),l:lv(HLV,dd?45:30),bar:dd/6*100,src:'Open-Meteo'});
  k+=kp({pd:1,t:X('จุดความร้อน (Hotspot) รัศมี 50 กม.','Fire hotspots within 50 km'),v:'—',src:X('วางแผน: NASA FIRMS (ขอ MAP_KEY)','Planned: NASA FIRMS (MAP_KEY)')});
  k+=kp({pd:1,t:'WBGT '+X('ในพื้นที่ทำงาน','at workplace'),v:'—',u:'°C',src:X('วางแผน: เซนเซอร์โรงงาน','Planned: plant sensors')});}
 $('dact').innerHTML=a;$('dkp').innerHTML=k;
 if(PAGE==='dr'){var d2=drought(s);gauge('dgA',d2.sc,100,DLV,X('ดัชนีภัยแล้ง','Drought index'),'')}else{gauge('dgA',pmOf(s),100,PLV,'PM2.5 µg/m³','');gauge('dgB',s.hi[THI],56,HLV,X('ดัชนีความร้อน','Heat index'),'°')}
 setTimeout(function(){$('dkp').querySelectorAll('.bar i').forEach(function(i){i.style.width=i.dataset.w+'%'})},50);countUp($('dkp'))}

/* ---------- box 3: analysis ---------- */
var AX={axisLabel:{fontSize:10,color:'#4a6a82'},axisLine:{lineStyle:{color:'#aebfca'}},splitLine:{lineStyle:{color:'#e6edf2'}}};
function ax(o){return Object.assign({},AX,o)}
function tank(n){var v=DAMS[n],p=v[1],y=110-90*cl(p,0,110)/110,id='tk'+Math.random().toString(36).slice(2,7),c=p<30?'#d7263d':p<50?'#f07b1d':'#2d8fd5';
 return '<div class="tank" title="'+esc(damName(n)+' · '+v[0]+' MCM')+'"><svg viewBox="0 0 100 130"><defs><clipPath id="'+id+'"><rect x="10" y="20" width="80" height="90" rx="10"/></clipPath></defs><rect x="10" y="20" width="80" height="90" rx="10" fill="#eef3f6" stroke="#14384f" stroke-width="2"/>'+
  '<g clip-path="url(#'+id+')"><rect class="dfl" x="0" y="'+y+'" width="100" height="'+(120-y)+'" fill="'+c+'" opacity=".85"/><path class="dwave" d="'+waveP(y-3,4,0,100)+'" fill="'+c+'" opacity=".55"/><path class="dwave r" d="'+waveP(y-1,3,-60,160)+'" fill="#fff" opacity=".25"/></g>'+
  '<line x1="10" y1="'+(110-90*80/110)+'" x2="90" y2="'+(110-90*80/110)+'" stroke="#14384f" stroke-dasharray="3 3" opacity=".4"/><text x="50" y="72" text-anchor="middle" font-size="17" font-weight="700" fill="#14384f">'+p.toFixed(0)+'%</text><text x="50" y="125" text-anchor="middle" font-size="8" fill="#4a6a82">in '+(v[2]==null?'–':v[2])+' · out '+v[3]+'</text></svg><b>'+esc(damName(n))+'</b><small>'+v[0].toLocaleString()+' MCM</small></div>'}
function box3(){var s=D[SEL],g=$('dg2');
 if(PAGE==='dr'){$('b3t').textContent=X('Drought Risk Analysis — การวิเคราะห์ความเสี่ยงภัยแล้ง','Drought Risk Analysis');
  var z=zoneOf(SEL),dl=z.d||['ศรีนครินทร์','วชิราลงกรณ','ภูมิพล','สิริกิติ์','อุบลรัตน์','ลำปาว','หนองปลาไหล','ประแสร์'];
  g.innerHTML='<div class="dcb"><h4>'+X('ฝนรายเดือน 12 เดือน เทียบค่าปกติ','Monthly rain vs normal, 12 months')+'</h4><p>'+X('แท่ง = ฝนจริง (ส้ม = ต่ำกว่าปกติ 30%) · เส้น = ค่าเฉลี่ย 2554–2568 · *เดือนล่าสุด ถึง '+dm(META.eraEnd),'Bars = actual (orange = >30% below normal) · line = 2011–'+(+META.eraEnd.slice(0,4)-1)+' mean · *latest month to '+dm(META.eraEnd))+'</p><div class="dch" id="dc1"></div></div>'+
   '<div class="dcb"><h4>'+X('ปริมาณน้ำในอ่างเก็บน้ำ — ','Reservoir storage — ')+(z.d?zn(z):X('เขื่อนหลัก','key dams'))+'</h4><p>'+X('กรมชลประทาน '+dm(META.damsDate)+' · เส้นประ = 80% · in/out = ล้าน ลบ.ม./วัน','RID '+dm(META.damsDate)+' · dashed = 80% · in/out = MCM/day')+'</p><div class="tanks">'+dl.map(tank).join('')+'</div></div>'+
   '<div class="dcb w"><h4>'+X('แผนที่ความร้อนฝน: % ของค่าปกติ รายเดือน','Rain heatmap: % of normal by month')+'</h4><p>'+X('แดง/ส้ม = แล้งกว่าปกติ · น้ำเงิน = ฝนมากกว่าปกติ · คลิกเพื่อเลือกโรงงาน','Red/orange = drier than normal · blue = wetter · click to select')+'</p><div class="dch" id="dc3"></div></div>'+
   '<div class="dcb"><h4>'+X('สมดุลน้ำ 30 วัน (ฝน − ET₀) ทุกโรงงาน','30-day water balance (rain − ET₀), all sites')+'</h4><p>'+X('ต่ำกว่า 0 = น้ำระเหยมากกว่าฝน','Below 0 = evaporation exceeds rain')+'</p><div class="dch t" id="dc4"></div></div>'+
   '<div class="dcb"><h4>'+X('จัดอันดับดัชนีภัยแล้ง','Drought index ranking')+'</h4><p>'+X('ตัวเลขขวา = ฝน 90 วัน % ของค่าปกติ','Right label = 90-day rain % of normal')+'</p><div class="dch t" id="dc5"></div></div>';
  var MON=META.months.map(function(m,k){return ym(m,k,k===11)});
  ch('dc1').setOption({tooltip:{trigger:'axis'},grid:{left:40,right:10,top:16,bottom:26},xAxis:ax({type:'category',data:MON}),yAxis:ax({type:'value',name:'mm',nameTextStyle:{fontSize:9}}),
   series:[{name:X('ฝนจริง','Actual'),type:'bar',barWidth:'55%',data:s.m12.map(function(x){return {value:x[0],itemStyle:{color:x[0]<x[1]*.7?'#f07b1d':'#2d8fd5',barBorderRadius:[4,4,0,0]}}}),animationDelay:function(i){return i*70}},
    {name:X('ค่าปกติ','Normal'),type:'line',smooth:true,symbolSize:5,data:s.m12.map(function(x){return x[1]}),lineStyle:{color:'#14384f',type:'dashed'},itemStyle:{color:'#14384f'},animationDuration:2000}]},true);
  var ids=(ZONE.s||D.map(function(x){return x.i})).slice().sort(function(a,b){return drought(D[b]).sc-drought(D[a]).sc}),hd=[];
  ids.forEach(function(i,r){D[i].m12.forEach(function(m,c){hd.push([c,r,m[1]?Math.round(m[0]/m[1]*100):100])})});
  $('dc3').style.height=Math.max(220,ids.length*18+70)+'px';
  var h3=ch('dc3');h3.resize();h3.setOption({tooltip:{formatter:function(p){return esc(D[ids[p.value[1]]].name)+'<br>'+MON[p.value[0]]+': '+p.value[2]+'%'}},grid:{left:205,right:12,top:8,bottom:56},xAxis:ax({type:'category',data:MON,splitArea:{show:false}}),yAxis:ax({type:'category',inverse:true,data:ids.map(function(i){return D[i].name}),axisLabel:{fontSize:9,color:'#14384f',interval:0}}),
   visualMap:{type:'piecewise',orient:'horizontal',left:'center',bottom:0,itemWidth:12,itemHeight:10,textStyle:{fontSize:9,color:'#4a6a82'},pieces:[{lt:50,color:'#d7263d',label:'<50%'},{gte:50,lt:70,color:'#f07b1d',label:'50–70'},{gte:70,lt:90,color:'#f6cf5c',label:'70–90'},{gte:90,lt:115,color:'#e8f1f5',label:'90–115'},{gte:115,lt:160,color:'#8cc4ea',label:'115–160'},{gte:160,color:'#2d6fb5',label:'>160%'}]},
   series:[{type:'heatmap',data:hd,itemStyle:{borderColor:'#fff',borderWidth:1.5},emphasis:{itemStyle:{borderColor:'#14384f',borderWidth:2}},animationDuration:1200}]},true);
  h3.off('click');h3.on('click',function(p){pick(ids[p.value[1]])});
  var wb=D.map(function(x){return {n:x.name,i:x.i,v:Math.round(x.rain30-x.et30)}}).sort(function(a,b){return a.v-b.v});
  ch('dc4').setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},grid:{left:150,right:16,top:6,bottom:20},xAxis:ax({type:'value'}),yAxis:ax({type:'category',inverse:true,data:wb.map(function(a){return a.n}),axisLabel:{fontSize:8,color:'#14384f',interval:0}}),
   series:[{type:'bar',barWidth:'60%',data:wb.map(function(a){return {value:a.v,itemStyle:{color:a.v<-50?'#f07b1d':a.v<0?'#f6cf5c':'#2d8fd5',borderColor:a.i===SEL?'#14384f':'rgba(0,0,0,0)',borderWidth:2}}}),animationDelay:function(i){return i*25}}]},true);
  var all=D.map(function(x){var d=drought(x);return {n:x.name,i:x.i,v:d.sc,p:d.p90}}).sort(function(a,b){return b.v-a.v});
  ch('dc5').setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},grid:{left:150,right:40,top:6,bottom:20},xAxis:ax({type:'value',max:100}),yAxis:ax({type:'category',inverse:true,data:all.map(function(a){return a.n}),axisLabel:{fontSize:8,color:'#14384f',interval:0}}),
   series:[{type:'bar',barWidth:'60%',label:{show:true,position:'right',fontSize:8,color:'#4a6a82',formatter:function(p){return all[p.dataIndex].p+'%'}},data:all.map(function(a){return {value:a.v,itemStyle:{color:lv(DLV,a.v)[3],borderColor:a.i===SEL?'#14384f':'rgba(0,0,0,0)',borderWidth:2,barBorderRadius:[0,4,4,0]}}}),animationDelay:function(i){return i*25}}]},true);
  ['dc4','dc5'].forEach(function(id){var c=CH[id];c.off('click');c.on('click',function(p){var i=NAMES.indexOf(p.name);if(i>=0)pick(i)})});
 }else{$('b3t').textContent=X('Air quality & Heat Analysis — การวิเคราะห์คุณภาพอากาศและความร้อน','Air quality & Heat Analysis');
  g.innerHTML='<div class="dcb"><h4>'+X('PM2.5 รายวัน: 7 วันย้อนหลัง + 4 วันคาดการณ์','Daily PM2.5: past 7 + next 4 days')+'</h4><p>'+X('CAMS ณ ตำแหน่งโรงงาน · แถบสี = เกณฑ์ คพ.','CAMS at the site · bands = PCD thresholds')+(s.a4?X(' · เพชร = Air4Thai ล่าสุด',' · diamond = latest Air4Thai'):'')+'</p><div class="dch" id="dc1"></div></div>'+
   '<div class="dcb"><h4>'+X('ดัชนีความร้อนสูงสุดรายวัน (14 + 6 วัน)','Daily max heat index (14 past + 6 ahead)')+'</h4><p>'+X('แถบสี = เกณฑ์ กรมอุตุนิยมวิทยา 27 / 33 / 42 / 52 °C','Bands = TMD 27 / 33 / 42 / 52 °C')+'</p><div class="dch" id="dc2"></div></div>'+
   '<div class="dcb w"><h4>'+X('แผนที่ความร้อน PM2.5 รายวัน ทุกโรงงาน','PM2.5 daily heatmap, all sites')+'</h4><p>'+X('เส้นแบ่ง = วันนี้ · คลิกเพื่อเลือกโรงงาน','Divider = today · click to select')+'</p><div class="dch" id="dc3"></div></div>'+
   '<div class="dcb w"><h4>'+X('เมทริกซ์ความเสี่ยง: PM2.5 × ดัชนีความร้อนวันนี้','Risk matrix: PM2.5 × heat index today')+'</h4><p>'+X('ขวาบน = เสี่ยงทั้งฝุ่นและความร้อน · ขนาดวงกลม = PM2.5 คาดการณ์สูงสุด 4 วัน','Top-right = both dust and heat risk · bubble size = max 4-day PM2.5 forecast')+'</p><div class="dch" id="dc4" style="height:380px"></div></div>';
  var bands=PLV.map(function(b,k){return [{yAxis:k?PLV[k-1][0]:0,itemStyle:{color:b[3],opacity:.1}},{yAxis:Math.min(b[0],200)}]});
  ch('dc1').setOption({tooltip:{trigger:'axis'},grid:{left:36,right:10,top:16,bottom:26},xAxis:ax({type:'category',boundaryGap:false,data:META.pmDays.map(dm)}),yAxis:ax({type:'value',max:function(v){return Math.max(60,Math.ceil(v.max/10)*10+10)}}),
   series:[{name:'PM2.5',type:'line',smooth:true,symbolSize:8,data:s.pmd.map(function(v){return {value:v,itemStyle:{color:lv(PLV,v)[3],borderColor:'#fff',borderWidth:1.5}}}),lineStyle:{width:3,color:'#14384f'},areaStyle:{color:'rgba(20,56,79,.08)'},animationDuration:2000,
    markArea:{silent:true,data:bands},markLine:{symbol:'none',data:[{xAxis:TPM,lineStyle:{color:'#14384f',type:'dashed'},label:{formatter:X('วันนี้','Today'),fontSize:10}},{yAxis:37.5,lineStyle:{color:'#f07b1d'},label:{formatter:'37.5',fontSize:9}}]}}].concat(s.a4?[{name:'Air4Thai',type:'effectScatter',symbol:'diamond',symbolSize:14,rippleEffect:{scale:2.4,brushType:'stroke'},data:[[TPM,s.a4.pm]],itemStyle:{color:lv(PLV,s.a4.pm)[3]}}]:[])},true);
  var hb=HLV.map(function(b,k){return [{yAxis:k?HLV[k-1][0]:20,itemStyle:{color:b[3],opacity:.12}},{yAxis:Math.min(b[0],56)}]});
  ch('dc2').setOption({tooltip:{trigger:'axis'},grid:{left:36,right:10,top:16,bottom:26},xAxis:ax({type:'category',boundaryGap:false,data:DHI}),yAxis:ax({type:'value',min:20,max:56}),
   series:[{name:'HI',type:'line',smooth:true,symbolSize:6,data:s.hi.map(function(v){return {value:v,itemStyle:{color:lv(HLV,v)[3]}}}),lineStyle:{width:3,color:'#d7263d'},areaStyle:{color:'rgba(215,38,61,.1)'},animationDuration:2000,markArea:{silent:true,data:hb},markLine:{symbol:'none',data:[{xAxis:THI,lineStyle:{color:'#14384f',type:'dashed'},label:{formatter:X('วันนี้','Today'),fontSize:10}}]}}]},true);
  var ids=D.map(function(x){return x.i}).sort(function(a,b){return pmOf(D[b])-pmOf(D[a])}),hd=[];ids.forEach(function(i,r){D[i].pmd.forEach(function(v,c){hd.push([c,r,v])})});
  $('dc3').style.height=(ids.length*16+80)+'px';var h3=ch('dc3');h3.resize();
  h3.setOption({tooltip:{formatter:function(p){return esc(D[ids[p.value[1]]].name)+'<br>'+dm(META.pmDays[p.value[0]])+': '+p.value[2]+' µg/m³'}},grid:{left:205,right:12,top:8,bottom:56},xAxis:ax({type:'category',data:DPM.map(function(d,k){return k===TPM?X('วันนี้','Today'):d})}),yAxis:ax({type:'category',inverse:true,data:ids.map(function(i){return D[i].name}),axisLabel:{fontSize:8.5,color:'#14384f',interval:0}}),
   visualMap:{type:'piecewise',orient:'horizontal',left:'center',bottom:0,itemWidth:12,itemHeight:10,textStyle:{fontSize:9,color:'#4a6a82'},pieces:PLV.map(function(l,k){return {gte:k?PLV[k-1][0]:0,lt:l[0],color:l[3],label:ln(l)}})},
   series:[{type:'heatmap',data:hd,itemStyle:{borderColor:'#fff',borderWidth:1},animationDuration:1200,markLine:{symbol:'none',silent:true,data:[{xAxis:TPM-.5}],lineStyle:{color:'#14384f',width:2}}}]},true);
  h3.off('click');h3.on('click',function(p){pick(ids[p.value[1]])});
  var sd=D.map(function(x){var m=Math.max.apply(null,x.pmd.slice(TPM+1));return {name:x.name,value:[pmOf(x),x.hi[THI],m,x.i],itemStyle:{color:lv(PLV,pmOf(x))[3],borderColor:x.i===SEL?'#14384f':'#fff',borderWidth:x.i===SEL?3:1,opacity:.85}}});
  var c4=ch('dc4');c4.setOption({tooltip:{formatter:function(p){return p.data&&p.data.value?esc(p.name)+'<br>PM2.5 '+p.value[0]+' µg/m³<br>HI '+p.value[1]+'°C<br>'+X('PM2.5 สูงสุด 4 วัน ','Max PM2.5 next 4 d ')+p.value[2]:''}},grid:{left:44,right:20,top:16,bottom:40},
   xAxis:ax({type:'value',name:'PM2.5 µg/m³',nameLocation:'middle',nameGap:26,nameTextStyle:{fontSize:10,color:'#4a6a82'}}),yAxis:ax({type:'value',min:15,max:50,name:'HI °C',nameTextStyle:{fontSize:10}}),
   series:[{type:'scatter',data:sd,symbolSize:function(v){return 8+Math.sqrt(v[2])*2.2},animationDelay:function(i){return i*30},
    markArea:{silent:true,data:[[{xAxis:37.5,yAxis:42,itemStyle:{color:'rgba(215,38,61,.08)'},label:{show:true,position:'insideTopRight',formatter:X('เสี่ยงสูงทั้งคู่','Both high'),color:'#d7263d',fontSize:10}},{xAxis:'max',yAxis:50}]]},
    markLine:{symbol:'none',silent:true,lineStyle:{type:'dashed',color:'#8aa0ad'},label:{fontSize:9},data:[{xAxis:37.5},{yAxis:42}]}}]},true);
  c4.off('click');c4.on('click',function(p){if(p.value&&p.value[3]!=null)pick(p.value[3])});}
}

/* ---------- box 4 ---------- */
var SRC={dr:[['ปริมาณน้ำอ่างเก็บน้ำขนาดใหญ่ 35 แห่ง','Large reservoirs (35)','กรมชลประทาน','RID','app.rid.go.th/reservoir/api/dam/public','ok'],['อ่างเก็บน้ำขนาดกลาง','Medium reservoirs','กรมชลประทาน','RID','app.rid.go.th/reservoir/api/rsvmiddles','ok'],['ฝนสะสม · สถิติ 15 ปี · ฝนทิ้งช่วง','Rain totals · 15-yr record · dry spell','Copernicus ERA5 / Open-Meteo','Copernicus ERA5 / Open-Meteo','archive-api.open-meteo.com','ok'],['ฝนคาดการณ์ · ET₀ · ความชื้นดิน (แบบจำลอง)','Forecast rain · ET₀ · soil moisture (model)','Open-Meteo','Open-Meteo','api.open-meteo.com','ok'],['ฝนสถานีตรวจวัด','Station rainfall','สสน. ThaiWater','HII ThaiWater','api-v3.thaiwater.net (via Water Dashboard)','ok'],['ความชื้นดินดาวเทียม · พื้นที่แล้งซ้ำซาก','Satellite soil moisture · recurrent drought','GISTDA','GISTDA','api-gateway.gistda.or.th','key'],['ความเค็มน้ำดิบ','Raw-water salinity','กปน. / กรมชลประทาน','MWA / RID','—','pl'],['ประกาศเขตภัยแล้ง','Drought declarations','ปภ.','DDPM','disaster.go.th','pl'],['น้ำดิบสำรองในโรงงาน','Plant raw-water stock','SCGP Engineering','SCGP Engineering','internal','pl']],
 air:[['PM2.5 / AQI สถานีตรวจวัด 178 สถานี','PM2.5 / AQI, 178 stations','กรมควบคุมมลพิษ Air4Thai','PCD Air4Thai','air4thai.pcd.go.th/services/getNewAQI_JSON.php','ok'],['PM2.5 แบบจำลอง + คาดการณ์ 5 วัน','PM2.5 model + 5-day forecast','Copernicus CAMS / Open-Meteo','Copernicus CAMS / Open-Meteo','air-quality-api.open-meteo.com','ok'],['ดัชนีความร้อน / อุณหภูมิที่รู้สึกได้','Heat index / apparent temperature','Open-Meteo · เกณฑ์ กรมอุตุฯ','Open-Meteo · TMD bands','api.open-meteo.com','ok'],['ดัชนีความร้อนพยากรณ์ทางการ','Official heat-index forecast','กรมอุตุนิยมวิทยา','TMD','rnd.tmd.go.th/heatindexanalysis','pl'],['จุดความร้อน VIIRS/MODIS','VIIRS/MODIS hotspots','NASA FIRMS / GISTDA','NASA FIRMS / GISTDA','firms.modaps.eosdis.nasa.gov/api/area','key'],['สถานีตรวจวัดต่างประเทศ','Stations outside Thailand','OpenAQ','OpenAQ','api.openaq.org/v3','key'],['WBGT ในพื้นที่ทำงาน','Workplace WBGT','SCGP Safety','SCGP Safety','internal','pl']]};
function box4(){$('b4t').textContent=X('แหล่งข้อมูล / Data sources','Data sources');var St={ok:X('ทดสอบแล้ว','Tested'),key:X('ต้องขอคีย์','Needs key'),pl:X('วางแผน','Planned')};
 $('dsrc').innerHTML='<tr><th>'+X('ข้อมูล','Data')+'</th><th>'+X('หน่วยงาน','Agency')+'</th><th>API</th><th>'+X('สถานะ','Status')+'</th></tr>'+SRC[PAGE].map(function(r){return '<tr><td>'+(TH()?r[0]:r[1])+'</td><td>'+(TH()?r[2]:r[3])+'</td><td style="word-break:break-all">'+r[4]+'</td><td><span class="st '+r[5]+'">'+St[r[5]]+'</span></td></tr>'}).join('')}

function render(){$('dpt').textContent=PAGE==='dr'?(TH()?'ภัยแล้ง':'Drought'):(TH()?'คุณภาพอากาศและความร้อน':'Air quality & Heat');$('dbkt').textContent=TH()?'หน้าหลัก':'Main Page';
 if(ZONE.s&&ZONE.s.indexOf(SEL)<0)SEL=topOf(ZONE.s);feed();stats();zones();drawMap();rank();box2();box3();box4();countUp($('dst'))}
addEventListener('resize',function(){if(sec.hidden)return;Object.keys(CH).forEach(function(k){CH[k].resize()});if(PAGE==='air')particles()});
var SELF='https://scgp-climate-flooding.vercel.app',WEB=/^https?:$/.test(location.protocol)&&!/(^|\.)claude\.ai$|claudeusercontent|anthropic/.test(location.hostname);
function pj(res){var p=res&&res.payload!==undefined?res.payload:res;if(typeof p==='string'){try{p=JSON.parse(p)}catch(_){}}if(p&&typeof p.text==='string'){if(p.status&&p.status!==200)throw new Error('HTTP '+p.status);return JSON.parse(p.text)}return p}
function fj(u){return fetch(u).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})}
function load(){var path='/api/drought-air',p=WEB?fj(path).catch(function(){return fj(SELF+path)}):Promise.reject();
 p.catch(function(){if(window.claude&&claude.use)return claude.use('mcp').then(function(m){if(!m)throw new Error('no mcp');return m.callTool('Vercel','web_fetch_vercel_url',{url:SELF+path},{cache:{staleTime:15*60e3,gcTime:3600e3}})}).then(pj);throw new Error('offline')})
 .then(function(j){if(!j||!j.raw||j.raw.split('\n').length!==45)throw new Error('bad');setData(j.raw,j.a4t,j.dams,{live:true,today:j.today,pmDays:j.pmDays,hiDays:j.hiDays,months:j.months,eraEnd:j.eraEnd,damsDate:j.damsDate||META.damsDate,asOf:j.asOf});if(!sec.hidden)render()})
 .catch(function(){});}
load();setInterval(function(){if(!sec.hidden)load()},30*60e3);
route();
})();
