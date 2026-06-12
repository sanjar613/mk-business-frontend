/* ============================================================
   MK Business Corp — PUBLIC SITE SCRIPT  (DEMO / MOCK BUILD)
   ------------------------------------------------------------
   В этой версии НЕТ ни одного реального запроса к бэкенду.
   Все данные (шаблоны бизнес-планов, контакты) живут в памяти
   браузера. Любой запрос вида /api/v1/... перехватывается и
   возвращает фейковые данные мгновенно, без сети.
   ============================================================ */

/* ---------- маленькие утилиты ---------- */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = String(html || '');
  return div.innerHTML;
}

function getToken() {
  return sessionStorage.getItem('adminToken') || null;
}

function authHeaders() {
  return { 'Content-Type': 'application/json' };
}

/* Оставлено для совместимости со старым кодом — реальный URL не используется */
const API_BASE = 'https://api.mkbusiness.uz';

function getLang() {
  return localStorage.getItem('language') || 'ru';
}

/* ============================================================
   ФЕЙКОВЫЕ ДАННЫЕ — 8 шаблонов бизнес-планов
   Та же форма данных, что ждёт templates.html.
   ============================================================ */
const MOCK_TEMPLATES = [
  {
    id: 1, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Тикув цехини ташкиллаштириш', ru: 'Швейный цех: организация производства', en: 'Sewing Workshop Business Plan', kaa: 'Tikiw cexin shólkemlestiríw' },
    description: { uz: 'Тикув цехи бизнесини ташкиллаштириш учун тайёр бизнес-режа шаблони.', ru: 'Готовый шаблон бизнес-плана для организации швейного цеха: оборудование, штат, расчёт себестоимости.', en: 'Ready business plan template for organizing a sewing workshop.', kaa: 'Tikiw cexin shólkemlestiríw ushın tayın biznes-joba shablonı.' }
  },
  {
    id: 2, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 2,
    imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Хусусий болалар богчаси', ru: 'Частный детский сад', en: 'Private Kindergarten Business Plan', kaa: 'Jeke bala baqsha' },
    description: { uz: 'Хусусий болалар боғчасини очиш учун бизнес-режа.', ru: 'Бизнес-план для открытия частного детского сада: лицензирование, помещение, финансовая модель.', en: 'Business plan for opening a private kindergarten.', kaa: 'Jeke bala baqshasın ashıw ushın biznes-joba.' }
  },
  {
    id: 3, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 3,
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Паррандачилик хужалиги', ru: 'Птицеводческое хозяйство', en: 'Poultry Farm Business Plan', kaa: 'Qusshılıq xojalıǵı' },
    description: { uz: 'Паррандачилик хўжалигини ташкил этиш бўйича тўлиқ бизнес-режа шаблони.', ru: 'Полный шаблон бизнес-плана для организации птицеводческого хозяйства.', en: 'Complete business plan template for a poultry farm.', kaa: 'Qusshılıq xojalıǵın shólkemlestiríw ushın tolıq biznes-joba.' }
  },
  {
    id: 4, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 4,
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Автомойка', ru: 'Автомойка: бизнес-план', en: 'Car Wash Business Plan', kaa: 'Avtomoyqa biznes-jobası' },
    description: { uz: 'Автомойка бизнесини очиш учун бизнес-режа.', ru: 'Бизнес-план для открытия автомойки: оборудование, расходы и прогноз доходов.', en: 'Business plan for opening a car wash.', kaa: 'Avtomoyqa ashıw ushın biznes-joba.' }
  },
  {
    id: 5, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 5,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Биогумус етиштириш', ru: 'Производство биогумуса', en: 'Biohumus Production', kaa: 'Biogumus óndiriw' },
    description: { uz: 'Биогумус (вермикомпост) ишлаб чиқариш бўйича бизнес-режа шаблони.', ru: 'Шаблон бизнес-плана для производства биогумуса (вермикомпоста).', en: 'Business plan template for biohumus production.', kaa: 'Biogumus óndiriw boyınsha biznes-joba shablonı.' }
  },
  {
    id: 6, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 6,
    imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Когоз салфетка ишлаб чикариш', ru: 'Производство бумажных салфеток', en: 'Paper Napkin Production', kaa: 'Qағaz salfetka óndiriw' },
    description: { uz: 'Қоғоз салфетка ишлаб чиқариш цехини ташкиллаштириш учун бизнес-режа.', ru: 'Бизнес-план для организации производства бумажных салфеток.', en: 'Business plan for paper napkin production.', kaa: 'Qағaz salfetka óndiriw cexin shólkemlestiríw ushın biznes-joba.' }
  },
  {
    id: 7, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 7,
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Пластик махсулотлар ишлаб чикариш', ru: 'Производство пластиковых изделий', en: 'Plastic Products Manufacturing', kaa: 'Plastik ónimlerin óndiriw' },
    description: { uz: 'Пластик маҳсулотлар ишлаб чиқариш бўйича тўлиқ бизнес-режа.', ru: 'Полный бизнес-план для производства пластиковых изделий.', en: 'Complete business plan for plastic products manufacturing.', kaa: 'Plastik ónimlerin óndiriw boyınsha tolıq biznes-joba.' }
  },
  {
    id: 8, category: 'business', badge: 'DOC', hasFile: false, published: true, sortOrder: 8,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
    title: { uz: 'Чехол-полик тикиш цехини ташкиллаштириш', ru: 'Цех по пошиву чехлов и ковриков', en: 'Car Cover & Mat Sewing Workshop', kaa: 'Qap-polıq tikiw cexin shólkemlestiríw' },
    description: { uz: 'Автомобиль чехол ва полик тикиш цехини ташкиллаштириш бўйича бизнес-режа.', ru: 'Бизнес-план для цеха по пошиву автомобильных чехлов и ковриков.', en: 'Business plan for a car cover and mat sewing workshop.', kaa: 'Avtomobil qap hám polıq tikiw cexin shólkemlestiríw boyınsha biznes-joba.' }
  }
];

