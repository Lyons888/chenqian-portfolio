(function(){
  const caseSection=document.querySelector("#cases");
  const caseMap=window.HAOYU_CASES;
  if(!caseSection||!caseMap)return;

  const cardNodes=[...caseSection.querySelectorAll("a.detail-case[data-case-id]")];
  const items=cardNodes.map(card=>{
    const id=card.dataset.caseId;
    const data=caseMap[id];
    if(!id||!data)return null;
    return{id,data,card,label:card.querySelector("h3")?.textContent?.trim()||data.title};
  }).filter(Boolean);
  if(!items.length)return;

  const itemById=new Map(items.map(item=>[item.id,item]));
  const pageShell=document.querySelector("main");
  const siteHeader=document.querySelector(".site-header");
  const anchorWrap=document.querySelector(".detail-anchor-wrap");
  const anchorLinks=anchorWrap?[...anchorWrap.querySelectorAll("[data-detail-nav] a")]:[];

  const solutionTitle=document.querySelector(".detail-hero h1")?.textContent?.trim()||document.body.dataset.solutionIntent||"解决方案";
  const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const renderPairs=(items,className)=>items.map((item,index)=>'<article class="'+className+'"><span>'+String(index+1).padStart(2,"0")+'</span><div><h4>'+escapeHtml(item[0])+'</h4><p>'+escapeHtml(item[1])+'</p></div></article>').join("");
  const renderSimpleList=items=>'<ul>'+items.map(item=>'<li>'+escapeHtml(item)+'</li>').join("")+'</ul>';
  const renderMetrics=metrics=>{
    const values=metrics.map(metric=>escapeHtml(metric[0])+escapeHtml(metric[1]));
    return values.join("<br>");
  };
  const sourceSubheadings=new Set(["课程供给概览","课程资源七大特色"]);
  const renderSourceList=items=>'<div class="solution-case-viewer__source-list">'+items.map((text,index)=>'<article class="solution-case-viewer__source-item"><span>'+String(index+1).padStart(2,"0")+'</span><p>'+escapeHtml(text)+'</p></article>').join("")+'</div>';
  const renderSourceTable=rows=>{
    if(!Array.isArray(rows)||!rows.length)return"";
    const head='<thead><tr>'+rows[0].map(cell=>'<th scope="col">'+escapeHtml(cell)+'</th>').join("")+'</tr></thead>';
    const body='<tbody>'+rows.slice(1).map(row=>'<tr>'+row.map(cell=>'<td>'+escapeHtml(cell)+'</td>').join("")+'</tr>').join("")+'</tbody>';
    return'<div class="solution-case-viewer__source-table-wrap"><table class="solution-case-viewer__source-table">'+head+body+'</table></div>';
  };
  const renderSourceSectionBody=section=>{
    const items=Array.isArray(section.items)?section.items:[];
    if(section.title==="一、项目概览")return'<div class="solution-case-viewer__source-prose">'+items.filter(item=>item.type==="paragraph").map(item=>'<p class="solution-case-viewer__intro">'+escapeHtml(item.text)+'</p>').join("")+'</div>';
    let output="";
    let list=[];
    const flush=()=>{if(list.length){output+=renderSourceList(list);list=[];}};
    items.forEach(item=>{
      if(item.type==="table"){
        flush();
        output+=renderSourceTable(item.rows);
      }else if(sourceSubheadings.has(item.text)){
        flush();
        output+='<h4 class="solution-case-viewer__source-subheading">'+escapeHtml(item.text)+'</h4>';
      }else{
        list.push(item.text);
      }
    });
    flush();
    return output;
  };
  const renderSourceSections=sections=>sections.map((section,index)=>'<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>'+String(index+1).padStart(2,"0")+'</span><h3>'+escapeHtml(section.title)+'</h3></div>'+renderSourceSectionBody(section)+'</section>').join("");

  const viewer=document.createElement("div");
  viewer.className="solution-case-viewer";
  viewer.hidden=true;
  viewer.innerHTML=
    '<div class="solution-case-viewer__backdrop" data-case-viewer-backdrop></div>'+ 
    '<section class="solution-case-viewer__drawer" role="dialog" aria-modal="true" aria-labelledby="solution-case-viewer-title" tabindex="-1">'+
      '<header class="solution-case-viewer__toolbar">'+
        '<div class="solution-case-viewer__toolbar-row">'+
          '<div><strong>'+escapeHtml(solutionTitle+'案例')+'</strong></div>'+
          '<button class="solution-case-viewer__close" type="button" data-case-viewer-close aria-label="关闭案例详情"><iconify-icon icon="tabler:x" aria-hidden="true"></iconify-icon></button>'+
        '</div>'+
        '<div class="solution-case-viewer__tabs" role="tablist" aria-label="切换本方案案例">'+items.map(item=>'<button type="button" role="tab" data-case-switch="'+escapeHtml(item.id)+'" aria-controls="solution-case-viewer-content" aria-selected="false">'+escapeHtml(item.label)+'</button>').join("")+'</div>'+
      '</header>'+
      '<div class="solution-case-viewer__scroll" id="solution-case-viewer-content" data-case-viewer-scroll></div>'+
      '<p class="solution-case-viewer__status" role="status" aria-live="polite"></p>'+
    '</section>';
  document.body.append(viewer);

  const drawer=viewer.querySelector(".solution-case-viewer__drawer");
  const closeButton=viewer.querySelector("[data-case-viewer-close]");
  const backdrop=viewer.querySelector("[data-case-viewer-backdrop]");
  const tabs=viewer.querySelector(".solution-case-viewer__tabs");
  const scrollArea=viewer.querySelector("[data-case-viewer-scroll]");
  const status=viewer.querySelector(".solution-case-viewer__status");
  const focusableSelector='a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const reduceMotionQuery=window.matchMedia("(prefers-reduced-motion: reduce)");

  let activeId="";
  let isOpen=false;
  let historyOwned=false;
  let lastTrigger=null;
  let lockedScrollY=0;
  let closeTimer=0;
  let closeTransitionCleanup=null;
  let restoreFrame=0;
  let priorScrollRestoration=null;
  let priorRootScrollBehavior=null;
  let priorAriaHidden=null;
  let priorInert=false;
  let bodyStyles=null;
  let rootStyles=null;
  let headerVisualState=null;
  let anchorState=null;
  let anchorVisualState=null;
  let anchorPlaceholder=null;

  const freezeAnchorState=()=>{
    if(anchorState===null&&anchorWrap){
      anchorState={
        pinned:anchorWrap.classList.contains("is-pinned"),
        current:anchorLinks.map(link=>link.getAttribute("aria-current"))
      };
    }
    document.body.setAttribute("data-case-viewer-open","");
  };

  const restoreAnchorState=()=>{
    if(anchorWrap&&anchorState){
      anchorWrap.classList.toggle("is-pinned",anchorState.pinned);
      anchorLinks.forEach((link,index)=>{
        const current=anchorState.current[index];
        if(current===null)link.removeAttribute("aria-current");
        else link.setAttribute("aria-current",current);
      });
    }
    document.body.removeAttribute("data-case-viewer-open");
    anchorState=null;
  };

  const pinAnchorVisual=()=>{
    if(!anchorWrap||anchorVisualState)return;
    const rect=anchorWrap.getBoundingClientRect();
    const computed=window.getComputedStyle(anchorWrap);
    anchorVisualState={
      position:anchorWrap.style.position,
      top:anchorWrap.style.top,
      right:anchorWrap.style.right,
      bottom:anchorWrap.style.bottom,
      left:anchorWrap.style.left,
      width:anchorWrap.style.width,
      height:anchorWrap.style.height,
      margin:anchorWrap.style.margin,
      boxSizing:anchorWrap.style.boxSizing,
      zIndex:anchorWrap.style.zIndex,
      transition:anchorWrap.style.transition
    };
    anchorPlaceholder=document.createElement("div");
    anchorPlaceholder.className="solution-case-viewer__anchor-placeholder";
    anchorPlaceholder.setAttribute("aria-hidden","true");
    Object.assign(anchorPlaceholder.style,{
      height:rect.height+"px",
      marginTop:computed.marginTop,
      marginBottom:computed.marginBottom,
      visibility:"hidden",
      pointerEvents:"none"
    });
    anchorWrap.parentNode.insertBefore(anchorPlaceholder,anchorWrap);
    Object.assign(anchorWrap.style,{
      position:"fixed",
      top:rect.top+"px",
      right:"auto",
      bottom:"auto",
      left:rect.left+"px",
      width:rect.width+"px",
      height:rect.height+"px",
      margin:"0",
      boxSizing:"border-box",
      zIndex:computed.zIndex,
      transition:"none"
    });
  };

  const restoreAnchorVisual=()=>{
    if(!anchorWrap||!anchorVisualState)return;
    Object.assign(anchorWrap.style,anchorVisualState);
    anchorVisualState=null;
    anchorPlaceholder?.remove();
    anchorPlaceholder=null;
  };

  const pinHeaderVisual=()=>{
    if(!siteHeader||headerVisualState)return;
    const rect=siteHeader.getBoundingClientRect();
    headerVisualState={
      position:siteHeader.style.position,
      top:siteHeader.style.top,
      right:siteHeader.style.right,
      bottom:siteHeader.style.bottom,
      left:siteHeader.style.left,
      width:siteHeader.style.width,
      height:siteHeader.style.height,
      boxSizing:siteHeader.style.boxSizing,
      transition:siteHeader.style.transition
    };
    Object.assign(siteHeader.style,{
      position:"fixed",
      top:rect.top+"px",
      right:"auto",
      bottom:"auto",
      left:rect.left+"px",
      width:rect.width+"px",
      height:rect.height+"px",
      boxSizing:"border-box",
      transition:"none"
    });
  };

  const restoreHeaderVisual=()=>{
    if(!siteHeader||!headerVisualState)return;
    Object.assign(siteHeader.style,headerVisualState);
    headerVisualState=null;
  };

  const renderCase=id=>{
    const item=itemById.get(id);
    if(!item)return false;
    const data=item.data;
    const image=data.heroImage||{};
    const platformAction=data.url?'<a class="solution-case-viewer__platform" href="'+escapeHtml(data.url)+'" target="_blank" rel="noopener noreferrer">访问平台<iconify-icon icon="tabler:arrow-up-right" aria-hidden="true"></iconify-icon></a>':'<span class="solution-case-viewer__private">内部系统，无公开访问入口</span>';
    const platformMeta=data.hidePlatform?'':'<div><dt>访问平台</dt><dd>'+platformAction+'</dd></div>';
    activeId=id;
    tabs.querySelectorAll("[data-case-switch]").forEach(button=>{
      const selected=button.dataset.caseSwitch===id;
      button.setAttribute("aria-selected",String(selected));
      button.tabIndex=selected?0:-1;
    });
    scrollArea.innerHTML=
      '<article class="solution-case-viewer__case">'+
        '<header class="solution-case-viewer__hero">'+
          '<div class="solution-case-viewer__hero-copy">'+
            '<span class="solution-case-viewer__type">'+escapeHtml(data.type)+'</span>'+
            '<h2 id="solution-case-viewer-title">'+escapeHtml(data.title)+'</h2>'+
            '<p>'+escapeHtml(data.summary)+'</p>'+
            
          '</div>'+
          '<figure><img src="'+escapeHtml(image.src)+'" width="'+escapeHtml(image.width)+'" height="'+escapeHtml(image.height)+'" decoding="async" alt="'+escapeHtml(data.caption)+'"></figure>'+
          '<dl><div><dt>客户单位</dt><dd>'+escapeHtml(data.client)+'</dd></div><div><dt>项目类型</dt><dd>'+escapeHtml(data.type)+'</dd></div>'+platformMeta+'</dl>'+
        '</header>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>01</span><h3>项目概览</h3></div><p class="solution-case-viewer__intro">'+escapeHtml(data.summary)+'</p><div class="solution-case-viewer__overview">'+data.overview.map(point=>'<div><iconify-icon icon="tabler:circle-check" aria-hidden="true"></iconify-icon><span>'+escapeHtml(point)+'</span></div>').join("")+'</div></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>02</span><h3>客户背景</h3></div><p class="solution-case-viewer__intro">'+escapeHtml(data.background)+'</p></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>03</span><h3>核心挑战</h3></div><div class="solution-case-viewer__pair-grid is-challenges">'+renderPairs(data.challenges,"solution-case-viewer__pair")+'</div></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>04</span><h3>解决方案</h3></div><div class="solution-case-viewer__solution-list">'+renderPairs(data.solutions,"solution-case-viewer__solution")+'</div></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>05</span><h3>创新亮点</h3></div><div class="solution-case-viewer__pair-grid is-highlights">'+renderPairs(data.highlights,"solution-case-viewer__pair")+'</div></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>06</span><h3>应用成果</h3></div><p class="solution-case-viewer__result-lead">'+renderMetrics(data.metrics)+'</p><div class="solution-case-viewer__outcomes">'+renderSimpleList(data.outcomes)+'</div></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>07</span><h3>客户价值</h3></div><div class="solution-case-viewer__pair-grid is-groups">'+renderPairs(data.values,"solution-case-viewer__pair")+'</div></section>'+
        '<section class="solution-case-viewer__section"><div class="solution-case-viewer__section-heading"><span>08</span><h3>昊誉能力</h3></div><p class="solution-case-viewer__intro solution-case-viewer__capability-intro">昊誉将业务咨询、平台建设、数据治理与运营服务结合，围绕客户真实工作持续迭代。</p><div class="solution-case-viewer__pair-grid is-groups">'+renderPairs(data.capabilities,"solution-case-viewer__pair")+'</div></section>'+
      '</article>';
    if(Array.isArray(data.sourceSections)){
      const article=scrollArea.querySelector(".solution-case-viewer__case");
      article?.querySelectorAll(":scope > .solution-case-viewer__section").forEach(section=>section.remove());
      article?.insertAdjacentHTML("beforeend",renderSourceSections(data.sourceSections));
    }
    scrollArea.scrollTop=0;
    status.textContent="已切换至“"+data.title+"”";
    return true;
  };

  const lockPage=()=>{
    if(restoreFrame){
      cancelAnimationFrame(restoreFrame);
      restoreFrame=0;
      if(priorRootScrollBehavior!==null){
        document.documentElement.style.scrollBehavior=priorRootScrollBehavior;
        priorRootScrollBehavior=null;
      }
    }
    if("scrollRestoration" in history&&priorScrollRestoration===null){
      priorScrollRestoration=history.scrollRestoration;
      history.scrollRestoration="manual";
    }
    lockedScrollY=window.scrollY;
    freezeAnchorState();
    pinHeaderVisual();
    pinAnchorVisual();

    const root=document.documentElement;
    const layoutWidth=root.clientWidth;
    const supportsStableGutter=window.CSS?.supports?.("scrollbar-gutter: stable")||false;
    bodyStyles={overflow:document.body.style.overflow,paddingRight:document.body.style.paddingRight,width:document.body.style.width};
    rootStyles={overflow:root.style.overflow,scrollbarGutter:root.style.scrollbarGutter};
    if(supportsStableGutter)root.style.scrollbarGutter="stable";
    document.body.style.width=layoutWidth+"px";
    root.style.overflow="hidden";
    document.body.style.overflow="hidden";
    if(pageShell){
      priorAriaHidden=pageShell.getAttribute("aria-hidden");
      priorInert=pageShell.hasAttribute("inert");
      pageShell.setAttribute("aria-hidden","true");
      pageShell.setAttribute("inert","");
    }
  };

  const unlockPage=()=>{
    if(rootStyles){
      document.documentElement.style.overflow=rootStyles.overflow;
      document.documentElement.style.scrollbarGutter=rootStyles.scrollbarGutter;
      rootStyles=null;
    }
    if(bodyStyles){
      document.body.style.overflow=bodyStyles.overflow;
      document.body.style.paddingRight=bodyStyles.paddingRight;
      document.body.style.width=bodyStyles.width;
      bodyStyles=null;
    }

    if(pageShell){
      if(!priorInert)pageShell.removeAttribute("inert");
      if(priorAriaHidden===null)pageShell.removeAttribute("aria-hidden");
      else pageShell.setAttribute("aria-hidden",priorAriaHidden);
    }
  };

  const restorePagePosition=focusTarget=>{
    const targetY=lockedScrollY;
    const root=document.documentElement;
    priorRootScrollBehavior=root.style.scrollBehavior;
    root.style.scrollBehavior="auto";
    const restore=()=>{
      if(Math.abs(window.scrollY-targetY)>1)window.scrollTo(0,targetY);
    };
    restore();
    if(focusTarget?.isConnected)focusTarget.focus({preventScroll:true});
    restoreHeaderVisual();
    restoreAnchorVisual();
    restoreFrame=requestAnimationFrame(()=>{
      restore();
      restoreFrame=0;
      root.style.scrollBehavior=priorRootScrollBehavior;
      priorRootScrollBehavior=null;
      if(priorScrollRestoration!==null){
        history.scrollRestoration=priorScrollRestoration;
        priorScrollRestoration=null;
      }
      restoreAnchorState();
    });
  };

  const showViewer=()=>{
    if(isOpen)return;
    if(closeTransitionCleanup){
      closeTransitionCleanup();
      closeTransitionCleanup=null;
    }
    clearTimeout(closeTimer);
    closeTimer=0;
    isOpen=true;

    viewer.hidden=false;
    lockPage();
    requestAnimationFrame(()=>{
      viewer.classList.add("is-open");
      closeButton.focus();
    });
  };

  const hideViewer=()=>{
    if(!isOpen)return;
    isOpen=false;
    viewer.classList.remove("is-open");
    const focusTarget=lastTrigger;
    let finished=false;
    const finish=()=>{
      if(finished)return;
      if(isOpen){
        cleanup();
        return;
      }
      finished=true;
      cleanup();
      viewer.hidden=true;
      unlockPage();
      restorePagePosition(focusTarget);
      lastTrigger=null;
      activeId="";
    };
    const handleDrawerTransitionEnd=event=>{
      if(event.target!==drawer||event.propertyName!=="transform")return;
      finish();
    };
    const cleanup=()=>{
      drawer.removeEventListener("transitionend",handleDrawerTransitionEnd);
      clearTimeout(closeTimer);
      closeTimer=0;
      if(closeTransitionCleanup===cleanup)closeTransitionCleanup=null;
    };
    closeTransitionCleanup=cleanup;
    if(reduceMotionQuery.matches){
      finish();
      return;
    }
    drawer.addEventListener("transitionend",handleDrawerTransitionEnd);
    closeTimer=window.setTimeout(finish,420);
  };

  const caseUrl=id=>{
    const url=new URL(window.location.href);
    url.hash="case-"+id;
    return url.href;
  };

  const openCase=(id,options={})=>{
    if(!renderCase(id))return;
    if(options.trigger)lastTrigger=options.trigger;
    showViewer();
    if(options.historyMode==="push"){
      history.pushState({solutionCaseViewer:true,caseId:id},"",caseUrl(id));
      historyOwned=true;
    }else if(options.historyMode==="replace"){
      history.replaceState({solutionCaseViewer:true,caseId:id},"",caseUrl(id));
    }
  };

  const requestClose=()=>{
    if(historyOwned&&history.state?.solutionCaseViewer){
      historyOwned=false;
      hideViewer();
      history.back();
      return;
    }
    const url=new URL(window.location.href);
    url.hash="cases";
    history.replaceState(null,"",url.href);
    hideViewer();
  };

  cardNodes.forEach(card=>card.addEventListener("click",event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const id=card.dataset.caseId;
    if(!itemById.has(id))return;
    event.preventDefault();
    openCase(id,{trigger:card,historyMode:"push"});
  }));

  tabs.addEventListener("click",event=>{
    const button=event.target.closest("[data-case-switch]");
    if(!button||button.dataset.caseSwitch===activeId)return;
    openCase(button.dataset.caseSwitch,{historyMode:"replace"});
    button.focus();
  });

  tabs.addEventListener("keydown",event=>{
    const buttons=[...tabs.querySelectorAll("[data-case-switch]")];
    const currentIndex=buttons.indexOf(document.activeElement);
    if(currentIndex<0)return;
    let nextIndex;
    if(event.key==="ArrowRight")nextIndex=(currentIndex+1)%buttons.length;
    else if(event.key==="ArrowLeft")nextIndex=(currentIndex-1+buttons.length)%buttons.length;
    else if(event.key==="Home")nextIndex=0;
    else if(event.key==="End")nextIndex=buttons.length-1;
    else return;
    event.preventDefault();
    const nextButton=buttons[nextIndex];
    if(nextButton.dataset.caseSwitch!==activeId){
      openCase(nextButton.dataset.caseSwitch,{historyMode:"replace"});
    }
    nextButton.focus();
  });

  closeButton.addEventListener("click",requestClose);
  backdrop.addEventListener("click",requestClose);
  document.addEventListener("keydown",event=>{
    if(!isOpen)return;
    if(event.key==="Escape"){
      event.preventDefault();
      requestClose();
      return;
    }
    if(event.key!=="Tab")return;
    const focusable=[...drawer.querySelectorAll(focusableSelector)].filter(element=>!element.hasAttribute("hidden")&&element.getClientRects().length);
    if(!focusable.length){event.preventDefault();drawer.focus();return;}
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });

  window.addEventListener("popstate",event=>{
    const match=window.location.hash.match(/^#case-([a-z0-9-]+)$/);
    const id=match?.[1];
    if(id&&itemById.has(id)){
      historyOwned=Boolean(event.state?.solutionCaseViewer);
      openCase(id,{historyMode:"none"});
    }else if(isOpen){
      historyOwned=false;
      hideViewer();
    }
  });

  const initialMatch=window.location.hash.match(/^#case-([a-z0-9-]+)$/);
  const navigationEntry=performance.getEntriesByType?.("navigation")?.[0];
  const isPageReload=navigationEntry?.type==="reload";
  if(initialMatch&&itemById.has(initialMatch[1])){
    if(isPageReload){
      const url=new URL(window.location.href);
      url.hash="";
      history.replaceState(null,"",url.href);
    }else{
      historyOwned=false;
      openCase(initialMatch[1],{trigger:itemById.get(initialMatch[1]).card,historyMode:"none"});
    }
  }
})();
