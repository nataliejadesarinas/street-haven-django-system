/* ═══════════════════════════════════════════════════════════════
   STREET.HAVEN — gg.js
   ═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   THEME — Apply IMMEDIATELY to prevent flash (FOUC fix)
══════════════════════════════════════════════════════ */
(function () {
    if (localStorage.getItem('sh-theme') === 'light') {
        document.documentElement.classList.add('light');
        document.body && document.body.classList.add('light');
    }
})();

/* ══════════════════════════════════════════════════════
   PRODUCT DATA
══════════════════════════════════════════════════════ */
const PRODUCT_DATA = {
    'Air Force 1 Low':       { brand:'Nike',        price:4200, oldPrice:5800,  badge:'sale', sizes:[7,8,9,10,11,12], desc:'A timeless streetwear classic. The Nike Air Force 1 Low features durable leather upper, Air cushioning, and pivot circles for easy movement on court and street.', imgSrc:'static/images/air_forcelow1.jpg' },
    'Air Max 90':            { brand:'Nike',        price:5500, oldPrice:7200,  badge:'sale', sizes:[7,8,9,10,11,12], desc:'Iconic Max Air cushioning meets bold street-ready style. The Air Max 90 stays fresh with its visible Air unit and classic runner silhouette.', imgSrc:'static/images/air_max90.jpg' },
    'Dunk Low Retro':        { brand:'Nike',        price:6800, oldPrice:null,  badge:'new',  sizes:[6,7,8,9,10,11], desc:'Born on the hardwood, the Nike Dunk Low Retro brings vintage hoops style to the streets. Padded collar and herringbone traction complete the retro look.', imgSrc:'static/images/dunk_lowretro.jpg' },
    'Jordan 1 Mid':          { brand:'Jordan',      price:8900, oldPrice:10500, badge:'hot',  sizes:[8,9,10,11,12],  desc:"MJ's legacy lives on. The Air Jordan 1 Mid features premium leather, Nike Air cushioning, and the iconic Wings logo.", imgSrc:'static/images/jordan1mid.jpg' },
    'Jordan 4 Retro':        { brand:'Jordan',      price:12000,oldPrice:null,  badge:'new',  sizes:[8,9,10,11],     desc:'The Air Jordan 4 Retro brings back the visible Air sole and mesh panels from 1989. A grail for collectors.', imgSrc:'static/images/jordan4retro.jpg' },
    'Ultraboost 22':         { brand:'Adidas',      price:7200, oldPrice:9000,  badge:'sale', sizes:[7,8,9,10,11,12],desc:'Maximum energy return meets modern style. Full-length BOOST midsole and Primeknit+ upper for all-day comfort.', imgSrc:'static/images/ultraboost22.jpg' },
    'Stan Smith':            { brand:'Adidas',      price:3800, oldPrice:null,  badge:null,   sizes:[6,7,8,9,10,11,12], desc:"The original clean court shoe. Stan Smith's minimalist leather upper and punched 3-Stripes remain as fresh today as they were in the 70s.", imgSrc:'static/images/stansmith.jpg' },
    '990v5':                 { brand:'New Balance', price:8500, oldPrice:10000, badge:'sale', sizes:[7,8,9,10,11,12],desc:'Made in the USA with premium suede and mesh. The 990v5 is a dad-shoe icon with ENCAP midsole technology.', imgSrc:'static/images/990v5.jpg' },
    'Chuck Taylor All Star': { brand:'Converse',    price:2500, oldPrice:3200,  badge:'sale', sizes:[6,7,8,9,10,11,12,13], desc:'The most iconic sneaker ever made. Chuck Taylors have been worn by athletes, rebels, and legends since 1917.', imgSrc:'static/images/chucktalyor.jpg' },
    'Puma Essential Hoodie': { brand:'Puma',        price:2000, oldPrice:2800,  badge:'sale', sizes:['S','M','L','XL','XXL'], desc:'Soft fleece hoodie with Puma Cat branding on the chest. A comfortable everyday streetwear staple.', imgSrc:'static/images/pumaessantialhoddie.jpg' }
};

