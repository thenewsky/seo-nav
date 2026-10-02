(() => {
  'use strict';

  function getDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
  }

  function addFavicon(link) {
    const url = link.getAttribute('href');
    if (!url || !url.startsWith('http') || link.querySelector('img')) return;

    const domain = getDomain(url);
    const img = document.createElement('img');
    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = function () {
      this.src = `https://${domain}/favicon.ico`;
      this.onerror = function () {
        this.style.display = 'none';
      };
    };
    link.insertBefore(img, link.firstChild);
  }

  document.querySelectorAll('td a[href^="http"]').forEach(addFavicon);
})();
