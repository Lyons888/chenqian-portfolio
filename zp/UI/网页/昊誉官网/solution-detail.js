(function(){
  var body=document.querySelector('body[data-page="solutions"][data-solution-key]');
  if(!body)return;
  var breadcrumb=document.querySelector('.detail-breadcrumb');
  if(breadcrumb){
    var currentCrumb=breadcrumb.querySelector('span:last-child');
    if(currentCrumb){
      var solutions=[['digital','\u6559\u80b2\u6570\u5b57\u5316\u89e3\u51b3\u65b9\u6848','solution-digital.html'],['teacher','\u6559\u5e08\u53d1\u5c55\u4e0e\u57f9\u8bad\u8fd0\u8425','solution-teacher-development.html'],['content-brand','\u6559\u80b2\u8d44\u6e90\u4e0e\u54c1\u724c\u8fd0\u8425','solution-content-brand.html'],['ai-talent','AI \u8bfe\u7a0b\u4e0e\u4eba\u624d\u57f9\u517b','solution-ai-talent.html'],['ai-application','AI \u667a\u80fd\u4f53\u4e0e\u5e94\u7528\u670d\u52a1','solution-ai-application.html']];
      var switcher=document.createElement('span');switcher.className='solution-switcher';
      var toggle=document.createElement('button');toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.textContent=currentCrumb.textContent;
      var menu=document.createElement('span');menu.className='solution-switcher-menu';
      solutions.forEach(function(item){var option=document.createElement('a');option.href=item[2];option.textContent=item[1];if(item[0]===body.getAttribute('data-solution-key'))option.setAttribute('aria-current','page');menu.appendChild(option)});
      switcher.appendChild(toggle);switcher.appendChild(menu);currentCrumb.replaceWith(switcher);
      toggle.addEventListener('click',function(){var open=switcher.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open))});
      document.addEventListener('click',function(event){if(!switcher.contains(event.target)){switcher.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}});
      document.addEventListener('keydown',function(event){if(event.key==='Escape'){switcher.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.focus()}});
    }
  }
  var isV3=body.getAttribute('data-solution-key')==='digital'||body.getAttribute('data-solution-template')==='v3';
  var links=Array.prototype.slice.call(document.querySelectorAll('[data-detail-nav] a'));
  var sections=links.map(function(link){return document.querySelector(link.getAttribute('href'))}).filter(Boolean);
  function setCurrent(id){if(body.hasAttribute('data-case-viewer-open'))return;links.forEach(function(link){var active=link.getAttribute('href')==='#'+id;if(active)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current')})}
  if(!isV3&&'IntersectionObserver' in window&&sections.length){
    var isDigitalSpy=body.getAttribute('data-solution-key')==='digital';
    var spy=new IntersectionObserver(function(entries){var visible=entries.filter(function(entry){return entry.isIntersecting}).sort(function(a,b){return isDigitalSpy?Math.abs(a.boundingClientRect.top-132)-Math.abs(b.boundingClientRect.top-132):b.intersectionRatio-a.intersectionRatio});if(visible[0])setCurrent(visible[0].target.id)},isDigitalSpy?{rootMargin:'-132px 0px -72% 0px',threshold:[0,.01]}:{rootMargin:'-24% 0px -62% 0px',threshold:[0,.15,.35,.6]});
    sections.forEach(function(section){spy.observe(section)});
  }
  if(isV3&&sections.length){
    var digitalSpyFrame=0;
    function syncDigitalSection(){
      digitalSpyFrame=0;
      var anchor=document.querySelector('.detail-anchor-wrap');
      var offset=(anchor?anchor.getBoundingClientRect().bottom:132)+18;
      var current=sections[0];
      sections.forEach(function(section){var margin=parseFloat(window.getComputedStyle(section).scrollMarginTop)||0;if(section.getBoundingClientRect().top<=offset+margin+8)current=section});
      if(current)setCurrent(current.id);
    }
    function requestDigitalSectionSync(){if(!digitalSpyFrame)digitalSpyFrame=window.requestAnimationFrame(syncDigitalSection)}
    document.addEventListener('scroll',requestDigitalSectionSync,{passive:true});
    window.addEventListener('resize',requestDigitalSectionSync,{passive:true});
    window.addEventListener('hashchange',requestDigitalSectionSync);
    window.addEventListener('load',requestDigitalSectionSync,{once:true});
    syncDigitalSection();
    window.requestAnimationFrame(requestDigitalSectionSync);
    window.setTimeout(function(){
      var deepLinkedId=window.location.hash.slice(1);
      if(deepLinkedId&&sections.some(function(section){return section.id===deepLinkedId}))setCurrent(deepLinkedId);
      else requestDigitalSectionSync();
    },500);
  }
  links.forEach(function(link){link.addEventListener('click',function(){setCurrent(link.getAttribute('href').slice(1))})});
  if(isV3){
    var anchorWrap=document.querySelector('.detail-anchor-wrap');
    if(anchorWrap){
      var anchorSentinel=document.createElement('span');
      anchorSentinel.className='detail-anchor-sentinel';
      anchorSentinel.setAttribute('aria-hidden','true');
      anchorWrap.parentNode.insertBefore(anchorSentinel,anchorWrap);
      if('IntersectionObserver' in window){
        var pinObserver=new IntersectionObserver(function(entries){if(body.hasAttribute('data-case-viewer-open'))return;anchorWrap.classList.toggle('is-pinned',!entries[0].isIntersecting)},{rootMargin:'-66px 0px 0px 0px',threshold:0});
        pinObserver.observe(anchorSentinel);
      }
    }
  }
  if(isV3)return;
  var targets=Array.prototype.slice.call(document.querySelectorAll('.detail-section-heading,.detail-overview-card,.detail-info-card,.detail-architecture-layer,.detail-flow li,.detail-pillar,.detail-case,.detail-related a,.detail-cta-box'));
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  body.classList.add('detail-page-motion');
  targets.forEach(function(target){target.setAttribute('data-detail-reveal','')});
  var reveal=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');reveal.unobserve(entry.target)})},{rootMargin:'0px 0px -9% 0px',threshold:.1});
  targets.forEach(function(target){reveal.observe(target)});
})();