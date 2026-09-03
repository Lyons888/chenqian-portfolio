(() => {
  const supported = new Set(["digital", "teacher", "content-brand"]);
  const key = document.body.dataset.solutionKey;

  if (!supported.has(key)) return;

  const alignCases = () => {
    if (window.location.hash !== "#cases") return;

    const cases = document.getElementById("cases");
    if (!cases) return;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        cases.scrollIntoView({ block: "start" });
      });
    });
  };

  document.addEventListener("DOMContentLoaded", alignCases, { once: true });
  window.addEventListener("hashchange", alignCases);
  window.addEventListener(
    "load",
    () => {
      alignCases();
      window.setTimeout(alignCases, 480);
    },
    { once: true }
  );
})();
