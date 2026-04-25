
/* Koda Studio — landing page interactions */

(() => {
// ═══ Header + WA button: dark→light transition on scroll ═══
const header = document.getElementById("site-header");
const hero = document.querySelector(".hero");
let waRail = null;

function isDark(sec) {
return (
sec.classList.contains("hero") ||
sec.classList.contains("dark") ||
sec.classList.contains("site-footer")
);
}

function updateHeader() {
if (!header || !hero) return;
const scrolled = window.scrollY > 40;
const sections = document.querySelectorAll(
"main > section, main > footer",
);

// Header — check section behind the top bar
const headerMid = 40;
let onDark = false;
sections.forEach(sec => {
const r = sec.getBoundingClientRect();
if (r.top <= headerMid && r.bottom > headerMid)
onDark = isDark(sec);
});
header.classList.toggle("on-dark", onDark);
header.classList.toggle("on-light", !onDark);
header.classList.toggle("scrolled", scrolled);

// WA button — check section behind the bottom-right corner
if (!waRail) waRail = document.querySelector(".wa-rail");
if (waRail) {
const waMid = window.innerHeight - 80;
let waOnDark = false;
sections.forEach(sec => {
const r = sec.getBoundingClientRect();
if (r.top <= waMid && r.bottom > waMid) waOnDark = isDark(sec);
});
waRail.classList.toggle("on-dark", waOnDark);
waRail.classList.toggle("on-light", !waOnDark);
}
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);

// ─── prefers-reduced-motion: pausa el video del hero ───
const heroVideo = document.querySelector(".hero-video-element");
if (heroVideo) {
const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const applyMotion = m => {
if (m.matches) {
heroVideo.pause();
heroVideo.removeAttribute("autoplay");
} else {
heroVideo.setAttribute("autoplay", "");
heroVideo.play().catch(() => {});
}
};
applyMotion(mq);
mq.addEventListener("change", applyMotion);
}
// Re-run after full DOM is ready so wa-rail (below the script) is found
document.addEventListener("DOMContentLoaded", updateHeader);

// ═══ Scale iframes to fit laptop screen width ═══
function scaleIframes() {
document.querySelectorAll(".laptop-screen").forEach(screen => {
const iframe = screen.querySelector("iframe");
if (!iframe) return;
const containerWidth = screen.offsetWidth;
const iframeNativeWidth = 1440;
const scaleRatio = containerWidth / iframeNativeWidth;
iframe.style.transform = `scale(${scaleRatio})`;
});
}
scaleIframes();
window.addEventListener("resize", scaleIframes, { passive: true });

// ═══ Method sticky: sync media frame to active step ═══
const methodSteps = document.querySelectorAll(".method-step");
const methodFrames = document.querySelectorAll(".method-frame");

function updateMethod() {
if (!methodSteps.length) return;
const vh = window.innerHeight;
let activeIdx = 0;
methodSteps.forEach((step, i) => {
const r = step.getBoundingClientRect();
const center = r.top + r.height / 2;
if (center < vh * 0.55) activeIdx = i;
});
methodSteps.forEach((s, i) =>
s.classList.toggle("active", i === activeIdx),
);
methodFrames.forEach((f, i) =>
f.classList.toggle("show", i === activeIdx),
);
}
// Set first frame visible initially
if (methodFrames[0]) methodFrames[0].classList.add("show");
if (methodSteps[0]) methodSteps[0].classList.add("active");
updateMethod();
window.addEventListener("scroll", updateMethod, { passive: true });

// ═══ Testimonials carousel ═══
const track = document.querySelector("[data-track]");
const testimonials = track
? track.querySelectorAll(".testimonial")
: [];
const dots = document.querySelectorAll("[data-dots] .dot");
const navBtns = document.querySelectorAll(".carousel-nav");
let tmIdx = 0;
let autoplay = true;
let tmTimer = null;

function setTestimonial(i) {
tmIdx = (i + testimonials.length) % testimonials.length;
testimonials.forEach((t, k) =>
t.classList.toggle("active", k === tmIdx),
);
dots.forEach((d, k) => d.classList.toggle("active", k === tmIdx));
}
navBtns.forEach(b =>
b.addEventListener("click", () => {
setTestimonial(tmIdx + parseInt(b.dataset.dir, 10));
resetAutoplay();
}),
);
dots.forEach(d =>
d.addEventListener("click", () => {
setTestimonial(parseInt(d.dataset.idx, 10));
resetAutoplay();
}),
);
function startAutoplay() {
if (!autoplay) return;
stopAutoplay();
tmTimer = setInterval(() => setTestimonial(tmIdx + 1), 6000);
}
function stopAutoplay() {
if (tmTimer) clearInterval(tmTimer);
tmTimer = null;
}
function resetAutoplay() {
stopAutoplay();
startAutoplay();
}
startAutoplay();

// ═══ Reveal on scroll ═══
const observer = new IntersectionObserver(
entries => {
entries.forEach(e => {
if (e.isIntersecting) e.target.classList.add("in");
});
},
{ threshold: 0.15 },
);
document
.querySelectorAll("[data-reveal]")
.forEach(el => observer.observe(el));

// ═══ Tweaks panel ═══
const panel = document.getElementById("tweaks-panel");
const closeBtn = panel?.querySelector(".tw-close");

window.addEventListener("message", e => {
if (e.data?.type === "__activate_edit_mode") {
panel.hidden = false;
} else if (e.data?.type === "__deactivate_edit_mode") {
panel.hidden = true;
}
});
// Announce availability after handler is registered
try {
window.parent.postMessage({ type: "__edit_mode_available" }, "*");
} catch (_) {}

closeBtn?.addEventListener("click", () => {
panel.hidden = true;
try {
window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
} catch (_) {}
});

// Tweak handlers
panel?.querySelectorAll("[data-tw]").forEach(ctl => {
const key = ctl.dataset.tw;
ctl.addEventListener("input", () =>
applyTweak(key, ctl.type === "checkbox" ? ctl.checked : ctl.value),
);
ctl.addEventListener("change", () =>
applyTweak(key, ctl.type === "checkbox" ? ctl.checked : ctl.value),
);
});

function applyTweak(key, value) {
const root = document.documentElement;
if (key === "accent") {
root.style.setProperty("--accent-live", value);
root.style.setProperty("--accent", value);
} else if (key === "hero") {
hero?.classList.remove("mode-marble", "mode-concrete", "mode-void");
if (value === "marble") hero?.classList.add("mode-marble");
else if (value === "concrete") hero?.classList.add("mode-concrete");
else if (value === "void") hero?.classList.add("mode-void");
} else if (key === "headerStart") {
// When 'solid', force on-light at top
if (value === "solid") {
header.classList.remove("on-dark");
header.classList.add("on-light", "scrolled");
} else {
updateHeader();
}
} else if (key === "grain") {
const grain = document.querySelector(".hero-grain");
if (grain) grain.style.opacity = (value / 100) * 0.16;
} else if (key === "parallax") {
parallaxEnabled = value;
if (!value) {
parallaxFrames.forEach(f => {
const s = f.querySelector("[data-parallax-scroll] .mock");
if (s) s.style.transform = "";
});
} else {
updateParallax();
}
} else if (key === "autoplay") {
autoplay = value;
if (value) startAutoplay();
else stopAutoplay();
}
}
})();


