import React, {useState,useRef,useEffect,useCallback} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Flip} from 'gsap/Flip';
import {useGSAP} from '@gsap/react';
import {ArrowUpRight, ArrowDown, ArrowRight, ArrowLeft, X, Sun, Moon, Plus, Minus, List, SquaresFour, Pause, Play, Copy, Check, MagnifyingGlassPlus, MagnifyingGlassMinus, DownloadSimple} from '@phosphor-icons/react';
import projects from './projects.json';

gsap.registerPlugin(ScrollTrigger,Flip,useGSAP);
const allCategories=['全部','UI / UX','品牌视觉','平面设计','IP / 插画'];
const reduceQuery=typeof window!=='undefined'?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
function readPreference(key,fallback){try{return localStorage.getItem(key)||fallback;}catch{return fallback;}}
function savePreference(key,value){try{localStorage.setItem(key,value);}catch{}}
function Image({item,className='',thumb=false,eager=false,...props}){
  const [failed,setFailed]=useState(false);
  return failed?<div className={`image-fallback ${className}`}>图片暂时无法显示</div>:<img className={className} src={thumb?item.thumb:item.src} alt={item.title} width={item.width} height={item.height} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)} {...props}/>;
}
function Magnetic({children,className='',as:Tag='button',motion=true,...props}){
  const ref=useRef(null);
  useGSAP((ctx,contextSafe)=>{
    if(!motion||!matchMedia('(pointer:fine)').matches)return;
    const el=ref.current;
    const x=gsap.quickTo(el,'x',{duration:.55,ease:'power3.out'});
    const y=gsap.quickTo(el,'y',{duration:.55,ease:'power3.out'});
    const move=contextSafe(e=>{const r=el.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.16);y((e.clientY-r.top-r.height/2)*.16);});
    const leave=contextSafe(()=>{x(0);y(0);});
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
    return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
  },{scope:ref,dependencies:[motion],revertOnUpdate:true});
  return <Tag ref={ref} className={className} {...props}>{children}</Tag>;
}
function Hero({open,motion}){
  const ref=useRef(null), deckRef=useRef(null), flipState=useRef(null), gesture=useRef(null), swipeClick=useRef(false);
  const [active,setActive]=useState(0);
  const features=[{project:projects[1],label:'品牌视觉',en:'BRAND & EDITORIAL'},{project:projects[0],label:'数字体验',en:'DIGITAL EXPERIENCE'},{project:projects[2],label:'视觉叙事',en:'POSTER DESIGN'}];
  const select=n=>{const next=(n+3)%3;if(next===active)return;if(motion)flipState.current=Flip.getState(deckRef.current.querySelectorAll('.deck-card'));setActive(next);};
  useGSAP((ctx,contextSafe)=>{
    const cards=deckRef.current.querySelectorAll('.deck-card');
    gsap.set(cards,{clearProps:'transform,translate,rotate,scale'});
    if(motion&&flipState.current){Flip.from(flipState.current,{duration:.95,ease:'power3.inOut',scale:true,prune:true,onComplete:contextSafe(()=>gsap.set(cards,{clearProps:'transform,translate,rotate,scale'}))});gsap.from('.exhibit-title',{y:12,opacity:0,duration:.5,delay:.12});}
    flipState.current=null;
  },{scope:ref,dependencies:[active,motion],revertOnUpdate:true});
  useGSAP((ctx,contextSafe)=>{
    if(!motion)return;
    if(document.documentElement.dataset.prerendered!=='true')gsap.timeline({defaults:{ease:'power3.out',duration:1.35}})
      .from('.hero-word span',{yPercent:115,rotation:3,stagger:.13},.12)
      .from('.hero-intro,.hero-description,.hero-actions',{y:25,autoAlpha:0,stagger:.09},.45)
      .from('.deck-card',{y:100,z:-200,autoAlpha:0,stagger:.13,duration:1.6},.22)
      .from('.hero-foot',{autoAlpha:0,y:12},1);
    const mm=gsap.matchMedia();
    mm.add('(min-width: 900px)',()=>{
      gsap.timeline({scrollTrigger:{trigger:ref.current,start:'top top',end:'bottom top',scrub:1}})
        .to('.hero-heading',{y:75,ease:'none'},0)
        .to('.deck-stage',{y:-90,rotation:-3,ease:'none'},0)
        .to('.hero-spark',{rotation:100,ease:'none'},0);
    },ref);
    let clean=()=>{};
    if(matchMedia('(pointer:fine)').matches){
      const el=deckRef.current;
      const rx=gsap.quickTo(el,'rotationX',{duration:1,ease:'power3.out'});
      const ry=gsap.quickTo(el,'rotationY',{duration:1,ease:'power3.out'});
      const move=contextSafe(e=>{const r=ref.current.getBoundingClientRect();rx(-((e.clientY-r.top)/r.height-.5)*10);ry(((e.clientX-r.left)/r.width-.5)*12);});
      const leave=contextSafe(()=>{rx(0);ry(0);});
      ref.current.addEventListener('pointermove',move);ref.current.addEventListener('pointerleave',leave);
      clean=()=>{ref.current?.removeEventListener('pointermove',move);ref.current?.removeEventListener('pointerleave',leave);};
    }
    return()=>{mm.revert();clean();};
  },{scope:ref,dependencies:[motion],revertOnUpdate:true});
  return <section className="hero" ref={ref} id="home">
    <div className="hero-content">
      <p className="hero-intro">陈谦 · 视觉与数字设计师</p>
      <h1 className="hero-heading" aria-label="CHEN QIAN · 陈谦"><span className="hero-word"><span>CHEN</span></span><span className="hero-word last"><span>QIAN<span className="period">.</span></span></span><span className="hero-spark" aria-hidden="true"><Plus weight="thin"/></span></h1>
      <p className="hero-description">把想法，变成<span className="description-emphasis">有感知的设计。</span></p>
      <p className="hero-disciplines">品牌视觉 <span>/</span> 数字体验 <span>/</span> 图形表达</p>
      <div className="hero-actions"><Magnetic as="a" href="#work" className="button primary" motion={motion}>进入作品集 <ArrowUpRight size={20}/></Magnetic><a href="#about" className="text-link">认识陈谦 <ArrowRight size={16}/></a></div>
    </div>
    <div className="hero-exhibition" onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1));}}} onPointerDown={e=>{swipeClick.current=false;if(e.pointerType==='touch')gesture.current={x:e.clientX,y:e.clientY};}} onPointerUp={e=>{if(!gesture.current)return;const dx=e.clientX-gesture.current.x,dy=e.clientY-gesture.current.y;gesture.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){swipeClick.current=true;select(active+(dx<0?1:-1));}}} onPointerCancel={()=>{gesture.current=null;}} onClickCapture={e=>{if(swipeClick.current){e.preventDefault();e.stopPropagation();swipeClick.current=false;}}}>
      <div className="exhibit-topline"><span>FEATURED OBJECTS / 2026</span><span className="exhibit-hint"><span className="desktop-hint">点选切换 · 点击当前作品展开</span><span className="mobile-hint">左右滑动 / 点选切换</span></span></div>
      <div className="deck-stage"><div className="deck" ref={deckRef} data-active={active}>
        <button className={`deck-card deck-a ${active===2?'is-featured':''}`} aria-label={active===2?'查看节日海报项目':'切换至视觉叙事作品'} onClick={()=>active===2?open(projects[2]):select(2)}><img src="assets/works/059.webp" alt="教师节黑金创意海报：师者如光"/><span>POSTER DESIGN <ArrowUpRight/></span></button>
        <button className={`deck-card deck-c ${active===1?'is-featured':''}`} aria-label={active===1?'查看心情气象台项目':'切换至数字体验作品'} onClick={()=>active===1?open(projects[0]):select(1)}><img src="assets/works/110.webp" alt="心情气象台绿色移动端界面"/><span>DIGITAL EXPERIENCE <ArrowUpRight/></span></button>
        <button className={`deck-card deck-b ${active===0?'is-featured':''}`} aria-label={active===0?'查看成达企业文化视觉项目':'切换至品牌视觉作品'} onClick={()=>active===0?open(projects[1]):select(0)}><div className="deck-cover"><img src="assets/works/014.webp" alt="成达企业文化手册：拥抱变化" fetchPriority="high"/></div><span>BRAND & EDITORIAL <ArrowUpRight/></span></button>
      </div></div>
      <div className="exhibit-controls"><div className="exhibit-title" aria-live="polite"><span>{String(active+1).padStart(2,'0')} / 03</span><button onClick={()=>open(features[active].project)}>{features[active].project.title}<ArrowUpRight size={17}/></button></div><div className="exhibit-tabs" role="group" aria-label="首页作品切换">{features.map((f,i)=><button key={f.label} aria-pressed={active===i} className={active===i?'active':''} onClick={()=>select(i)}><span>{f.label}</span></button>)}</div></div>
    </div>
    <div className="hero-foot"><span>DESIGNING SINCE 2008 <span className="foot-divider">/</span> GUANGZHOU, CHINA</span><a href="#work">向下探索 <ArrowDown size={15}/></a><span>SELECTED PORTFOLIO © 2026</span></div>
  </section>;
}
function Artwork({project,eager=false}){
  const p=project;
  if(p.id==='haoyu')return <div className="artwork website-art"><div className="browser-chrome"><i/><i/><i/><span>HAOYU · DIGITAL EXPERIENCE</span></div><img src="assets/works/haoyu.webp" alt="昊誉信息官网设计" loading="lazy"/></div>;
  if(['mood','teacher'].includes(p.id))return <div className="artwork phone-art">{p.cover.map((im,i)=><div className={`phone phone-${i}`} key={im.src}><Image item={im} thumb eager={eager}/></div>)}<span className="art-word">{p.id==='mood'?'FEEL GOOD.':'KEEP LEARNING.'}</span></div>;
  if(p.id==='chengda')return <div className="artwork editorial-art"><Image item={p.cover[0]} thumb eager={eager}/><span className="editorial-caption">EMBRACE<br/>THE CHANGE.</span><span className="editorial-small">成达 · 文化视觉体系</span></div>;
  if(['festival','care'].includes(p.id))return <div className={`artwork poster-art ${p.id}`}>{p.cover.map((im,i)=><Image item={im} key={im.src} className={`poster poster-${i}`} thumb eager={eager}/>)}</div>;
  if(p.id==='ip')return <div className="artwork ip-art"><span className="ip-type">HELLO,<br/>LITTLE ONE.</span><Image item={p.cover[0]} thumb eager={eager}/></div>;
  if(p.id==='data')return <div className="artwork data-art"><span className="data-label">DATA IN PERSPECTIVE</span><Image item={p.cover[0]} thumb/></div>;
  if(p.id==='forum')return <div className="artwork forum-art"><Image item={p.cover[0]} thumb/><Image item={p.cover[1]} className="pass" thumb/></div>;
  if(p.id==='identity')return <div className="artwork identity-art">{p.cover.map(im=><Image item={im} key={im.src} thumb/>)}</div>;
  return <div className={`artwork long-art ${p.id}`}><Image item={p.cover[0]} thumb/></div>;
}
function WorkCard({project,open,motion,index}){
  const ref=useRef(null);
  useGSAP((ctx,contextSafe)=>{
    if(!motion||!matchMedia('(pointer:fine)').matches)return;
    const el=ref.current,scene=el.querySelector('.work-visual'),label=el.querySelector('.view-label');
    const x=gsap.quickTo(label,'x',{duration:.5,ease:'power3.out'}),y=gsap.quickTo(label,'y',{duration:.5,ease:'power3.out'});
    const rx=gsap.quickTo(scene,'rotationX',{duration:.7}),ry=gsap.quickTo(scene,'rotationY',{duration:.7});
    const move=contextSafe(e=>{const r=el.getBoundingClientRect();const dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;x(dx*24);y(dy*20);rx(-dy*3);ry(dx*3);});
    const leave=contextSafe(()=>{x(0);y(0);rx(0);ry(0);});
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
    return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
  },{scope:ref,dependencies:[motion],revertOnUpdate:true});
  return <article className={`work-card work-${project.id}`} ref={ref} data-flip-id={project.id}>
    <button className="work-button" onClick={()=>open(project)} aria-label={`查看项目：${project.title}`} aria-describedby={`caption-${project.id}`}>
      <div className="work-visual" aria-hidden="true" style={{'--art-bg':project.color}}><Artwork project={project}/><span className="view-label">查看项目 <ArrowUpRight size={22}/></span><span className="corner-mark"><ArrowUpRight size={20}/></span></div>
      <div className="work-caption"><div><h3>{project.title}</h3><p id={`caption-${project.id}`} aria-hidden="true">{project.type}</p></div><span className="project-category" aria-hidden="true">{project.category}</span></div>
    </button>
  </article>;
}
function Work({open,motion}){
  const [filter,setFilter]=useState('全部'),[layout,setLayout]=useState('grid'),[expanded,setExpanded]=useState(false);
  const ref=useRef(null),flipState=useRef(null);
  const filtered=projects.filter(p=>filter==='全部'||p.category===filter);
  const visible=filter==='全部'&&!expanded?filtered.slice(0,6):filtered;
  const switchFilter=(f)=>{if(motion)flipState.current=Flip.getState(ref.current.querySelectorAll('.work-card'));setFilter(f);};
  useGSAP(()=>{
    if(motion&&flipState.current){Flip.from(flipState.current,{duration:.65,ease:'power3.inOut',absolute:false,prune:true});gsap.from('.work-card',{autoAlpha:0,y:25,duration:.6,stagger:.04,clearProps:'opacity,visibility'});flipState.current=null;}
    ScrollTrigger.refresh();
  },{scope:ref,dependencies:[filter,layout,expanded,motion],revertOnUpdate:true});
  return <section id="work" className="work-section section" ref={ref}>
    <div className="section-heading reveal"><div><p className="eyebrow">SELECTED WORK</p><h2>让作品<span className="muted">说话。</span></h2></div><div className="heading-copy"><span className="collection-count">{String(projects.length).padStart(2,'0')}<sup>精选项目</sup></span><p>从一个符号，到一整套体验。</p></div></div>
    <div className="work-toolbar"><div className="filters" role="group" aria-label="按作品类别筛选">{allCategories.map(c=><button className={filter===c?'selected':''} aria-pressed={filter===c} onClick={()=>switchFilter(c)} key={c}>{c}<sup>{c==='全部'?projects.length:projects.filter(p=>p.category===c).length}</sup></button>)}</div><div className="layout-toggle" role="group" aria-label="作品视图"><button onClick={()=>setLayout('grid')} className={layout==='grid'?'active':''} aria-label="画廊视图" aria-pressed={layout==='grid'}><SquaresFour size={18}/></button><button onClick={()=>setLayout('list')} className={layout==='list'?'active':''} aria-label="索引视图" aria-pressed={layout==='list'}><List size={19}/></button></div></div>
    {layout==='grid'?<div className="work-grid">{visible.map((p,i)=><WorkCard key={p.id} project={p} open={open} motion={motion} index={i}/>)}</div>:<div className="work-index">{filtered.map((p,i)=><button className="index-row" key={p.id} onClick={()=>open(p)}><span className="index-no">{String(i+1).padStart(2,'0')}</span><span className="index-title"><strong>{p.title}</strong><span>{p.en}</span></span><span className="index-preview" style={{background:p.color}}><Artwork project={p}/></span><span className="index-category">{p.category}</span><ArrowUpRight size={28}/></button>)}</div>}
    {layout==='grid'&&filter==='全部'&&<div className="more-work"><Magnetic className="button secondary" motion={motion} onClick={()=>setExpanded(!expanded)}>{expanded?'收起更多作品':`继续探索全部 ${projects.length} 组项目`}{expanded?<Minus size={18}/>:<Plus size={18}/>}</Magnetic><span>{expanded?'持续探索，持续创作。':'还有更多，值得一看。'}</span></div>}
  </section>;
}
const history=[
  ['2014.11 至今','广州昊誉信息科技有限公司','设计部经理','负责项目平台设计，统筹设计与前端工作的分配、审核与协作。'],
  ['2013.12 - 2014.11','广州比目科技有限公司','UI 设计','负责公司各类项目的 UI 设计。'],
  ['2012.06 - 2013.12','广州云宏科技股份有限公司','UI 设计主管','负责云平台项目界面及相关宣传设计。'],
  ['2010.09 - 2012.06','深圳艾诺科技有限公司','UI 设计','负责产品网页宣传与界面设计。'],
  ['2008.06 - 2010.09','泛蓝集团','设计','负责画册、包装等平面设计工作。']
];
function Filmstrip({open,motion}){
  const ref=useRef(null),track=useRef(null),tween=useRef(null),current=useRef(0),[active,setActive]=useState(0);
  const chapters=[
    {title:<>从一个符号，<br/>到一个品牌。</>,en:'MAKE IT<br/>RECOGNIZABLE.',text:'在色彩、图形与版式之间，找到属于品牌的表达。',project:projects[1],label:'品牌表达',num:'01'},
    {title:<>从一次点击，<br/>到一种体验。</>,en:'MAKE IT<br/>INTUITIVE.',text:'让复杂的内容变得清晰，让每一次交互自然发生。',project:projects[0],label:'数字体验',num:'02'},
    {title:<>从一张画面，<br/>到一份共鸣。</>,en:'MAKE IT<br/>MEMORABLE.',text:'用有辨识度的视觉，让重要的信息被看见、被记住。',project:projects[2],label:'视觉叙事',num:'03'}
  ];
  useGSAP(()=>{
    current.current=0;setActive(0);track.current.scrollLeft=0;
    const mm=gsap.matchMedia();
    if(motion)mm.add('(min-width: 900px)',()=>{
      tween.current=gsap.to(track.current,{x:()=>-(track.current.scrollWidth-ref.current.clientWidth),ease:'none',scrollTrigger:{trigger:ref.current,start:'top 88px',end:()=>`+=${track.current.scrollWidth-ref.current.clientWidth}`,pin:true,scrub:.8,invalidateOnRefresh:true,onUpdate:self=>{const n=Math.round(self.progress*2);if(n!==current.current){current.current=n;setActive(n);}}}});
      return()=>{tween.current=null;current.current=0;setActive(0);};
    },ref);
    return()=>mm.revert();
  },{scope:ref,dependencies:[motion],revertOnUpdate:true});
  const go=n=>{const target=Math.max(0,Math.min(2,n));if(tween.current?.scrollTrigger){const st=tween.current.scrollTrigger;window.scrollTo({top:st.start+(st.end-st.start)*target/2,behavior:motion?'smooth':'instant'});}else{track.current.scrollTo({left:target*track.current.clientWidth,behavior:motion?'smooth':'instant'});}current.current=target;setActive(target);};
  return <section className={`film-section ${motion?'animated':''}`} ref={ref} aria-label="设计视角横向展厅"><div className="film-header"><div><p className="eyebrow">A CHANGE OF PERSPECTIVE</p><h2>设计，不止一面。</h2></div><div className="film-tabs" role="group" aria-label="切换设计视角">{chapters.map((c,i)=><button key={c.label} aria-pressed={active===i} className={active===i?'active':''} onClick={()=>go(i)}>{c.label}</button>)}</div></div><div className="film-window"><div className="film-track" ref={track} onScroll={()=>{if(!tween.current){const n=Math.round(track.current.scrollLeft/track.current.clientWidth);if(n!==current.current){current.current=n;setActive(n);}}}}>{chapters.map((c,i)=><div className={`film-panel film-panel-${i}`} key={c.label} inert={active!==i}><div className="film-copy"><span className="film-number">{c.num}</span><h3>{c.title}</h3><p>{c.text}</p><button className="text-link" onClick={()=>open(c.project)}>走近这个项目 <ArrowUpRight size={18}/></button></div><button className="film-art" onClick={()=>open(c.project)} aria-label={`查看${c.project.title}`} style={{'--art-bg':c.project.color}}><span aria-hidden="true"><Artwork project={c.project}/></span></button><span className="film-background-type" aria-hidden="true" dangerouslySetInnerHTML={{__html:c.en}}/></div>)}</div></div><div className="film-footer"><span>用不同的设计语言，回应同一份热爱。</span><div><button className="icon-button" aria-label="上一个设计视角" onClick={()=>go(active-1)} disabled={active===0}><ArrowLeft size={21}/></button><span>{String(active+1).padStart(2,'0')} / 03</span><button className="icon-button" aria-label="下一个设计视角" onClick={()=>go(active+1)} disabled={active===2}><ArrowRight size={21}/></button></div></div></section>;
}
function About(){
  const [active,setActive]=useState(0);
  return <section id="about" className="about-section section"><div className="about-intro"><div className="about-heading reveal"><p className="eyebrow">THE PERSON BEHIND THE PIXELS</p><h2>对设计，<br/>一直<span className="highlight">保持好奇。</span></h2><div className="name-sign">CHEN<br/>QIAN<span>陈谦</span><span className="signature-dot">.</span></div></div><div className="about-copy reveal"><p className="about-lead">你好，我是陈谦。<br/>让视觉表达与产品体验，<br/>在同一个方向上前进。</p><p>从平面设计出发，走进数字产品，再到品牌与设计团队管理。我始终在意：一个想法如何被准确表达，一个界面如何被自然使用。</p><p>毕业于武汉工业学院广告学专业，2008 年开始设计工作。先后参与企业品牌、产品界面、教育平台与活动视觉设计，也负责设计和前端之间的协调与落地。</p><div className="expertise"><span>UI / UX 设计</span><span>品牌视觉</span><span>图形与 IP</span><span>设计管理</span><span>前端协作</span></div><a className="text-link download-link" href="#contact">联系我，了解更多 <ArrowUpRight size={18}/></a></div></div>
    <div className="experience"><div className="experience-label"><h3>一路走来</h3><p>EXPERIENCE</p><span>始于 2008</span></div><div className="career-list">{history.map((h,i)=><div className={`career-item ${active===i?'active':''}`} key={h[0]}><button aria-expanded={active===i} aria-controls={`career-${i}`} onClick={()=>setActive(active===i?-1:i)}><span className="career-date">{h[0]}</span><span><strong>{h[1]}</strong><em>{h[2]}</em></span>{active===i?<Minus size={19}/>:<Plus size={19}/>}</button><div className="career-detail" id={`career-${i}`} hidden={active!==i}><p>{h[3]}</p></div></div>)}</div></div>
  </section>;
}
function Contact({motion}){
  const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false),timeout=useRef(null);
  useEffect(()=>()=>clearTimeout(timeout.current),[]);
  const copy=async()=>{let ok=false;try{await navigator.clipboard.writeText('381858149@qq.com');ok=true;}catch{const input=document.createElement('textarea');input.value='381858149@qq.com';input.style.cssText='position:fixed;left:-9999px';document.body.appendChild(input);input.select();ok=document.execCommand('copy');input.remove();}setCopied(ok);setCopyError(!ok);clearTimeout(timeout.current);timeout.current=setTimeout(()=>{setCopied(false);setCopyError(false);},3000);};
  return <footer id="contact" className="contact-section section"><div className="contact-top reveal"><p className="eyebrow">LET’S CREATE SOMETHING GOOD</p><h2>下一个好想法，<br/><a href="mailto:381858149@qq.com">一起让它发生。<ArrowUpRight weight="light"/></a></h2></div><div className="contact-links"><div><span>写封邮件给我</span><a href="mailto:381858149@qq.com">381858149@qq.com</a><button className="copy-button" onClick={copy} aria-label="复制邮箱地址">{copied?<Check size={21}/>:<Copy size={21}/>}</button><span className="copy-state" role="status">{copied?'已复制邮箱':copyError?'请长按邮箱地址复制':''}</span></div><div><span>也可以直接联系</span><a href="tel:15915839376">159 1583 9376</a></div><Magnetic as="a" motion={motion} href="mailto:381858149@qq.com" className="contact-orbit" aria-label="发送邮件"><ArrowUpRight size={48} weight="light"/></Magnetic></div><div className="footer-bottom"><a href="#home" className="footer-wordmark">cq.</a><span>© 2026 陈谦 · 设计持续发生</span><span>广州，中国</span><a className="back-top" href="#home">回到顶部 <ArrowUpRight size={16}/></a></div></footer>;
}
function Viewer({items,index,setIndex,close,motion}){
  const ref=useRef(null),[zoom,setZoom]=useState(false),stage=useRef(null);
  const item=items[index];
  useEffect(()=>{ref.current.showModal();return()=>ref.current?.close();},[]);
  useEffect(()=>{setZoom(false);stage.current?.scrollTo(0,0);},[index]);
  useGSAP(()=>{if(motion)gsap.from('.lightbox-image',{opacity:0,scale:.97,duration:.35,ease:'power2.out'});},{scope:ref,dependencies:[index],revertOnUpdate:true});
  const change=(d)=>setIndex((index+d+items.length)%items.length);
  return <dialog className="lightbox" ref={ref} onCancel={e=>{e.preventDefault();e.stopPropagation();close();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();change(1);}if(e.key==='ArrowLeft'){e.preventDefault();change(-1);}}}><div className="lightbox-bar"><span>{item.title}</span><div><button className="icon-button" aria-label={zoom?'适应窗口':'放大查看'} onClick={()=>setZoom(!zoom)}>{zoom?<MagnifyingGlassMinus size={22}/>:<MagnifyingGlassPlus size={22}/>}</button><button className="icon-button" autoFocus aria-label="关闭图片" onClick={close}><X size={24}/></button></div></div><div className={`lightbox-stage ${zoom?'zoomed':''}`} ref={stage}><button className="image-zoom-target" aria-label={zoom?'缩小图片':'放大图片'} onClick={()=>setZoom(!zoom)}><Image item={item} className="lightbox-image" eager/></button></div><div className="lightbox-controls"><button className="icon-button" aria-label="上一张图片" onClick={()=>change(-1)}><ArrowLeft size={24}/></button><span>{String(index+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button className="icon-button" aria-label="下一张图片" onClick={()=>change(1)}><ArrowRight size={24}/></button></div></dialog>;
}
function ProjectDialog({project,close,open,motion}){
  const ref=useRef(null),[viewer,setViewer]=useState(null);
  const items=project.images.length?project.images:[{src:'assets/works/haoyu.webp',thumb:'assets/works/haoyu.webp',title:'昊誉信息官网首页',width:1440,height:1000}];
  useEffect(()=>{const el=ref.current;el.showModal();const before=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=before;};},[]);
  useEffect(()=>{ref.current.scrollTo(0,0);setViewer(null);},[project.id]);
  useGSAP(()=>{if(motion)gsap.from('.project-info,.project-gallery',{y:35,opacity:0,duration:.65,stagger:.1,ease:'power3.out'});},{scope:ref,dependencies:[project.id,motion],revertOnUpdate:true});
  const next=projects[(projects.findIndex(p=>p.id===project.id)+1)%projects.length];
  return <dialog className="project-dialog" ref={ref} aria-labelledby="project-title" onCancel={e=>{e.preventDefault();close();}}><div className="project-topbar"><span>CHEN QIAN / PROJECT VIEW</span><button className="button close-project" autoFocus onClick={close}>关闭项目 <X size={20}/></button></div><div className="project-body"><aside className="project-info"><p className="eyebrow">{project.category}</p><h2 id="project-title">{project.title}</h2><p className="project-en">{project.en}</p><p className="project-description">{project.description}</p><dl><div><dt>设计方向</dt><dd>{project.type}</dd></div><div><dt>项目内容</dt><dd>{project.scope.join(' / ')}</dd></div><div><dt>作品图集</dt><dd>{items.length} 张作品</dd></div></dl>{project.href&&<a className="button primary prototype-link" href={project.href} target="_blank" rel="noreferrer">{project.id==='chengda'?'查看完整 VI 手册':'浏览交互原型'}<ArrowUpRight size={20}/></a>}<p className="gallery-note">点击作品可全屏查看细节。</p></aside><div className="project-gallery"><div className="project-overview" style={{'--art-bg':project.color}}><Artwork project={project} eager/></div><div className={`detail-images ${['mood','teacher','festival','care'].includes(project.id)?'portrait-grid':''}`}>{items.map((im,i)=><button className="detail-image" key={im.src} onClick={()=>setViewer(i)} aria-label={`全屏查看第 ${i+1} 张作品`}><Image item={im}/><span>查看大图 <ArrowUpRight size={18}/></span></button>)}</div></div></div><button className="next-project" onClick={()=>open(next)}><span>下一个项目<strong>{next.title}</strong></span><ArrowRight size={46} weight="light"/></button>{viewer!==null&&<Viewer items={items} index={viewer} setIndex={setViewer} close={()=>setViewer(null)} motion={motion}/>}</dialog>;
}
export function App(){
  const ref=useRef(null),[project,setProject]=useState(null),[theme,setTheme]=useState('light'),[motionSetting,setMotionSetting]=useState(true),[systemReduce,setSystemReduce]=useState(false),[menu,setMenu]=useState(false);
  const motion=motionSetting&&!systemReduce;
  const open=useCallback(p=>setProject(p),[]);
  const firstTheme=useRef(true);
  useEffect(()=>{setTheme(document.documentElement.dataset.theme||'light');setMotionSetting(readPreference('cq-motion','on')==='on');setSystemReduce(reduceQuery.matches);},[]);
  useEffect(()=>{const listener=e=>setSystemReduce(e.matches);reduceQuery.addEventListener('change',listener);return()=>reduceQuery.removeEventListener('change',listener);},[]);
  useEffect(()=>{if(firstTheme.current){firstTheme.current=false;return;}document.documentElement.dataset.theme=theme;savePreference('cq-theme',theme);},[theme]);
  useEffect(()=>{document.documentElement.dataset.motion=motion?'on':'off';savePreference('cq-motion',motionSetting?'on':'off');},[motion,motionSetting]);
  useGSAP(()=>{
    if(!motion)return;
    const reveals=gsap.utils.toArray('.reveal');
    reveals.forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    gsap.to('.page-progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:ref.current,start:'top top',end:'bottom bottom',scrub:.2}});
    gsap.from('.contact-orbit',{rotation:-80,scrollTrigger:{trigger:'#contact',start:'top bottom',end:'bottom bottom',scrub:1}});
    const refresh=()=>ScrollTrigger.refresh();document.fonts.ready.then(refresh);
  },{scope:ref,dependencies:[motion],revertOnUpdate:true});
  useEffect(()=>{const handler=e=>{if(e.key==='Escape')setMenu(false);};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);},[]);
  return <div className="portfolio" ref={ref}><a className="skip-link" href="#work">跳至作品</a><div className="page-progress"/><header className="site-header"><a href="#home" className="brand" aria-label="cq. CHEN QIAN 视觉与数字设计，回到首页"><span className="brand-mark">cq.</span><span className="brand-text">CHEN QIAN<span>视觉与数字设计</span></span></a><nav className={menu?'open':''} aria-label="主导航"><a href="#work" onClick={()=>setMenu(false)}>作品 <span>WORK</span></a><a href="#about" onClick={()=>setMenu(false)}>关于 <span>ABOUT</span></a><a href="#contact" onClick={()=>setMenu(false)}>联系 <ArrowUpRight size={15}/></a></nav><div className="header-controls"><button className="icon-button motion-toggle" aria-label={motion?'暂停动效':'开启动效'} aria-pressed={motion} onClick={()=>setMotionSetting(!motionSetting)} title={systemReduce?'系统已启用减弱动态效果':motion?'暂停动效':'开启动效'} disabled={systemReduce}>{motion?<Pause size={17}/>:<Play size={17}/>}</button><button className="icon-button theme-toggle" aria-label={theme==='light'?'切换深色模式':'切换浅色模式'} onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon size={19}/>:<Sun size={19}/>}</button><button className="icon-button mobile-menu" aria-label={menu?'关闭导航':'打开导航'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={23}/>:<List size={23}/>}</button></div></header><main><Hero open={open} motion={motion}/><Work open={open} motion={motion}/><Filmstrip open={open} motion={motion}/><About/></main><Contact motion={motion}/>{project&&<ProjectDialog project={project} close={()=>setProject(null)} open={open} motion={motion}/>}</div>;
}
if(typeof document!=='undefined')hydrateRoot(document.getElementById('root'),<App/>);
