const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.car-card');
const emptyState = document.getElementById('emptyState');
const carType = document.getElementById('carType');
const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');
const pickup = document.getElementById('pickup');
const returnDate = document.getElementById('return');

function applyFilter(category) {
  let visibleCount = 0;
  cards.forEach((card) => {
    const visible = category === 'all' || card.dataset.category === category;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  emptyState.hidden = visibleCount !== 0;
  filters.forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

filters.forEach((button) => button.addEventListener('click', () => {
  carType.value = button.dataset.category;
  applyFilter(button.dataset.category);
}));

carType.addEventListener('change', () => applyFilter(carType.value));

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
pickup.min = localDate;
returnDate.min = localDate;
pickup.addEventListener('change', () => { returnDate.min = pickup.value || localDate; });

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (returnDate.value < pickup.value) {
    bookingMessage.textContent = 'Drop-off date must be on or after your pick-up date.';
    returnDate.focus();
    return;
  }
  const category = carType.value;
  applyFilter(category);
  document.getElementById('cars').scrollIntoView({ behavior: 'smooth' });
  bookingMessage.textContent = `Showing ${category === 'all' ? 'all available cars' : `${category} cars`} for your trip from ${document.getElementById('location').value}.`;
});

document.querySelectorAll('.rent-btn').forEach((button) => button.addEventListener('click', () => {
  document.getElementById('location').focus();
  bookingMessage.textContent = `${button.dataset.car} selected. Enter your trip details to continue.`;
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}));

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('open', !expanded);
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('show'));
}
