const navItems = [
  ["index.html", "首页", "home"],
  ["solutions.html", "解决方案", "solutions"],
  ["ai-training.html", "AI课程培训", "training"],
  ["ai-tools.html", "AI工具开发", "tools"],
  ["cases.html", "成功案例", "cases"],
  ["about.html", "关于昊誉", "about"],
];

function asset(path) {
  return `assets/${path}`;
}

function pageId() {
  return document.body.dataset.page || "home";
}

function renderHeader() {
  const header = document.querySelector("#site-header");
  if (!header) return;
  const current = pageId();
  header.innerHTML = `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="index.html" aria-label="昊誉信息首页">
          <img src="${asset("logo.png")}" alt="昊誉信息">
        </a>
        <nav class="main-nav" id="main-nav" aria-label="主导航">
          ${navItems.map(([href, label, id]) => `<a class="${id === current ? "active" : ""}" href="${href}">${label}</a>`).join("")}
        </nav>
        <a class="nav-cta" href="#lead-form">业务咨询 <span><img src="${asset("iconify-arrow-right.svg")}" alt=""></span></a>
        <button class="menu-btn" id="menu-btn" type="button" aria-label="打开导航" aria-controls="main-nav" aria-expanded="false">
          <span class="menu-icon" aria-hidden="true">
            <span class="menu-icon-fallback"><img src="${asset("menu.svg")}" alt=""></span>
            <span class="menu-icon-lottie"></span>
          </span>
        </button>
      </div>
    </header>
  `;
}