/* ══════════════════════════════════════════════════════
   CART  (localStorage-backed)
══════════════════════════════════════════════════════ */
function loadCart() {
    try { return JSON.parse(localStorage.getItem('sh-cart') || '[]'); } catch(e) { return []; }
}
function saveCart(cart) {
    try { localStorage.setItem('sh-cart', JSON.stringify(cart)); } catch(e) {}
}
let cart = loadCart();

function updateCartCount() {
    const total = cart.reduce((s, x) => s + x.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

function addToCart(name, imgSrc, price, brand) {
    const data = PRODUCT_DATA[name] || { brand: brand || 'Street Haven', price: parseFloat(price) || 0, imgSrc: imgSrc || '' };
    const existing = cart.find(x => x.name === name);
    if (existing) { existing.qty += 1; }
    else { cart.push({ name, brand: data.brand, price: data.price, imgSrc: imgSrc || data.imgSrc, qty: 1 }); }
    saveCart(cart);
    updateCartCount();
    showNotif(`${name} added to cart!`);
    refreshCartSidebar();
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.style.transform = 'scale(1.35)';
        setTimeout(() => btn.style.transform = '', 200);
    });
}

function removeFromCart(name) {
    cart = cart.filter(x => x.name !== name);
    saveCart(cart);
    updateCartCount();
    refreshCartSidebar();
}

