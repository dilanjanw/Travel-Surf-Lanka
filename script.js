const header = document.getElementById('siteHeader');
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
});

menuBtn?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    mobileNav?.classList.remove('open');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


const translateBtn = document.getElementById('translateBtn');
const translateMenu = document.getElementById('translateMenu');

function openTranslateMenu(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !translateMenu.classList.contains('open');
  translateMenu.classList.toggle('open', shouldOpen);
  translateBtn?.setAttribute('aria-expanded', String(shouldOpen));
}

translateBtn?.addEventListener('click', (event) => {
  event.stopPropagation();
  openTranslateMenu();
});

translateMenu?.querySelectorAll('button[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    const interval = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
        clearInterval(interval);
        openTranslateMenu(false);
      }
    }, 200);

    setTimeout(() => clearInterval(interval), 5000);
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.translate-wrap')) {
    openTranslateMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    openTranslateMenu(false);
  }
});

function googleTranslateElementInit() {
  if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) return;
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'he,nl,de,es,sl,it',
      autoDisplay: false,
    },
    'google_translate_element'
  );
}
