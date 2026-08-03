document.addEventListener('DOMContentLoaded', () => {
  const progress = document.getElementById('progress');
  const toTop = document.getElementById('toTop');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const sections = Array.from(document.querySelectorAll('main section.card[id]'));
  const navAnchors = Array.from(document.querySelectorAll('nav.links a[href^="#"]'));
  const tocAnchors = Array.from(document.querySelectorAll('#tocList a[href^="#"]'));

  function onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progress.style.width = pct + '%';
    toTop.classList.toggle('show', scrollTop > 480);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  menuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navAnchors.forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    sections.forEach(s => reduceMotion ? s.classList.add('in-view') : revealObserver.observe(s));

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        [...navAnchors, ...tocAnchors].forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spyObserver.observe(s));
  } else {
    sections.forEach(s => s.classList.add('in-view'));
  }
});
