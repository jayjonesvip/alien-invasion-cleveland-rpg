/* Shared GA4 tag. Local previews and offline games never send analytics. */
(() => {
  const liveSite = ['lakeeffectinvasion.com', 'www.lakeeffectinvasion.com'].includes(window.location?.hostname);
  window.trackGameEvent = (name, details = {}) => {
    try {
      if (!liveSite || typeof window.gtag !== 'function') return;
      const state = typeof Game === 'undefined' ? null : Game;
      window.gtag('event', name, {
        ...(state ? {level:state.level, street:state.currentStreet} : {}),
        ...details
      });
    } catch { /* Analytics must never interrupt a fight or a save. */ }
  };
  if (!liveSite) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-W7H8DZ7F3R');
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-W7H8DZ7F3R';
  document.head.appendChild(tag);
})();
