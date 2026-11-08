// The Lord Barbier demo: language switch, service tabs, booking by WhatsApp.
(() => {
  const EN = {
    'skip': 'Skip to content',
    'nav.services': 'Services', 'nav.nicole': 'Nails with Nicole', 'nav.visit': 'Find us', 'nav.book': 'Book',
    'lang.aria': 'Leer en español',
    'hero.h1': 'Sharp fades, 25 metres from the BCR', 'hero.lead': 'A barbershop in central La Fortuna since 2020, plus nails with Nicole.', 'hero.more': 'See services',
    'book.title': 'Ask for a time', 'book.service': 'Service', 'book.day': 'Day', 'book.time': 'Preferred time', 'book.name': 'Your name',
    'book.send': 'Send on WhatsApp', 'book.help': 'WhatsApp opens with your message ready. The shop confirms the time.',
    'book.err': 'Add your name so the shop knows who is coming.',
    'tab.barber': 'Barbershop', 'tab.nails': 'Nails with Nicole', 'svc.tabs': 'Services',
    'svc.title': 'What happens in the chair', 'svc.prices': 'Prices:', 'svc.pricesfill': 'set by the shop',
    'svc.cut': 'Classic cut', 'svc.cut.d': 'Scissors and clippers, finished with a razor.',
    'svc.fade': 'Fade', 'svc.fade.d': 'Low, mid or high, however you ask for it.',
    'svc.combo': 'Cut and beard', 'svc.combo.d': 'The full combo, with a hot towel.',
    'svc.beard': 'Beard trim', 'svc.beard.d': 'Clean lines, shaped to your face.',
    'svc.kids': 'Kids cut', 'svc.kids.d': 'For the little ones.',
    'svc.mani': 'Manicure', 'svc.mani.d': 'Clean-up, shape and polish.',
    'svc.pedi': 'Pedicure', 'svc.pedi.d': 'Feet ready for sandals.',
    'svc.gel': 'Gel polish', 'svc.gel.d': 'Gel colour, cured under a lamp.',
    'svc.acryl': 'Acrylic nails', 'svc.acryl.d': 'Length and shape made to measure.',
    'svc.art': 'Nail art', 'svc.art.d': 'Painted by hand, simple to bold.',
    'row.book': 'Book this',
    'chairs.title': 'Two chairs, one shop', 'chairs.who': 'Who', 'chairs.what': 'What', 'chairs.for': 'For', 'chairs.where': 'Where',
    'chairs.b.name': 'The barbershop', 'chairs.b.who': 'Harvin, the owner, and his team', 'chairs.b.what': 'Cuts, fades and beards',
    'chairs.b.for': 'Locals and people passing through', 'chairs.b.book': 'Book at the barbershop',
    'chairs.n.name': 'Nicole’s corner', 'chairs.n.what': 'Manicure, pedicure, gel and acrylics', 'chairs.n.where': 'Her own corner inside the barbershop',
    'chairs.n.book': 'Book with Nicole',
    'rev.label': 'out of 5 on Google, from 18 reviews', 'rev.title': 'From the chair to Google', 'rev.q1': 'Visitor from Canada, on Google',
    'visit.title': 'By the BCR, in town', 'visit.where': 'Address', 'visit.addr': '25 metres from the BCR, La Fortuna, Alajuela',
    'visit.hours': 'Hours', 'visit.hoursfill': 'hours to be confirmed', 'visit.mail': 'Email', 'visit.book': 'Book a time',
    'visit.maps': 'Open in Google Maps', 'visit.waze': 'Go with Waze', 'mbar.book': 'Ask for a time', 'visit.maptitle': 'Map of The Lord Barbier in La Fortuna',
    'foot.visit': 'Visit', 'foot.contact': 'Contact', 'foot.page': 'On this page', 'foot.photos': 'Photos from the shop’s Google profile.',
    'work.title': 'Fresh out of the chair', 'work.c1': 'Beard with steam and a hot towel', 'work.c2': 'Low fade with curls on top', 'work.c3': 'Clean neckline, volume on top',
    'img.room': 'Inside the shop: barber chairs, mirrors with ring lights and The Lord Barbier sign at the back',
    'img.steam': 'A barber preps a beard with steam and a hot towel, the shop sign behind',
    'img.curls': 'Low fade on curly hair, side view', 'img.taper': 'Neckline fade with volume on top, from behind',
    'img.logo': 'The Lord Barbier logo, since 2020'
  };

  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const ES = {};
  nodes.forEach((n) => { ES[n.dataset.i18n] = n.textContent; });
  const attrs = [['data-i18n-aria', 'aria-label'], ['data-i18n-label', 'label'], ['data-i18n-title', 'title'], ['data-i18n-alt', 'alt']];
  const ESattr = new Map();
  attrs.forEach(([d, a]) => document.querySelectorAll(`[${d}]`).forEach((n) => ESattr.set(n, n.getAttribute(a))));
  ES['book.err'] = 'Poné tu nombre para que el local sepa quién viene.';

  let lang = 'es';
  const t = (k) => (lang === 'en' ? EN[k] : ES[k]) ?? ES[k] ?? k;
  const langBtn = document.getElementById('lang');

  function setLang(next) {
    lang = next;
    document.documentElement.lang = next;
    nodes.forEach((n) => { const v = t(n.dataset.i18n); if (v) n.textContent = v; });
    attrs.forEach(([d, a]) => document.querySelectorAll(`[${d}]`).forEach((n) => {
      n.setAttribute(a, next === 'en' ? (EN[n.getAttribute(d)] || ESattr.get(n)) : ESattr.get(n));
    }));
    langBtn.textContent = next === 'en' ? 'ES' : 'EN';
    document.title = next === 'en' ? 'The Lord Barbier, barbershop and nails in La Fortuna' : 'The Lord Barbier, barbería y uñas en La Fortuna';
    buildDays();
    try { localStorage.setItem('tlb-lang', next); } catch (e) { /* private mode */ }
  }
  langBtn.addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));

  // Days: the next six days, real dates
  const days = document.getElementById('days');
  function buildDays() {
    const checked = days.querySelector('input:checked');
    const keep = checked ? Number(checked.value) : 0;
    const legend = days.querySelector('legend');
    days.replaceChildren(legend);
    const locale = lang === 'en' ? 'en-GB' : 'es-CR';
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric' });
    for (let i = 0; i < 6; i += 1) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const input = Object.assign(document.createElement('input'), { type: 'radio', name: 'day', id: `d${i}`, value: String(i), checked: i === keep });
      input.dataset.date = d.toISOString().slice(0, 10);
      const label = document.createElement('label');
      label.htmlFor = `d${i}`;
      label.textContent = i === 0 ? (lang === 'en' ? 'Today' : 'Hoy') : i === 1 ? (lang === 'en' ? 'Tomorrow' : 'Mañana') : fmt.format(d);
      label.dataset.full = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
      days.append(input, label);
    }
  }

  // Service tabs
  document.querySelectorAll('[data-switch]').forEach((sw) => {
    const tabs = [...sw.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((x) => {
        const on = x === tab;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
      });
    });
  });

  // "Book this" links pre-pick the service
  const service = document.getElementById('service');
  document.querySelectorAll('[data-pick]').forEach((a) => a.addEventListener('click', () => { service.value = a.dataset.pick; }));

  // Booking: hand the request to the shop's WhatsApp, never fake a confirmation
  const form = document.getElementById('reservar');
  const name = document.getElementById('name');
  const help = document.getElementById('book-help');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!name.value.trim()) {
      name.setAttribute('aria-invalid', 'true');
      name.setAttribute('aria-describedby', 'book-help');
      help.textContent = t('book.err');
      name.focus();
      return;
    }
    name.removeAttribute('aria-invalid');
    help.textContent = t('book.help');
    const svc = service.options[service.selectedIndex].textContent;
    const dayInput = form.querySelector('input[name="day"]:checked');
    const dayLabel = dayInput ? form.querySelector(`label[for="${dayInput.id}"]`) : null;
    const day = dayLabel ? (dayLabel.dataset.full || dayLabel.textContent) : '';
    const time = (form.querySelector('input[name="time"]:checked') || {}).value || '';
    const msg = lang === 'en'
      ? `Hi The Lord Barbier! I'm ${name.value.trim()}. I'd like to book: ${svc}, ${day}, around ${time}. Is that time free?`
      : `¡Hola The Lord Barbier! Soy ${name.value.trim()}. Quisiera una cita: ${svc}, ${day}, a eso de las ${time}. ¿Hay espacio?`;
    window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  // Remember the customer's name for next time (stays on their phone only)
  try { const n = localStorage.getItem('tlb-name'); if (n) name.value = n; } catch (e) { /* private mode */ }
  form.addEventListener('submit', () => { try { if (name.value.trim()) localStorage.setItem('tlb-name', name.value.trim()); } catch (e) { /* private mode */ } });

  // Phone booking bar: shown on small screens, hidden while the form or the footer is in view
  const bar = document.getElementById('mbar');
  if (bar && 'IntersectionObserver' in window) {
    const seen = new Set();
    const update = () => { bar.hidden = seen.size > 0 || window.scrollY < 200; };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      update();
    });
    [form, document.querySelector('.foot'), document.querySelector('.visit__actions')].forEach((el) => el && io.observe(el));
    window.addEventListener('scroll', update, { passive: true });
    bar.querySelector('a').addEventListener('click', () => { setTimeout(() => name.focus({ preventScroll: true }), 600); });
  }

  buildDays();
  let saved = null;
  try { saved = localStorage.getItem('tlb-lang'); } catch (e) { /* private mode */ }
  const prefersEn = !saved && !(navigator.language || '').toLowerCase().startsWith('es');
  if (saved === 'en' || prefersEn) setLang('en');
})();