function renderFooter() {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <section class="contact-zone" id="contact-zone">
      <div class="container contact-grid">
        <div class="contact-copy">
          <h2>想把方案真正变成<br><span>可持续</span>的业务能力？</h2>
          <p>无论您需要平台建设、教师发展、资源与品牌运营、AI人才培养或智能体应用，昊誉都可以提供可落地的方案与持续服务。</p>
          <i></i>
        </div>
        <form class="contact-form js-form" id="lead-form">
          <h3>留下您的信息，我们主动联系您</h3>
          <div class="form-grid compact-form">
            <div class="field inline-field"><label>姓名</label><input name="name" placeholder="请输入" required></div>
            <div class="field inline-field"><label>手机</label><input name="phone" placeholder="请输入" required></div>
            <div class="field inline-field"><label>身份类型</label><select name="role"><option>请选择</option><option>教育局/区域机构</option><option>学校/培训机构</option><option>个人/教育工作者</option><option>AI应用学习者/技术团队</option><option>企业/业务管理团队</option></select></div>
            <div class="field inline-field"><label>咨询方向</label><select name="intent"><option>请选择</option><option>教育数字化解决方案</option><option>教师发展与培训运营</option><option>教育资源与品牌运营</option><option>AI课程与人才培养</option><option>AI智能体与应用服务</option></select></div>
            <button class="btn" type="submit">提交信息 <iconify-icon class="btn-icon" icon="lucide:arrow-right" aria-hidden="true"></iconify-icon></button>
          </div>
        </form>
        <div class="qr-card">
          <strong>扫码咨询</strong>
          <p>获取方案建议</p>
          <div class="qr-box" aria-label="二维码"><img src="${asset("contact-qr.png")}" alt="扫码咨询二维码"></div>
        </div>
      </div>
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <img src="${asset("logo-white.png")}" alt="昊誉信息">
            <p>使命：让教育更简单<br>定位：教育数字化与AI能力驱动的解决方案服务商</p>
            <div class="social-row"><a class="social-link social-link--wechat" tabindex="0" aria-label="查看昊誉信息微信公众号二维码" title="微信公众号"><img src="${asset("iconify-wechat.svg")}" alt="" aria-hidden="true"><span class="social-qr-card" aria-hidden="true"><img src="${asset("wechat-official-account-qr.png")}" alt=""><span>扫码关注公众号</span></span></a><a class="social-link" href="https://www.douyin.com/user/MS4wLjABAAAA46GB-xOOKP97ZobPf4sax6JfNAtFJGDa02Addd35qpM" target="_blank" rel="noopener noreferrer" aria-label="访问昊誉信息抖音主页" title="抖音"><img src="${asset("iconify-douyin.svg")}" alt="" aria-hidden="true"></a></div>
          </div>
          <div>
            <h3>快速导航</h3>
            <a href="index.html">首页</a>
            <a href="cases.html">成功案例</a>
            <a href="about.html">关于昊誉</a>

          </div>
          <div>
            <h3>业务入口</h3>
            <a href="ai-training.html">AI课程培训</a>
            <a href="ai-tools.html">AI工具开发</a>

            <a href="solutions.html">解决方案</a>
          </div>
          <div>
            <h3>联系方式</h3>
            <p class="contact-line"><span><img src="${asset("Vector.png")}" alt="电话"></span>020-38857148</p>
            <p class="contact-line"><span><img src="${asset("Vector-1.png")}" alt="邮箱"></span>hr@haoyuinfo.com</p>
            <p class="contact-line contact-address"><span><img src="${asset("icon-location.svg")}" alt=""></span>广州市天河区科韵路信息港C1栋903</p>
          </div>
        </div>
        <div class="container copyright">© 2012-2026 广州昊誉信息科技有限公司 All Rights Reserved. 粤ICP备12012345号</div>
      </footer>
      <div class="float-actions" aria-label="快捷操作">
        <button class="float-action js-back-top" type="button" aria-label="返回顶部"><img src="${asset("top.png")}" alt=""></button>
        <button class="float-action js-service" type="button" aria-label="联系客服"><img src="${asset("service.png")}" alt=""></button>
      </div>
    </section>
  `;
  const preferredIntent = document.body.dataset.solutionIntent;
  const intentSelect = footer.querySelector('select[name="intent"]');
  if (preferredIntent && intentSelect && Array.from(intentSelect.options).some((option) => option.value === preferredIntent)) {
    intentSelect.value = preferredIntent;
  }
}



function initHeroCarousel() {
  const hero = document.querySelector("body[data-page='home'] .hero");
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll(".hero-bg-slide"));
  const contentSlides = Array.from(hero.querySelectorAll(".hero-copy-slide"));
  const buttons = Array.from(hero.querySelectorAll(".hero-switch button"));
  if (slides.length < 2 || buttons.length !== slides.length || contentSlides.length !== slides.length) return;

  let current = 0;
  let timer = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const focusableSelector = "a, button, input, select, textarea, [tabindex]";

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === current));
    contentSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      slide.querySelectorAll(focusableSelector).forEach((element) => {
        if (active) element.removeAttribute("tabindex");
        else element.setAttribute("tabindex", "-1");
      });
    });
    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === current;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.setAttribute("tabindex", active ? "0" : "-1");
    });
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = 0;
    hero.classList.add("is-carousel-paused");
  };

  const restart = () => {
    stop();
    hero.classList.remove("is-carousel-paused");
    const activeButton = buttons[current];
    if (activeButton && !reducedMotion) {
      activeButton.classList.remove("is-active");
      void activeButton.offsetWidth;
      activeButton.classList.add("is-active");
    }
    if (!reducedMotion && !document.hidden) timer = window.setInterval(() => show(current + 1), 6000);
  };

  const resumeIfIdle = () => {
    if (hero.contains(document.activeElement)) stop();
    else restart();
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      show(index);
      restart();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + buttons.length) % buttons.length;
      show(next);
      buttons[next].focus();
      resumeIfIdle();
    });
  });



  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) restart();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else resumeIfIdle();
  });

  show(0);
  restart();
}
function animateTrustCounters() {
  const counters = document.querySelectorAll(".count-up[data-count]");
  if (!counters.length) return;

  const run = (counter) => {
    if (counter.dataset.done === "true") return;
    counter.dataset.done = "true";
    const target = Number(counter.dataset.count || 0);
    counter.textContent = "0";
    const duration = Number(counter.dataset.duration || 1100);
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .45 });

  counters.forEach((counter) => observer.observe(counter));
}
function normalizeButtonArrowIcons() {
  document.querySelectorAll('iconify-icon[icon="lucide:arrow-right"], iconify-icon[icon^="solar:arrow-right"]').forEach((icon) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", icon.className || "btn-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("data-icon", "lucide:arrow-right");
    svg.innerHTML = '<path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>';
    icon.replaceWith(svg);
  });
}

let menuAnimationDependencies;

function loadMenuAnimationScript(src, id, isReady) {
  if (isReady()) return Promise.resolve();
  const existing = document.querySelector(`#${id}`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadMenuAnimationDependencies() {
  if (!menuAnimationDependencies) {
    menuAnimationDependencies = loadMenuAnimationScript(
      asset("menuV2-data.js"),
      "menu-v2-animation-data",
      () => Boolean(window.__HAOYU_MENU_V2__)
    ).then(() => loadMenuAnimationScript(
      "vendor/lottie/5.6.5/lottie_light.min.js",
      "lottie-menu-player",
      () => Boolean(window.lottie)
    ));
  }
  return menuAnimationDependencies;
}

