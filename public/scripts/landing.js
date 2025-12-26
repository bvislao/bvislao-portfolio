const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const progress = document.querySelector("[data-scroll-progress]");
function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) : 0;
  if (progress) progress.style.transform = `scaleX(${pct})`;

  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = Number(el.getAttribute("data-parallax")) || 0.12;
    const rect = el.getBoundingClientRect();
    const mid = (rect.top + rect.bottom) / 2;
    const offset = (mid - window.innerHeight / 2) * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
}
window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
onScroll();

// Reveal
if (!reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
}