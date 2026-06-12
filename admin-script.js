/* ============================================================
   MK Business Corp — ADMIN PANEL SCRIPT  (DEMO / MOCK BUILD)
   ------------------------------------------------------------
   Полностью автономная админка. НЕТ запросов к бэкенду и БД.
   Все данные — фейковые массивы в оперативной памяти браузера.
   Кнопки «Добавить / Редактировать / Удалить» реально меняют
   эти массивы и перерисовывают интерфейс + показывают красивые
   всплывающие уведомления (toast).
   ============================================================ */

/* ---------- утилиты ---------- */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getToken() {
  return sessionStorage.getItem('adminToken') || null;
}

let currentLanguage = localStorage.getItem('language') || 'en';
let editingItemId = null;
let editingFeedbackId = null;
let editingLearningId = null;
let editingTemplateId = null;

/* ============================================================
   ЛОКАЛИЗАЦИЯ
   ============================================================ */
const uiText = {
  welcome: { en: 'Welcome', ru: 'Добро пожаловать', uz: 'Xush kelibsiz', kaa: 'Qosh keldiniz' },
  loadingContacts: { en: 'Loading contacts...', ru: 'Загрузка контактов...', uz: 'Yuklanmoqda...', kaa: 'Júklenbekte...' },
  loadingItems: { en: 'Loading items...', ru: 'Загрузка...', uz: 'Yuklanmoqda...', kaa: 'Júklenbekte...' },
  totalItems: { en: 'Total Items', ru: 'Всего элементов', uz: 'Jami elementlar', kaa: 'Jámi elementler' },
  results: { en: 'Results', ru: 'Результаты', uz: 'Natijalar', kaa: 'Netijeler' },
  achievements: { en: 'Achievements', ru: 'Достижения', uz: 'Yutuqlar', kaa: 'Jetiskenlikler' },
  totalFeedback: { en: 'Total Feedback', ru: 'Всего отзывов', uz: 'Jami sharhlar', kaa: 'Jámi pikirler' },
  totalPrograms: { en: 'Total Programs', ru: 'Всего программ', uz: 'Jami dasturlar', kaa: 'Jámi programmalar' },
  courses: { en: 'Courses', ru: 'Курсы', uz: 'Kurslar', kaa: 'Kurslar' },
  webinars: { en: 'Webinars', ru: 'Вебинары', uz: 'Vebinarlar', kaa: 'Vebinarlar' },
  totalTemplates: { en: 'Total Templates', ru: 'Всего шаблонов', uz: 'Jami shablonlar', kaa: 'Jámi úlgiler' },
  published: { en: 'Published', ru: 'Опубликовано', uz: 'Chop etilgan', kaa: 'Jariyalanǵan' },
  totalUsers: { en: 'Total Users', ru: 'Всего пользователей', uz: 'Jami foydalanuvchilar', kaa: 'Jámi paydalanıwshılar' },
  edit: { en: 'Edit', ru: 'Редактировать', uz: 'Tahrirlash', kaa: 'Ózgertiw' },
  delete: { en: 'Delete', ru: 'Удалить', uz: 'O‘chirish', kaa: 'Óshiriw' },
  markRead: { en: 'Mark Read', ru: 'Прочитано', uz: 'O‘qilgan', kaa: 'Oqıldı' },
  close: { en: 'Close', ru: 'Закрыть', uz: 'Yopish', kaa: 'Jabıw' },
  result: { en: 'Result', ru: 'Результат', uz: 'Natija', kaa: 'Netije' },
  achievement: { en: 'Achievement', ru: 'Достижение', uz: 'Yutuq', kaa: 'Jetiskenlik' },
  course: { en: 'Course', ru: 'Курс', uz: 'Kurs', kaa: 'Kurs' },
  webinar: { en: 'Webinar', ru: 'Вебинар', uz: 'Vebinar', kaa: 'Vebinar' },
  noContacts: { en: 'No contact messages found', ru: 'Сообщения не найдены', uz: 'Xabarlar topilmadi', kaa: 'Xabarlar tabılmadı' },
  adjustFilters: { en: 'Try adjusting your filters.', ru: 'Попробуйте изменить фильтры.', uz: 'Filtrlarni o‘zgartiring.', kaa: 'Súzgishlerdi ózgertiń.' },
  noResults: { en: 'No results yet', ru: 'Пока нет результатов', uz: 'Hali natijalar yo‘q', kaa: 'Ele netijeler joq' },
  addResultHint: { en: 'Use Add Item to create one.', ru: 'Нажмите «Добавить».', uz: '«Qo‘shish» tugmasini bosing.', kaa: '«Qosıw» túymesin basıń.' },
  noFeedback: { en: 'No feedback yet', ru: 'Пока нет отзывов', uz: 'Hali sharhlar yo‘q', kaa: 'Ele pikirler joq' },
  addFeedbackHint: { en: 'Add client reviews from the Feedback tab.', ru: 'Добавьте отзывы клиентов.', uz: 'Mijoz sharhlarini qo‘shing.', kaa: 'Klient pikirlerin qosıń.' },
  noPrograms: { en: 'No programs yet', ru: 'Пока нет программ', uz: 'Hali dasturlar yo‘q', kaa: 'Ele programmalar joq' },
  addProgramsHint: { en: 'Add courses or webinars.', ru: 'Добавьте курсы или вебинары.', uz: 'Kurs yoki vebinar qo‘shing.', kaa: 'Kurs yamasa vebinar qosıń.' },
  noTemplates: { en: 'No templates yet', ru: 'Пока нет шаблонов', uz: 'Hali shablonlar yo‘q', kaa: 'Ele úlgiler joq' },
  addTemplatesHint: { en: 'Add templates from the Templates tab.', ru: 'Добавьте шаблоны.', uz: 'Shablon qo‘shing.', kaa: 'Úlgi qosıń.' },
  noUsers: { en: 'No users yet', ru: 'Пока нет пользователей', uz: 'Hali foydalanuvchilar yo‘q', kaa: 'Ele paydalanıwshılar joq' },
  usersHint: { en: 'Users appear here when they submit the contact form.', ru: 'Пользователи появляются после отправки формы.', uz: 'Forma yuborilgach paydo bo‘ladi.', kaa: 'Forma jiberilgennen keyin kórinedi.' },
  name: { en: 'Name', ru: 'Имя', uz: 'Ism', kaa: 'At' },
  email: { en: 'Email', ru: 'Email', uz: 'Email', kaa: 'Email' },
  messages: { en: 'Messages', ru: 'Сообщения', uz: 'Xabarlar', kaa: 'Xabarlar' },
  lastContact: { en: 'Last Contact', ru: 'Последний контакт', uz: 'Oxirgi aloqa', kaa: 'Aqırǵı baylanıs' },
  addNewItem: { en: 'Add New Item', ru: 'Добавить запись', uz: 'Yangi yozuv', kaa: 'Jańa jazıw' },
  editItem: { en: 'Edit Item', ru: 'Редактировать запись', uz: 'Yozuvni tahrirlash', kaa: 'Jazıwdı ózgertiw' },
  saveItem: { en: 'Save Item', ru: 'Сохранить', uz: 'Saqlash', kaa: 'Saqlaw' },
  updateItem: { en: 'Update Item', ru: 'Обновить', uz: 'Yangilash', kaa: 'Jańalaw' },
  addFeedback: { en: 'Add Feedback', ru: 'Добавить отзыв', uz: 'Sharh qo‘shish', kaa: 'Pikir qosıw' },
  editFeedback: { en: 'Edit Feedback', ru: 'Редактировать отзыв', uz: 'Sharhni tahrirlash', kaa: 'Pikirdi ózgertiw' },
  saveFeedback: { en: 'Save Feedback', ru: 'Сохранить отзыв', uz: 'Sharhni saqlash', kaa: 'Pikirdi saqlaw' },
  updateFeedback: { en: 'Update Feedback', ru: 'Обновить отзыв', uz: 'Sharhni yangilash', kaa: 'Pikirdi jańalaw' },
  addProgram: { en: 'Add Learning Program', ru: 'Добавить программу', uz: 'Dastur qo‘shish', kaa: 'Programma qosıw' },
  editProgram: { en: 'Edit Learning Program', ru: 'Редактировать программу', uz: 'Dasturni tahrirlash', kaa: 'Programmanı ózgertiw' },
  saveProgram: { en: 'Save Program', ru: 'Сохранить', uz: 'Saqlash', kaa: 'Saqlaw' },
  updateProgram: { en: 'Update Program', ru: 'Обновить', uz: 'Yangilash', kaa: 'Jańalaw' },
  addTemplate: { en: 'Add Template', ru: 'Добавить шаблон', uz: 'Shablon qo‘shish', kaa: 'Úlgi qosıw' },
  editTemplate: { en: 'Edit Template', ru: 'Редактировать шаблон', uz: 'Shablonni tahrirlash', kaa: 'Úlgini ózgertiw' },
  saveTemplate: { en: 'Save Template', ru: 'Сохранить шаблон', uz: 'Shablonni saqlash', kaa: 'Úlgini saqlaw' },
  updateTemplate: { en: 'Update Template', ru: 'Обновить шаблон', uz: 'Shablonni yangilash', kaa: 'Úlgini jańalaw' },
  deleteConfirm: { en: 'Delete this item?', ru: 'Удалить эту запись?', uz: 'Ushbu yozuvni o‘chirilsinmi?', kaa: 'Bul jazıwdı óshiriw kerek pe?' },
  fillRequired: { en: 'Please fill in the required fields.', ru: 'Заполните обязательные поля.', uz: 'Majburiy maydonlarni to‘ldiring.', kaa: 'Májbúriy maydanlardı toltırıń.' },
  noContactsToExport: { en: 'No contacts to export.', ru: 'Нет контактов для экспорта.', uz: 'Eksport uchun kontaktlar yo‘q.', kaa: 'Eksport ushın baylanıslar joq.' },
  savedOk: { en: 'Saved successfully', ru: 'Успешно сохранено', uz: 'Muvaffaqiyatli saqlandi', kaa: 'Tabıslı saqlandı' },
  deletedOk: { en: 'Deleted', ru: 'Удалено', uz: 'O‘chirildi', kaa: 'Óshirildi' },
  refreshedOk: { en: 'Refreshed', ru: 'Обновлено', uz: 'Yangilandi', kaa: 'Jańalandı' },
  statusUpdated: { en: 'Status updated', ru: 'Статус обновлён', uz: 'Status yangilandi', kaa: 'Status jańalandı' },
  exportedOk: { en: 'CSV exported', ru: 'CSV экспортирован', uz: 'CSV eksport qilindi', kaa: 'CSV eksport etildi' },
  sectionNowVisible: { en: 'Section is now visible', ru: 'Раздел теперь виден', uz: 'Bo‘lim ko‘rinadi', kaa: 'Bólim kórinedi' },
  sectionNowHidden: { en: 'Section is now hidden', ru: 'Раздел скрыт', uz: 'Bo‘lim yashirildi', kaa: 'Bólim jasırıldı' },
  visible: { en: 'Visible', ru: 'Виден', uz: 'Ko‘rinadi', kaa: 'Kórinedi' },
  hidden: { en: 'Hidden', ru: 'Скрыт', uz: 'Yashirilgan', kaa: 'Jasırılǵan' },
  fileSelected: { en: 'File selected: ', ru: 'Файл выбран: ', uz: 'Fayl tanlandi: ', kaa: 'Fayl tańlandı: ' }
};

