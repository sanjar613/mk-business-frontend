function getToken() {
  // sessionStorage preferred (clears on tab close)
  return sessionStorage.getItem('adminToken') || null;
}

// Safe HTML sanitizer — strip dangerous tags/attrs
function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = String(html || '');
  return div.innerHTML;
}

// ============================================================
// CONFIG: замени на URL твоего бэкенда после деплоя на Render
// Например: 'https://mk-business-api.onrender.com'
// ============================================================
const API_BASE = 'https://api.mkbusiness.uz';

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

function handleAuthError(response) {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
    return true;
  }
  return false;
}

let currentLanguage = localStorage.getItem('language') || 'en';
let editingItemId = null;
let editingFeedbackId = null;
let editingLearningId = null;
let editingTemplateId = null;

const uiText = {
  welcome: { en: 'Welcome', ru: 'Добро пожаловать', uz: 'Xush kelibsiz', kaa: 'Qosh keldiniz' },
  loadingContacts: { en: 'Loading contacts...', ru: 'Загрузка контактов...', uz: 'Bog‘lanishlar yuklanmoqda...', kaa: 'Baylanıslar júklenbekte...' },
  loadingItems: { en: 'Loading items...', ru: 'Загрузка элементов...', uz: 'Elementlar yuklanmoqda...', kaa: 'Elementler júklenbekte...' },
  loadingUsers: { en: 'Loading users...', ru: 'Загрузка пользователей...', uz: 'Foydalanuvchilar yuklanmoqda...', kaa: 'Paydalanıwshılar júklenbekte...' },
  totalItems: { en: 'Total Items', ru: 'Всего элементов', uz: 'Jami elementlar', kaa: 'Jámi elementler' },
  results: { en: 'Results', ru: 'Результаты', uz: 'Natijalar', kaa: 'Netijeler' },
  achievements: { en: 'Achievements', ru: 'Достижения', uz: 'Yutuqlar', kaa: 'Jetiskenlikler' },
  totalFeedback: { en: 'Total Feedback', ru: 'Всего отзывов', uz: 'Jami sharhlar', kaa: 'Jámi pikirler' },
  totalPrograms: { en: 'Total Programs', ru: 'Всего программ', uz: 'Jami dasturlar', kaa: 'Jámi programmalar' },
  courses: { en: 'Courses', ru: 'Курсы', uz: 'Kurslar', kaa: 'Kurslar' },
  webinars: { en: 'Webinars', ru: 'Вебинары', uz: 'Vebinarlar', kaa: 'Vebinarlar' },
  totalTemplates: { en: 'Total Templates', ru: 'Всего шаблонов', uz: 'Jami shablonlar', kaa: 'Jámi úlgiler' },
  totalUsers: { en: 'Total Users', ru: 'Всего пользователей', uz: 'Jami foydalanuvchilar', kaa: 'Jámi paydalanıwshılar' },
  edit: { en: 'Edit', ru: 'Редактировать', uz: 'Tahrirlash', kaa: 'Ózgertiw' },
  delete: { en: 'Delete', ru: 'Удалить', uz: 'O‘chirish', kaa: 'Óshiriw' },
  markRead: { en: 'Mark Read', ru: 'Отметить прочитанным', uz: 'O‘qilgan deb belgilash', kaa: 'Oqıldı dep belgilew' },
  close: { en: 'Close', ru: 'Закрыть', uz: 'Yopish', kaa: 'Jabıw' },
  result: { en: 'Result', ru: 'Результат', uz: 'Natija', kaa: 'Netije' },
  achievement: { en: 'Achievement', ru: 'Достижение', uz: 'Yutuq', kaa: 'Jetiskenlik' },
  course: { en: 'Course', ru: 'Курс', uz: 'Kurs', kaa: 'Kurs' },
  webinar: { en: 'Webinar', ru: 'Вебинар', uz: 'Vebinar', kaa: 'Vebinar' },
  link: { en: 'Link', ru: 'Ссылка', uz: 'Havola', kaa: 'Silteme' },
  file: { en: 'File', ru: 'Файл', uz: 'Fayl', kaa: 'Fayl' },
  uploadedFile: { en: 'Uploaded file', ru: 'Загруженный файл', uz: 'Yuklangan fayl', kaa: 'Júklengen fayl' },
  visible: { en: 'Visible', ru: 'Видимый', uz: 'Ko‘rinadi', kaa: 'Kórinedi' },
  hidden: { en: 'Hidden', ru: 'Скрыт', uz: 'Yashirilgan', kaa: 'Jasırılǵan' },
  noContacts: { en: 'No contact messages found', ru: 'Контактные сообщения не найдены', uz: 'Bog‘lanish xabarlari topilmadi', kaa: 'Baylanıs xabarları tabılmadı' },
  adjustFilters: { en: 'Try adjusting your filters.', ru: 'Попробуйте изменить фильтры.', uz: 'Filtrlarni o‘zgartirib ko‘ring.', kaa: 'Súzgishlerdi ózgertip kóriń.' },
  noResults: { en: 'No results yet', ru: 'Пока нет результатов', uz: 'Hali natijalar yo‘q', kaa: 'Ele netijeler joq' },
  addResultHint: { en: 'Use Add Item to create one.', ru: 'Используйте Добавить элемент.', uz: 'Element qo‘shish tugmasidan foydalaning.', kaa: 'Element qosıw túymesin paydalanıń.' },
  noFeedback: { en: 'No feedback yet', ru: 'Пока нет отзывов', uz: 'Hali sharhlar yo‘q', kaa: 'Ele pikirler joq' },
  addFeedbackHint: { en: 'Add client reviews from the Feedback tab.', ru: 'Добавьте отзывы во вкладке Отзывы.', uz: 'Sharhlarni Feedback bo‘limidan qo‘shing.', kaa: 'Pikirlerdi Feedback bóliminen qosıń.' },
  noPrograms: { en: 'No programs yet', ru: 'Пока нет программ', uz: 'Hali dasturlar yo‘q', kaa: 'Ele programmalar joq' },
  addProgramsHint: { en: 'Add courses or webinars from the Courses tab.', ru: 'Добавьте курсы или вебинары во вкладке Курсы.', uz: 'Kurslar bo‘limidan kurs yoki vebinar qo‘shing.', kaa: 'Kurslar bóliminen kurs yamasa vebinar qosıń.' },
  noTemplates: { en: 'No templates yet', ru: 'Пока нет шаблонов', uz: 'Hali shablonlar yo‘q', kaa: 'Ele úlgiler joq' },
  addTemplatesHint: { en: 'Add templates from the Templates tab.', ru: 'Добавьте шаблоны во вкладке Шаблоны.', uz: 'Shablonlar bo‘limidan shablon qo‘shing.', kaa: 'Úlgiler bóliminen úlgi qosıń.' },
  noUsers: { en: 'No users yet', ru: 'Пока нет пользователей', uz: 'Hali foydalanuvchilar yo‘q', kaa: 'Ele paydalanıwshılar joq' },
  usersHint: { en: 'Users appear here when they submit the contact form.', ru: 'Пользователи появятся здесь после отправки формы контакта.', uz: 'Foydalanuvchilar aloqa formasini yuborganda shu yerda ko‘rinadi.', kaa: 'Paydalanıwshılar baylanıs formasın jiberse, bul jerde kórinedi.' },
  name: { en: 'Name', ru: 'Имя', uz: 'Ism', kaa: 'At' },
  email: { en: 'Email', ru: 'Email', uz: 'Email', kaa: 'Email' },
  messages: { en: 'Messages', ru: 'Сообщения', uz: 'Xabarlar', kaa: 'Xabarlar' },
  lastContact: { en: 'Last Contact', ru: 'Последний контакт', uz: 'Oxirgi aloqa', kaa: 'Aqırǵı baylanıs' },
  addNewItem: { en: 'Add New Item', ru: 'Добавить новый элемент', uz: 'Yangi element qo‘shish', kaa: 'Jańa element qosıw' },
  editItem: { en: 'Edit Item', ru: 'Редактировать элемент', uz: 'Elementni tahrirlash', kaa: 'Elementti ózgertiw' },
  saveItem: { en: 'Save Item', ru: 'Сохранить элемент', uz: 'Elementni saqlash', kaa: 'Elementni saqlaw' },
  updateItem: { en: 'Update Item', ru: 'Обновить элемент', uz: 'Elementni yangilash', kaa: 'Elementti jańalaw' },
  addFeedback: { en: 'Add Feedback', ru: 'Добавить отзыв', uz: 'Sharh qo‘shish', kaa: 'Pikir qosıw' },
  editFeedback: { en: 'Edit Feedback', ru: 'Редактировать отзыв', uz: 'Sharhni tahrirlash', kaa: 'Pikirdi ózgertiw' },
  saveFeedback: { en: 'Save Feedback', ru: 'Сохранить отзыв', uz: 'Sharhni saqlash', kaa: 'Pikirdi saqlaw' },
  updateFeedback: { en: 'Update Feedback', ru: 'Обновить отзыв', uz: 'Sharhni yangilash', kaa: 'Pikirdi jańalaw' },
  addProgram: { en: 'Add Learning Program', ru: 'Добавить учебную программу', uz: 'O‘quv dasturini qo‘shish', kaa: 'Oqıw programmasın qosıw' },
  editProgram: { en: 'Edit Learning Program', ru: 'Редактировать учебную программу', uz: 'O‘quv dasturini tahrirlash', kaa: 'Oqıw programmasın ózgertiw' },
  saveProgram: { en: 'Save Program', ru: 'Сохранить программу', uz: 'Dasturni saqlash', kaa: 'Programmanı saqlaw' },
  updateProgram: { en: 'Update Program', ru: 'Обновить программу', uz: 'Dasturni yangilash', kaa: 'Programmanı jańalaw' },
  addTemplate: { en: 'Add Template', ru: 'Добавить шаблон', uz: 'Shablon qo‘shish', kaa: 'Úlgi qosıw' },
  editTemplate: { en: 'Edit Template', ru: 'Редактировать шаблон', uz: 'Shablonni tahrirlash', kaa: 'Úlgini ózgertiw' },
  saveTemplate: { en: 'Save Template', ru: 'Сохранить шаблон', uz: 'Shablonni saqlash', kaa: 'Úlgini saqlaw' },
  updateTemplate: { en: 'Update Template', ru: 'Обновить шаблон', uz: 'Shablonni yangilash', kaa: 'Úlgini jańalaw' },
  deleteContactConfirm: { en: 'Delete this contact message?', ru: 'Удалить это контактное сообщение?', uz: 'Bu aloqa xabarini o‘chirish?', kaa: 'Bul baylanıs xabarın óshiriw kerek pe?' },
  deleteItemConfirm: { en: 'Delete this item?', ru: 'Удалить этот элемент?', uz: 'Bu elementni o‘chirish?', kaa: 'Bul elementti óshiriw kerek pe?' },
  deleteFeedbackConfirm: { en: 'Delete this feedback?', ru: 'Удалить этот отзыв?', uz: 'Bu sharhni o‘chirish?', kaa: 'Bul pikirdi óshiriw kerek pe?' },
  deleteLearningConfirm: { en: 'Delete this learning item?', ru: 'Удалить этот учебный материал?', uz: 'Bu o‘quv materialini o‘chirish?', kaa: 'Bul oqıw materialın óshiriw kerek pe?' },
  deleteTemplateConfirm: { en: 'Delete this template?', ru: 'Удалить этот шаблон?', uz: 'Bu shablonni o‘chirish?', kaa: 'Bul úlgini óshiriw kerek pe?' },
  noContactsToExport: { en: 'No contacts to export.', ru: 'Нет контактов для экспорта.', uz: 'Eksport qilish uchun kontaktlar yo‘q.', kaa: 'Eksport etiw ushın baylanıslar joq.' },
  failedUpdateStatus: { en: 'Failed to update status: ', ru: 'Не удалось обновить статус: ', uz: 'Statusni yangilab bo‘lmadi: ', kaa: 'Status jańalaw múmkin bolmadı: ' },
  failedDelete: { en: 'Failed to delete: ', ru: 'Не удалось удалить: ', uz: 'O‘chirib bo‘lmadi: ', kaa: 'Óshiriw múmkin bolmadı: ' },
  errorLoadingItems: { en: 'Error loading items', ru: 'Ошибка загрузки элементов', uz: 'Elementlarni yuklashda xatolik', kaa: 'Elementlerdi júklewde qátelik' },
  fillTitleValue: { en: 'Please fill in both title and value.', ru: 'Пожалуйста, заполните название и значение.', uz: 'Iltimos, sarlavha va qiymatni to‘ldiring.', kaa: 'Iltimas, ataw hám qıymattı toltırıń.' },
  fillFeedbackFields: { en: 'Please fill in all feedback fields.', ru: 'Пожалуйста, заполните все поля отзыва.', uz: 'Iltimos, sharhning barcha maydonlarini to‘ldiring.', kaa: 'Iltimas, pikir maydanlarınıń barlıǵın toltırıń.' },
  fillLearningFields: { en: 'Please fill in title, format, and date.', ru: 'Пожалуйста, заполните название, формат и дату.', uz: 'Iltimos, sarlavha, format va sanani to‘ldiring.', kaa: 'Iltimas, ataw, format hám kúnin toltırıń.' },
  fillTemplateFields: { en: 'Please fill in all required template fields.', ru: 'Пожалуйста, заполните все обязательные поля шаблона.', uz: 'Iltimos, shablonning barcha majburiy maydonlarini to‘ldiring.', kaa: 'Iltimas, úlginiń barlıq májbúriy maydanларын toltırıń.' },
  sectionNowVisible: { en: 'Section is now visible', ru: 'Раздел теперь виден', uz: 'Bo‘lim endi ko‘rinadi', kaa: 'Bólim endi kórinedi' },
  sectionNowHidden: { en: 'Section is now hidden', ru: 'Раздел теперь скрыт', uz: 'Bo‘lim endi yashirildi', kaa: 'Bólim endi jasırıldı' }
};