// ══════════════ PARALLAX ENGINE (lerp smoothing) ══════════════
document.addEventListener("DOMContentLoaded", () => {
const section = document.getElementById("trabajo");
if (!section) return;
const images = document.querySelectorAll(".parallax-img");
if (!images.length) return;

const items = Array.from(images)
.map(img => ({
img,
container: img.closest(".laptop-screen"),
currentY: 0,
targetY: 0,
maxTranslate: 0,
}))
.filter(it => it.container);

const EASE = 0.15; // menor = inercia más larga al parar
const COMPLETE_AT = 0.5; // imagen 100% cuando la sección está al 50% pasado el viewport
const SPEED_MULT = 2; // multiplicador de velocidad (2 = doble de rápido)
const MOBILE_BP = 900;
let rafId = null;

function recomputeBounds() {
items.forEach(it => {
const containerH = it.container.offsetHeight;
const imgH =
it.img.offsetHeight ||
it.img.naturalHeight *
(it.container.offsetWidth / Math.max(1, it.img.naturalWidth));
it.maxTranslate = Math.max(0, imgH - containerH);
});
}

function updateTargets() {
if (window.innerWidth <= MOBILE_BP) {
items.forEach(it => (it.targetY = 0));
return;
}
const rect = section.getBoundingClientRect();
// Inicia cuando la sección llega al tope del viewport (rect.top = 0).
// Antes de eso: image en 0. SPEED_MULT comprime el rango hacia el final,
// haciendo scroll más rápido sin adelantar el inicio.
const range = Math.max(1, rect.height);
let progress = (-rect.top / range) * SPEED_MULT;
progress = Math.max(0, Math.min(1, progress));
items.forEach(it => (it.targetY = it.maxTranslate * progress));
}

function paint(it) {
it.img.style.transform = `translate3d(0, -${it.currentY.toFixed(2)}px, 0)`;
}

function tick() {
let animating = false;
for (const it of items) {
const delta = it.targetY - it.currentY;
if (Math.abs(delta) < 0.05) {
if (it.currentY !== it.targetY) {
it.currentY = it.targetY;
paint(it);
}
} else {
it.currentY += delta * EASE;
paint(it);
animating = true;
}
}
rafId = animating ? requestAnimationFrame(tick) : null;
}

function ensureAnimating() {
if (rafId === null) rafId = requestAnimationFrame(tick);
}

function onScroll() {
updateTargets();
ensureAnimating();
}

function onResize() {
recomputeBounds();
updateTargets();
ensureAnimating();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize);

images.forEach(img => {
if (!img.complete) {
img.addEventListener("load", onResize);
}
});

// Initial: snap to current scroll position (no animation on load)
recomputeBounds();
updateTargets();
items.forEach(it => {
it.currentY = it.targetY;
paint(it);
});
});


