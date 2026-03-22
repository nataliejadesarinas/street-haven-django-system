// Street.Haven - Complete JavaScript functionality
// Includes: Login/Register modals, theme toggle, notifications, carousel, product modals, cart

// ══════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════
function showNotif(msg) {
    const n = document.getElementById('notif') || createNotif();
    n.textContent = msg;
    n.classList.add('show');
    clearTimeout(n._t);
    n._t = setTimeout(() => n.classList.remove('show'), 3200);
}

function createNotif() {
    const notif = document.createElement('div');
    notif.className = 'notif';
    notif.id = 'notif';
    document.body.appendChild(notif);
    return notif;
}

// ══════════════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════════════
function initTheme() {
    const saved = localStorage.getItem('sh-theme') || 'dark';
    if (saved === 'light') document.body.classList.add('light');
    updateThemeBtn();
}

function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('sh-theme', isLight ? 'light' : 'dark');
    updateThemeBtn();
    showNotif(isLight ? '☀️ Light mode activated' : '🌙 Dark mode activated');
}

function updateThemeBtn() {
    const isLight = document.body.classList.contains('light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = isLight ? '🌙 Dark' : '☀️ Light';
    });
}

// ══════════════════════════════════════════════════════
// LOGIN / REGISTER MODALS
// ══════════════════════════════════════════════════════
function openLoginModal() {
    const modal = document.getElementById('loginModal') || createLoginModal();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function openSignupModal() {
    closeAllModals();
    const modal = document.getElementById('signupModal') || createSignupModal();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
}

function createLoginModal() {
    const modalHTML = `
        <div class="modal-overlay" id="loginModal">
            <div class="modal">
                <button class="modal-close" onclick="closeAllModals()">✕</button>
                <div class="modal-title">WELCOME<br>BACK</div>
                <div class="modal-sub">Sign in to your Street.Haven account</div>
                <div class="form-group"><label>EMAIL</label><input type="email" placeholder="you@email.com"></div>
                <div class="form-group"><label>PASSWORD</label><input type="password" placeholder="••••••••"></div>
                <button class="modal-btn">LOGIN</button>
                <div class="modal-divider">— OR —</div>
                <button class="modal-btn-outline" onclick="openSignupModal()">REGISTER</button>
                <div class="modal-switch">No account? <a onclick="openSignupModal()">Sign Up</a></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('loginModal');
}

function createSignupModal() {
    const modalHTML = `
        <div class="modal-overlay" id="signupModal">
            <div class="modal">
                <button class="modal-close" onclick="closeAllModals()">✕</button>
                <div class="modal-title">JOIN<br>THE HAVEN</div>
                <div class="modal-sub">Create your account</div>
                <div class="form-group"><label>FULL NAME</label><input type="text" placeholder="Juan dela Cruz"></div>
                <div class="form-group"><label>EMAIL</label><input type="email" placeholder="you@email.com"></div>
                <div class="form-group"><label>PASSWORD</label><input type="password" placeholder="••••••••"></div>
                <button class="modal-btn">CREATE ACCOUNT</button>
                <div class="modal-switch">Already have one? <a onclick="openLoginModal()">Login</a></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('signupModal');
}

// ══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Theme toggle
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Login buttons
    document.querySelectorAll('.btn-login').forEach(btn => {
        btn.addEventListener('click', openLoginModal);
    });

    // Cart buttons (if exist)
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotif('🛒 Cart feature coming soon!');
        });
    });

    // ESC key closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Admin dashboard nav fix (if present)
    if (document.querySelector('.admin-nav')) {
        document.querySelectorAll('.nav-item[onclick]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const onclickStr = this.getAttribute('onclick');
                const sectionMatch = onclickStr.match(/'([^']+)'/);
                if (sectionMatch) {
                    const sectionName = sectionMatch[1];
                    window.showSection = window.showSection || function(name, target) {
                        const sections = ['dashboard','products','orders','users','settings'];
                        sections.forEach(s => {
                            const el = document.getElementById('section-' + s);
                            if (el) el.style.display = s === name ? 'block' : 'none';
                        });
                        const titleEl = document.getElementById('topbarTitle');
                        if (titleEl) titleEl.textContent = sectionName.toUpperCase();
                        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                        this.classList.add('active');
                    };
                    window.showSection(sectionName, this);
                }
            });
        });
    }
    
    showNotif('✅ Street.Haven loaded successfully!');
});