function initMenuIconAnimation(menuBtn) {
  if (!menuBtn || menuBtn.dataset.menuAnimationInit === "true") return;
  menuBtn.dataset.menuAnimationInit = "true";
  const container = menuBtn.querySelector(".menu-icon-lottie");
  if (!container) return;

  loadMenuAnimationDependencies().then(() => {
    if (!window.lottie || !window.__HAOYU_MENU_V2__) return;
    const animation = window.lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: window.__HAOYU_MENU_V2__,
      rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
    });
    animation.setSpeed(6);
    menuBtn._menuAnimation = animation;
    menuBtn.classList.add("has-lottie-menu");
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    animation.goToAndStop(open ? animation.totalFrames - 1 : 0, true);
  }).catch(() => {
    menuBtn.dataset.menuAnimationInit = "fallback";
  });
}

function wireInteractions() {
  const menu = document.querySelector("#main-nav");
  const menuBtn = document.querySelector("#menu-btn");
  const siteHeader = document.querySelector(".site-header");
  const floatActions = document.querySelector(".float-actions");
  const updateScrollState = () => {
    if (document.body.hasAttribute("data-case-viewer-open")) return;
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
    floatActions?.classList.toggle("show", window.scrollY > 360);
  };
  updateScrollState();
  animateTrustCounters();
  initHeroCarousel();
  if (window.innerWidth <= 1280) initMenuIconAnimation(menuBtn);
  window.addEventListener("scroll", updateScrollState, { passive: true });
  const setMenuOpen = (open) => {
    if (!menu || !menuBtn) return;
    menu.classList.toggle("open", open);
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    const animation = menuBtn._menuAnimation;
    if (animation) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animation.goToAndStop(open ? animation.totalFrames - 1 : 0, true);
      } else {
        animation.setDirection(open ? 1 : -1);
        animation.play();
      }
    }
  };

  menuBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!menu?.classList.contains("open"));
  });
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
  document.addEventListener("click", (event) => {
    if (menu?.classList.contains("open") && !siteHeader?.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1280) initMenuIconAnimation(menuBtn);
    if (window.innerWidth > 1280) setMenuOpen(false);
  });

  document.querySelector(".js-back-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.querySelector(".js-service")?.addEventListener("click", () => {
    document.querySelector(".contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelectorAll("[data-agent-intent], [data-lead-intent]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const form = document.querySelector("#lead-form");
      const intentSelect = form?.querySelector('select[name="intent"]');
      const roleSelect = form?.querySelector('select[name="role"]');
      const intent = link.dataset.leadIntent || link.dataset.agentIntent;
      const role = link.dataset.leadRole;
      if (!form || !intentSelect || !intent) return;
      event.preventDefault();
      intentSelect.value = intent;
      intentSelect.dispatchEvent(new Event("change", { bubbles: true }));
      if (role && roleSelect && Array.from(roleSelect.options).some((option) => option.value === role)) {
        roleSelect.value = role;
        roleSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
      history.replaceState(null, "", "#lead-form");
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll(".js-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("资料已提交，后续请留意手机，会有专员联系您！", form);
      form.reset();
    });
  });

  document.querySelectorAll(".contact-zone .inline-field select").forEach((select) => {
    select.addEventListener("change", () => select.blur());
  });

  document.querySelectorAll(".js-tabs").forEach((wrap) => {
    const buttons = wrap.querySelectorAll(".tab-btn");
    const panels = wrap.querySelectorAll(".tab-panel");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("active"));
        panels.forEach((panel) => panel.classList.remove("active"));
        button.classList.add("active");
        wrap.querySelector(`[data-panel="${button.dataset.tab}"]`)?.classList.add("active");
      });
    });
  });

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-filter-group]");
      const target = button.dataset.filter;
      group?.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      group?.querySelectorAll("[data-category]").forEach((card) => {
        card.style.display = target === "all" || card.dataset.category === target ? "" : "none";
      });
    });
  });

  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      item?.classList.toggle("open");
    });
  });

  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.modal);
      modal?.classList.add("show");
    });
  });

  document.querySelectorAll(".close-modal, .modal").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target === item || item.classList.contains("close-modal")) {
        document.querySelectorAll(".modal").forEach((modal) => modal.classList.remove("show"));
      }
    });
  });
}

