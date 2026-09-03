(() => {
  const body = document.body;
  if (body.dataset.page !== "about") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroRevealItems = Array.from(document.querySelectorAll(".about-hero-content [data-reveal]"));
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"))
    .filter((item) => !item.closest(".about-hero-content"));
  const chapterLinks = Array.from(document.querySelectorAll("[data-about-nav]"));
  const chapterSections = Array.from(document.querySelectorAll("[data-about-section]"));

  if (!reduceMotion && "IntersectionObserver" in window) {
    body.classList.add("about-motion-ready");
    // The shared hero entrance owns the opening animation. Keep its final
    // state visible after the Web Animation is cancelled on completion.
    heroRevealItems.forEach((item) => item.classList.add("is-visible"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8%" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const key = visible.target.dataset.aboutSection;
      chapterLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.aboutNav === key));
    }, { threshold: 0.01, rootMargin: "-35% 0px -55%" });
    chapterSections.forEach((section) => chapterObserver.observe(section));

  }

  const historyLayout = document.querySelector(".about-history-layout");
  const historySteps = Array.from(document.querySelectorAll("[data-history-step]"));
  const historyLinks = Array.from(document.querySelectorAll("[data-history-link]"));

  let activeHistoryIndex = -1;
  let historyFrame = 0;
  const activateHistoryStep = (index) => {
    const safeIndex = Math.max(0, Math.min(historySteps.length - 1, Number(index) || 0));
    if (safeIndex === activeHistoryIndex) return;
    const previousIndex = activeHistoryIndex;
    activeHistoryIndex = safeIndex;
    cancelAnimationFrame(historyFrame);
    historyFrame = requestAnimationFrame(() => {
      historySteps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === safeIndex));
      historyLinks.forEach((link, linkIndex) => {
        link.classList.toggle("is-passed", linkIndex < safeIndex);
        if (linkIndex === safeIndex) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      const progress = historySteps.length > 1 ? safeIndex / (historySteps.length - 1) : 0;
      historyLayout?.style.setProperty("--history-progress-scale", String(progress));
    });
  };

  if (historySteps.length) {
    activateHistoryStep(0);
    historyLinks.forEach((link) => {
      link.addEventListener("click", () => activateHistoryStep(link.dataset.historyIndex));
    });

    const hasHistoryScrubSpace = window.matchMedia("(min-width: 901px) and (min-height: 820px)").matches;
    const canScrubHistory = !reduceMotion && hasHistoryScrubSpace && window.gsap && window.ScrollTrigger;

    if (canScrubHistory) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      body.classList.add("about-history-ready", "about-history-scrub");

      historySteps.forEach((step, stepIndex) => {
        const content = [step.querySelector("time"), step.querySelector("div")].filter(Boolean);

        window.gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            end: "bottom 15%",
            scrub: true
          }
        })
          .fromTo(content,
            { opacity: 0.03, y: 58 },
            { opacity: 1, y: 0, duration: 0.4, ease: "none" }
          )
          .to(content, { opacity: 1, y: 0, duration: 0.2, ease: "none" })
          .to(content, { opacity: 0.03, y: -58, duration: 0.4, ease: "none" });

        window.ScrollTrigger.create({
          trigger: step,
          start: "top 48%",
          end: "bottom 48%",
          onEnter: () => activateHistoryStep(stepIndex),
          onEnterBack: () => activateHistoryStep(stepIndex)
        });
      });

      document.fonts?.ready.then(() => window.ScrollTrigger.refresh());
    } else if ("IntersectionObserver" in window) {
      body.classList.add("about-history-ready");
      const historyObserver = new IntersectionObserver((entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.45) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.45))[0];
        if (activeEntry) activateHistoryStep(activeEntry.target.dataset.historyIndex);
      }, { threshold: 0, rootMargin: "-36% 0px -48%" });
      historySteps.forEach((step) => historyObserver.observe(step));
    }
  }
  const countItems = Array.from(document.querySelectorAll("[data-count]"));
  if (!reduceMotion && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const target = Number(node.dataset.count || 0);
        if (!target || target > 500) {
          node.textContent = String(target);
          observer.unobserve(node);
          return;
        }
        const start = performance.now();
        const duration = 1100;
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = String(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(node);
      });
    }, { threshold: 0.65 });
    countItems.forEach((item) => countObserver.observe(item));
  }
})();

