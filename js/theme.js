// Follow the device until the visitor chooses the opposite appearance.
(() => {
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'theme-mode';
  const normalize = (value) => value === 'light' || value === 'dark' ? value : null;
  const deviceTheme = () => system.matches ? 'dark' : 'light';
  let preference = null;
  try { preference = normalize(localStorage.getItem(storageKey)); } catch { /* Storage can be disabled. */ }

  const update = () => {
    const theme = preference || deviceTheme();
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    }
  };
  update();
  system.addEventListener('change', update);
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) {
      preference = normalize(event.newValue);
      update();
    }
  });

  const initializeButton = () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    update();
    button.hidden = false;
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      // Switching back to the device's theme resumes automatic appearance.
      preference = next === deviceTheme() ? null : next;
      try {
        if (preference) localStorage.setItem(storageKey, preference);
        else localStorage.removeItem(storageKey);
      } catch { /* Keep working in memory. */ }
      update();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeButton);
  else initializeButton();
})();
