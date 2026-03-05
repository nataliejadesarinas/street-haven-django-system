
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-track img');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    let currentIndex = 0;
    const slideWidth = 450;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        updateCarousel();
    });
 
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }
        updateCarousel();
    });

   // ── MODES ───────────────────────────────────────
(function initTheme() {
    const saved = localStorage.getItem('sh-theme') || 'dark';
    if (saved === 'light') document.body.classList.add('light');
    updateThemeIcon();
})();

function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('sh-theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isLight = document.body.classList.contains('light');
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
        btn.textContent = isLight ? '🌙 Dark' : '☀️ Light';
    });
} 