/* Фейковые контакты (на случай, если их кто-то запросит, + сюда падают
   заявки с формы на главной — в памяти текущей сессии). */
const MOCK_CONTACTS = [
  { id: 1, firstName: 'Азиз', lastName: 'Каримов', email: 'aziz.karimov@mail.uz', message: 'Здравствуйте! Хочу заказать бизнес-план для швейного цеха.', status: 'NEW', createdAt: new Date(Date.now() - 2 * 864e5).toISOString() },
  { id: 2, firstName: 'Дилноза', lastName: 'Юсупова', email: 'dilnoza.y@gmail.com', message: 'Интересует консультация по грантам для малого бизнеса.', status: 'READ', createdAt: new Date(Date.now() - 5 * 864e5).toISOString() },
  { id: 3, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', message: 'Looking for a partnership opportunity in Karakalpakstan.', status: 'NEW', createdAt: new Date(Date.now() - 1 * 864e5).toISOString() }
];

/* ============================================================
   MOCK API LAYER
   Перехватываем window.fetch: любой /api/v1/... отдаём из памяти,
   реального сетевого запроса не происходит. Всё остальное (шрифты
   и т.п.) уходит в настоящий fetch.
   ============================================================ */
(function installMockApi() {
  const realFetch = (typeof window.fetch === 'function') ? window.fetch.bind(window) : null;

  function jsonResponse(data, status = 200) {
    const body = JSON.stringify(data);
    if (typeof Response === 'function') {
      return Promise.resolve(new Response(body, {
        status,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Фолбэк для очень старых браузеров
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(body)
    });
  }

  window.fetch = function (input, init) {
    const url = (typeof input === 'string') ? input : (input && input.url) || '';

    if (url.indexOf('/api/v1/') !== -1) {
      if (url.indexOf('/api/v1/templates') !== -1 && url.indexOf('/download') === -1) {
        return jsonResponse(MOCK_TEMPLATES);
      }
      if (url.indexOf('/api/v1/admin/templates') !== -1) {
        return jsonResponse(MOCK_TEMPLATES);
      }
      if (url.indexOf('/api/v1/admin/contacts') !== -1) {
        return jsonResponse(MOCK_CONTACTS);
      }
      // contact POST, feedback, learning и любой другой api — успешный пустой ответ
      return jsonResponse([], 200);
    }

    return realFetch ? realFetch(input, init) : jsonResponse({}, 200);
  };
})();

/* ============================================================
   ЯЗЫК (i18n) — переключение текста через data-* атрибуты
   ============================================================ */
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;

  const langNames = { en: 'English', ru: 'Русский', uz: "O'zbekcha", kaa: 'Қарақалпақша' };
  const langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.textContent = langNames[lang] || 'Language';

  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('active');

  document.querySelectorAll('[data-en]').forEach((el) => {
    const attr = 'data-' + lang;
    if (!el.hasAttribute(attr)) return;
    const value = el.getAttribute(attr);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const phAttr = 'data-' + lang + '-placeholder';
      if (el.hasAttribute(phAttr)) el.placeholder = el.getAttribute(phAttr);
    } else {
      el.textContent = value;
    }
  });

  // Перерисовать сетку шаблонов на главной в новом языке
  renderHomeTemplates();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}
window.setLanguage = setLanguage;

/* ============================================================
   МОБИЛЬНОЕ МЕНЮ (вызывается из onclick в HTML)
   ============================================================ */
function toggleMobileMenu() {
  const nav = document.querySelector('.site-nav');
  const btn = document.getElementById('mobileMenuBtn');
  if (nav) nav.classList.toggle('mobile-open');
  if (btn) btn.classList.toggle('open');
}
window.toggleMobileMenu = toggleMobileMenu;

/* ============================================================
   КРАСИВЫЕ ВСПЛЫВАЮЩИЕ УВЕДОМЛЕНИЯ (toast)
   ============================================================ */
function ensureToastStyles() {
  if (document.getElementById('mkToastStyles')) return;
  const style = document.createElement('style');
  style.id = 'mkToastStyles';
  style.textContent = `
    .mk-toast-wrap{position:fixed;top:1.25rem;right:1.25rem;z-index:99999;display:flex;flex-direction:column;gap:.6rem;max-width:360px}
    .mk-toast{display:flex;align-items:flex-start;gap:.7rem;padding:1rem 1.1rem;border-radius:.75rem;
      background:#ffffff;color:#0f172a;box-shadow:0 18px 48px rgba(2,12,40,.22);
      border:1px solid #e6ebf5;border-left:4px solid #16a34a;font:500 .92rem/1.45 'Plus Jakarta Sans',system-ui,sans-serif;
      transform:translateX(120%);opacity:0;transition:transform .35s cubic-bezier(.4,0,.2,1),opacity .35s}
    .mk-toast.show{transform:translateX(0);opacity:1}
    .mk-toast.err{border-left-color:#dc2626}
    .mk-toast.info{border-left-color:#0066ff}
    .mk-toast-ico{flex:0 0 auto;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:1.1rem}
    .mk-toast-msg{flex:1}
    .mk-toast-title{font-weight:800;margin-bottom:.15rem}
  `;
  document.head.appendChild(style);
}

function showToast(message, type = 'success', title = '') {
  ensureToastStyles();
  let wrap = document.querySelector('.mk-toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'mk-toast-wrap';
    document.body.appendChild(wrap);
  }
  const icons = { success: '✅', err: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = 'mk-toast ' + (type === 'success' ? '' : type);
  toast.innerHTML =
    '<span class="mk-toast-ico">' + (icons[type] || icons.success) + '</span>' +
    '<span class="mk-toast-msg">' +
    (title ? '<span class="mk-toast-title">' + escapeHtml(title) + '</span>' : '') +
    escapeHtml(message) + '</span>';
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}
window.showToast = showToast;

/* ============================================================
   СЕТКА ШАБЛОНОВ НА ГЛАВНОЙ (#templatesGrid)
   ============================================================ */
function localText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = getLang();
  return obj[lang] || obj.ru || obj.uz || obj.en || '';
}

function renderHomeTemplates() {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;

  const lang = getLang();
  const viewLabel = { ru: 'Подробнее', en: 'View', uz: 'Batafsil', kaa: 'Tolıǵıraq' }[lang] || 'Подробнее';

  grid.innerHTML = MOCK_TEMPLATES.map((tpl) => {
    const title = escapeHtml(localText(tpl.title));
    const desc = escapeHtml(localText(tpl.description));
    const img = escapeHtml(tpl.imageUrl || '');
    const badge = escapeHtml(tpl.badge || 'DOC');
    return (
      '<article class="template-card reveal">' +
        '<div class="template-preview">' +
          (img
            ? '<img class="template-image" src="' + img + '" alt="' + title + '" loading="lazy" onerror="this.style.display=\'none\'">'
            : '') +
          '<span class="template-badge">' + badge + '</span>' +
        '</div>' +
        '<div class="template-card-content">' +
          '<h3>' + title + '</h3>' +
          '<p>' + desc + '</p>' +
          '<a class="button button-secondary" href="templates.html" ' +
             'style="margin-top:auto;align-self:flex-start;font-size:.875rem;padding:.55rem 1.25rem">' +
             viewLabel + ' →</a>' +
        '</div>' +
      '</article>'
    );
  }).join('');
}

/* ============================================================
   ФОРМА КОНТАКТА на главной (#contactForm)
   ============================================================ */
function wireContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const get = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const firstName = get('firstName');
    const lastName = get('lastName');
    const email = get('email');
    const message = get('message');

    if (!firstName || !email) {
      showToast(
        { ru: 'Пожалуйста, заполните имя и email.', en: 'Please fill in your name and email.', uz: 'Iltimos, ism va emailni to‘ldiring.', kaa: 'Iltimas, at hám email toltırıń.' }[getLang()] || 'Заполните имя и email.',
        'err'
      );
      return;
    }

    // Сохраняем заявку в памяти сессии
    MOCK_CONTACTS.unshift({
      id: Date.now(),
      firstName, lastName, email, message,
      status: 'NEW',
      createdAt: new Date().toISOString()
    });

    form.reset();
    showToast(
      { ru: 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.', en: 'Your message has been sent! We will contact you soon.', uz: 'So‘rovingiz yuborildi! Tez orada bog‘lanamiz.', kaa: 'Sorawıńız jiberildi! Tez arada baylanısamız.' }[getLang()] || 'Заявка отправлена!',
      'success',
      { ru: 'Спасибо!', en: 'Thank you!', uz: 'Rahmat!', kaa: 'Rahmet!' }[getLang()] || 'Спасибо!'
    );
  });
}

/* ============================================================
   КНОПКА «НАВЕРХ» (#fab) + тень шапки при скролле
   ============================================================ */
function wireScrollUi() {
  const fab = document.getElementById('fab');
  const header = document.querySelector('.site-header');

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (fab) fab.classList.toggle('fab-visible', y > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (fab) {
    fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

/* ============================================================
   ЯЗЫКОВОЕ МЕНЮ (открытие/выбор)
   ============================================================ */
function wireLanguageMenu() {
  const toggle = document.getElementById('langToggle');
  const menu = document.getElementById('langMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== toggle) menu.classList.remove('active');
    });
  }

  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    });
  });
}

/* ============================================================
   ИНИЦИАЛИЗАЦИЯ
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  wireLanguageMenu();
  wireScrollUi();
  wireContactForm();
  renderHomeTemplates();

  // Применяем сохранённый язык (по умолчанию RU)
  setLanguage(getLang());

  // Закрывать мобильное меню при клике по ссылке навигации
  document.querySelectorAll('.site-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const nav = document.querySelector('.site-nav');
      const btn = document.getElementById('mobileMenuBtn');
      if (nav) nav.classList.remove('mobile-open');
      if (btn) btn.classList.remove('open');
    });
  });
});