/* ══ Modal de contacto ══ */
(() => {
// Reemplaza con tu endpoint de Formspree u otro servicio de formularios:
// https://formspree.io/f/TU_ID
const ENDPOINT = "";

const STORAGE_KEY = "koda_cf";
const modal = document.getElementById("contact-modal");
const form = document.getElementById("cf-form");
const successEl = document.getElementById("cf-success");
const errorEl = document.getElementById("cf-error");
const submitBtn = document.getElementById("cf-submit");

const fieldsCfg = [
{ id: "cf-name", errId: "cf-name-err", required: true, type: "text" },
{
id: "cf-email",
errId: "cf-email-err",
required: true,
type: "email",
},
{ id: "cf-phone", required: false },
{ id: "cf-company", required: false },
{
id: "cf-service",
errId: "cf-service-err",
required: true,
type: "select",
},
{
id: "cf-message",
errId: "cf-message-err",
required: true,
type: "text",
},
];

// ── Focus trap ──
let triggerEl = null;
const FOCUSABLE = 'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusable() {
return Array.from(modal.querySelectorAll(FOCUSABLE)).filter(
el => !el.closest("[hidden]"),
);
}

modal.addEventListener("keydown", e => {
if (e.key !== "Tab") return;
const els = getFocusable();
if (!els.length) return;
const first = els[0], last = els[els.length - 1];
if (e.shiftKey) {
if (document.activeElement === first) { e.preventDefault(); last.focus(); }
} else {
if (document.activeElement === last) { e.preventDefault(); first.focus(); }
}
});

// ── Abrir / cerrar ──
function openModal() {
triggerEl = document.activeElement;
modal.hidden = false;
document.body.style.overflow = "hidden";
requestAnimationFrame(() => modal.classList.add("is-open"));
restoreForm();
setTimeout(() => {
const first = form.querySelector("input, select, textarea");
if (first) first.focus();
}, 360);
}

function closeModal() {
modal.classList.remove("is-open");
document.body.style.overflow = "";
setTimeout(() => {
modal.hidden = true;
if (triggerEl) { triggerEl.focus(); triggerEl = null; }
}, 360);
}

// Botones que abren el modal
document.querySelectorAll("[data-open-modal]").forEach(el => {
el.addEventListener("click", e => {
e.preventDefault();
openModal();
});
});

// Botón X del header del modal
modal.querySelector(".modal-x").addEventListener("click", closeModal);

// Botón cerrar en estado de éxito
modal
.querySelector(".cf-success-close")
.addEventListener("click", closeModal);

// Botón reintentar en estado de error
modal.querySelector(".cf-retry").addEventListener("click", () => {
errorEl.hidden = true;
form.hidden = false;
});

// ESC cierra el modal
document.addEventListener("keydown", e => {
if (e.key === "Escape" && !modal.hidden) closeModal();
});

// Clic fuera NO cierra el modal (sin listener en el overlay)

// ── Persistencia ──
function saveForm() {
const data = {};
fieldsCfg.forEach(f => {
const el = document.getElementById(f.id);
if (el) data[f.id] = el.value;
});
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
} catch (_) {}
}