function showToast(message, anchor) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.toggle("toast--form", Boolean(anchor));
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    toast.style.left = `${rect.left + rect.width / 2}px`;
    toast.style.top = `${Math.max(20, rect.top - 56)}px`;
  } else {
    toast.style.left = "";
    toast.style.top = "";
  }
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}


function initPageReveals() {
  const body = document.body;
  const solutionKey = body.dataset.solutionKey;
  const page = ["ai-application", "ai-talent"].includes(solutionKey) ? "ai-v4" : ["digital", "teacher", "content-brand"].includes(solutionKey) ? solutionKey : pageId();
  const pageConfigs = {
    home: {
      groups: [
        ".trust-strip",
        ".problem-grid",
        ".business-grid",
        ".capability-band",
        ".course-grid",
        ".tool-grid",
        ".audience-grid",
        ".logo-wall",
        ".dark-cta",
      ],
      singles: [],
    },
    cases: {
      groups: [
        ".case-index-v3-grid",
      ],
      singles: [
        ".case-index-v3-hero h1",
        ".case-index-v3-hero p",
      ],
    },
    training: {
      groups: [
        ".training-hero-metrics",
        ".training-why-grid",
        ".training-gain-panel",
        ".training-fit-grid",
        ".training-personas",
        ".training-course-grid",
        ".training-aigc-grid",
        ".training-coop-grid",
      ],
      singles: [
        ".training-persona-title",
        ".training-subtitle",
      ],
    },
    "ai-v4": {
      groups: [
        ".ai-v4-overview-grid",
        ".ai-v4-card-grid",
        ".ai-v4-layer-tabs",
        ".ai-v4-step-grid",
        ".ai-v4-value-grid",
        ".ai-v4-related",
      ],
      singles: [
        ".ai-v4-heading > *",
        ".ai-v4-mode",
        ".detail-cta-box",
      ],
    },    digital: {
      groups: [
        ".digital-v3-overview-story",
        ".digital-v3-direction-grid",
        ".digital-v3-layer-tabs",
        ".digital-v3-scene-list",
        ".digital-v3-delivery-steps",
        ".digital-v3-value-grid",
        ".detail-cases",
        ".digital-related",
      ],
      singles: [
        ".digital-v3-heading > *",
        "#cases .detail-section-heading > *",
        "#related .detail-section-heading > *",
        ".detail-cta-box",
      ],
    },
    "content-brand": {
      groups: [
        ".content-v3-overview-grid",
        ".content-v3-pillar-grid",
        ".content-v3-step-grid",
        ".content-v3-brand-grid",
        ".content-v3-chain-grid",
        ".content-v3-value-grid",
        ".detail-cases",
        ".detail-related",
      ],
      singles: [
        ".content-v3-heading > *",
        ".detail-cta-box",
      ],
    },
    teacher: {
      groups: [
        ".teacher-v3-overview-grid",
        ".teacher-v3-capability-grid",
        ".teacher-v3-loop",
        ".teacher-v3-system-grid",
        ".teacher-v3-ai-grid",
        ".teacher-v3-value-grid",
        ".detail-cases",
        ".detail-related",
      ],
      singles: [
        ".teacher-v3-heading > *",
        ".detail-cta-box",
      ],
    },
    tools: {
      groups: [
        ".tools-metric-strip",
        ".tools-problem-grid",
        ".tools-card-grid",
        ".tools-process-list",
        ".tools-scenario-grid",
        ".tools-delivery-tags",
      ],
      singles: [
        ".tools-final-cta",
        ".tools-process-copy > .btn",
        ".tools-delivery-panel > img",
      ],
    },
  };
  const config = pageConfigs[page];
  if (!config) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const revealItems = new Set();
  const register = (element, order = 0) => {
    if (!element || revealItems.has(element)) return;
    element.dataset.pageReveal = "";
    element.style.setProperty("--page-reveal-delay", `${Math.min(order, 9) * 65}ms`);
    revealItems.add(element);
  };

  body.querySelectorAll("main .section-title").forEach((title) => {
    Array.from(title.children).forEach((child, index) => register(child, index));
  });

  config.groups.forEach((selector) => {
    body.querySelectorAll(`main ${selector}`).forEach((group) => {
      Array.from(group.children).forEach((child, index) => register(child, index));
    });
  });

  config.singles.forEach((selector) => {
    body.querySelectorAll(`main ${selector}`).forEach((element) => register(element));
  });

  if (page === "cases") {
    const initialViewportBottom = window.innerHeight;
    revealItems.forEach((element) => {
      if (element.getBoundingClientRect().top >= initialViewportBottom) return;
      element.removeAttribute("data-page-reveal");
      element.style.removeProperty("--page-reveal-delay");
      revealItems.delete(element);
    });
  }

  if (!revealItems.size) return;
  body.classList.add("page-reveal-ready");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      element.classList.add("is-page-visible");
      observer.unobserve(element);

      const finishReveal = () => {
        element.removeAttribute("data-page-reveal");
        element.classList.remove("is-page-visible");
        element.style.removeProperty("--page-reveal-delay");
      };
      element.addEventListener("transitionend", finishReveal, { once: true });
      window.setTimeout(finishReveal, 1500);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

  revealItems.forEach((element) => revealObserver.observe(element));
}

