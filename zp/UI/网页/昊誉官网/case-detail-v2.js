(function(){
  const root=document.getElementById("case-detail-root");
  const old=root&&root.querySelector(".case-story");
  if(!old)return;
  const current=window.HAOYU_CASES?.[document.body.dataset.caseId];
  const q=(s,p=old)=>p.querySelector(s);
  const qa=(s,p=old)=>[...p.querySelectorAll(s)];
  const text=(s,p=old)=>q(s,p)?.textContent?.trim()||"";
  const escape=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const title=text(".case-story-head h1"),type=text(".case-story-type"),lead=text(".case-story-lead");
  const meta=qa(".case-story-meta div").map(x=>({label:text("dt",x),value:text("dd",x)}));
  const actionNodes=qa(".case-story-actions a");
  const platformAction=actionNodes[0];
  const coverFigure=q(".case-story-cover figure").cloneNode(true);
  q("figcaption",coverFigure)?.remove();
  const cover=coverFigure.outerHTML;
  const solutionLink=q(".story-side-solution");
  const linkAttrs=a=>' href="'+escape(a?.getAttribute("href")||"#")+'"'+(a?.getAttribute("target")?' target="_blank" rel="noopener noreferrer"':"");
  const platformHtml=current?.url?'<a class="story-v2-fact-link"'+linkAttrs(platformAction)+'>访问平台<iconify-icon icon="tabler:arrow-up-right" aria-hidden="true"></iconify-icon></a>':'<span>'+escape(current?.platform)+'</span>';
  const solutionHtml='<a class="story-v2-fact-link" href="'+escape(solutionLink.getAttribute("href"))+'">'+escape(text("strong",solutionLink))+'<iconify-icon icon="tabler:arrow-up-right" aria-hidden="true"></iconify-icon></a>';
  const overviewText=text(".story-copy p",q("#overview"));
  const overviewPoints=qa(".story-overview-point span",q("#overview")).map(x=>x.textContent.trim());
  const background=text(":scope > p",q("#background"));
  const backgroundFigure=q(".case-story-visual",q("#background"));
  const challenges=qa(".story-challenge",q("#challenges")).map(x=>({title:text("h3",x),body:text("p",x)}));
  const solutions=qa(".story-solution",q("#solution")).map(x=>({title:text("h3",x),body:text("p",x)}));
  const highlights=qa(".story-highlight",q("#highlights")).map(x=>({title:text("h3",x),body:text("p",x)}));
  const metrics=qa(".story-metric",q("#results")).map(x=>text("strong",x)+text("span",x));
  const outcomes=qa(".story-outcome span",q("#results")).map(x=>x.textContent.trim());
  const groups=id=>qa(".story-value-list li",q(id)).map(li=>{const strong=text("strong",li);return{title:strong,body:li.textContent.trim().slice(strong.length).trim()}});
  const values=groups("#value"),capabilities=groups("#capabilities");
  const capabilityIntro="";
  const convertDiagram=source=>{if(!source)return"";const diagram=q(".story-diagram",source);if(!diagram)return"";const nodes=qa(".story-diagram-node",diagram).map(n=>'<div class="story-v2-diagram-node">'+escape(n.textContent.trim())+'</div>').join("");return'<div class="story-v2-diagram"><p class="story-v2-diagram-title">'+escape(text(".story-diagram-title",diagram))+'</p><div class="story-v2-diagram-grid">'+nodes+'</div><p class="story-v2-diagram-note">'+escape(text(".story-diagram-note",diagram))+'</p></div>'};
  const backgroundMedia="";
  const solutionDiagram="";
  const nav=[["overview","项目概览"],["background","客户背景"],["challenges","核心挑战"],["solution","解决方案"],["highlights","创新亮点"],["results","应用成果"],["value","客户价值"],["capabilities","昊誉能力"]];
  root.innerHTML='<article class="story-v2">'+
  '<header class="story-v2-hero"><div class="container-sm"><nav class="story-v2-breadcrumb" aria-label="面包屑"><a href="index.html"><iconify-icon icon="tabler:home" aria-hidden="true"></iconify-icon>首页</a><span>/</span><a href="cases.html">客户案例</a><span>/</span><span aria-current="page">'+escape(title)+'</span></nav><div class="story-v2-hero-grid"><div class="story-v2-hero-main"><h1>'+escape(title)+'</h1><p class="story-v2-lead">'+escape(lead)+'</p><div class="story-v2-cover">'+cover+'</div></div><dl class="story-v2-facts"><div><dt>客户单位</dt><dd>'+escape(meta[0]?.value)+'</dd></div><div><dt>项目类型</dt><dd>'+escape(meta[1]?.value||type)+'</dd></div><div><dt>相关方案</dt><dd>'+solutionHtml+'</dd></div><div><dt>访问平台</dt><dd>'+platformHtml+'</dd></div></dl></div></div></header>'+
  '<div class="container-sm story-v2-shell"><div class="story-v2-nav-bar"><nav class="story-v2-nav" aria-label="案例内容导航">'+nav.map(n=>'<a href="#'+n[0]+'">'+n[1]+'</a>').join("")+'</nav></div><main class="story-v2-article">'+
  '<section class="story-v2-section" id="overview"><h2>项目概览</h2><div class="story-v2-overview"><p>'+escape(overviewText)+'</p><div class="story-v2-overview-points">'+overviewPoints.map(p=>'<div class="story-v2-overview-point">'+escape(p)+'</div>').join("")+'</div></div></section>'+
  '<section class="story-v2-section" id="background"><h2>客户背景</h2><p>'+escape(background)+'</p>'+backgroundMedia+'</section>'+
  '<section class="story-v2-section" id="challenges"><h2>核心挑战</h2><div class="story-v2-challenges">'+challenges.map((c,i)=>'<article class="story-v2-challenge"><span class="story-v2-index">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+escape(c.title)+'</h3><p>'+escape(c.body)+'</p></div></article>').join("")+'</div></section>'+
  '<section class="story-v2-section" id="solution"><h2>解决方案</h2><div class="story-v2-solutions">'+solutions.map((s,i)=>'<article class="story-v2-solution"><span class="story-v2-index">'+String(i+1).padStart(2,"0")+'</span><h3>'+escape(s.title)+'</h3><div><p>'+escape(s.body)+'</p></div></article>').join("")+'</div>'+solutionDiagram+'</section>'+
  '<section class="story-v2-section" id="highlights"><h2>创新亮点</h2><div class="story-v2-highlights">'+highlights.map(h=>'<article class="story-v2-highlight"><h3>'+escape(h.title)+'</h3><p>'+escape(h.body)+'</p></article>').join("")+'</div></section>'+
  '<section class="story-v2-section" id="results"><h2>应用成果</h2><p class="story-v2-result-lead">'+metrics.map(escape).join("<br>")+'</p><ul class="story-v2-result-list">'+outcomes.map(o=>'<li>'+escape(o)+'</li>').join("")+'</ul></section>'+
  '<section class="story-v2-section" id="value"><h2>客户价值</h2><div class="story-v2-groups">'+values.map(v=>'<article class="story-v2-group"><h3>'+escape(v.title)+'</h3><p>'+escape(v.body)+'</p></article>').join("")+'</div></section>'+
  '<section class="story-v2-section" id="capabilities"><h2>昊誉能力</h2>'+(capabilityIntro?'<p class="story-v2-capability-intro">'+escape(capabilityIntro)+'</p>':'')+'<div class="story-v2-groups">'+capabilities.map(v=>'<article class="story-v2-group"><h3>'+escape(v.title)+'</h3><p>'+escape(v.body)+'</p></article>').join("")+'</div></section>'+
  '</main><div class="story-v2-rail" aria-hidden="true"></div></div></article>';
})();