function t(key) {
  return (uiText[key] && (uiText[key][currentLanguage] || uiText[key].en)) || key;
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;

  const langToggle = document.getElementById('langToggle');
  const langNames = { en: 'English', ru: 'Русский', uz: "O'zbekcha", kaa: 'Қарақалпақша' };
  if (langToggle) langToggle.textContent = langNames[lang];

  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('active');

  document.querySelectorAll('[data-en]').forEach((el) => {
    if (el.id === 'adminUser') return;
    const attr = `data-${lang}`;
    if (!el.hasAttribute(attr)) return;
    const value = el.getAttribute(attr);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const phAttr = `data-${lang}-placeholder`;
      if (el.hasAttribute(phAttr)) el.placeholder = el.getAttribute(phAttr);
    } else {
      el.textContent = value;
    }
  });
  setAdminWelcome();
  refreshActiveTab();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}

window.setLanguage = setLanguage;

function setAdminWelcome() {
  const adminUser = localStorage.getItem('adminUser') || 'Admin';
  const adminUserEl = document.getElementById('adminUser');
  if (adminUserEl) adminUserEl.textContent = `${t('welcome')}, ${adminUser}`;
}

function refreshActiveTab() {
  const active = document.querySelector('.nav-btn.active');
  if (active) switchTab(active.dataset.tab);
}