function changeQty(name, delta) {
    const item = cart.find(x => x.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(name);
    else { saveCart(cart); updateCartCount(); refreshCartSidebar(); }
}

function clearCart() {
    cart = [];
    saveCart(cart);
    updateCartCount();
    refreshCartSidebar();
    showNotif('Cart cleared');
}

function openCartSidebar() {
    refreshCartSidebar();
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function refreshCartSidebar() {
    const wrap   = document.getElementById('cartItemsWrap');
    const footer = document.getElementById('cartFooter');
    if (!wrap || !footer) return;

    if (cart.length === 0) {
        wrap.innerHTML = `
            <div class="cart-empty-msg">
                <span>🛒</span>
                YOUR CART IS EMPTY
                <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;color:var(--muted);letter-spacing:0.5px;margin-top:4px">Start shopping to add items</div>
            </div>`;
        footer.innerHTML = '';
        return;
    }

    wrap.innerHTML = cart.map((item, i) => `
        <div class="cart-item" style="animation-delay:${i*0.05}s">
            <div class="cart-item-thumb">
                <img src="${item.imgSrc}" alt="${item.name}" onerror="this.style.display='none'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₱${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="changeQty('${item.name.replace(/'/g,"\\'")}', -1)">−</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.name.replace(/'/g,"\\'")}', 1)">+</button>
                <button class="delete-btn" onclick="removeFromCart('${item.name.replace(/'/g,"\\'")}')">🗑</button>
            </div>
        </div>`).join('');

    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total    = subtotal + shipping;

    footer.innerHTML = `
        <div class="cart-summary-row"><span>Subtotal</span><span>₱${subtotal.toLocaleString()}</span></div>
        <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--red)">FREE</span>' : '₱' + shipping}</span></div>
        <div class="cart-summary-row total"><span>TOTAL</span><span>₱${total.toLocaleString()}</span></div>
        <button class="checkout-btn" onclick="closeCartSidebar();openCheckout()">CHECKOUT →</button>
        <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>`;
}

/* ══════════════════════════════════════════════════════
   CHECKOUT
══════════════════════════════════════════════════════ */
function openCheckout() {
    if (cart.length === 0) { showNotif('Your cart is empty!'); return; }
    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total    = subtotal + shipping;
    const el = document.getElementById('checkoutSummary');
    if (el) {
        el.innerHTML =
            cart.map(i => `<div class="cs-row"><span>${i.name} ×${i.qty}</span><span>₱${(i.price*i.qty).toLocaleString()}</span></div>`).join('') +
            `<div class="cs-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₱'+shipping}</span></div>
             <div class="cs-row total"><span>TOTAL</span><span>₱${total.toLocaleString()}</span></div>`;
    }
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('open');
    document.body.style.overflow = '';
}

function placeOrder() {
    closeCheckout();
    clearCart();
    showNotif('🎉 Order placed! Thank you!');
}

/* ══════════════════════════════════════════════════════
   PRODUCT MODAL
══════════════════════════════════════════════════════ */
function openProductModal(card) {
    const nameEl = card.querySelector('.p-name');
    const imgEl  = card.querySelector('.product-thumb img');
    if (!nameEl) return;

    const name   = nameEl.textContent.trim();
    const imgSrc = card.dataset.img || (imgEl ? imgEl.src : '');
    const brand  = card.dataset.brand || '';
    const price  = parseFloat(card.dataset.price) || 0;
    const desc   = card.dataset.desc || '';

    const data = PRODUCT_DATA[name] || { brand, price, oldPrice: null, badge: null, sizes: ['S','M','L','XL','XXL'], desc, imgSrc };
    const discount = data.oldPrice ? Math.round((1 - data.price / data.oldPrice) * 100) : 0;
    const badgeColors = { sale:'badge-sale', new:'badge-new', hot:'badge-hot' };

    document.getElementById('pmBadge').innerHTML = data.badge
        ? `<div class="badge ${badgeColors[data.badge]||'badge-sale'}" style="position:relative;top:0;left:0">${data.badge.toUpperCase()}</div>` : '';
    document.getElementById('pmBrand').textContent = data.brand;
    document.getElementById('pmName').textContent  = name;
    document.getElementById('pmPrice').innerHTML = `
        <span class="pm-price-now">₱${data.price.toLocaleString()}</span>
        ${data.oldPrice ? `<span class="pm-price-old">₱${data.oldPrice.toLocaleString()}</span><span class="pm-discount">-${discount}%</span>` : ''}`;
    document.getElementById('pmDesc').textContent = data.desc || '';
    document.getElementById('pmSizes').innerHTML = `
        <div class="pm-sizes-label">SELECT SIZE</div>
        <div class="pm-size-grid">
            ${data.sizes.map((s,i) => `<div class="pm-sz${i===0?' active':''}" onclick="selectPmSize(this)">${s}</div>`).join('')}
        </div>`;
    document.getElementById('pmMainImg').innerHTML = `<img src="${imgSrc}" alt="${name}" onerror="this.style.display='none'">`;
    document.getElementById('pmThumbs').innerHTML = `
        <div class="pm-thumb active" onclick="switchAngle(this,'${imgSrc}','Front','')">
            <img src="${imgSrc}" alt="Front" onerror="this.style.display='none'">
        </div>
        <div class="pm-thumb" onclick="switchAngle(this,'${imgSrc}','Side','↩️ ')">
            <span style="font-size:26px">↩️</span>
        </div>
        <div class="pm-thumb" onclick="switchAngle(this,'${imgSrc}','Back','📐 ')">
            <span style="font-size:26px">📐</span>
        </div>`;
    document.getElementById('pmAddBtn').onclick = () => {
        addToCart(name, imgSrc, data.price, data.brand);
        closeProductModal();
    };
    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
}

function selectPmSize(el) {
    document.querySelectorAll('.pm-sz').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
}

function switchAngle(thumb, src, label, prefix) {
    document.querySelectorAll('.pm-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    document.getElementById('pmMainImg').innerHTML = `<img src="${src}" alt="${label}" onerror="this.style.display='none'">`;
}

/* ══════════════════════════════════════════════════════
   NOTIFICATION
══════════════════════════════════════════════════════ */
function showNotif(msg) {
    let notif = document.querySelector('.notif');
    if (!notif) {
        notif = document.createElement('div');
        notif.className = 'notif';
        document.body.appendChild(notif);
    }
    notif.textContent = msg;
    notif.classList.add('show');
    clearTimeout(notif._t);
    notif._t = setTimeout(() => notif.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════════════════════
   DOB DROPDOWNS  (auto-populate Day & Year)
══════════════════════════════════════════════════════ */
function initDOBDropdowns() {
    const dayEl   = document.getElementById('dobDay');
    const yearEl  = document.getElementById('dobYear');
    const monthEl = document.getElementById('dobMonth');
    if (!dayEl || !yearEl || !monthEl) return;

    // Populate days 1–31
    for (let d = 1; d <= 31; d++) {
        const o = document.createElement('option');
        o.value = d; o.textContent = d; dayEl.appendChild(o);
    }
    // Populate years (current year down to 1940)
    const now = new Date().getFullYear();
    for (let y = now; y >= 1940; y--) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y; yearEl.appendChild(o);
    }
    // Re-calculate days when month or year changes
    function refreshDays() {
        const m   = monthEl.selectedIndex;           // 0 = no selection
        const y   = parseInt(yearEl.value) || 2000;
        const max = m ? new Date(y, m, 0).getDate() : 31;
        const cur = parseInt(dayEl.value);
        dayEl.innerHTML = '<option value="">Day</option>';
        for (let d = 1; d <= max; d++) {
            const o = document.createElement('option');
            o.value = d; o.textContent = d;
            if (d === cur) o.selected = true;
            dayEl.appendChild(o);
        }
    }
    monthEl.addEventListener('change', refreshDays);
    yearEl.addEventListener('change',  refreshDays);
}

function getDOBString() {
    const month = document.getElementById('dobMonth')?.selectedIndex;
    const day   = document.getElementById('dobDay')?.value;
    const year  = document.getElementById('dobYear')?.value;
    if (month && day && year)
        return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return '';
}

/* ══════════════════════════════════════════════════════
   AUTH — MODALS
══════════════════════════════════════════════════════ */
function openLoginModal() {
    document.getElementById('loginModal')?.classList.add('open');
    document.getElementById('signupModal')?.classList.remove('open');
    document.body.style.overflow = 'hidden';
}

function openSignupModal() {
    document.getElementById('signupModal')?.classList.add('open');
    document.getElementById('loginModal')?.classList.remove('open');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
}

/* ── LOGIN ── */
function validateField(el) {
    const formGroup = el.closest('.form-group');
    if (!formGroup) return;
    const val = el.value.trim();
    const isValid = val.length > 0 && (el.type === 'email' ? /\S+@\S+\.\S+/.test(val) : el.type === 'password' ? val.length >= 6 : true);
    el.classList.toggle('valid', isValid);
    el.classList.toggle('invalid', !isValid);
    formGroup.querySelector('label').classList.toggle('valid', isValid);
    formGroup.querySelector('label').classList.toggle('invalid', !isValid);
}

async function doLogin() {
    const emailEl    = document.querySelector('#loginModal input[type="email"]');
    const passwordEl = document.querySelector('#loginModal input[type="password"]');
    if (!emailEl || !passwordEl) return;

    const email    = emailEl.value.trim();
    const password = passwordEl.value;

    if (!email || !password) { showNotif('Please fill in all fields'); return; }

    try {
        const res  = await fetch('/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('sh-user', JSON.stringify(data.user));
            closeAllModals();
            showNotif(`Welcome back, ${data.user.username}!`);
            setTimeout(() => location.reload(), 600);
        } else {
            showNotif(data.error || 'Invalid email or password');
        }
    } catch(e) {
        showNotif('Network error — please try again');
    }
}

/* ── REGISTER ── */
async function doRegister() {
    // Validate all fields before submit
    const requiredIds = ['signupName', 'signupEmail', 'signupUsername', 'signupPassword'];
    let allValid = true;
    requiredIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) validateField(el);
        if (!el.value.trim()) allValid = false;
    });
    const passwordEl = document.getElementById('signupPassword');
    if (passwordEl && passwordEl.value.length < 6) allValid = false;

    if (!allValid) {
        showNotif('Please fill all required fields correctly');
        return;
    }

    // Collect all fields
    const name     = document.getElementById('signupName')?.value.trim()    || '';
    const email    = document.getElementById('signupEmail')?.value.trim()   || '';
    const username = document.getElementById('signupUsername')?.value.trim()|| '';
    const password = document.getElementById('signupPassword')?.value       || '';
    const contact  = document.getElementById('signupContact')?.value.trim() || '';
    const street   = document.getElementById('signupStreet')?.value.trim()  || '';
    const cityMun  = document.getElementById('signupCityMun')?.value.trim() || '';
    const province = document.getElementById('signupProvince')?.value       || '';
    const region   = document.getElementById('signupRegion')?.value         || '';
    const zip      = document.getElementById('signupZip')?.value.trim()     || '';
    const dob      = getDOBString();

    const formData = {
        name, email, username, password, contact, dob,
        address: { street, cityMun, province, region, zip }
    };

    try {
        const res  = await fetch('/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('sh-user', JSON.stringify(data.user));
            closeAllModals();
            showNotif(`Welcome to Haven, ${data.user.username}! 🔥`);
            setTimeout(() => window.location.href = '/profile/', 800);
        } else {
            showNotif(data.error || 'Registration failed');
        }
    } catch(e) {
        showNotif('Network error — please try again');
    }
}

/* ══════════════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════════════ */
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (!user) return;

    // Sidebar card
    _setText('profileUsername', user.username || 'User');
    _setText('profileEmail',    user.email    || '');
    _setText('avatarInitial',   (user.username || 'U')[0].toUpperCase());
    _setText('orderCount',      user.orders    || 0);
    _setText('favCount',        user.favorites || 0);

    // Header avatar (nav area)
    _setText('profileHeaderName',   user.username || 'User');
    _setText('profileHeaderAvatar', (user.username || 'U')[0].toUpperCase());

    // Settings form
    _setVal('settingsName',     user.name     || '');
    _setVal('settingsUsername', user.username || '');
    _setVal('settingsEmail',    user.email    || '');
    _setVal('settingsContact',  user.contact  || '');
    _setVal('settingsDob',      user.dob      || '');

    // Address fields in settings
    if (user.address) {
        _setVal('settingsStreet',   user.address.street   || '');
        _setVal('settingsCityMun',  user.address.cityMun  || '');
        _setVal('settingsProvince', user.address.province || '');
        _setVal('settingsRegion',   user.address.region   || '');
        _setVal('settingsZip',      user.address.zip      || '');
    }

    // Settings panel avatar
    _setText('settingsAvatar',     (user.username || 'U')[0].toUpperCase());
    _setText('settingsAvatarName', user.username || 'User');

    // Profile photo
    if (user.avatar) {
        const img = document.getElementById('avatarImg');
        if (img) { img.src = user.avatar; img.style.display = 'block'; }
        const init = document.getElementById('avatarInitial');
        if (init) init.style.display = 'none';
    }
}

