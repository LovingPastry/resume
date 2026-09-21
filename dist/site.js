/* No remote libraries, tracking, or services required. */
(() => {
  const status = document.querySelector('#copy-status');
  let statusTimer;
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      let success = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          success = true;
        }
      } catch (_) { /* Local file and embedded-browser fallback below. */ }
      if (!success) {
        const field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('aria-label', '微信号');
        field.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.appendChild(field);
        field.select();
        try { success = document.execCommand('copy'); } catch (_) { success = false; }
        field.remove();
        button.focus({ preventScroll: true });
      }
      status.textContent = success ? '微信号已复制：lzc18977189094' : '请长按或选择号码复制：lzc18977189094';
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { status.textContent = ''; }, 4500);
    });
  });

  const links = [...document.querySelectorAll('.section-nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  function updateNavigation() {
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) current = section;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) current = sections.at(-1);
    for (const link of links) {
      if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  let queued = false;
  window.addEventListener('scroll', () => {
    if (!queued) requestAnimationFrame(() => { updateNavigation(); queued = false; });
    queued = true;
  }, { passive: true });
  updateNavigation();

  const progress = document.querySelector('.scroll-progress span');
  function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  const revealItems = [
    ...document.querySelectorAll('.section-heading, .experience, .research-card, .ongoing-research, .project-card, .background-grid, .contact-section')
  ];
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    if (index % 3 !== 0) item.classList.add(`reveal-delay-${index % 3}`);
  });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-media]').forEach(slot => {
    const items = (window.RESUME_MEDIA || {})[slot.dataset.media] || [];
    for (const item of items) {
      if (!item.src || !['image', 'video'].includes(item.type)) continue;
      const figure = document.createElement('figure');
      const media = document.createElement(item.type === 'video' ? 'video' : 'img');
      media.src = item.src;
      if (item.type === 'video') {
        media.controls = true;
        media.preload = 'metadata';
        media.playsInline = true;
        media.setAttribute('aria-label', item.caption || '项目演示视频');
        if (item.poster) media.poster = item.poster;
      } else {
        media.alt = item.alt || item.caption || '项目展示';
        media.loading = 'lazy';
      }
      figure.appendChild(media);
      if (item.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = item.caption;
        figure.appendChild(caption);
      }
      slot.appendChild(figure);
    }
  });

  // Theme: follow system by default, remember an explicit choice.
  const THEME_KEY = 'resume-theme';
  const THEMES = ['system', 'light', 'dark'];
  const LABEL = { system: '跟随系统', light: '浅色模式', dark: '深色模式' };
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: light)');
  const toggle = document.querySelector('#theme-toggle');
  const toggleText = toggle && toggle.querySelector('.theme-toggle-text');

  function stored() {
    try {
      const value = localStorage.getItem(THEME_KEY);
      return THEMES.includes(value) ? value : 'system';
    } catch (_) { return 'system'; }
  }
  function resolved(mode) {
    if (mode === 'system') return media.matches ? 'light' : 'dark';
    return mode;
  }
  function paint() {
    const mode = stored();
    const theme = resolved(mode);
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    root.dataset.themeMode = mode;
    if (!toggle) return;
    const next = THEMES[(THEMES.indexOf(mode) + 1) % THEMES.length];
    toggle.setAttribute('aria-label', `当前${LABEL[mode]}，点击切换到${LABEL[next]}`);
    toggle.setAttribute('title', LABEL[mode]);
    toggle.dataset.theme = theme;
    toggle.dataset.mode = mode;
    if (toggleText) toggleText.textContent = LABEL[mode];
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = THEMES[(THEMES.indexOf(stored()) + 1) % THEMES.length];
      try {
        if (next === 'system') localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, next);
      } catch (_) { /* private mode */ }
      paint();
    });
  }
  media.addEventListener('change', () => { if (stored() === 'system') paint(); });
  paint();
})();
