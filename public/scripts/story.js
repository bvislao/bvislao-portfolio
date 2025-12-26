const root = document.documentElement;

const titleEl = document.getElementById("storyTitle");
const subEl = document.getElementById("storySubtitle");
const valueEl = document.getElementById("storyValue");

const values = {
  payki: "Producto + arquitectura: UX fluida, datos protegidos con RLS y funciones para operaciones privilegiadas.",
  antiphishing: "Seguridad aplicada: señales de riesgo claras, bloqueo de inputs sensibles y UX de prevención.",
  aliases: "Tooling: mejoras pequeñas que se sienten cada día en velocidad y consistencia.",
};

function setAccent(accent) {
  const map = {
    a1: "var(--a1)",
    a2: "var(--a2)",
    a3: "var(--a3)",
    a4: "var(--a4)",
  };
  root.style.setProperty("--story-accent", `rgb(${getComputedStyle(root).getPropertyValue(map[accent].replace("var(", "").replace(")", "")).trim()})`);
}

function applyActive(card) {
  document.querySelectorAll("[data-story-item]").forEach((el) => {
    el.classList.remove("ring-1");
    el.style.boxShadow = "none";
    el.style.transform = "translateY(0)";
    el.style.borderColor = "rgb(var(--border))";
  });

  card.classList.add("ring-1");
  card.style.transform = "translateY(-2px)";
  card.style.boxShadow = "0 18px 60px rgba(0,0,0,.10)";
  card.style.borderColor = "rgb(var(--story-accent, var(--border)))";

  const key = card.dataset.key;
  const accent = card.dataset.accent || "a1";

  // set accent to match theme variables
  root.style.setProperty("--story-accent", `var(--${accent})`);

  titleEl.textContent = card.querySelector("h3")?.textContent ?? "";
  subEl.textContent = card.querySelector("p")?.textContent ?? "";
  valueEl.textContent = values[key] ?? "";
}

const cards = [...document.querySelectorAll("[data-story-item]")];
if (cards.length) {
  // init
  root.style.setProperty("--story-accent", "var(--a1)");
  applyActive(cards[0]);

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target) applyActive(visible.target);
    },
    { threshold: [0.2, 0.35, 0.5, 0.65] }
  );

  cards.forEach((c) => io.observe(c));
}