function t(key) {
  return (uiText[key] && (uiText[key][currentLanguage] || uiText[key].en)) || key;
}

function pick(obj) {
  if (!obj) return '';
  return obj[currentLanguage] || obj.ru || obj.en || obj.uz || '';
}

/* ============================================================
   ФЕЙКОВЫЕ ДАННЫЕ В ПАМЯТИ
   ============================================================ */
let allContacts = [
  { id: 1, firstName: 'Азиз', lastName: 'Каримов', email: 'aziz.karimov@mail.uz', message: 'Здравствуйте! Хочу заказать бизнес-план для швейного цеха. Сколько это стоит?', status: 'NEW', createdAt: new Date(Date.now() - 2 * 864e5).toISOString() },
  { id: 2, firstName: 'Дилноза', lastName: 'Юсупова', email: 'dilnoza.y@gmail.com', message: 'Интересует консультация по грантам для малого бизнеса в Нукусе.', status: 'READ', createdAt: new Date(Date.now() - 5 * 864e5).toISOString() },
  { id: 3, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', message: 'Looking for a partnership opportunity in Karakalpakstan. Please contact me.', status: 'NEW', createdAt: new Date(Date.now() - 1 * 864e5).toISOString() },
  { id: 4, firstName: 'Сардор', lastName: 'Рахимов', email: 'sardor.r@inbox.uz', message: 'Нужен шаблон бизнес-плана для птицеводческого хозяйства.', status: 'CLOSED', createdAt: new Date(Date.now() - 9 * 864e5).toISOString() }
];

let results = [
  { id: 101, type: 'result', title: 'Реализованных проектов', value: '120+', description: 'Бизнес-планы и консалтинг для предпринимателей региона.', createdAt: new Date().toISOString() },
  { id: 102, type: 'result', title: 'Привлечено грантов', value: '$450K', description: 'Сопровождение грантовых заявок для МСБ.', createdAt: new Date().toISOString() },
  { id: 103, type: 'achievement', title: 'Лучшая консалтинговая компания', value: '2025', description: 'Региональная премия в сфере развития бизнеса.', createdAt: new Date().toISOString() }
];

let feedback = [
  { id: 201, name: 'Гулнора Сейтова', role: 'Директор', organization: 'ООО «Текстиль Нукус»', message: 'Отличная команда! Помогли составить бизнес-план и получить финансирование.', rating: 5, published: true, createdAt: new Date().toISOString() },
  { id: 202, name: 'Бахтиёр Аллаяров', role: 'Основатель', organization: 'Стартап AgroTech', message: 'Профессиональный подход к грантовым заявкам. Рекомендую.', rating: 5, published: true, createdAt: new Date().toISOString() },
  { id: 203, name: 'Малика Ниязова', role: 'Предприниматель', organization: 'Частный детский сад', message: 'Спасибо за подробную финансовую модель!', rating: 4, published: false, createdAt: new Date().toISOString() }
];

let learning = [
  { id: 301, title: 'Как написать бизнес-план за 7 дней', format: 'course', date: 'Май 2026', description: 'Пошаговый онлайн-курс для начинающих предпринимателей.', createdAt: new Date().toISOString() },
  { id: 302, title: 'Грантовое финансирование 2026', format: 'webinar', date: 'Апрель 2026', description: 'Вебинар о доступных грантах и условиях участия.', createdAt: new Date().toISOString() },
  { id: 303, title: 'Финансовое моделирование в Excel', format: 'course', date: 'Июнь 2026', description: 'Практический курс по финансовым расчётам.', createdAt: new Date().toISOString() }
];

/* Шаблоны хранятся «плоско», чтобы их было удобно редактировать в форме */
let templates = [
  { id: 1, title: 'Тикув цехини ташкиллаштириш', titleRu: 'Швейный цех: организация производства', titleEn: 'Sewing Workshop Business Plan', titleKaa: 'Tikiw cexin shólkemlestiríw', description: 'Готовый шаблон бизнес-плана для организации швейного цеха.', descriptionEn: 'Ready business plan template for a sewing workshop.', category: 'business', badge: 'DOC', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Хусусий болалар богчаси', titleRu: 'Частный детский сад', titleEn: 'Private Kindergarten Business Plan', titleKaa: 'Jeke bala baqsha', description: 'Бизнес-план для открытия частного детского сада.', descriptionEn: 'Business plan for a private kindergarten.', category: 'business', badge: 'DOC', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Паррандачилик хужалиги', titleRu: 'Птицеводческое хозяйство', titleEn: 'Poultry Farm Business Plan', titleKaa: 'Qusshılıq xojalıǵı', description: 'Полный шаблон бизнес-плана для птицеводческого хозяйства.', descriptionEn: 'Complete business plan for a poultry farm.', category: 'business', badge: 'DOC', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 4, title: 'Автомойка', titleRu: 'Автомойка: бизнес-план', titleEn: 'Car Wash Business Plan', titleKaa: 'Avtomoyqa biznes-jobası', description: 'Бизнес-план для открытия автомойки: оборудование и прогноз доходов.', descriptionEn: 'Business plan for a car wash.', category: 'business', badge: 'DOC', sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 5, title: 'Биогумус етиштириш', titleRu: 'Производство биогумуса', titleEn: 'Biohumus Production', titleKaa: 'Biogumus óndiriw', description: 'Шаблон бизнес-плана для производства биогумуса.', descriptionEn: 'Business plan template for biohumus production.', category: 'business', badge: 'DOC', sortOrder: 5, imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 6, title: 'Когоз салфетка ишлаб чикариш', titleRu: 'Производство бумажных салфеток', titleEn: 'Paper Napkin Production', titleKaa: 'Qағaz salfetka óndiriw', description: 'Бизнес-план для производства бумажных салфеток.', descriptionEn: 'Business plan for paper napkin production.', category: 'business', badge: 'DOC', sortOrder: 6, imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 7, title: 'Пластик махсулотлар ишлаб чикариш', titleRu: 'Производство пластиковых изделий', titleEn: 'Plastic Products Manufacturing', titleKaa: 'Plastik ónimlerin óndiriw', description: 'Полный бизнес-план для производства пластиковых изделий.', descriptionEn: 'Complete business plan for plastic products.', category: 'business', badge: 'DOC', sortOrder: 7, imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&q=80&auto=format&fit=crop', fileName: '', published: true, hasFile: false, createdAt: new Date().toISOString() },
  { id: 8, title: 'Чехол-полик тикиш цехини ташкиллаштириш', titleRu: 'Цех по пошиву чехлов и ковриков', titleEn: 'Car Cover & Mat Sewing Workshop', titleKaa: 'Qap-polıq tikiw cexin shólkemlestiríw', description: 'Бизнес-план для цеха по пошиву автомобильных чехлов и ковриков.', descriptionEn: 'Business plan for a car cover and mat sewing workshop.', category: 'business', badge: 'DOC', sortOrder: 8, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop', fileName: '', published: false, hasFile: false, createdAt: new Date().toISOString() }
];

let sections = [
  { key: 'hero', label: { en: 'Hero / Header', ru: 'Главный экран', uz: 'Bosh ekran', kaa: 'Bas ekran' }, visible: true },
  { key: 'services', label: { en: 'Services', ru: 'Услуги', uz: 'Xizmatlar', kaa: 'Qızmetler' }, visible: true },
  { key: 'about', label: { en: 'About', ru: 'О нас', uz: 'Biz haqimizda', kaa: 'Biz haqqında' }, visible: true },
  { key: 'feedback', label: { en: 'Feedback', ru: 'Отзывы', uz: 'Fikrlar', kaa: 'Pikirler' }, visible: true },
  { key: 'templates', label: { en: 'Templates', ru: 'Шаблоны', uz: 'Shablonlar', kaa: 'Úlgiler' }, visible: true },
  { key: 'articles', label: { en: 'Articles', ru: 'Статьи', uz: 'Maqolalar', kaa: 'Maqalalar' }, visible: true },
  { key: 'contact', label: { en: 'Contact', ru: 'Контакты', uz: 'Bog‘lanish', kaa: 'Baylanıs' }, visible: true }
];

let contactFilters = { search: '', from: '', to: '', sort: 'date_desc' };

/* ============================================================
   ЯЗЫК + ШАПКА
   ============================================================ */
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;

  const langNames = { en: 'English', ru: 'Русский', uz: "O'zbekcha", kaa: 'Қарақалпақша' };
  const langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.textContent = langNames[lang] || 'Language';

  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.remove('active');

  document.querySelectorAll('[data-en]').forEach((el) => {
    if (el.id === 'adminUser') return;
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

  setAdminWelcome();
  refreshActiveTab();
}
window.setLanguage = setLanguage;

function setAdminWelcome() {
  const adminUser = localStorage.getItem('username') || localStorage.getItem('adminUser') || 'Admin';
  const el = document.getElementById('adminUser');
  if (el) el.textContent = t('welcome') + ', ' + adminUser;
}

function refreshActiveTab() {
  const active = document.querySelector('.nav-btn.active');
  if (active && active.dataset.tab) switchTab(active.dataset.tab);
}

/* ============================================================
   TOAST
   ============================================================ */
function ensureToastStyles() {
  if (document.getElementById('mkToastStyles')) return;
  const style = document.createElement('style');
  style.id = 'mkToastStyles';
  style.textContent =
    '.mk-toast-wrap{position:fixed;top:1.25rem;right:1.25rem;z-index:99999;display:flex;flex-direction:column;gap:.6rem;max-width:360px}' +
    '.mk-toast{display:flex;align-items:flex-start;gap:.7rem;padding:1rem 1.1rem;border-radius:.75rem;background:#fff;color:#0f172a;' +
    'box-shadow:0 18px 48px rgba(2,12,40,.22);border:1px solid #e6ebf5;border-left:4px solid #16a34a;' +
    "font:500 .92rem/1.45 'Plus Jakarta Sans',system-ui,sans-serif;transform:translateX(120%);opacity:0;" +
    'transition:transform .35s cubic-bezier(.4,0,.2,1),opacity .35s}' +
    '.mk-toast.show{transform:translateX(0);opacity:1}' +
    '.mk-toast.err{border-left-color:#dc2626}.mk-toast.info{border-left-color:#0066ff}' +
    '.mk-toast-ico{flex:0 0 auto;font-size:1.1rem}.mk-toast-msg{flex:1}.mk-toast-title{font-weight:800;margin-bottom:.15rem}';
  document.head.appendChild(style);
}

function showToast(message, type, title) {
  ensureToastStyles();
  type = type || 'success';
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
  }, 3500);
}
window.showToast = showToast;

/* ============================================================
   ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
   ============================================================ */
function switchTab(tabId) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach((content) => {
    const match = content.id === tabId + 'Tab' || content.id === tabId;
    content.style.display = match ? 'block' : 'none';
    content.classList.toggle('active', match);
  });

  if (tabId === 'contacts') loadContacts();
  else if (tabId === 'results') loadResults();
  else if (tabId === 'feedback') loadFeedbacks();
  else if (tabId === 'templates') loadTemplates();
  else if (tabId === 'learning') loadLearning();
  else if (tabId === 'users') loadUsers();
  else if (tabId === 'sections') loadSections();
}
window.switchTab = switchTab;

function closeModalWindow() {
  document.querySelectorAll('.modal').forEach((m) => m.classList.remove('active'));
}
window.closeModalWindow = closeModalWindow;

/* ============================================================
   КОНТАКТЫ
   ============================================================ */
function loadContacts() {
  const list = document.getElementById('contactsList');
  if (list) list.innerHTML = '<div class="loading">' + t('loadingContacts') + '</div>';
  const filtered = filterContacts(allContacts);
  displayContactSummary(filtered, allContacts);
  displayContacts(filtered);
}

function filterContacts(contacts) {
  let filtered = contacts.slice();
  if (contactFilters.search) {
    const q = contactFilters.search.toLowerCase();
    filtered = filtered.filter((c) =>
      (c.firstName + ' ' + c.lastName + ' ' + c.email + ' ' + c.message).toLowerCase().indexOf(q) !== -1
    );
  }
  if (contactFilters.from) {
    const from = new Date(contactFilters.from);
    filtered = filtered.filter((c) => new Date(c.createdAt) >= from);
  }
  if (contactFilters.to) {
    const to = new Date(contactFilters.to);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((c) => new Date(c.createdAt) <= to);
  }
  return filtered.sort((a, b) => {
    if (contactFilters.sort === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
    if (contactFilters.sort === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
    const na = (a.firstName + ' ' + a.lastName).toLowerCase();
    const nb = (b.firstName + ' ' + b.lastName).toLowerCase();
    return contactFilters.sort === 'name_asc' ? na.localeCompare(nb) : nb.localeCompare(na);
  });
}

function displayContactSummary(filtered, all) {
  const tc = document.getElementById('totalContacts');
  const us = document.getElementById('uniqueSenders');
  const rc = document.getElementById('recentContacts');
  const lc = document.getElementById('latestContact');
  if (tc) tc.textContent = all.length;
  if (us) us.textContent = new Set(all.map((c) => c.email)).size;
  if (rc) {
    rc.textContent = all.filter((c) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return new Date(c.createdAt) >= cutoff;
    }).length;
  }
  const latest = all.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  if (lc) lc.textContent = latest ? new Date(latest.createdAt).toLocaleDateString() : '—';
}

function displayContacts(contacts) {
  const list = document.getElementById('contactsList');
  if (!list) return;
  if (!contacts.length) {
    list.innerHTML = '<div class="empty-state"><h3>' + t('noContacts') + '</h3><p>' + t('adjustFilters') + '</p></div>';
    return;
  }
  const ALLOWED = { NEW: 1, READ: 1, CLOSED: 1 };
  list.innerHTML = contacts.map((c) => {
    const id = parseInt(c.id, 10);
    const status = ALLOWED[c.status] ? c.status : 'NEW';
    return '' +
      '<div class="contact-card list-card">' +
        '<div class="contact-header">' +
          '<div>' +
            '<div class="contact-name">' + escapeHtml(c.firstName) + ' ' + escapeHtml(c.lastName) + '</div>' +
            '<div class="contact-email">' + escapeHtml(c.email) + '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:.625rem;flex-wrap:wrap">' +
            '<span class="status-badge status-' + status + '">' + escapeHtml(status) + '</span>' +
            '<span class="timestamp">' + new Date(c.createdAt).toLocaleString() + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="contact-message">' + escapeHtml(c.message) + '</p>' +
        '<div class="contact-footer">' +
          '<button onclick="updateContactStatus(' + id + ', \'READ\')" class="soft-btn">' + t('markRead') + '</button>' +
          '<button onclick="updateContactStatus(' + id + ', \'CLOSED\')" class="soft-btn">' + t('close') + '</button>' +
          '<button onclick="deleteContact(' + id + ')" class="soft-btn" style="color:var(--danger);border-color:var(--danger)">' + t('delete') + '</button>' +
        '</div>' +
      '</div>';
  }).join('');
}

function updateContactStatus(id, status) {
  const idx = allContacts.findIndex((c) => c.id === id);
  if (idx !== -1) {
    allContacts[idx].status = status;
    showToast(t('statusUpdated'), 'success');
  }
  loadContacts();
}
window.updateContactStatus = updateContactStatus;

function deleteContact(id) {
  if (!confirm(t('deleteConfirm'))) return;
  allContacts = allContacts.filter((c) => c.id !== id);
  showToast(t('deletedOk'), 'success');
  loadContacts();
}
window.deleteContact = deleteContact;

function updateContactFilters() {
  const g = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  contactFilters.search = g('contactSearch').trim().toLowerCase();
  contactFilters.from = g('contactFromDate');
  contactFilters.to = g('contactToDate');
  contactFilters.sort = g('contactSort') || 'date_desc';
  const filtered = filterContacts(allContacts);
  displayContactSummary(filtered, allContacts);
  displayContacts(filtered);
}
window.updateContactFilters = updateContactFilters;

function clearContactFilters() {
  contactFilters = { search: '', from: '', to: '', sort: 'date_desc' };
  ['contactSearch', 'contactFromDate', 'contactToDate'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sort = document.getElementById('contactSort');
  if (sort) sort.value = 'date_desc';
  updateContactFilters();
}
window.clearContactFilters = clearContactFilters;

function exportContactsToCSV() {
  const filtered = filterContacts(allContacts);
  if (!filtered.length) { showToast(t('noContactsToExport'), 'err'); return; }
  const headers = ['First Name', 'Last Name', 'Email', 'Message', 'Status', 'Date'];
  const rows = filtered.map((c) => [
    '"' + c.firstName + '"', '"' + c.lastName + '"', '"' + c.email + '"',
    '"' + (c.message || '').replace(/"/g, '""') + '"',
    '"' + (c.status || '') + '"',
    '"' + new Date(c.createdAt).toLocaleString() + '"'
  ].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'contacts_' + new Date().toISOString().split('T')[0] + '.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(t('exportedOk'), 'success');
}
window.exportContactsToCSV = exportContactsToCSV;

/* ============================================================
   РЕЗУЛЬТАТЫ И ДОСТИЖЕНИЯ
   ============================================================ */
function loadResults() {
  displayResultsSummary(results);
  displayResults(results);
}

function displayResultsSummary(items) {
  const area = document.getElementById('resultsSummary');
  if (!area) return;
  area.innerHTML =
    '<div class="summary-card small"><span class="summary-label">' + t('totalItems') + '</span><strong>' + items.length + '</strong></div>' +
    '<div class="summary-card small"><span class="summary-label">' + t('results') + '</span><strong>' + items.filter((i) => i.type === 'result').length + '</strong></div>' +
    '<div class="summary-card small"><span class="summary-label">' + t('achievements') + '</span><strong>' + items.filter((i) => i.type === 'achievement').length + '</strong></div>';
}

function displayResults(items) {
  const list = document.getElementById('resultsList');
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div class="empty-state"><h3>' + t('noResults') + '</h3><p>' + t('addResultHint') + '</p></div>';
    return;
  }
  list.innerHTML = items.map((item) => {
    const id = parseInt(item.id, 10);
    return '' +
      '<div class="result-card list-card">' +
        '<div>' +
          '<div class="result-type-badge">' + escapeHtml(item.type === 'achievement' ? t('achievement') : t('result')) + '</div>' +
          '<div class="result-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="result-value">' + escapeHtml(item.value) + '</div>' +
          (item.description ? '<div class="result-description">' + escapeHtml(item.description) + '</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap;flex-shrink:0">' +
          '<button class="soft-btn" onclick="editItem(' + id + ')">' + t('edit') + '</button>' +
          '<button class="soft-btn" onclick="deleteItem(' + id + ')" style="color:var(--danger);border-color:var(--danger)">' + t('delete') + '</button>' +
        '</div>' +
      '</div>';
  }).join('');
}

function openAddItemModal() {
  editingItemId = null;
  const form = document.getElementById('addResultForm');
  if (form) form.reset();
  const saveBtn = document.querySelector('#addResultModal .save-btn');
  const head = document.querySelector('#addResultModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('saveItem');
  if (head) head.textContent = t('addNewItem');
  document.getElementById('addResultModal').classList.add('active');
}
window.openAddItemModal = openAddItemModal;

function handleResultFormSubmit(e) {
  e.preventDefault();
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const title = v('resultTitle');
  const value = v('resultValue');
  const description = v('resultDescription');
  const type = v('itemType') || 'result';
  if (!title || !value) { showToast(t('fillRequired'), 'err'); return; }

  if (editingItemId !== null) {
    const idx = results.findIndex((i) => i.id === editingItemId);
    if (idx !== -1) results[idx] = Object.assign({}, results[idx], { title, value, description, type });
  } else {
    results.push({ id: Date.now(), title, value, description, type, createdAt: new Date().toISOString() });
  }
  closeModalWindow();
  loadResults();
  showToast(t('savedOk'), 'success');
}
window.handleResultFormSubmit = handleResultFormSubmit;

function editItem(id) {
  const item = results.find((r) => r.id === id);
  if (!item) return;
  editingItemId = id;
  const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
  set('itemType', item.type || 'result');
  set('resultTitle', item.title);
  set('resultValue', item.value);
  set('resultDescription', item.description || '');
  const saveBtn = document.querySelector('#addResultModal .save-btn');
  const head = document.querySelector('#addResultModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('updateItem');
  if (head) head.textContent = t('editItem');
  document.getElementById('addResultModal').classList.add('active');
}
window.editItem = editItem;

function deleteItem(id) {
  if (!confirm(t('deleteConfirm'))) return;
  results = results.filter((i) => i.id !== id);
  loadResults();
  showToast(t('deletedOk'), 'success');
}
window.deleteItem = deleteItem;

/* ============================================================
   ОТЗЫВЫ
   ============================================================ */
function loadFeedbacks() {
  const summary = document.getElementById('feedbackSummary');
  if (summary) {
    summary.innerHTML = '<div class="summary-card small"><span class="summary-label">' + t('totalFeedback') + '</span><strong>' + feedback.length + '</strong></div>';
  }
  const list = document.getElementById('feedbackList');
  if (!list) return;
  if (!feedback.length) {
    list.innerHTML = '<div class="empty-state"><h3>' + t('noFeedback') + '</h3><p>' + t('addFeedbackHint') + '</p></div>';
    return;
  }
  list.innerHTML = feedback.map((item) => {
    const id = parseInt(item.id, 10);
    return '' +
      '<div class="feedback-card list-card">' +
        '<div>' +
          '<div class="feedback-author">' + escapeHtml(item.name) + '</div>' +
          '<div class="feedback-meta">' + escapeHtml(item.role || '') + ' — ' + escapeHtml(item.organization || '') + '</div>' +
          '<div class="feedback-text">' + escapeHtml(item.message) + '</div>' +
          (item.rating ? '<div class="feedback-meta">⭐ ' + parseInt(item.rating, 10) + '/5</div>' : '') +
          '<div class="feedback-meta" style="font-size:.75rem">' + (item.published ? '✅ Published' : '🔒 Hidden') + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap;flex-shrink:0">' +
          '<button class="soft-btn" onclick="editFeedback(' + id + ')">' + t('edit') + '</button>' +
          '<button class="soft-btn" onclick="deleteFeedback(' + id + ')" style="color:var(--danger);border-color:var(--danger)">' + t('delete') + '</button>' +
        '</div>' +
      '</div>';
  }).join('');
}

function openAddFeedbackModal() {
  editingFeedbackId = null;
  const form = document.getElementById('addFeedbackForm');
  if (form) form.reset();
  const saveBtn = document.querySelector('#addFeedbackModal .save-btn');
  const head = document.querySelector('#addFeedbackModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('saveFeedback');
  if (head) head.textContent = t('addFeedback');
  document.getElementById('addFeedbackModal').classList.add('active');
}
window.openAddFeedbackModal = openAddFeedbackModal;

function handleFeedbackFormSubmit(e) {
  e.preventDefault();
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const name = v('feedbackName');
  const role = v('feedbackRole');
  const organization = v('feedbackOrg');
  const message = v('feedbackMessage');
  if (!name || !message) { showToast(t('fillRequired'), 'err'); return; }

  if (editingFeedbackId !== null) {
    const idx = feedback.findIndex((f) => f.id === editingFeedbackId);
    if (idx !== -1) feedback[idx] = Object.assign({}, feedback[idx], { name, role, organization, message });
  } else {
    feedback.push({ id: Date.now(), name, role, organization, message, rating: 5, published: true, createdAt: new Date().toISOString() });
  }
  closeModalWindow();
  loadFeedbacks();
  showToast(t('savedOk'), 'success');
}
window.handleFeedbackFormSubmit = handleFeedbackFormSubmit;

function editFeedback(id) {
  const item = feedback.find((f) => f.id === id);
  if (!item) return;
  editingFeedbackId = id;
  const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
  set('feedbackName', item.name);
  set('feedbackRole', item.role || '');
  set('feedbackOrg', item.organization || '');
  set('feedbackMessage', item.message);
  const saveBtn = document.querySelector('#addFeedbackModal .save-btn');
  const head = document.querySelector('#addFeedbackModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('updateFeedback');
  if (head) head.textContent = t('editFeedback');
  document.getElementById('addFeedbackModal').classList.add('active');
}
window.editFeedback = editFeedback;

function deleteFeedback(id) {
  if (!confirm(t('deleteConfirm'))) return;
  feedback = feedback.filter((f) => f.id !== id);
  loadFeedbacks();
  showToast(t('deletedOk'), 'success');
}
window.deleteFeedback = deleteFeedback;

/* ============================================================
   КУРСЫ / ВЕБИНАРЫ (LEARNING)
   ============================================================ */
function loadLearning() {
  const summary = document.getElementById('learningSummary');
  if (summary) {
    summary.innerHTML =
      '<div class="summary-card small"><span class="summary-label">' + t('totalPrograms') + '</span><strong>' + learning.length + '</strong></div>' +
      '<div class="summary-card small"><span class="summary-label">' + t('courses') + '</span><strong>' + learning.filter((i) => i.format === 'course').length + '</strong></div>' +
      '<div class="summary-card small"><span class="summary-label">' + t('webinars') + '</span><strong>' + learning.filter((i) => i.format === 'webinar').length + '</strong></div>';
  }
  const list = document.getElementById('learningList');
  if (!list) return;
  if (!learning.length) {
    list.innerHTML = '<div class="empty-state"><h3>' + t('noPrograms') + '</h3><p>' + t('addProgramsHint') + '</p></div>';
    return;
  }
  list.innerHTML = learning.map((item) => {
    const id = parseInt(item.id, 10);
    return '' +
      '<div class="learning-card list-card">' +
        '<div>' +
          '<div class="learning-format-badge">' + escapeHtml(item.format === 'course' ? t('course') : t('webinar')) + '</div>' +
          '<div class="learning-title">' + escapeHtml(item.title) + ' <span style="font-weight:500;color:var(--muted,#64748b)">· ' + escapeHtml(item.date || '') + '</span></div>' +
          (item.description ? '<div class="learning-description">' + escapeHtml(item.description) + '</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap;flex-shrink:0">' +
          '<button class="soft-btn" onclick="editLearning(' + id + ')">' + t('edit') + '</button>' +
          '<button class="soft-btn" onclick="deleteLearning(' + id + ')" style="color:var(--danger);border-color:var(--danger)">' + t('delete') + '</button>' +
        '</div>' +
      '</div>';
  }).join('');
}

function openAddLearningModal() {
  editingLearningId = null;
  const form = document.getElementById('addLearningForm');
  if (form) form.reset();
  const saveBtn = document.querySelector('#addLearningModal .save-btn');
  const head = document.querySelector('#addLearningModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('saveProgram');
  if (head) head.textContent = t('addProgram');
  document.getElementById('addLearningModal').classList.add('active');
}
window.openAddLearningModal = openAddLearningModal;

function handleLearningFormSubmit(e) {
  e.preventDefault();
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const title = v('learningTitle');
  const format = v('learningFormat') || 'course';
  const date = v('learningDate');
  const description = v('learningDescription');
  if (!title || !date) { showToast(t('fillRequired'), 'err'); return; }

  if (editingLearningId !== null) {
    const idx = learning.findIndex((i) => i.id === editingLearningId);
    if (idx !== -1) learning[idx] = Object.assign({}, learning[idx], { title, format, date, description });
  } else {
    learning.push({ id: Date.now(), title, format, date, description, createdAt: new Date().toISOString() });
  }
  closeModalWindow();
  loadLearning();
  showToast(t('savedOk'), 'success');
}
window.handleLearningFormSubmit = handleLearningFormSubmit;

function editLearning(id) {
  const item = learning.find((i) => i.id === id);
  if (!item) return;
  editingLearningId = id;
  const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
  set('learningTitle', item.title);
  set('learningFormat', item.format || 'course');
  set('learningDate', item.date || '');
  set('learningDescription', item.description || '');
  const saveBtn = document.querySelector('#addLearningModal .save-btn');
  const head = document.querySelector('#addLearningModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('updateProgram');
  if (head) head.textContent = t('editProgram');
  document.getElementById('addLearningModal').classList.add('active');
}
window.editLearning = editLearning;

function deleteLearning(id) {
  if (!confirm(t('deleteConfirm'))) return;
  learning = learning.filter((i) => i.id !== id);
  loadLearning();
  showToast(t('deletedOk'), 'success');
}
window.deleteLearning = deleteLearning;

/* ============================================================
   ШАБЛОНЫ
   ============================================================ */
function tplTitle(tpl) {
  if (currentLanguage === 'ru') return tpl.titleRu || tpl.title || tpl.titleEn || '';
  if (currentLanguage === 'en') return tpl.titleEn || tpl.title || tpl.titleRu || '';
  if (currentLanguage === 'kaa') return tpl.titleKaa || tpl.title || tpl.titleRu || '';
  return tpl.title || tpl.titleRu || tpl.titleEn || '';
}
function tplDesc(tpl) {
  if (currentLanguage === 'en') return tpl.descriptionEn || tpl.description || '';
  return tpl.description || tpl.descriptionEn || '';
}

function loadTemplates() {
  const summary = document.getElementById('templatesSummary');
  if (summary) {
    summary.innerHTML =
      '<div class="summary-card small"><span class="summary-label">' + t('totalTemplates') + '</span><strong>' + templates.length + '</strong></div>' +
      '<div class="summary-card small"><span class="summary-label">' + t('published') + '</span><strong>' + templates.filter((x) => x.published).length + '</strong></div>';
  }
  const list = document.getElementById('templatesList');
  if (!list) return;
  if (!templates.length) {
    list.innerHTML = '<div class="empty-state"><h3>' + t('noTemplates') + '</h3><p>' + t('addTemplatesHint') + '</p></div>';
    return;
  }
  list.innerHTML = templates.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((tpl) => {
    const id = parseInt(tpl.id, 10);
    const pubLabel = tpl.published ? '✅ ' + t('visible') : '🔒 ' + t('hidden');
    return '' +
      '<div class="result-card list-card">' +
        '<div style="display:flex;gap:1rem;align-items:flex-start">' +
          (tpl.imageUrl ? '<img src="' + escapeHtml(tpl.imageUrl) + '" alt="" style="width:72px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0" onerror="this.style.display=\'none\'">' : '') +
          '<div>' +
            '<div class="result-type-badge">' + escapeHtml(tpl.badge || 'DOC') + ' · ' + escapeHtml(tpl.category || 'business') + '</div>' +
            '<div class="result-title">' + escapeHtml(tplTitle(tpl)) + '</div>' +
            (tplDesc(tpl) ? '<div class="result-description">' + escapeHtml(tplDesc(tpl)) + '</div>' : '') +
            '<div class="feedback-meta" style="font-size:.75rem;margin-top:.35rem">' + pubLabel + (tpl.fileName ? ' · 📎 ' + escapeHtml(tpl.fileName) : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap;flex-shrink:0">' +
          '<button class="soft-btn" onclick="toggleTemplatePublished(' + id + ')">' + (tpl.published ? t('hidden') : t('visible')) + '</button>' +
          '<button class="soft-btn" onclick="editTemplate(' + id + ')">' + t('edit') + '</button>' +
          '<button class="soft-btn" onclick="deleteTemplate(' + id + ')" style="color:var(--danger);border-color:var(--danger)">' + t('delete') + '</button>' +
        '</div>' +
      '</div>';
  }).join('');
}

function openAddTemplateModal() {
  editingTemplateId = null;
  const form = document.getElementById('addTemplateForm');
  if (form) form.reset();
  const status = document.getElementById('templateFileStatus');
  if (status) status.textContent = '';
  const pub = document.getElementById('templatePublished');
  if (pub) pub.checked = true;
  const saveBtn = document.querySelector('#addTemplateModal .save-btn');
  const head = document.querySelector('#addTemplateModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('saveTemplate');
  if (head) head.textContent = t('addTemplate');
  document.getElementById('addTemplateModal').classList.add('active');
}
window.openAddTemplateModal = openAddTemplateModal;

function handleTemplateFormSubmit(e) {
  e.preventDefault();
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const title = v('templateTitle');
  if (!title) { showToast(t('fillRequired'), 'err'); return; }

  const fileInput = document.getElementById('templateUpload');
  const fileName = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : '';
  const pubEl = document.getElementById('templatePublished');

  const data = {
    title: title,
    titleRu: v('templateTitleRu'),
    titleEn: v('templateTitleEn'),
    titleKaa: v('templateTitleKaa'),
    description: v('templateDescription'),
    descriptionEn: v('templateDescriptionEn'),
    category: v('templateType') || 'business',
    badge: v('templateBadge') || 'DOC',
    sortOrder: parseInt(v('templatePages'), 10) || 0,
    imageUrl: v('templateImage'),
    published: pubEl ? pubEl.checked : true
  };

  if (editingTemplateId !== null) {
    const idx = templates.findIndex((x) => x.id === editingTemplateId);
    if (idx !== -1) {
      if (fileName) { data.fileName = fileName; data.hasFile = true; }
      templates[idx] = Object.assign({}, templates[idx], data);
    }
  } else {
    data.id = Date.now();
    data.fileName = fileName;
    data.hasFile = !!fileName;
    data.createdAt = new Date().toISOString();
    templates.push(data);
  }
  closeModalWindow();
  loadTemplates();
  showToast(t('savedOk'), 'success');
}
window.handleTemplateFormSubmit = handleTemplateFormSubmit;

function editTemplate(id) {
  const tpl = templates.find((x) => x.id === id);
  if (!tpl) return;
  editingTemplateId = id;
  const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
  set('templateTitle', tpl.title || '');
  set('templateTitleRu', tpl.titleRu || '');
  set('templateTitleEn', tpl.titleEn || '');
  set('templateTitleKaa', tpl.titleKaa || '');
  set('templateDescription', tpl.description || '');
  set('templateDescriptionEn', tpl.descriptionEn || '');
  set('templateType', tpl.category || 'business');
  set('templateBadge', tpl.badge || 'DOC');
  set('templatePages', tpl.sortOrder || 0);
  set('templateImage', tpl.imageUrl || '');
  const pub = document.getElementById('templatePublished');
  if (pub) pub.checked = !!tpl.published;
  const status = document.getElementById('templateFileStatus');
  if (status) status.textContent = tpl.fileName ? '📎 ' + tpl.fileName : '';
  const saveBtn = document.querySelector('#addTemplateModal .save-btn');
  const head = document.querySelector('#addTemplateModal .modal-header h3');
  if (saveBtn) saveBtn.textContent = t('updateTemplate');
  if (head) head.textContent = t('editTemplate');
  document.getElementById('addTemplateModal').classList.add('active');
}
window.editTemplate = editTemplate;

function deleteTemplate(id) {
  if (!confirm(t('deleteConfirm'))) return;
  templates = templates.filter((x) => x.id !== id);
  loadTemplates();
  showToast(t('deletedOk'), 'success');
}
window.deleteTemplate = deleteTemplate;

function toggleTemplatePublished(id) {
  const tpl = templates.find((x) => x.id === id);
  if (!tpl) return;
  tpl.published = !tpl.published;
  loadTemplates();
  showToast(tpl.published ? t('sectionNowVisible') : t('sectionNowHidden'), 'info');
}
window.toggleTemplatePublished = toggleTemplatePublished;

/* ============================================================
   ПОЛЬЗОВАТЕЛИ (выводятся из контактов)
   ============================================================ */
function loadUsers() {
  const list = document.getElementById('usersList');
  if (!list) return;
  const map = {};
  allContacts.forEach((c) => {
    if (!map[c.email]) {
      map[c.email] = { name: (c.firstName + ' ' + c.lastName).trim(), email: c.email, count: 0, last: c.createdAt };
    }
    map[c.email].count += 1;
    if (new Date(c.createdAt) > new Date(map[c.email].last)) map[c.email].last = c.createdAt;
  });
  const users = Object.keys(map).map((k) => map[k]);

  if (!users.length) {
    list.innerHTML = '<div class="empty-state"><h3>' + t('noUsers') + '</h3><p>' + t('usersHint') + '</p></div>';
    return;
  }
  list.innerHTML =
    '<div class="summary-grid" style="margin-bottom:1rem"><div class="summary-card small"><span class="summary-label">' + t('totalUsers') + '</span><strong>' + users.length + '</strong></div></div>' +
    users.map((u) =>
      '<div class="contact-card list-card">' +
        '<div class="contact-header"><div>' +
          '<div class="contact-name">' + escapeHtml(u.name || u.email) + '</div>' +
          '<div class="contact-email">' + escapeHtml(u.email) + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:.625rem;flex-wrap:wrap">' +
          '<span class="status-badge status-READ">' + t('messages') + ': ' + u.count + '</span>' +
          '<span class="timestamp">' + t('lastContact') + ': ' + new Date(u.last).toLocaleDateString() + '</span>' +
        '</div></div>' +
      '</div>'
    ).join('');
}

/* ============================================================
   РАЗДЕЛЫ САЙТА (переключатели видимости)
   ============================================================ */
function loadSections() {
  const list = document.getElementById('sectionsList');
  if (!list) return;
  list.innerHTML = sections.map((s) =>
    '<div class="contact-card list-card" style="display:flex;align-items:center;justify-content:space-between">' +
      '<div>' +
        '<div class="contact-name">' + escapeHtml(pick(s.label)) + '</div>' +
        '<div class="feedback-meta" style="font-size:.8rem">' + (s.visible ? '✅ ' + t('visible') : '🔒 ' + t('hidden')) + '</div>' +
      '</div>' +
      '<button class="soft-btn" onclick="toggleSection(\'' + s.key + '\')" ' +
        (s.visible ? '' : 'style="color:var(--danger);border-color:var(--danger)"') + '>' +
        (s.visible ? t('hidden') : t('visible')) +
      '</button>' +
    '</div>'
  ).join('');
}

function toggleSection(key) {
  const s = sections.find((x) => x.key === key);
  if (!s) return;
  s.visible = !s.visible;
  loadSections();
  showToast(s.visible ? t('sectionNowVisible') : t('sectionNowHidden'), 'info');
}
window.toggleSection = toggleSection;

/* ============================================================
   ВЫХОД
   ============================================================ */
function logout() {
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminUser');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  window.location.href = 'login.html';
}
window.logout = logout;

/* ============================================================
   ЯЗЫКОВОЕ МЕНЮ
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
   ИНИЦИАЛИЗАЦИЯ + ПРИВЯЗКА ВСЕХ КНОПОК
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Навигация по вкладкам
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => { if (btn.dataset.tab) switchTab(btn.dataset.tab); });
  });

  wireLanguageMenu();

  // Кнопки в шапке вкладок
  const on = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };

  on('logoutBtn', 'click', logout);
  on('exportContacts', 'click', exportContactsToCSV);
  on('refreshContacts', 'click', () => { loadContacts(); showToast(t('refreshedOk'), 'info'); });
  on('clearContactFilters', 'click', clearContactFilters);

  on('refreshResults', 'click', () => { loadResults(); showToast(t('refreshedOk'), 'info'); });
  on('addItemBtn', 'click', openAddItemModal);

  on('refreshFeedback', 'click', () => { loadFeedbacks(); showToast(t('refreshedOk'), 'info'); });
  on('addFeedbackBtn', 'click', openAddFeedbackModal);

  on('refreshLearning', 'click', () => { loadLearning(); showToast(t('refreshedOk'), 'info'); });
  on('addLearningBtn', 'click', openAddLearningModal);

  on('refreshTemplates', 'click', () => { loadTemplates(); showToast(t('refreshedOk'), 'info'); });
  on('addTemplateBtn', 'click', openAddTemplateModal);

  on('refreshUsers', 'click', () => { loadUsers(); showToast(t('refreshedOk'), 'info'); });

  // Фильтры контактов
  ['contactSearch', 'contactFromDate', 'contactToDate'].forEach((id) => on(id, 'input', updateContactFilters));
  on('contactSort', 'change', updateContactFilters);

  // Формы модалок
  on('addResultForm', 'submit', handleResultFormSubmit);
  on('addFeedbackForm', 'submit', handleFeedbackFormSubmit);
  on('addLearningForm', 'submit', handleLearningFormSubmit);
  on('addTemplateForm', 'submit', handleTemplateFormSubmit);

  // Отображение имени выбранного файла шаблона
  on('templateUpload', 'change', (e) => {
    const status = document.getElementById('templateFileStatus');
    const f = e.target.files && e.target.files[0];
    if (status) status.textContent = f ? t('fileSelected') + f.name : '';
  });

  // Закрытие модалок (крестик, Cancel, клик по фону)
  document.querySelectorAll('.close-modal, .cancel-btn').forEach((el) => {
    el.addEventListener('click', closeModalWindow);
  });
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModalWindow(); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModalWindow(); });

  // Старт
  setLanguage(currentLanguage);
  setAdminWelcome();

  const initial = document.querySelector('.nav-btn.active');
  switchTab(initial && initial.dataset.tab ? initial.dataset.tab : 'contacts');
});