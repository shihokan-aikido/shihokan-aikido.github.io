/* =========================================================
   合気道 志鵬館  共通スクリプト
   ・日本語／English の切り替え（選んだ言語は次のページでも続く）
   ・すかし案の切り替え（URLに ?sukashi=a / b / c を付けたときだけ）
   ・円相の色・正勝吾勝の書体・全体のトーンの切り替え（URLに ?enso= / ?motto= / ?tone= を付けたときだけ）
   ・デザインパターンの切り替え（URLに ?pattern=p1〜p5 を付けたときだけ）
   ・p2 の中のすかし・金の筆あと（?p2sil=on / ?p2kin=on）、最初の画面のすかし（?herosil=ho1〜ho3）
   ・お知らせ（data/news.js）と通信（data/tsushin.js）を表示
   ・円相と筆あとの形をつくる
   ========================================================= */
(function(){
  var body=document.body;
  var root=body.getAttribute('data-root')||'';   /* 下層ページは "../" */
  document.documentElement.classList.remove('no-js');

  /* ---------- すかし案 ---------- */
  var m=/[?&]sukashi=([abc])\b/i.exec(location.search);
  if(m){body.setAttribute('data-sukashi',m[1].toLowerCase());}
  /* 円相の色・正勝吾勝の書体（URLに ?enso=kin&motto=syuku を付けたときだけ） */
  var me=/[?&]enso=(white|kin|shu)\b/i.exec(location.search);
  if(me){body.setAttribute('data-enso',me[1].toLowerCase());}
  var mf=/[?&]motto=(noto|syuku|mai|boku|antique|b1|kaisei)\b/i.exec(location.search);
  if(mf){body.setAttribute('data-motto-font',mf[1].toLowerCase());}
  /* 全体の色のトーン（URLに ?tone=nijimi や ?tone=nijimi+shizume を付けたときだけ） */
  var mt=/[?&]tone=([a-z+ ,%20]+)/i.exec(location.search);
  if(mt){var tv=decodeURIComponent(mt[1]).toLowerCase().split(/[+ ,]+/).filter(function(x){return /^(base|nijimi|kogo|sumi|shizume)$/.test(x)});if(tv.length)body.setAttribute('data-tone',tv.join(' '));}
  /* デザインパターン（URLに ?pattern=p1〜p5 / none を付けたときだけ） */
  var mp=/[?&]pattern=(none|p[1-5])\b/i.exec(location.search);
  if(mp){body.setAttribute('data-pattern',mp[1].toLowerCase());}
  /* p2 の中のスイッチ（URLに ?p2sil=on / ?p2kin=on を付けたときだけ） */
  var ms=/[?&]p2sil=(on|off)\b/i.exec(location.search);
  if(ms){body.setAttribute('data-p2-sil',ms[1].toLowerCase());}
  var mk=/[?&]p2kin=(on|off)\b/i.exec(location.search);
  if(mk){body.setAttribute('data-p2-kin',mk[1].toLowerCase());}
  /* 最初の画面のすかし（URLに ?herosil=ho1 などを付けたときだけ） */
  var mh=/[?&]herosil=(nage2|ho[1-9])\b/i.exec(location.search);
  if(mh){body.setAttribute('data-hero-sil',mh[1].toLowerCase());}

  /* ---------- 言語 ---------- */
  var btns=document.querySelectorAll('.lang button');
  function setLang(l){
    body.classList.toggle('en',l==='en');
    document.documentElement.lang=l;
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===l))});
    try{localStorage.setItem('shihokan-lang',l)}catch(e){}
  }
  btns.forEach(function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'))})});
  document.querySelectorAll('[data-lang-switch]').forEach(function(b){
    b.addEventListener('click',function(){setLang(body.classList.contains('en')?'ja':'en');window.scrollTo(0,0)});
  });
  var saved=null; try{saved=localStorage.getItem('shihokan-lang')}catch(e){}
  if(/[?&]lang=en\b/.test(location.search)||location.hash==='#en')saved='en';
  if(/[?&]lang=ja\b/.test(location.search))saved='ja';
  setLang(saved==='en'?'en':'ja');

  /* ---------- 小さな道具 ---------- */
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
  function href(u){ if(!u)return ''; return /^(https?:|mailto:|tel:|#)/.test(u)?u:root+u; }
  function isExternal(u){return /^https?:/.test(u||'')}
  function bi(ja,en){ /* 日本語と英語の2つの span */
    var f=document.createDocumentFragment();
    var j=el('span','ja',ja||''); f.appendChild(j);
    var e=el('span','en',en||ja||''); e.setAttribute('lang','en'); f.appendChild(e);
    return f;
  }
  function kk(text){return el('span','kk',text)}
  function byDateDesc(list){
    return list.map(function(x,i){return {x:x,i:i}})
      .sort(function(a,b){var da=String(a.x.date||''),db=String(b.x.date||''); return da<db?1:da>db?-1:b.i-a.i})
      .map(function(o){return o.x});
  }

  /* ---------- お知らせ ---------- */
  var NEWS=window.SHIHOKAN_NEWS||[];
  document.querySelectorAll('[data-news]').forEach(function(ul){
    var n=ul.getAttribute('data-news'); var list=byDateDesc(NEWS);
    if(n!=='all')list=list.slice(0,parseInt(n,10)||3);
    ul.textContent='';
    if(!list.length){var li=el('li');li.appendChild(el('span','empty ja','お知らせはまだありません。'));li.appendChild(el('span','empty en','No news yet.'));ul.appendChild(li);return;}
    list.forEach(function(it){
      var li=el('li');
      var t=el('time',null,it.date||''); li.appendChild(t);
      var b=el('span','body');
      var target=b;
      if(it.link){
        var a=el('a'); a.href=href(it.link);
        if(isExternal(it.link)){a.target='_blank';a.rel='noopener';a.className='ext';}
        b.appendChild(a); target=a;
      }
      if(it.ja||it.en)target.appendChild(bi(it.ja,it.en));
      if(it.kk){ if(it.ja||it.en)b.appendChild(document.createTextNode(' ')); b.appendChild(kk(it.kk)); }
      li.appendChild(b); ul.appendChild(li);
    });
  });

  /* ---------- 志鵬館通信の一覧 ---------- */
  var TS=window.SHIHOKAN_TSUSHIN||[];
  document.querySelectorAll('[data-tsushin]').forEach(function(ul){
    var n=ul.getAttribute('data-tsushin'); var list=byDateDesc(TS);
    if(n!=='all')list=list.slice(0,parseInt(n,10)||3);
    ul.textContent='';
    list.forEach(function(it){
      var li=el('li'); var a=el('a'); a.href=href(it.page);
      a.appendChild(el('span','no',it.no||''));
      var t=el('span','t');
      t.appendChild(bi(it.title,it.titleEn));
      (it.parts||[]).forEach(function(p){
        var s=el('small'); s.appendChild(bi('＋ '+p.title,'+ '+(p.titleEn||p.title))); t.appendChild(s);
      });
      if(it.kk){var k=el('small');k.appendChild(kk(it.kk));t.appendChild(k);}
      a.appendChild(t);
      a.appendChild(el('span','d',it.date||''));
      li.appendChild(a); ul.appendChild(li);
    });
  });

  /* ---------- ヘッダーの地色（トップだけ） ---------- */
  var top=document.getElementById('top'), hero=document.getElementById('hero');
  if(top&&hero){
    var onScroll=function(){top.classList.toggle('solid',window.scrollY>hero.offsetHeight-60)};
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  }

  /* ---------- ふわっと出る ---------- */
  var els=document.querySelectorAll('.fade,.flow');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(x){io.observe(x)});
  }else{els.forEach(function(x){x.classList.add('in')})}

  /* ---------- 筆あとの形（自作） ---------- */
  function rnd(seed){return function(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
  function f(n){return n.toFixed(1)}
  function polygon(out,inn){
    var d='M'+out.map(function(p){return f(p[0])+' '+f(p[1])}).join('L');
    d+='L'+inn.reverse().map(function(p){return f(p[0])+' '+f(p[1])}).join('L')+'Z';return d;
  }
  function enso(cx,cy,R,start,sweep,wMax,seed){
    var r=rnd(seed),p1=r()*6,p2=r()*6,p3=r()*6,N=240,o=[],i_=[];
    for(var k=0;k<=N;k++){
      var t=k/N,a=start+sweep*t;
      var rr=R*(1+.025*Math.sin(a*2+p1)+.012*Math.sin(a*5+p2))+(t*R*.04);
      var w=wMax*(.28+.72*Math.pow(1-t,.7))*Math.min(1,Math.pow(t/.05,.5))*(t>.86?Math.pow((1-t)/.14,.6):1);
      w*=1+.12*Math.sin(t*40+p3);
      var c=Math.cos(a),s=Math.sin(a);
      o.push([cx+(rr+w/2)*c,cy+(rr+w/2)*s]);i_.push([cx+(rr-w/2)*c,cy+(rr-w/2)*s]);
    }
    return polygon(o,i_);
  }
  function stroke(x0,x1,y,wMax,bend,seed){
    var r=rnd(seed),p=r()*6,N=160,o=[],i_=[];
    for(var k=0;k<=N;k++){
      var t=k/N,x=x0+(x1-x0)*t,yy=y+bend*Math.sin(Math.PI*t)+2*Math.sin(t*9+p);
      var w=wMax*Math.min(1,Math.pow(t/.06,.6))*Math.pow(1-t,.45)*(1+.1*Math.sin(t*30+p));
      o.push([x,yy-w/2]);i_.push([x,yy+w/2]);
    }
    return polygon(o,i_);
  }
  function setD(id,d){var e=document.getElementById(id);if(e)e.setAttribute('d',d)}
  var D=Math.PI/180;
  setD('enso-main',enso(500,500,360,-62*D,334*D,78,11));
  setD('enso-dry',enso(500,500,372,-48*D,300*D,40,29));
  setD('sweep-path',stroke(40,1560,130,150,-40,5));
  setD('kin-path',stroke(10,590,22,11,-5,17));

  /* ---------- 入口の円相：スマホでも押した瞬間に朱へ変わってから移る（2026-11-14） ---------- */
  (function(){
    var touch=window.matchMedia&&matchMedia('(hover: none)').matches;
    var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!touch||still)return;
    document.querySelectorAll('.enso-gates a').forEach(function(a){
      a.addEventListener('click',function(e){
        var href=a.getAttribute('href');
        if(!href||href.charAt(0)!=='#')return;
        e.preventDefault();
        a.classList.add('tapped');
        setTimeout(function(){
          var t=document.querySelector(href);
          if(t){var y0=window.scrollY;t.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',href);
            setTimeout(function(){if(Math.abs(window.scrollY-y0)<2)t.scrollIntoView({block:'start'})},700)}
          setTimeout(function(){a.classList.remove('tapped')},900);
        },420);
      });
    });
  })();

  /* ---------- 小見出しと道場名の墨の筆線（案1に決定・2026-11-14） ---------- */
  (function(){
    function line(x0,x1,y,wMax,bend,seed){
      var r=rnd(seed),p=r()*6,N=160,o=[],i_=[];
      for(var k=0;k<=N;k++){
        var t=k/N,x=x0+(x1-x0)*t,yy=y+bend*Math.sin(Math.PI*t)+.6*Math.sin(t*9+p);
        var w=wMax*Math.min(1,Math.pow(t/.06,.6))*Math.pow(1-t,.45)*(1+.1*Math.sin(t*30+p));
        o.push([x,yy-w/2]);i_.push([x,yy+w/2]);
      }
      return polygon(o,i_);
    }
    var NS='http://www.w3.org/2000/svg';
    if(!document.getElementById('fudeRough')){
      var defs=document.createElementNS(NS,'svg');defs.setAttribute('width','0');defs.setAttribute('height','0');defs.setAttribute('aria-hidden','true');defs.style.position='absolute';
      defs.innerHTML='<filter id="fudeRough" x="-20%" y="-60%" width="140%" height="220%"><feTurbulence type="fractalNoise" baseFrequency="0.09 0.5" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6"/></filter>';
      document.body.appendChild(defs);
    }
    function svgLine(d){return '<svg viewBox="0 0 240 24" preserveAspectRatio="none"><path filter="url(#fudeRough)" fill="currentColor" d="'+d+'"/></svg>'}
    var LN=svgLine(line(4,236,12,15,-2,8)), LNS=svgLine(line(2,238,12,9,-1.5,21));
    function deco(html,cls){var e=document.createElement('span');e.className=cls;e.setAttribute('aria-hidden','true');e.innerHTML=html;return e}
    document.querySelectorAll('main h3, main h4').forEach(function(h){
      if(h.querySelector('.fude-ln'))return;
      var d=deco(h.tagName==='H3'?LN:LNS,'fude-ln');if(getComputedStyle(h).textAlign==='center'){d.style.marginLeft='auto';d.style.marginRight='auto'}
      h.appendChild(d);
    });
    var mk=document.querySelector('.top .mark .ja');
    if(mk&&!mk.querySelector('.fude-ln')){
      var t=document.createElement('span');t.className='fude-name';t.textContent=mk.textContent;
      mk.textContent='';mk.classList.add('fude-mark');mk.appendChild(t);mk.appendChild(deco(LNS,'fude-ln'));
    }
    if(!document.getElementById('fudeFont')){
      var l=document.createElement('link');l.id='fudeFont';l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Yuji+Syuku&text='+encodeURIComponent('合気道　志鵬館')+'&display=swap';
      document.head.appendChild(l);
    }
  })();
  /* 入口の円相：1つずつ書き出しの位置・太さを変えて、手で描いた感じに（2026-11-14） */
  var GE={1:[-70,330,64,11],2:[-110,326,58,23],3:[-40,322,60,37],4:[-95,328,56,41]};
  document.querySelectorAll('.enso-gates path[data-enso]').forEach(function(p){
    var a=GE[p.getAttribute('data-enso')];if(a)p.setAttribute('d',enso(500,500,405,a[0]*D,a[1]*D,a[2],a[3]));
  });

  /* ---------- すかし（本文）：案3＋案2＋案4（2026-11-14 決定） ---------- */
  (function(){
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* 墨の帯：筆で横に引いた形（上の筆あとと同じ作り方で、太く） */
    function obi(x0,x1,y,wMax,bend,seed){
      var r=rnd(seed),p=r()*6,q=r()*6,N=200,o=[],i_=[];
      for(var k=0;k<=N;k++){
        var t=k/N,x=x0+(x1-x0)*t,yy=y+bend*Math.sin(Math.PI*t)+6*Math.sin(t*5+p);
        var w=wMax*Math.min(1,Math.pow(t/.08,.55))*Math.pow(1-t,.38)*(1+.13*Math.sin(t*23+q));
        o.push([x,yy-w/2]);i_.push([x,yy+w/2]);
      }
      return polygon(o,i_);
    }
    var OB={1:[[-60,1660,134,205,-14,5],[-120,1720,130,240,-10,9]],
            2:[[1660,-60,128,200,12,13],[1720,-120,132,236,8,17]],
            3:[[-60,1660,132,180,-10,21],[-120,1720,130,214,-8,25]]};
    document.querySelectorAll('.obi-ink,.obi-wash').forEach(function(p){
      var a=OB[p.getAttribute('data-obi')];if(a)p.setAttribute('d',obi.apply(null,a[p.classList.contains('obi-ink')?0:1]));
    });
    /* 帯は画面に入ったら、筆で引くように現れる */
    var obs=document.querySelectorAll('.sumi-obi');
    if(reduce||!('IntersectionObserver' in window)){obs.forEach(function(x){x.classList.add('in')})}
    else{
      var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'});
      obs.forEach(function(x){io2.observe(x)});
    }
    /* 合気道とは の一枚・鵬は、スクロールに少し遅れて／先に流れる */
    if(reduce)return;
    var dr=[].slice.call(document.querySelectorAll('[data-drift]')),busy=false;
    function drift(){
      if(busy)return;busy=true;
      requestAnimationFrame(function(){
        busy=false;var vh=innerHeight;
        dr.forEach(function(e){
          var b=e.getBoundingClientRect();if(b.bottom<-vh||b.top>2*vh)return;
          var p=Math.max(-1.2,Math.min(1.2,((b.top+b.height/2)-vh/2)/vh)),a=e.getAttribute('data-drift').split(',');
          var sx=innerWidth<=640?0:1;/* スマホでは横に流さない（画面から見切れないように・2026-11-14） */
          e.style.transform='translate('+f(-a[0]*p*sx)+'px,'+f(a[1]*p)+'px)';
        });
      });
    }
    addEventListener('scroll',drift,{passive:true});addEventListener('resize',drift);drift();
  })();
})();
