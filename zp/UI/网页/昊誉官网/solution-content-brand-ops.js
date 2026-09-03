(function(){
  var ops=document.querySelector('.content-v3-ops');
  if(!ops)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)){
    ops.classList.add('is-ops-visible');
    return;
  }
  ops.classList.add('is-ops-ready');
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-ops-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.22,rootMargin:'0px 0px -9% 0px'});
  observer.observe(ops);
})();