let allContacts = [];
let contactFilters = { search: '', from: '', to: '', sort: 'date_desc' };

async function loadContacts() {
  const list = document.getElementById('contactsList');
  list.innerHTML = `<div class="loading">${t('loadingContacts')}</div>`;

  try {
    if (false) { // local-auth removed
      allContacts = getStoredItems('siteContacts');
      const filtered = filterContacts(allContacts);
      displayContactSummary(filtered, allContacts);
      displayContacts(filtered);
      return;
    }

    const res = await fetch(`${API_BASE}/api/v1/admin/contacts`, {
      headers: authHeaders()
    });

    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    allContacts = await res.json();
    const filtered = filterContacts(allContacts);
    displayContactSummary(filtered, allContacts);
    displayContacts(filtered);
  } catch (err) {
    console.error('loadContacts error:', err);
    allContacts = getStoredItems('siteContacts');
    const filtered = filterContacts(allContacts);
    displayContactSummary(filtered, allContacts);
    displayContacts(filtered);
  }
}

function filterContacts(contacts) {
  let filtered = contacts.slice();

  if (contactFilters.search) {
    const q = contactFilters.search.toLowerCase();
    filtered = filtered.filter(c =>
      `${c.firstName} ${c.lastName} ${c.email} ${c.message}`.toLowerCase().includes(q)
    );
  }
  if (contactFilters.from) {
    const from = new Date(contactFilters.from);
    filtered = filtered.filter(c => new Date(c.createdAt) >= from);
  }
  if (contactFilters.to) {
    const to = new Date(contactFilters.to);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter(c => new Date(c.createdAt) <= to);
  }

  return filtered.sort((a, b) => {
    if (contactFilters.sort === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
    if (contactFilters.sort === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
    const na = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nb = `${b.firstName} ${b.lastName}`.toLowerCase();
    return contactFilters.sort === 'name_asc' ? na.localeCompare(nb) : nb.localeCompare(na);
  });
}

function displayContactSummary(filtered, all) {
  document.getElementById('totalContacts').textContent = all.length;
  document.getElementById('uniqueSenders').textContent = new Set(all.map(c => c.email)).size;
  document.getElementById('recentContacts').textContent = all.filter(c => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return new Date(c.createdAt) >= cutoff;
  }).length;
  const latest = all.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  document.getElementById('latestContact').textContent = latest
    ? new Date(latest.createdAt).toLocaleDateString() : '—';
}

function displayContacts(contacts) {
  const list = document.getElementById('contactsList');
  if (!contacts.length) {
    list.innerHTML = `<div class="empty-state"><h3>${t('noContacts')}</h3><p>${t('adjustFilters')}</p></div>`;
    return;
  }

  const ALLOWED_STATUSES = new Set(['NEW', 'READ', 'CLOSED']);
  list.innerHTML = contacts.map(c => {
    const safeId  = parseInt(c.id, 10);
    const safeStatus = ALLOWED_STATUSES.has(c.status) ? c.status : 'NEW';
    return `
    <div class="contact-card list-card">
      <div class="contact-header">
        <div>
          <div class="contact-name">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</div>
          <div class="contact-email">${escapeHtml(c.email)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap">
          <span class="status-badge status-${safeStatus}">${escapeHtml(safeStatus)}</span>
          <span class="timestamp">${new Date(c.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <p class="contact-message">${escapeHtml(c.message)}</p>
      <div class="contact-footer">
        <button onclick="updateContactStatus(${safeId},'READ')" class="soft-btn">${t('markRead')}</button>
        <button onclick="updateContactStatus(${safeId},'CLOSED')" class="soft-btn">${t('close')}</button>
        <button onclick="deleteContact(${safeId})" class="soft-btn" style="color:var(--danger);border-color:var(--danger)">${t('delete')}</button>
      </div>
    </div>`;
  }).join('');
}

async function updateContactStatus(id, status) {
  if (false) { // local-auth removed
    const contacts = getStoredItems('siteContacts');
    const idx = contacts.findIndex(c => c.id === id);
    if (idx !== -1) contacts[idx] = { ...contacts[idx], status };
    localStorage.setItem('siteContacts', JSON.stringify(contacts));
    await loadContacts();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/contacts/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    await loadContacts();
  } catch (err) {
    alert(t('failedUpdateStatus') + err.message);
  }
}

async function deleteContact(id) {
  if (!confirm(t('deleteContactConfirm'))) return;
  if (false) { // local-auth removed
    const contacts = getStoredItems('siteContacts').filter(c => c.id !== id);
    localStorage.setItem('siteContacts', JSON.stringify(contacts));
    await loadContacts();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    await loadContacts();
  } catch (err) {
    alert(t('failedDelete') + err.message);
  }
}

function updateContactFilters() {
  contactFilters.search = document.getElementById('contactSearch').value.trim().toLowerCase();
  contactFilters.from = document.getElementById('contactFromDate').value;
  contactFilters.to = document.getElementById('contactToDate').value;
  contactFilters.sort = document.getElementById('contactSort').value;
  const filtered = filterContacts(allContacts);
  displayContactSummary(filtered, allContacts);
  displayContacts(filtered);
}

function clearContactFilters() {
  contactFilters = { search: '', from: '', to: '', sort: 'date_desc' };
  document.getElementById('contactSearch').value = '';
  document.getElementById('contactFromDate').value = '';
  document.getElementById('contactToDate').value = '';
  document.getElementById('contactSort').value = 'date_desc';
  updateContactFilters();
}

function exportContactsToCSV() {
  const filtered = filterContacts(allContacts);
  if (!filtered.length) { alert(t('noContactsToExport')); return; }

  const headers = ['First Name', 'Last Name', 'Email', 'Message', 'Status', 'Date'];
  const rows = filtered.map(c => [
    `"${c.firstName}"`, `"${c.lastName}"`, `"${c.email}"`,
    `"${(c.message || '').replace(/"/g, '""')}"`,
    `"${c.status || ''}"`,
    `"${new Date(c.createdAt).toLocaleString()}"`
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getStoredItems(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (err) {
    return [];
  }
}

function readUploadedFile(inputId) {
  const input = document.getElementById(inputId);
  const file = input && input.files ? input.files[0] : null;
  if (!file) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadResults() {
  const list = document.getElementById('resultsList');
  list.innerHTML = `<div class="loading">${t('loadingItems')}</div>`;

  try {
    const results = JSON.parse(localStorage.getItem('siteResults') || '[]');
    displayResultsSummary(results);
    displayResults(results);
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><h3>${t('errorLoadingItems')}</h3></div>`;
  }
}

function displayResultsSummary(results) {
  const area = document.getElementById('resultsSummary');
  area.innerHTML = `
    <div class="summary-card small"><span class="summary-label">${t('totalItems')}</span><strong>${results.length}</strong></div>
    <div class="summary-card small"><span class="summary-label">${t('results')}</span><strong>${results.filter(i => i.type === 'result').length}</strong></div>
    <div class="summary-card small"><span class="summary-label">${t('achievements')}</span><strong>${results.filter(i => i.type === 'achievement').length}</strong></div>
  `;
}

function displayResults(results) {
  const list = document.getElementById('resultsList');
  if (!results.length) {
    list.innerHTML = `<div class="empty-state"><h3>${t('noResults')}</h3><p>${t('addResultHint')}</p></div>`;
    return;
  }

  list.innerHTML = results.map(item => {
    const safeId = parseInt(item.id, 10);
    return `
    <div class="result-card list-card">
      <div>
        <div class="result-type-badge">${escapeHtml(item.type === 'achievement' ? t('achievement') : t('result'))}</div>
        <div class="result-title">${escapeHtml(item.title)}</div>
        <div class="result-value">${escapeHtml(item.value)}</div>
        ${item.description ? `<div class="result-description">${escapeHtml(item.description)}</div>` : ''}
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;flex-shrink:0">
        <button class="soft-btn" onclick="editItem(${safeId})">${t('edit')}</button>
        <button class="soft-btn" onclick="deleteItem(${safeId})" style="color:var(--danger);border-color:var(--danger)">${t('delete')}</button>
      </div>
    </div>
  `}).join('');
}

function openAddItemModal() {
  editingItemId = null;
  document.getElementById('addResultForm').reset();
  document.querySelector('#addResultModal .save-btn').textContent = t('saveItem');
  document.querySelector('#addResultModal .modal-header h3').textContent = t('addNewItem');
  document.getElementById('addResultModal').classList.add('active');
}

function closeModalWindow() {
  document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
}

function handleResultFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('resultTitle').value.trim();
  const value = document.getElementById('resultValue').value.trim();
  const description = document.getElementById('resultDescription').value.trim();
  const type = document.getElementById('itemType').value;

  if (!title || !value) { alert(t('fillTitleValue')); return; }

  const results = JSON.parse(localStorage.getItem('siteResults') || '[]');
  if (editingItemId !== null) {
    const idx = results.findIndex(i => i.id === editingItemId);
    if (idx !== -1) results[idx] = { ...results[idx], title, value, description, type };
  } else {
    results.push({ id: Date.now(), title, value, description, type, createdAt: new Date().toISOString() });
  }
  localStorage.setItem('siteResults', JSON.stringify(results));
  closeModalWindow();
  loadResults();
}

function editItem(itemId) {
  const results = JSON.parse(localStorage.getItem('siteResults') || '[]');
  const item = results.find(r => r.id === itemId);
  if (!item) return;
  editingItemId = itemId;
  document.getElementById('itemType').value = item.type || 'result';
  document.getElementById('resultTitle').value = item.title;
  document.getElementById('resultValue').value = item.value;
  document.getElementById('resultDescription').value = item.description || '';
  document.querySelector('#addResultModal .save-btn').textContent = t('updateItem');
  document.querySelector('#addResultModal .modal-header h3').textContent = t('editItem');
  document.getElementById('addResultModal').classList.add('active');
}

function deleteItem(itemId) {
  if (!confirm(t('deleteItemConfirm'))) return;
  const results = JSON.parse(localStorage.getItem('siteResults') || '[]');
  localStorage.setItem('siteResults', JSON.stringify(results.filter(i => i.id !== itemId)));
  loadResults();
}

// ============================================================
// FEEDBACKS — Admin panel, uses backend API with JWT
// ============================================================
async function loadFeedbacks() {
  const list = document.getElementById('feedbackList');
  const summary = document.getElementById('feedbackSummary');
  list.innerHTML = `<div class="loading">${t('loadingItems')}</div>`;

  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/feedbacks`, {
      headers: authHeaders()
    });
    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const feedbacks = await res.json();
    renderFeedbackList(feedbacks, list, summary);
  } catch (err) {
    console.error('loadFeedbacks error:', err);
    list.innerHTML = `<div class="empty-state"><h3>${t('errorLoadingItems')}</h3></div>`;
  }
}

function renderFeedbackList(feedbacks, list, summary) {
  summary.innerHTML = `
    <div class="summary-card small"><span class="summary-label">${t('totalFeedback')}</span><strong>${feedbacks.length}</strong></div>
  `;

  if (!feedbacks.length) {
    list.innerHTML = `<div class="empty-state"><h3>${t('noFeedback')}</h3><p>${t('addFeedbackHint')}</p></div>`;
    return;
  }

  list.innerHTML = feedbacks.map(item => {
    const safeId = parseInt(item.id, 10);
    return `
    <div class="feedback-card list-card">
      <div>
        <div class="feedback-author">${escapeHtml(item.name)}</div>
        <div class="feedback-meta">${escapeHtml(item.role || '')} — ${escapeHtml(item.organization || '')}</div>
        <div class="feedback-text">${escapeHtml(item.message)}</div>
        ${item.rating ? `<div class="feedback-meta">⭐ ${parseInt(item.rating, 10)}/5</div>` : ''}
        <div class="feedback-meta" style="font-size:0.75rem;color:var(--muted)">${item.published ? '✅ Published' : '🔒 Hidden'}</div>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;flex-shrink:0">
        <button class="soft-btn" onclick="editFeedback(${safeId})">${t('edit')}</button>
        <button class="soft-btn" onclick="deleteFeedback(${safeId})" style="color:var(--danger);border-color:var(--danger)">${t('delete')}</button>
      </div>
    </div>`;
  }).join('');
}

async function openAddFeedbackModal() {
  editingFeedbackId = null;
  document.getElementById('addFeedbackForm').reset();
  document.querySelector('#addFeedbackModal .save-btn').textContent = t('saveFeedback');
  document.querySelector('#addFeedbackModal .modal-header h3').textContent = t('addFeedback');
  document.getElementById('addFeedbackModal').classList.add('active');
}

async function handleFeedbackFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('feedbackName').value.trim();
  const role = document.getElementById('feedbackRole').value.trim();
  const organization = document.getElementById('feedbackOrg').value.trim();
  const message = document.getElementById('feedbackMessage').value.trim();

  if (!name || !message) {
    alert(t('fillFeedbackFields'));
    return;
  }

  const payload = { name, role, organization, message, published: true };

  try {
    let res;
    if (editingFeedbackId !== null) {
      res = await fetch(`${API_BASE}/api/v1/admin/feedbacks/${editingFeedbackId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API_BASE}/api/v1/admin/feedbacks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    }
    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    closeModalWindow();
    await loadFeedbacks();
  } catch (err) {
    alert(t('failedDelete') + err.message);
  }
}

async function editFeedback(itemId) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/feedbacks`, { headers: authHeaders() });
    if (!res.ok) throw new Error();
    const feedbacks = await res.json();
    const item = feedbacks.find(f => f.id === itemId);
    if (!item) return;
    editingFeedbackId = itemId;
    document.getElementById('feedbackName').value = item.name;
    document.getElementById('feedbackRole').value = item.role || '';
    document.getElementById('feedbackOrg').value = item.organization || '';
    document.getElementById('feedbackMessage').value = item.message;
    document.querySelector('#addFeedbackModal .save-btn').textContent = t('updateFeedback');
    document.querySelector('#addFeedbackModal .modal-header h3').textContent = t('editFeedback');
    document.getElementById('addFeedbackModal').classList.add('active');
  } catch (err) {
    alert({en:'Could not load feedback for editing',ru:'Не удалось загрузить отзыв для редактирования',uz:'Tahrirlash uchun fikrni yuklashning imkoni yo\'lmadi',kaa:'Redaktorlaw ushın pikirdi júklew múmkin bolmadı'}[localStorage.getItem('language')||'ru']);
  }
}

async function deleteFeedback(itemId) {
  if (!confirm(t('deleteFeedbackConfirm'))) return;
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/feedbacks/${itemId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    await loadFeedbacks();
  } catch (err) {
    alert(t('failedDelete') + err.message);
  }
}

// ============================================================
// LEARNING — Admin panel, uses backend API with JWT
// ============================================================
async function loadLearning() {
  const list = document.getElementById('learningList');
  const summary = document.getElementById('learningSummary');
  list.innerHTML = `<div class="loading">${t('loadingItems')}</div>`;

  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/learning`, {
      headers: authHeaders()
    });
    if (handleAuthError(res)) return;
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const programs = await res.json();
    renderLearningList(programs, list, summary);
  } catch (err) {
    console.error('loadLearning error:', err);
    list.innerHTML = `<div class="empty-state"><h3>${t('errorLoadingItems')}</h3></div>`;
  }
}

function renderLearningList(programs, list, summary) {
  summary.innerHTML = `
    <div class="summary-card small"><span class="summary-label">${t('totalPrograms')}</span><strong>${programs.length}</strong></div>
    <div class="summary-card small"><span class="summary-label">${t('courses')}</span><strong>${programs.filter(item => item.format === 'course').length}</strong></div>
    <div class="summary-card small"><span class="summary-label">${t('webinars')}</span><strong>${programs.filter(item => item.format === 'webinar').length}</strong></div>
  `;

  if (!programs.length) {
    list.innerHTML = `<div class="empty-state"><h3>${t('noPrograms')}</h3><p>${t('addProgramsHint')}</p></div>`;
    return;
  }

  list.innerHTML = programs.map(item => {
    const safeId = parseInt(item.id, 10);
    return `
    <div class="learning-card list-card">
      <div>
        <div class="learning-format-badge">${escapeHtml(item.format === 'course' ? t('course') : t('webinar'))}</div>
        <div class="learning-title">${escapeHtml(item.title)}</div>
        ${item.description ? `<div class="learning-description">${escapeHtml(item.description)}</div>` : ''}
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;flex-shrink:0">
        <button class="soft-btn" onclick="editLearning(${safeId})">${t('edit')}</button>
        <button class="soft-btn" onclick="deleteLearning(${safeId})" style="color:var(--danger);border-color:var(--danger)">${t('delete')}</button>
      </div>
    </div>`;
  }).join('');
}

// Заглушки для функций редактирования и удаления обучающих материалов, чтобы избежать неопределенных вызовов
function editLearning(id) {
  console.log("Редактирование элемента обучения с id:", id);
}

function deleteLearning(id) {
  console.log("Удаление элемента обучения с id:", id);
}
