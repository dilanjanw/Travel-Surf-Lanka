/* ── HEADER SCROLL ── */
const header = document.getElementById('siteHeader');
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
});

/* ── MOBILE MENU ── */
menuBtn?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    mobileNav?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    openTranslateMenu(false);
  }
});

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── TRANSLATE MENU ── */
const translateBtn = document.getElementById('translateBtn');
const translateMenu = document.getElementById('translateMenu');

function openTranslateMenu(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !translateMenu.classList.contains('open');
  translateMenu.classList.toggle('open', shouldOpen);
  translateBtn?.setAttribute('aria-expanded', String(shouldOpen));
}

translateBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
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

document.addEventListener('click', (e) => {
  if (!e.target.closest('.floating-translate')) {
    openTranslateMenu(false);
  }
});

function googleTranslateElementInit() {
  if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) return;
  new google.translate.TranslateElement(
    { pageLanguage: 'en', includedLanguages: 'de,nl,fr,es,it,he', autoDisplay: false },
    'google_translate_element'
  );
}

/* ── FORM VALIDATION HELPER ── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputId, errId, message) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('error');
  if (err) err.textContent = message;
}

function clearError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.remove('error');
  if (err) err.textContent = '';
}

function clearAllErrors(fieldMap) {
  Object.entries(fieldMap).forEach(([inputId, errId]) => clearError(inputId, errId));
}

/* ── WHATSAPP MESSAGE BUILDER ── */
function buildWhatsAppMessage(data) {
  const lines = Object.entries(data)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`);
  return encodeURIComponent(lines.join('\n'));
}

function openWhatsApp(message) {
  window.open('https://wa.me/94777491188?text=' + message, '_blank', 'noopener');
}

/* ── BOOKING FORM ── */
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

if (bookingForm) {
  /* Live clear errors on input */
  const bFields = { 'b-name': 'b-name-err', 'b-email': 'b-email-err', 'b-arrival': 'b-arrival-err', 'b-guests': 'b-guests-err' };
  Object.entries(bFields).forEach(([inputId, errId]) => {
    document.getElementById(inputId)?.addEventListener('input', () => clearError(inputId, errId));
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(bFields);

    const name    = document.getElementById('b-name')?.value.trim();
    const email   = document.getElementById('b-email')?.value.trim();
    const arrival = document.getElementById('b-arrival')?.value;
    const guests  = document.getElementById('b-guests')?.value;
    const pkg     = document.getElementById('b-package')?.value;
    const notes   = document.getElementById('b-notes')?.value.trim();

    let valid = true;

    if (!name) { showError('b-name', 'b-name-err', 'Please enter your name.'); valid = false; }
    if (!email) { showError('b-email', 'b-email-err', 'Please enter your email.'); valid = false; }
    else if (!validateEmail(email)) { showError('b-email', 'b-email-err', 'Please enter a valid email address.'); valid = false; }
    if (!arrival) { showError('b-arrival', 'b-arrival-err', 'Please select an arrival date.'); valid = false; }
    if (!guests || guests < 1) { showError('b-guests', 'b-guests-err', 'Please enter number of guests.'); valid = false; }

    if (!valid) return;

    const msg = buildWhatsAppMessage({
      'Hi Dilanjan, I have a booking request': '',
      'Name': name,
      'Email': email,
      'Arrival date': arrival,
      'Guests': guests,
      'Package': pkg || 'Not selected',
      'Notes': notes || 'None',
    });

    /* Also update email fallback button */
    const emailBtn = document.getElementById('emailBookingBtn');
    if (emailBtn) {
      const subject = encodeURIComponent('Booking Request — Travel Surf Lanka');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nArrival: ${arrival}\nGuests: ${guests}\nPackage: ${pkg || 'Not selected'}\nNotes: ${notes || 'None'}`);
      emailBtn.href = `mailto:dilanjanw@gmail.com?subject=${subject}&body=${body}`;
    }

    openWhatsApp(msg);

    /* Show success message */
    bookingSuccess.style.display = 'block';
    bookingForm.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    /* Hide success after 8s */
    setTimeout(() => { bookingSuccess.style.display = 'none'; }, 8000);
  });
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  const cFields = { 'c-name': 'c-name-err', 'c-email': 'c-email-err', 'c-message': 'c-message-err' };
  Object.entries(cFields).forEach(([inputId, errId]) => {
    document.getElementById(inputId)?.addEventListener('input', () => clearError(inputId, errId));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(cFields);

    const name     = document.getElementById('c-name')?.value.trim();
    const email    = document.getElementById('c-email')?.value.trim();
    const dates    = document.getElementById('c-dates')?.value.trim();
    const interest = document.getElementById('c-interest')?.value;
    const message  = document.getElementById('c-message')?.value.trim();

    let valid = true;

    if (!name) { showError('c-name', 'c-name-err', 'Please enter your name.'); valid = false; }
    if (!email) { showError('c-email', 'c-email-err', 'Please enter your email.'); valid = false; }
    else if (!validateEmail(email)) { showError('c-email', 'c-email-err', 'Please enter a valid email address.'); valid = false; }
    if (!message) { showError('c-message', 'c-message-err', 'Please enter a message.'); valid = false; }

    if (!valid) return;

    const msg = buildWhatsAppMessage({
      'Hi Dilanjan, I have an enquiry': '',
      'Name': name,
      'Email': email,
      'Travel dates': dates || 'Not specified',
      'Interested in': interest || 'Not specified',
      'Message': message,
    });

    openWhatsApp(msg);

    contactSuccess.style.display = 'block';
    contactForm.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
    contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { contactSuccess.style.display = 'none'; }, 8000);
  });
}