function initSharedHeroEntrance() {
  const page = pageId();
  if (page === "solutions" || page === "cases") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const configs = {
    home: {
      copy: ".hero-grid > div:first-child",
      items: [".eyebrow", "h1", "p", ".hero-actions"],
      visual: ".hero-media",
    },
    training: {
      copy: ".training-hero-copy",
      items: [".training-kicker", "h1", ":scope > p", ".training-actions", ".training-scroll-cue"],
      visual: ".training-hero-bg",
    },
    tools: {
      copy: ".tools-hero-copy",
      items: ["h1", ":scope > p", ".tools-hero-actions", ".tools-scroll-cue"],
      visual: ".tools-hero-visual",
    },
    about: {
      copy: ".about-hero-content",
      items: [".about-hero-label", "h1", ".about-hero-note"],
      visual: ".about-hero-media",
    },
    contact: {
      copy: ".page-hero-grid > div:first-child",
      items: [".eyebrow", "h1", "p", ".hero-actions"],
      visual: ".page-hero-visual",
    },
    digital: {
      copy: ".page-hero-grid > div:first-child",
      items: [".eyebrow", "h1", "p", ".hero-actions"],
      visual: ".page-hero-visual",
    },
  };
  const config = configs[page];
  if (!config || !Element.prototype.animate) return;

  const copy = document.querySelector(config.copy);
  if (!copy || copy.dataset.heroEntered === "true") return;
  copy.dataset.heroEntered = "true";

  const items = config.items
    .map((selector) => copy.querySelector(selector))
    .filter(Boolean);
  items.forEach((item, index) => {
    item.style.willChange = "transform, opacity";
    const animation = item.animate([
      { opacity: 0, transform: "translate3d(0, 28px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ], {
      duration: 760,
      delay: 70 + index * 105,
      easing: "cubic-bezier(.22, 1, .36, 1)",
      fill: "both",
    });
    animation.finished.finally(() => {
      animation.cancel();
      item.style.removeProperty("will-change");
    });
  });

  const visual = document.querySelector(config.visual);
  if (visual) {
    visual.style.willChange = "transform, opacity";
    const visualAnimation = visual.animate([
      { opacity: 0, transform: "translate3d(0, 16px, 0) scale(1.025)" },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
    ], {
      duration: 980,
      delay: 190,
      easing: "cubic-bezier(.22, 1, .36, 1)",
      fill: "both",
    });
    visualAnimation.finished.finally(() => {
      visualAnimation.cancel();
      visual.style.removeProperty("will-change");
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  normalizeButtonArrowIcons();
  wireInteractions();
  initSharedHeroEntrance();
  initPageReveals();
  initCasesPage();
});
























function initCasesPage() {
  const body = document.querySelector('body[data-page="cases"]');
  if (!body) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = Array.from(body.querySelectorAll("[data-case-reveal]"));
  if (!reduce && "IntersectionObserver" in window) {
    body.classList.add("cases-motion-ready");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .14, rootMargin: "0px 0px -7% 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add("is-visible"));
  const links = Array.from(body.querySelectorAll(".cases-anchor-inner a"));
  const sections = Array.from(body.querySelectorAll("[data-case-section]"));
  const setActive = (id) => links.forEach((link) => {
    const active = link.getAttribute("href") === "#" + id;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, .2, .5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
}
