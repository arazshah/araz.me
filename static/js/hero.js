(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---- topographic background (value-noise contours) ---- */
  var cv=document.getElementById('topo');
  if(cv){
    var ctx=cv.getContext('2d'),W,H,t=0,cell=14;
    function hash(x,y){var h=Math.sin(x*127.1+y*311.7)*43758.5453;return h-Math.floor(h)}
    function noise(x,y){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
      var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
      return (hash(xi,yi)*(1-u)+hash(xi+1,yi)*u)*(1-v)+(hash(xi,yi+1)*(1-u)+hash(xi+1,yi+1)*u)*v}
    function field(x,y,t){return .55*noise(x*.008+t,y*.008)+.3*noise(x*.018-t,y*.018+3)+.15*noise(x*.04,y*.04+t*2)}
    function size(){var r=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    function draw(){
      var cs=getComputedStyle(document.documentElement),c=cs.getPropertyValue('--accent').trim()||'#0f766e';
      ctx.clearRect(0,0,W,H);ctx.strokeStyle=c;ctx.lineWidth=1;
      var cols=Math.ceil(W/cell)+1,rows=Math.ceil(H/cell)+1,g=[];
      for(var j=0;j<rows;j++){g[j]=[];for(var i=0;i<cols;i++)g[j][i]=field(i*cell,j*cell,t)}
      for(var lv=.2;lv<.9;lv+=.06){
        ctx.globalAlpha=(Math.round(lv*100)%3===0)?.22:.1;ctx.beginPath();
        for(j=0;j<rows-1;j++)for(i=0;i<cols-1;i++){
          var a=g[j][i],b=g[j][i+1],c2=g[j+1][i+1],d=g[j+1][i],x=i*cell,y=j*cell,p=[];
          function lerp(v1,v2){return (lv-v1)/(v2-v1)}
          if((a<lv)!==(b<lv))p.push([x+lerp(a,b)*cell,y]);
          if((b<lv)!==(c2<lv))p.push([x+cell,y+lerp(b,c2)*cell]);
          if((d<lv)!==(c2<lv))p.push([x+lerp(d,c2)*cell,y+cell]);
          if((a<lv)!==(d<lv))p.push([x,y+lerp(a,d)*cell]);
          if(p.length>=2){ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1])}
          if(p.length===4){ctx.moveTo(p[2][0],p[2][1]);ctx.lineTo(p[3][0],p[3][1])}
        }
        ctx.stroke();
      }
    }
    size();draw();addEventListener('resize',function(){size();draw()});window.addEventListener('themechange',draw);
    if(!reduce){var last=0;(function loop(ts){if(ts-last>60){t+=.0012;draw();last=ts}requestAnimationFrame(loop)})(0)}
  }
  /* ---- "ask in words, get a map" demo ---- */
  var q=document.getElementById('demo-text'),dag=document.getElementById('demo-dag'),mc=document.getElementById('demo-map');
  if(!q||!dag)return;
  var QS=[
    {q:'Which neighbourhoods are more than 15 minutes from a hospital?',n:[['load_osm','hospitals'],['network_isochrone','15 min'],['load_boundaries','districts'],['overlay_difference','uncovered'],['rank_districts','population'],['make_map','layers']]},
    {q:'How did vegetation change in Cairo between 2018 and 2024?',n:[['load_raster','Sentinel-2'],['ndvi','2018'],['ndvi','2024'],['raster_diff','Δ NDVI'],['zonal_stats','districts'],['make_map','layers']]},
    {q:'تغییرات مساحت دریاچه ارومیه را در ده سال اخیر نشان بده',n:[['load_raster','imagery'],['water_index','NDWI'],['time_series','10 yr'],['area_stats','km²'],['make_chart','trend'],['make_map','layers']]}
  ];
  var cases=[];try{cases=JSON.parse(document.getElementById('case-data').textContent)}catch(e){}
  var qi=0;
  function drawMap(k){
    if(!mc)return;var r=mc.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);mc.width=r.width*dpr;mc.height=r.height*dpr;
    var x=mc.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,r.width,r.height);
    x.strokeStyle='#16303a';x.lineWidth=1;for(var i=0;i<r.width;i+=28){x.beginPath();x.moveTo(i,0);x.lineTo(i,r.height);x.stroke()}for(var j=0;j<r.height;j+=28){x.beginPath();x.moveTo(0,j);x.lineTo(r.width,j);x.stroke()}
    if(!cases.length)return;
    var minLa=Math.min.apply(0,cases.map(c=>c.la))-6,maxLa=Math.max.apply(0,cases.map(c=>c.la))+6,minLo=Math.min.apply(0,cases.map(c=>c.lo))-10,maxLo=Math.max.apply(0,cases.map(c=>c.lo))+10;
    function px(c){return[(c.lo-minLo)/(maxLo-minLo)*r.width,(1-(c.la-minLa)/(maxLa-minLa))*r.height]}
    cases.forEach(function(c,i){var p=px(c),on=k>=i;x.beginPath();x.arc(p[0],p[1],on?5:3,0,7);x.fillStyle=on?'#2dd4bf':'#2b4a52';x.fill();
      if(on){x.beginPath();x.arc(p[0],p[1],14,0,7);x.strokeStyle='rgba(45,212,191,.35)';x.stroke();x.fillStyle='#9fd9d1';x.font='11px JetBrains Mono,monospace';x.fillText(c.n,p[0]+10,p[1]+4)}});
  }
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
  async function run(){
    var s=QS[qi%QS.length];qi++;q.textContent='';dag.innerHTML='';drawMap(-1);
    q.parentElement.style.direction=/[؀-ۿ]/.test(s.q)?'rtl':'ltr';
    for(var i=0;i<=s.q.length;i++){q.textContent=s.q.slice(0,i);await sleep(reduce?0:28)}
    await sleep(350);
    for(var n=0;n<s.n.length;n++){var el=document.createElement('div');el.className='node';el.innerHTML='<i></i><span>'+s.n[n][0]+'</span><em>'+s.n[n][1]+'</em>';dag.appendChild(el);
      await sleep(30);el.classList.add('on');drawMap(n%Math.max(cases.length,1));await sleep(reduce?0:520)}
    if(reduce)return;await sleep(3200);run();
  }
  var started=false;
  var ob=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!started){started=true;if(reduce){QS=[QS[0]]}run()}},{threshold:.25});ob.observe(document.getElementById('demo'));
})();
