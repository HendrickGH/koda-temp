
/* Koda Studio — landing page interactions */

(() => {
// ═══ Mobile burger menu ═══
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const headerEl = document.getElementById("site-header");

function setNavOpen(open) {
if (!navToggle || !mobileNav || !headerEl) return;
navToggle.setAttribute("aria-expanded", open ? "true" : "false");
navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
headerEl.classList.toggle("nav-open", open);
document.body.classList.toggle("nav-locked", open);
}
if (navToggle && mobileNav) {
navToggle.addEventListener("click", () => {
const isOpen = headerEl.classList.contains("nav-open");
setNavOpen(!isOpen);
});
mobileNav.querySelectorAll("a").forEach(a => {
a.addEventListener("click", () => setNavOpen(false));
});
document.addEventListener("keydown", e => {
if (e.key === "Escape" && headerEl.classList.contains("nav-open")) {
setNavOpen(false);
navToggle.focus();
}
});
window.addEventListener("resize", () => {
if (window.innerWidth > 880 && headerEl.classList.contains("nav-open")) {
setNavOpen(false);
}
});
}

// ═══ Header + WA button: dark→light transition on scroll ═══
const header = document.getElementById("site-header");
const hero = document.querySelector(".hero");
let waRail = null;

function isDark(sec) {
	if (!sec) return false;
	return (
		sec.classList.contains("hero") ||
		sec.classList.contains("dark") ||
		sec.classList.contains("site-footer") ||
		sec.getAttribute("data-theme") === "dark"
	);
}

function updateHeader() {
if (!header) return;
const scrolled = window.scrollY > 40;
	const sections = document.querySelectorAll(
		"main > header, main > section, main > article, main > div, main > footer, body > footer"
	);

// Header — check section behind the top bar
const headerMid = 40;
let onDark = false;
let found = false;
sections.forEach(sec => {
const r = sec.getBoundingClientRect();
if (r.top <= headerMid && r.bottom > headerMid) {
onDark = isDark(sec);
found = true;
}
});

// Fallback for Safari elastic scroll (bounce) or fast load at the top:
if (!found && sections.length > 0) {
const firstRect = sections[0].getBoundingClientRect();
if (firstRect.top > 0) {
onDark = isDark(sections[0]);
}
}

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

// ─── Video hero: pausa en reduced-motion, mobile y save-data ───
const heroVideo = document.querySelector(".hero-video-element");
if (heroVideo) {
const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const skipVideo = () =>
window.innerWidth < 768 || navigator.connection?.saveData === true;

const applyMotion = m => {
if (m.matches || skipVideo()) {
heroVideo.pause();
heroVideo.removeAttribute("autoplay");
} else {
heroVideo.setAttribute("autoplay", "");
heroVideo.play().catch(() => {});
}
};
applyMotion(mq);
mq.addEventListener("change", applyMotion);

// ─── Pausa video + animaciones decorativas cuando el hero sale del viewport ───
const heroSection = document.querySelector(".hero");
if (heroSection) {
const heroObs = new IntersectionObserver(([entry]) => {
const smoke = heroSection.querySelector(".hero-smoke");
const line = heroSection.querySelector(".scroll-cue .line");
if (entry.isIntersecting) {
if (!mq.matches && !skipVideo()) heroVideo.play().catch(() => {});
[smoke, line].forEach(el => { if (el) el.style.animationPlayState = ""; });
} else {
heroVideo.pause();
[smoke, line].forEach(el => { if (el) el.style.animationPlayState = "paused"; });
}
}, { threshold: 0 });
heroObs.observe(heroSection);
}
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

// ═══ Tweaks panel — lazy (inyectado desde <template> al primer mensaje) ═══
let panel = null;

function ensureTweaks() {
if (panel) return panel;
const tpl = document.getElementById("tpl-tweaks");
if (!tpl) return null;
document.body.appendChild(tpl.content.cloneNode(true));
panel = document.getElementById("tweaks-panel");
panel.querySelector(".tw-close")?.addEventListener("click", () => {
panel.hidden = true;
try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (_) {}
});
panel.querySelectorAll("[data-tw]").forEach(ctl => {
const key = ctl.dataset.tw;
ctl.addEventListener("input", () =>
applyTweak(key, ctl.type === "checkbox" ? ctl.checked : ctl.value));
ctl.addEventListener("change", () =>
applyTweak(key, ctl.type === "checkbox" ? ctl.checked : ctl.value));
});
return panel;
}

window.addEventListener("message", e => {
if (e.data?.type === "__activate_edit_mode") {
const p = ensureTweaks();
if (p) p.hidden = false;
} else if (e.data?.type === "__deactivate_edit_mode") {
if (panel) panel.hidden = true;
}
});
try {
window.parent.postMessage({ type: "__edit_mode_available" }, "*");
} catch (_) {}

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

const EASE = 0.15;
const SPEED_MULT = 2;
const MOBILE_BP = 900;
let rafId = null;
let sectionVisible = false;

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
if (!sectionVisible) return;
updateTargets();
ensureAnimating();
}

function onResize() {
recomputeBounds();
if (sectionVisible) {
updateTargets();
ensureAnimating();
}
}

// Only attach scroll work when section is actually visible
const sectionObserver = new IntersectionObserver(([entry]) => {
sectionVisible = entry.isIntersecting;
if (sectionVisible) {
updateTargets();
ensureAnimating();
} else if (rafId !== null) {
cancelAnimationFrame(rafId);
rafId = null;
}
}, { rootMargin: "200px 0px 200px 0px" });
sectionObserver.observe(section);

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


/* ══ Modal de contacto — lazy (inyectado desde <template> al primer trigger) ══ */
(() => {
const EMAILJS_SERVICE  = "service_deimki6";
const EMAILJS_TEMPLATE = "template_3d6wlxk";
const STORAGE_KEY = "koda_cf";
const FOCUSABLE = 'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const fieldsCfg = [
{ id: "cf-name",    errId: "cf-name-err",    required: true,  type: "text"   },
{ id: "cf-email",   errId: "cf-email-err",   required: true,  type: "email"  },
{ id: "cf-phone",                            required: false                  },
{ id: "cf-company",                          required: false                  },
{ id: "cf-service", errId: "cf-service-err", required: true,  type: "select" },
{ id: "cf-message", errId: "cf-message-err", required: true,  type: "text"   },
];

let modal = null;
let triggerEl = null;

function isValidEmail(v) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function saveForm() {
const data = {};
fieldsCfg.forEach(f => {
const el = document.getElementById(f.id);
if (el) data[f.id] = el.value;
});
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
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

function clearFieldError(f) {
const el = document.getElementById(f.id);
const err = f.errId ? document.getElementById(f.errId) : null;
if (el) el.classList.remove("invalid");
if (err) { err.textContent = ""; err.classList.remove("show"); }
}

function validateForm() {
let valid = true;
fieldsCfg.forEach(f => {
if (!f.required) return;
const el = document.getElementById(f.id);
const err = f.errId ? document.getElementById(f.errId) : null;
const ok = f.type === "email" ? isValidEmail(el.value) : el.value.trim() !== "";
el.classList.toggle("invalid", !ok);
if (err) err.classList.toggle("show", !ok);
if (!ok) valid = false;
});
return valid;
}

function openModal(sector) {
triggerEl = document.activeElement;
modal.hidden = false;
document.body.style.overflow = "hidden";
requestAnimationFrame(() => modal.classList.add("is-open"));
restoreForm();

if (sector) {
const msgEl = document.getElementById("cf-message");
if (msgEl && msgEl.value.trim() === "") {
msgEl.value = `Me interesa iniciar un proyecto para el sector: ${sector}\n\n`;
}
}
setTimeout(() => {
const first = modal.querySelector("input, select, textarea");
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

function initModal() {
modal = document.getElementById("contact-modal");
const form = document.getElementById("cf-form");
const successEl = document.getElementById("cf-success");
const errorEl = document.getElementById("cf-error");
const submitBtn = document.getElementById("cf-submit");

modal.addEventListener("keydown", e => {
if (e.key !== "Tab") return;
const els = Array.from(modal.querySelectorAll(FOCUSABLE)).filter(
el => !el.closest("[hidden]"));
if (!els.length) return;
const first = els[0], last = els[els.length - 1];
if (e.shiftKey) {
if (document.activeElement === first) { e.preventDefault(); last.focus(); }
} else {
if (document.activeElement === last) { e.preventDefault(); first.focus(); }
}
});

modal.querySelector(".modal-x").addEventListener("click", closeModal);
modal.querySelector(".cf-success-close").addEventListener("click", closeModal);
modal.querySelector(".cf-retry").addEventListener("click", () => {
errorEl.hidden = true;
form.hidden = false;
});

fieldsCfg.forEach(f => {
const el = document.getElementById(f.id);
if (!el) return;
el.addEventListener("input", saveForm);
el.addEventListener("input", () => clearFieldError(f));
});

form.addEventListener("submit", async e => {
e.preventDefault();
if (!validateForm()) return;
submitBtn.disabled = true;
submitBtn.querySelector(".lbl").textContent = "Enviando…";

// Inject current page URL so the template knows the origin slug
let pageInput = form.querySelector('[name="page_url"]');
if (!pageInput) {
pageInput = Object.assign(document.createElement("input"), { type: "hidden", name: "page_url" });
form.appendChild(pageInput);
}
pageInput.value = window.location.href;

try {
await window.emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, form);
form.hidden = true;
successEl.hidden = false;
try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
} catch (_) {
form.hidden = true;
errorEl.hidden = false;
} finally {
submitBtn.disabled = false;
submitBtn.querySelector(".lbl").textContent = "Enviar solicitud";
}
});
}

function ensureModal() {
if (modal) return;
const tpl = document.getElementById("tpl-modal");
if (!tpl) return;
document.body.appendChild(tpl.content.cloneNode(true));
initModal();
}

document.querySelectorAll("[data-open-modal]").forEach(el => {
el.addEventListener("click", e => {
e.preventDefault();
ensureModal();
openModal(el.dataset.sector);
});
});

document.addEventListener("keydown", e => {
if (e.key === "Escape" && modal && !modal.hidden) closeModal();
});
})();
