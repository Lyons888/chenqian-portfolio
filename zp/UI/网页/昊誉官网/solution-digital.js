(() => {
  const stage = document.querySelector('.digital-v3-architecture-stage');
  const tabs = [...document.querySelectorAll('[data-digital-layer]')];
  if (!stage || !tabs.length) return;

  const activate = (tab) => {
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    stage.dataset.activeLayer = tab.dataset.digitalLayer;
  };

  const defaultTab = tabs[1] || tabs[0];
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('pointerenter', () => {
      if (canHover.matches) activate(tab);
    });
    tab.addEventListener('focus', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      activate(next);
    });
  });

  stage.addEventListener('pointerleave', () => {
    if (canHover.matches) activate(defaultTab);
  });
  stage.addEventListener('focusout', (event) => {
    if (!stage.contains(event.relatedTarget)) activate(defaultTab);
  });

  activate(defaultTab);
})();
