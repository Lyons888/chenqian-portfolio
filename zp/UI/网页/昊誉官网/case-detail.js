(function(){
  const cases=Object.values(window.HAOYU_CASES||{});

  const icons=["tabler:arrows-exchange","tabler:database","tabler:target-arrow","tabler:chart-dots","tabler:shield-check","tabler:books"];
  const root=document.getElementById("case-detail-root");
  const current=cases.find(item=>item.id===document.body.dataset.caseId);
  if(!root)return;
  if(!current){root.innerHTML='<section class="story-error container-sm"><h1>案例未找到</h1><a href="cases.html">返回客户案例</a></section>';return;}
  const currentIndex=cases.indexOf(current);
  const related=[1,2,3].map(step=>cases[(currentIndex+step)%cases.length]);
  const picture=(item,size="hero")=>{
    const screenshot=item.heroImage;
    if(size==="hero"||item.id==="party")return '<picture><img src="'+screenshot.src+'" width="'+screenshot.width+'" height="'+screenshot.height+'" loading="'+(size==="hero"?'eager':'lazy')+'"'+(size==="hero"?' fetchpriority="high"':'')+' alt="'+item.caption+'"></picture>';
    return '<img src="assets/case-'+item.image+'-detail-1200.webp" width="1200" height="750" loading="lazy" alt="'+item.caption+'局部">';
  };
  const diagram=d=>'<div class="story-diagram" role="img" aria-label="'+d.title+'"><p class="story-diagram-title">'+d.title+'</p><div class="story-diagram-grid">'+d.nodes.map(n=>'<div class="story-diagram-node">'+n+'</div>').join("")+'</div><p class="story-diagram-note">'+d.note+'</p></div>';
  const heroAction=current.url
    ? '<a class="btn" href="'+current.url+'" target="_blank" rel="noopener noreferrer">访问平台<iconify-icon icon="tabler:external-link" aria-hidden="true"></iconify-icon></a>'
    : '<a class="btn" href="#lead-form">咨询同类项目<iconify-icon icon="tabler:arrow-right" aria-hidden="true"></iconify-icon></a>';

  root.innerHTML='<article class="case-story">'+
    '<header class="case-story-hero"><div class="container-sm"><p class="case-story-breadcrumb"><a href="cases.html">客户案例</a><span>/</span><span>'+current.type+'</span></p><div class="case-story-head"><div><p class="case-story-type">'+current.type+'</p><h1>'+current.title+'</h1><p class="case-story-lead">'+current.summary+'</p><div class="case-story-actions">'+heroAction+'<a class="ghost-btn" href="'+current.solution+'">查看相关解决方案</a></div>'+(current.url?'':'<p class="case-story-private"><iconify-icon icon="tabler:lock" aria-hidden="true"></iconify-icon>内部系统，无公开访问入口</p>')+'</div><dl class="case-story-meta"><div><dt>客户单位</dt><dd>'+current.client+'</dd></div><div><dt>项目类型</dt><dd>'+current.type+'</dd></div><div><dt>建设方向</dt><dd>教育信息化平台与持续运营</dd></div></dl></div><div class="case-story-cover"><figure>'+picture(current,"hero")+'<figcaption>'+current.caption+'</figcaption></figure></div></div></header>'+
    '<div class="container-sm case-story-layout"><main class="case-story-article">'+
      '<section class="story-section" id="overview"><h2>项目概览</h2><div class="story-overview"><div class="story-copy"><p>'+current.summary+'</p><p>项目以业务持续运行和数据长期积累为基础，建设可迭代、可运营的数字化支撑体系。</p></div><div class="story-overview-points">'+current.overview.map(p=>'<div class="story-overview-point"><iconify-icon icon="tabler:circle-check" aria-hidden="true"></iconify-icon><span>'+p+'</span></div>').join("")+'</div></div></section>'+
      '<section class="story-section" id="background"><h2>客户背景</h2><p>'+current.background+'</p>'+(current.concept?diagram(current.diagrams[0]):'<figure class="case-story-visual is-real">'+picture(current,"detail")+'<figcaption>'+current.caption+'，用于说明项目公开页面与服务形态。</figcaption></figure>')+'</section>'+
      '<section class="story-section" id="challenges"><h2>核心挑战</h2><div class="story-challenge-grid">'+current.challenges.map((c,i)=>'<article class="story-challenge"><iconify-icon icon="'+icons[i%icons.length]+'" aria-hidden="true"></iconify-icon><h3>'+c[0]+'</h3><p>'+c[1]+'</p></article>').join("")+'</div></section>'+
      '<section class="story-section" id="solution"><h2>解决方案</h2><div class="story-solution-list">'+current.solutions.map((s,i)=>'<article class="story-solution"><div class="story-solution-num">'+String(i+1).padStart(2,"0")+'</div><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div></article>').join("")+'</div>'+(current.concept?diagram(current.diagrams[1]):'')+'</section>'+
      '<section class="story-section" id="highlights"><h2>创新亮点</h2><div class="story-highlight-grid">'+current.highlights.map(h=>'<article class="story-highlight"><h3>'+h[0]+'</h3><p>'+h[1]+'</p></article>').join("")+'</div></section>'+
      '<section class="story-section" id="results"><h2>应用成果</h2><div class="story-metrics">'+current.metrics.map(m=>'<div class="story-metric"><strong>'+m[0]+'</strong><span>'+m[1]+'</span></div>').join("")+'</div><div class="story-outcomes">'+current.outcomes.map(o=>'<div class="story-outcome"><iconify-icon icon="tabler:circle-check-filled" aria-hidden="true"></iconify-icon><span>'+o+'</span></div>').join("")+'</div></section>'+
      '<section class="story-section" id="value"><h2>客户价值</h2><div class="story-value-columns"><div><h3>面向客户与用户</h3><ul class="story-value-list">'+current.values.map(v=>'<li><strong>'+v[0]+'</strong>'+v[1]+'</li>').join("")+'</ul></div><div><h3>面向长期发展</h3><p>以统一平台、连续数据和持续运营为基础，帮助客户把阶段性项目建设转化为可积累、可扩展的数字化能力。</p></div></div></section>'+
      '<section class="story-section" id="capabilities"><h2>昊誉能力</h2><div class="story-value-columns"><div><h3>服务能力</h3><p>昊誉将业务咨询、平台建设、数据治理与运营服务结合，围绕客户真实工作持续迭代。</p></div><div><ul class="story-value-list">'+current.capabilities.map(v=>'<li><strong>'+v[0]+'</strong>'+v[1]+'</li>').join("")+'</ul></div></div></section>'+
    '</main><aside class="story-sidebar" aria-label="案例目录"><div class="story-sidebar-box"><h2>案例内容</h2><nav class="story-nav"><a href="#overview">项目概览</a><a href="#background">客户背景</a><a href="#challenges">核心挑战</a><a href="#solution">解决方案</a><a href="#highlights">创新亮点</a><a href="#results">应用成果</a><a href="#value">客户价值</a><a href="#capabilities">昊誉能力</a></nav><a class="story-side-solution" href="'+current.solution+'"><span>相关解决方案</span><strong>'+current.solutionLabel+'<iconify-icon icon="tabler:arrow-up-right" aria-hidden="true"></iconify-icon></strong></a></div></aside></div>'+
    '<section class="story-related"><div class="container-sm"><div class="story-related-head"><h2>相关案例</h2><a href="cases.html">查看全部案例</a></div><div class="story-related-grid">'+related.map(item=>'<a class="story-related-card" href="'+item.file+'"><img src="assets/case-'+item.image+'-cover-760.webp" width="760" height="430" loading="lazy" alt="'+item.caption+'"><div><span>'+item.type+'</span><h3>'+item.title+'</h3></div></a>').join("")+'</div></div></section>'+
  '</article>';
})();