function _setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function _setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function switchTab(tab, btn) {
    document.querySelectorAll('.profile-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const section = document.getElementById('section-' + tab);
    if (section) section.classList.add('active');
}

function saveSettings() {
    const user = JSON.parse(localStorage.getItem('sh-user') || '{}');
    user.name     = document.getElementById('settingsName')?.value     || user.name;
    user.username = document.getElementById('settingsUsername')?.value || user.username;
    user.email    = document.getElementById('settingsEmail')?.value    || user.email;
    user.contact  = document.getElementById('settingsContact')?.value  || '';
    user.dob      = document.getElementById('settingsDob')?.value      || '';
    user.address  = {
        street:   document.getElementById('settingsStreet')?.value   || '',
        cityMun:  document.getElementById('settingsCityMun')?.value  || '',
        province: document.getElementById('settingsProvince')?.value || '',
        region:   document.getElementById('settingsRegion')?.value   || '',
        zip:      document.getElementById('settingsZip')?.value      || ''
    };
    localStorage.setItem('sh-user', JSON.stringify(user));
    loadUserData();
    showNotif('Settings saved!');
    const successEl = document.getElementById('settingsSuccess');
    if (successEl) { successEl.style.display = 'block'; setTimeout(() => successEl.style.display = 'none', 3500); }
}

function changePassword() {
    const current = document.getElementById('currentPassword')?.value || '';
    const newP    = document.getElementById('newPassword')?.value     || '';
    const confirm = document.getElementById('confirmPassword')?.value || '';
    if (!current)          { showNotif('Enter your current password'); return; }
    if (newP.length < 6)   { showNotif('New password must be at least 6 characters'); return; }
    if (newP !== confirm)  { showNotif('Passwords do not match'); return; }
    showNotif('Password updated!');
    ['currentPassword','newPassword','confirmPassword'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const successEl = document.getElementById('passwordSuccess');
    if (successEl) { successEl.style.display = 'block'; setTimeout(() => successEl.style.display = 'none', 3500); }
}

function uploadAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showNotif('Image too large — max 2MB'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        const user = JSON.parse(localStorage.getItem('sh-user') || '{}');
        user.avatar = e.target.result;
        localStorage.setItem('sh-user', JSON.stringify(user));
        // Update all avatar images on the page
        document.querySelectorAll('#avatarImg, .avatar-big img').forEach(img => {
            img.src = user.avatar; img.style.display = 'block';
        });
        document.querySelectorAll('#avatarInitial, #settingsAvatar').forEach(el => {
            el.style.display = 'none';
        });
        showNotif('Profile picture updated!');
    };
    reader.readAsDataURL(file);
}

function doLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('sh-user');
        showNotif('Logged out — see you soon!');
        setTimeout(() => window.location.href = '/', 800);
    }
}

