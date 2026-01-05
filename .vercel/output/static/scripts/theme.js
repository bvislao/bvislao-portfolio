(function () {
  const KEY = "theme";
  const root = document.documentElement;

  function apply(mode) {
    root.classList.toggle("dark", mode === "dark");
    root.dataset.theme = mode;
  }

  function getPreferred() {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  apply(getPreferred());

  window.__toggleTheme = function () {
    const next = root.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(KEY, next);
    apply(next);
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    window.__toggleTheme();
  });
})();