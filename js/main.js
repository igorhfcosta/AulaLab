const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const filterButtons = document.querySelectorAll('.filter-btn');
const gameCards = document.querySelectorAll('.game-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    gameCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'todos' || category === filter;
      card.style.display = shouldShow ? 'block' : 'none';
    });
  });
});

const slides = Array.from(document.querySelectorAll('[data-slide]'));
const prevButton = document.querySelector('[data-slider-prev]');
const nextButton = document.querySelector('[data-slider-next]');
const dotsContainer = document.querySelector('[data-slider-dots]');
let currentSlide = 0;
let sliderTimer = null;

function showSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === currentSlide);
  });

  document.querySelectorAll('[data-slider-dot]').forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === currentSlide);
    dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function restartSliderTimer() {
  if (!slides.length) return;
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 6500);
}

if (slides.length && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.dataset.sliderDot = String(index);
    dot.setAttribute('aria-label', `Ir para destaque ${index + 1}`);
    dot.addEventListener('click', () => {
      showSlide(index);
      restartSliderTimer();
    });
    dotsContainer.appendChild(dot);
  });

  prevButton?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    restartSliderTimer();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    restartSliderTimer();
  });

  showSlide(0);
  restartSliderTimer();
}