function restoreForm() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (!raw) return;
const data = JSON.parse(raw);
fieldsCfg.forEach(f => {
const el = document.getElementById(f.id);
if (el && data[f.id] !== undefined) el.value = data[f.id];
});
} catch (_) {}
}

fieldsCfg.forEach(f => {
const el = document.getElementById(f.id);
if (el) el.addEventListener("input", saveForm);
});

// ── Validación ──
function isValidEmail(v) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function clearFieldError(f) {
const el = document.getElementById(f.id);
const err = f.errId ? document.getElementById(f.errId) : null;
if (el) el.classList.remove("invalid");
if (err) {
err.textContent = "";
err.classList.remove("show");
}
}

function validateForm() {
let valid = true;
fieldsCfg.forEach(f => {
if (!f.required) return;
const el = document.getElementById(f.id);
const err = f.errId ? document.getElementById(f.errId) : null;
const ok =
f.type === "email"
? isValidEmail(el.value)
: el.value.trim() !== "";
el.classList.toggle("invalid", !ok);
if (err) {
err.classList.toggle("show", !ok);
}
if (!ok) valid = false;
});
return valid;
}

// Limpiar error al corregir el campo
fieldsCfg.forEach(f => {
const el = document.getElementById(f.id);
if (!el) return;
el.addEventListener("input", () => clearFieldError(f));
});

// ── Envío ──
form.addEventListener("submit", async e => {
e.preventDefault();
if (!validateForm()) return;

submitBtn.disabled = true;
submitBtn.querySelector(".lbl").textContent = "Enviando…";

try {
if (!ENDPOINT) throw new Error("No endpoint configured");
const res = await fetch(ENDPOINT, {
method: "POST",
body: new FormData(form),
headers: { Accept: "application/json" },
});
if (!res.ok) throw new Error("Server error");

// Éxito
form.hidden = true;
successEl.hidden = false;
try {
localStorage.removeItem(STORAGE_KEY);
} catch (_) {}
} catch (_) {
// Error
form.hidden = true;
errorEl.hidden = false;
} finally {
submitBtn.disabled = false;
submitBtn.querySelector(".lbl").textContent = "Enviar solicitud";
}
});
})();
