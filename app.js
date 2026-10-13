const dialog = document.querySelector('#booking');
const form = document.querySelector('#booking-form');
const status = document.querySelector('#booking-status');
const date = form.elements.date;
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
date.min = localDate;
document.querySelector('#year').textContent = today.getFullYear();
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
  status.textContent = '';
  if (button.dataset.service) form.elements.service.value = button.dataset.service;
  dialog.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (!data.name.trim()) { form.elements.name.setCustomValidity('Введи имя'); form.elements.name.reportValidity(); return; }
  const chosen = new Date(`${data.date}T${data.time}`);
  if (chosen <= new Date()) { status.textContent = 'Выбери дату и время в будущем.'; return; }
  try {
    localStorage.setItem('fashion-booking-draft', JSON.stringify(data));
    status.textContent = `Черновик сохранён: ${data.service}, ${chosen.toLocaleDateString('ru-RU')} в ${data.time}. Это не подтверждённая запись; данные не отправлены.`;
  } catch { status.textContent = 'Браузер не разрешил сохранить черновик. Данные остаются в форме, но не отправлены.'; }
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
try {
  const saved = JSON.parse(localStorage.getItem('fashion-booking-draft') || 'null');
  if (saved) for (const name of ['name', 'service', 'date', 'time']) {
    if (typeof saved[name] === 'string') form.elements[name].value = saved[name];
  }
} catch { /* The form remains usable if storage is unavailable. */ }
const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
}));
