(function(){
  var body=document.querySelector('body[data-solution-key="content-brand"]');
  if(!body)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items=Array.prototype.slice.call(document.querySelectorAll('.content-v3-heading,.content-v3-overview-grid,.content-v3-pillar-grid,.content-v3-step-grid,.content-v3-brand-grid,.content-v3-chain-grid,.content-v3-value-grid,.content-v3-cases .detail-cases,.content-v3-related .detail-related,.content-v3-cta .detail-cta-box'));
  if(reduce||!('IntersectionObserver' in window))return;
  body.classList.add('content-v3-motion');
  items.forEach(function(item,index){
    item.setAttribute('data-content-reveal','');
    item.style.setProperty('--content-reveal-delay',String(Math.min(index%6,5)*55)+'ms');
  });
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-content-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.11,rootMargin:'0px 0px -7% 0px'});
  items.forEach(function(item){observer.observe(item)});
})();
