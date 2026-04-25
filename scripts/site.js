/* Koda Studio — landing page interactions */

(() => {
  // ═══ Header: dark→light transition on scroll ═══
  const header = document.getElementById('site-header');
  const hero = document.querySelector('.hero');

  function updateHeader() {
    if (!header || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const scrolled = window.scrollY > 40;

    // Find the section currently behind the header
    const headerMid = 40; // below the fixed header top
    const sections = document.querySelectorAll('main > section, main > footer');
    let onDark = false;
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top <= headerMid && r.bottom > headerMid) {
        onDark = sec.classList.contains('hero') ||
                 sec.classList.contains('dark') ||
                 sec.classList.contains('site-footer');
      }
    });

    header.classList.toggle('on-dark', onDark);
    header.classList.toggle('on-light', !onDark);
    header.classList.toggle('scrolled', scrolled);

    // Swap wordmark color class (both already use currentColor so nothing to do)
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  // ═══ Parallax mockups in case frames ═══
  const parallaxFrames = document.querySelectorAll('[data-parallax]');
  let parallaxEnabled = true;

  function updateParallax() {
    if (!parallaxEnabled) return;
    const vh = window.innerHeight;
    parallaxFrames.forEach(frame => {
      const scroller = frame.querySelector('[data-parallax-scroll] .mock');
      if (!scroller) return;
      const rect = frame.getBoundingClientRect();
      // Progress: 0 when frame enters viewport bottom, 1 when exits top
      const progress = 1 - (rect.top + rect.height * 0.5) / (vh + rect.height * 0.5);
      const clamped = Math.max(-0.2, Math.min(1.2, progress));
      // The mock is sized to overflow the frame; slide it upward
      const mockH = scroller.scrollHeight;
      const frameH = rect.height;
      const travel = Math.max(0, mockH - frameH);
      scroller.style.transform = `translateY(${-clamped * travel}px)`;
    });
  }
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);

  // ═══ Method sticky: sync media frame to active step ═══
  const methodSteps = document.querySelectorAll('.method-step');
  const methodFrames = document.querySelectorAll('.method-frame');

  function updateMethod() {
    if (!methodSteps.length) return;
    const vh = window.innerHeight;
    let activeIdx = 0;
    methodSteps.forEach((step, i) => {
      const r = step.getBoundingClientRect();
      const center = r.top + r.height / 2;
      if (center < vh * 0.55) activeIdx = i;
    });
    methodSteps.forEach((s, i) => s.classList.toggle('active', i === activeIdx));
    methodFrames.forEach((f, i) => f.classList.toggle('show', i === activeIdx));
  }
  // Set first frame visible initially
  if (methodFrames[0]) methodFrames[0].classList.add('show');
  if (methodSteps[0]) methodSteps[0].classList.add('active');
  updateMethod();
  window.addEventListener('scroll', updateMethod, { passive: true });

  // ═══ Testimonials carousel ═══
  const track = document.querySelector('[data-track]');
  const testimonials = track ? track.querySelectorAll('.testimonial') : [];
  const dots = document.querySelectorAll('[data-dots] .dot');
  const navBtns = document.querySelectorAll('.carousel-nav');
  let tmIdx = 0;
  let autoplay = true;
  let tmTimer = null;

  function setTestimonial(i) {
    tmIdx = (i + testimonials.length) % testimonials.length;
    testimonials.forEach((t, k) => t.classList.toggle('active', k === tmIdx));
    dots.forEach((d, k) => d.classList.toggle('active', k === tmIdx));
  }
  navBtns.forEach(b => b.addEventListener('click', () => {
    setTestimonial(tmIdx + parseInt(b.dataset.dir, 10));
    resetAutoplay();
  }));
  dots.forEach(d => d.addEventListener('click', () => {
    setTestimonial(parseInt(d.dataset.idx, 10));
    resetAutoplay();
  }));
  function startAutoplay() {
    if (!autoplay) return;
    stopAutoplay();
    tmTimer = setInterval(() => setTestimonial(tmIdx + 1), 6000);
  }
  function stopAutoplay() { if (tmTimer) clearInterval(tmTimer); tmTimer = null; }
  function resetAutoplay() { stopAutoplay(); startAutoplay(); }
  startAutoplay();

  // ═══ Reveal on scroll ═══
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  // ═══ Tweaks panel ═══
  const panel = document.getElementById('tweaks-panel');
  const closeBtn = panel?.querySelector('.tw-close');

  window.addEventListener('message', (e) => {
    if (e.data?.type === '__activate_edit_mode') {
      panel.hidden = false;
    } else if (e.data?.type === '__deactivate_edit_mode') {
      panel.hidden = true;
    }
  });
  // Announce availability after handler is registered
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(_) {}

  closeBtn?.addEventListener('click', () => {
    panel.hidden = true;
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(_) {}
  });

  // Tweak handlers
  panel?.querySelectorAll('[data-tw]').forEach(ctl => {
    const key = ctl.dataset.tw;
    ctl.addEventListener('input', () => applyTweak(key, ctl.type === 'checkbox' ? ctl.checked : ctl.value));
    ctl.addEventListener('change', () => applyTweak(key, ctl.type === 'checkbox' ? ctl.checked : ctl.value));
  });

  function applyTweak(key, value) {
    const root = document.documentElement;
    if (key === 'accent') {
      root.style.setProperty('--accent-live', value);
      root.style.setProperty('--accent', value);
    } else if (key === 'hero') {
      hero?.classList.remove('mode-marble', 'mode-concrete', 'mode-void');
      if (value === 'marble') hero?.classList.add('mode-marble');
      else if (value === 'concrete') hero?.classList.add('mode-concrete');
      else if (value === 'void') hero?.classList.add('mode-void');
    } else if (key === 'headerStart') {
      // When 'solid', force on-light at top
      if (value === 'solid') {
        header.classList.remove('on-dark');
        header.classList.add('on-light', 'scrolled');
      } else {
        updateHeader();
      }
    } else if (key === 'grain') {
      const grain = document.querySelector('.hero-grain');
      if (grain) grain.style.opacity = (value / 100) * 0.16;
    } else if (key === 'parallax') {
      parallaxEnabled = value;
      if (!value) {
        parallaxFrames.forEach(f => {
          const s = f.querySelector('[data-parallax-scroll] .mock');
          if (s) s.style.transform = '';
        });
      } else { updateParallax(); }
    } else if (key === 'autoplay') {
      autoplay = value;
      if (value) startAutoplay(); else stopAutoplay();
    }
  }
})();
