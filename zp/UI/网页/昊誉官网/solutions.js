(function(){
  'use strict';
  var body=document.querySelector('body[data-page="solutions"]');
  if(!body||body.dataset.solutionGateway)return;
  body.dataset.solutionGateway='ready';

  var routes={'solution-digital':'solution-digital.html','solution-teacher':'solution-teacher-development.html','solution-resource':'solution-content-brand.html','solution-brand':'solution-content-brand.html','solution-resource-brand':'solution-content-brand.html','solution-ai-training':'solution-ai-talent.html','solution-agent':'solution-ai-application.html'};
  var routeKey=window.location.hash.slice(1);
  if(routes[routeKey]){window.location.replace(routes[routeKey]);return;}

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function localizeFooter(){var node=document.querySelector('#site-footer .copyright');if(node&&node.textContent.includes(' All Rights Reserved.'))node.textContent=node.textContent.replace(' All Rights Reserved.',' 版权所有');}
  localizeFooter();
  var footerHost=document.querySelector('#site-footer');
  if(footerHost&&window.MutationObserver)new MutationObserver(localizeFooter).observe(footerHost,{childList:true,subtree:true});

  function initAnchorNav(){
    var links=Array.prototype.slice.call(document.querySelectorAll('.solution-anchor-inner a'));
    var sections=links.map(function(link){return document.querySelector(link.getAttribute('href'));}).filter(Boolean);
    if(!links.length||!sections.length||!('IntersectionObserver' in window))return;
    function setCurrent(id){links.forEach(function(link){var active=link.getAttribute('href')==='#'+id;link.classList.toggle('is-current',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
    var visible={};
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){visible[entry.target.id]=entry.isIntersecting?entry.intersectionRatio:0;});var winner=sections.slice().sort(function(a,b){return (visible[b.id]||0)-(visible[a.id]||0);})[0];if(winner&&(visible[winner.id]||0)>0)setCurrent(winner.id);},{rootMargin:'-18% 0px -55% 0px',threshold:[0,.1,.25,.5]});
    sections.forEach(function(section){observer.observe(section);});
  }

  function initSolutionSelector(){
    var root=document.querySelector('[data-solution-selector]');if(!root)return;
    var tabs=Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels=tabs.map(function(tab){return document.getElementById(tab.getAttribute('aria-controls'));});
    var active=0;
    function select(index,focus){
      active=clamp(index,0,tabs.length-1);
      tabs.forEach(function(tab,i){var on=i===active;tab.classList.toggle('is-active',on);tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;});
      panels.forEach(function(panel,i){if(!panel)return;var on=i===active;panel.hidden=!on;panel.classList.toggle('is-active',on);panel.classList.remove('is-entering');if(on){void panel.offsetWidth;panel.classList.add('is-entering');}});
      if(focus)tabs[active].focus({preventScroll:true});
    }
    tabs.forEach(function(tab,index){tab.addEventListener('click',function(){select(index,false);});tab.addEventListener('keydown',function(event){var next=index;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(next,true);});});
    select(0,false);
  }

  function initSolutionCards(){
    var cards=Array.prototype.slice.call(document.querySelectorAll('.solution-panel'));
    cards.forEach(function(card){
      var link=card.querySelector('a[href]');
      if(!link)return;
      card.classList.add('is-clickable');
      card.addEventListener('click',function(event){
        if(event.target.closest('a'))return;
        window.location.href=link.href;
      });
    });
  }
  function initCapabilities(){
    var items=Array.prototype.slice.call(document.querySelectorAll('.solution-capability-list li'));if(!items.length)return;
    function activate(item){items.forEach(function(node){node.classList.toggle('is-active',node===item);});}
    items.forEach(function(item){item.addEventListener('click',function(){activate(item);});item.addEventListener('focus',function(){activate(item);});item.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();activate(item);}});});
  }

  function initDeliveryStory(){
    var story=document.querySelector('[data-delivery-story]');if(!story)return;
    var controls=Array.prototype.slice.call(story.querySelectorAll('.solution-delivery-track button'));
    var panels=Array.prototype.slice.call(story.querySelectorAll('.solution-delivery-panels article'));
    var mobile=window.matchMedia('(max-width:760px)');var active=0;var ticking=false;
    function select(index,focus){active=clamp(index,0,controls.length-1);controls.forEach(function(control,i){var current=i===active;control.classList.toggle('is-current',current);control.classList.toggle('is-passed',i<active);control.setAttribute('aria-selected',String(current));control.tabIndex=current?0:-1;});panels.forEach(function(panel,i){var current=i===active;if(mobile.matches){panel.hidden=false;panel.classList.remove('is-current','is-entering');return;}panel.hidden=!current;panel.classList.toggle('is-current',current);panel.classList.remove('is-entering');if(current){void panel.offsetWidth;panel.classList.add('is-entering');}});if(focus)controls[active].focus({preventScroll:true});}
    function updateFromScroll(){ticking=false;if(mobile.matches)return;var rect=story.getBoundingClientRect();var travel=Math.max(1,rect.height-window.innerHeight);var progress=clamp((-rect.top+90)/travel,0,1);var next=Math.round(progress*(controls.length-1));if(next!==active)select(next,false);}
    function onScroll(){if(!ticking){ticking=true;window.requestAnimationFrame(updateFromScroll);}}
    controls.forEach(function(control,index){control.addEventListener('click',function(){select(index,false);});control.addEventListener('keydown',function(event){var next=index;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=index+1;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=index-1;else if(event.key==='Home')next=0;else if(event.key==='End')next=controls.length-1;else return;event.preventDefault();select(next,true);});});
    window.addEventListener('scroll',onScroll,{passive:true});
    function modeChange(){select(active,false);updateFromScroll();}
    if(mobile.addEventListener)mobile.addEventListener('change',modeChange);else mobile.addListener(modeChange);
    select(0,false);updateFromScroll();
  }

  function initDeliveryProgress(){
    var track=document.querySelector('.solution-delivery-track');
    if(!track)return;
    var items=Array.prototype.slice.call(track.querySelectorAll('article'));
    if(!items.length)return;
    var ticking=false;
    function update(){
      ticking=false;
      var rect=track.getBoundingClientRect();
      var viewport=window.innerHeight||document.documentElement.clientHeight;
      var progress=clamp((viewport*.88-rect.top)/(viewport*.68),0,1);
      var activeCount=Math.max(1,Math.ceil(progress*items.length));
      items.forEach(function(item,index){item.classList.toggle('is-active',index<activeCount);});
    }
    function requestUpdate(){if(ticking)return;ticking=true;window.requestAnimationFrame(update);}
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate,{passive:true});
    update();
  }
  function initReveal(){
    if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var targets=Array.prototype.slice.call(document.querySelectorAll('.solution-section-heading,.solution-selector,.solution-capability-board,.solution-audience-map'));
    targets.forEach(function(target){target.style.opacity='0';target.style.transform='translateY(12px)';});
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;entry.target.style.transition='opacity .42s ease,transform .42s ease';entry.target.style.opacity='1';entry.target.style.transform='none';observer.unobserve(entry.target);});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    targets.forEach(function(target){observer.observe(target);});
  }

  initSolutionCards();initCapabilities();initDeliveryProgress();initReveal();
})();


