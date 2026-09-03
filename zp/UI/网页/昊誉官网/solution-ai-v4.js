(function(){
  var body=document.querySelector('body[data-solution-template="v3"]');
  if(!body||!body.matches('[data-solution-key="ai-application"],[data-solution-key="ai-talent"]'))return;

  var tabs=Array.prototype.slice.call(document.querySelectorAll('.ai-v4-layer-tabs [role="tab"]'));
  if(!tabs.length)return;
  var stage=document.querySelector('.ai-v4-layer-tabs');
  var defaultTab=tabs.find(function(tab){return tab.getAttribute('aria-selected')==='true'})||tabs[0];
  var committedTab=defaultTab;
  var persistentSelection=body.matches('[data-solution-key="ai-application"]');
  var canHover=window.matchMedia('(hover: hover) and (pointer: fine)');

  function selectTab(next,moveFocus){
    tabs.forEach(function(tab){
      var active=tab===next;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    if(moveFocus)next.focus();
  }

  function commitTab(next,moveFocus){
    committedTab=next;
    selectTab(next,moveFocus);
  }

  tabs.forEach(function(tab,index){
    tab.tabIndex=tab.getAttribute('aria-selected')==='true'?0:-1;
    tab.addEventListener('click',function(){
      if(persistentSelection)commitTab(tab,false);
      else selectTab(tab,false);
    });
    tab.addEventListener('pointerenter',function(){
      if(canHover.matches)selectTab(tab,false);
    });
    tab.addEventListener('focus',function(){selectTab(tab,false)});
    tab.addEventListener('keydown',function(event){
      var nextIndex=index;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')nextIndex=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft'||event.key==='ArrowUp')nextIndex=(index-1+tabs.length)%tabs.length;
      else if(event.key==='Home')nextIndex=0;
      else if(event.key==='End')nextIndex=tabs.length-1;
      else return;
      event.preventDefault();
      if(persistentSelection)commitTab(tabs[nextIndex],true);
      else selectTab(tabs[nextIndex],true);
    });
  });

  if(stage){
    stage.addEventListener('pointerleave',function(){
      if(canHover.matches)selectTab(persistentSelection?committedTab:defaultTab,false);
    });
    stage.addEventListener('focusout',function(event){
      if(!stage.contains(event.relatedTarget))selectTab(persistentSelection?committedTab:defaultTab,false);
    });
  }
})();