function deleteAccount() {
    if (confirm('Permanently delete your account? This cannot be undone.')) {
        localStorage.removeItem('sh-user');
        localStorage.removeItem('sh-cart');
        showNotif('Account deleted');
        setTimeout(() => window.location.href = '/', 1200);
    }
}

/* ══════════════════════════════════════════════════════
   THEME TOGGLE (FIXED)
══════════════════════════════════════════════════════ */

function initTheme() {
    const isLight = localStorage.getItem('sh-theme') === 'light';
    // Apply to both <html> and <body> for full coverage
    document.documentElement.classList.toggle('light', isLight);
    document.body.classList.toggle('light', isLight);
    updateThemeButtons();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    document.documentElement.classList.toggle('light', isLight);
    localStorage.setItem('sh-theme', isLight ? 'light' : 'dark');
    updateThemeButtons();
}

function updateThemeButtons() {
    const isLight = document.body.classList.contains('light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.textContent = isLight ? '🌙 DARK' : '☀️ LIGHT';
    });
}

/* ══════════════════════════════════════════════════════
   DOMContentLoaded — wire everything up
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // Theme — init state + wire all toggle buttons
    initTheme();
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Cart
    updateCartCount();
    document.querySelectorAll('.cart-btn').forEach(btn => btn.addEventListener('click', openCartSidebar));
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);

    // Add-to-cart buttons on product cards
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const card   = btn.closest('.product-card');
            const nameEl = card.querySelector('.p-name');
            const imgEl  = card.querySelector('.product-thumb img');
            const name   = nameEl ? nameEl.textContent.trim() : '';
            const imgSrc = card.dataset.img || (imgEl ? imgEl.src : '');
            const price  = card.dataset.price || 0;
            const brand  = card.dataset.brand || '';
            addToCart(name, imgSrc, price, brand);
        });
    });

    // Product card click → modal
    document.querySelectorAll('.product-card').forEach(card => {
        const thumb = card.querySelector('.product-thumb');
        if (thumb && !thumb.querySelector('.product-thumb-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'product-thumb-overlay';
            overlay.textContent = '👁 VIEW';
            thumb.appendChild(overlay);
        }
        card.addEventListener('click', e => {
            if (e.target.classList.contains('add-btn')) return;
            openProductModal(card);
        });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeAllModals();
        });
    });

    // Login / signup trigger buttons
    document.querySelectorAll('.btn-login').forEach(btn => btn.addEventListener('click', openLoginModal));

    // DOB dropdowns
    initDOBDropdowns();

    // Profile page — load user data if on profile
    if (document.querySelector('.profile-layout') || document.querySelector('.profile-page')) {
        const user = JSON.parse(localStorage.getItem('sh-user') || 'null');
        if (!user) {
            window.location.href = '/';
            return;
        }
        loadUserData();
        // Activate first tab
        const firstTab = document.querySelector('.profile-nav-item');
        const firstSection = document.querySelector('.profile-section');
        if (firstTab)    firstTab.classList.add('active');
        if (firstSection) firstSection.classList.add('active');
    }

    // Update header login button if user is logged in
    const user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (user) {
        document.querySelectorAll('.btn-login').forEach(btn => {
            btn.textContent = user.username.toUpperCase();
            btn.onclick = () => window.location.href = '/profile/';
        });
    }
});