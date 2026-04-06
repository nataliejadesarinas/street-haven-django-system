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
    function getAngleImages(productData) {
        return {
            left: productData.image_left || productData.image_front || productData.image,
            front: productData.image_front || productData.image,
            back: productData.image_back || productData.image,
            right: productData.image_right || productData.image
        };
    }

    const angleImages = getAngleImages({
        image_left: card.dataset.imageLeft || imgSrc,
        image_front: card.dataset.imageFront || imgSrc,
        image_back: card.dataset.imageBack || imgSrc,
        image_right: card.dataset.imageRight || imgSrc,
        image: imgSrc
    });
    
    document.getElementById('pmThumbs').innerHTML = `
        <div class="pm-thumb active" onclick="switchAngle(this,'${angleImages.left}','Left')">
            <img src="${angleImages.left}" alt="Left" onerror="this.style.display='none'">
            <div class="pm-thumb-label">LEFT</div>
        </div>
        <div class="pm-thumb" onclick="switchAngle(this,'${angleImages.front}','Front')">
            <img src="${angleImages.front}" alt="Front" onerror="this.style.display='none'">
            <div class="pm-thumb-label">FRONT</div>
        </div>
        <div class="pm-thumb" onclick="switchAngle(this,'${angleImages.back}','Back')">
            <img src="${angleImages.back}" alt="Back" onerror="this.style.display='none'">
            <div class="pm-thumb-label">BACK</div>
        </div>
        <div class="pm-thumb" onclick="switchAngle(this,'${angleImages.right}','Right')">
            <img src="${angleImages.right}" alt="Right" onerror="this.style.display='none'">
            <div class="pm-thumb-label">RIGHT</div>
        </div>
    `;
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

/** Open product modal from API search result object */
function openProductModalFromData(item) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.price = String(item.price ?? '');
    card.dataset.brand = item.brand ?? '';
    card.dataset.desc = item.description ?? '';
    card.dataset.img = item.image ?? '';

    const thumb = document.createElement('div');
    thumb.className = 'product-thumb';
    const img = document.createElement('img');
    img.src = item.image || '';
    img.alt = item.name || '';
    thumb.appendChild(img);

    const info = document.createElement('div');
    info.className = 'product-info';
    const nameEl = document.createElement('div');
    nameEl.className = 'p-name';
    nameEl.textContent = item.name || '';
    info.appendChild(nameEl);

    card.appendChild(thumb);
    card.appendChild(info);
    openProductModal(card);
}

window.openProductModalFromData = openProductModalFromData;

function selectPmSize(el) {
    document.querySelectorAll('.pm-sz').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
}

function switchAngle(thumb, src, label) {
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

/* ══════════════════════════════════════════════════════
   CITY DATA — Minimal cities per province
══════════════════════════════════════════════════════ */
const CITY_DATA = {
    'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig'],
    'Bulacan': ['Malolos', 'San Jose del Monte', 'Meycauayan', 'Santa Maria'],
    'Rizal': ['Antipolo', 'Taytay', 'Cainta', 'Rodriguez'],
    'Cavite': ['Dasmariñas', 'Bacoor', 'Imus', 'Trece Martires'],
    'Laguna': ['Santa Cruz', 'Calamba', 'San Pablo', 'Biñan'],
    'Batangas': ['Batangas City', 'Lipa City', 'Tanjay', 'Balayan'],
    'Pampanga': ['San Fernando', 'Angeles City', 'Mabalacat', 'Porac'],
    'Bataan': ['Balanga', 'Dinalupihan', 'Mariveles', 'Orani'],
    'Zambales': ['Olongapo City', 'Iba', 'Botolan', 'Candelaria'],
    'Nueva Ecija': ['Cabanatuan City', 'Palayan City', 'Gapan City', 'Science City of Muñoz']
};

async function updateCities() {
    const provinceEl = document.getElementById('signupProvince');
    const cityEl = document.getElementById('signupCityMun');
    if (!provinceEl || !cityEl) return;

    const province = provinceEl.value;
    cityEl.innerHTML = '<option value="">Loading cities...</option>';

    try {
        const res = await fetch('/api/locations/');
        if (!res.ok) throw new Error('API failed');
        const CITY_DATA = await res.json();
        
        cityEl.innerHTML = '<option value="">City / Municipality</option>';
        if (province && CITY_DATA[province]) {
            CITY_DATA[province].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityEl.appendChild(option);
            });
        }
    } catch(e) {
        console.error('Location API error:', e);
        cityEl.innerHTML = '<option value="">Error loading cities</option>';
    }
}

// Auto-wire city updater to signupModal open (both templates)
function initAddressDropdowns() {
    const provinceEl = document.getElementById('signupProvince');
    const cityEl = document.getElementById('signupCityMun');
    if (provinceEl && cityEl) {
        provinceEl.removeEventListener('change', updateCities); // Avoid duplicates
        provinceEl.addEventListener('change', updateCities);
        updateCities(); // Reset cities
    }
}

/* ══════════════════════════════════════════════════════
   DOMContentLoaded — ONE single listener, everything wired here
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

    // ── Theme ──
    initTheme();
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', toggleTheme);
    });

    // ── Address dropdowns (signup modal) ──
    var provinceEl = document.getElementById('signupProvince');
    if (provinceEl) initAddressDropdowns();

    // ── Wrap openSignupModal SAFELY here, not at file scope ──
    var _origOpenSignup = openSignupModal;
    openSignupModal = function () {
        _origOpenSignup();
        setTimeout(initAddressDropdowns, 50);
    };

    // ── Cart ──
    updateCartCount();
    document.querySelectorAll('.cart-btn').forEach(function (btn) {
        btn.addEventListener('click', openCartSidebar);
    });
    var cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);

    // ── Add-to-cart buttons ──
    document.querySelectorAll('.add-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (btn.dataset.pdCart !== undefined) {
                addToCart(btn.dataset.name || '', btn.dataset.img || '', btn.dataset.price || 0, btn.dataset.brand || '');
                return;
            }
            var card = btn.closest('.product-card');
            if (!card) return;
            var nameEl = card.querySelector('.p-name');
            var imgEl  = card.querySelector('.product-thumb img');
            var name   = nameEl ? nameEl.textContent.trim() : '';
            var imgSrc = card.dataset.img || (imgEl ? imgEl.src : '');
            addToCart(name, imgSrc, card.dataset.price || 0, card.dataset.brand || '');
        });
    });

    // ── Product card click → modal ──
    document.querySelectorAll('.product-card:not(.search-result-card)').forEach(function (card) {
        var thumb = card.querySelector('.product-thumb');
        if (thumb && !thumb.querySelector('.product-thumb-overlay')) {
            var overlay = document.createElement('div');
            overlay.className = 'product-thumb-overlay';
            overlay.textContent = '👁 VIEW';
            thumb.appendChild(overlay);
        }
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('add-btn')) return;
            openProductModal(card);
        });
    });

    // ── Modal close buttons ──
    document.querySelectorAll('.modal-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.closest('.modal-overlay').classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeAllModals();
        });
    });

    // ── Login button ──
    document.querySelectorAll('.btn-login').forEach(function (btn) {
        btn.addEventListener('click', openLoginModal);
    });

    // ── DOB dropdowns ──
    initDOBDropdowns();

    // ── Search ──
    (function initGlobalSearch() {
        var wrap  = document.querySelector('.search-wrap');
        var input = document.getElementById('globalSearchInput');
        var dd    = document.getElementById('searchDropdown');
        if (!wrap || !input || !dd) return;

        var path       = wrap.getAttribute('data-search-url') || '/api/search/';
        var searchPage = wrap.getAttribute('data-search-page-url') || '/search/';

        function goToSearchPage() {
            var q = input.value.trim();
            var u = new URL(searchPage, window.location.origin);
            if (q) u.searchParams.set('q', q);
            window.location.href = u.toString();
        }

        function syncPos() {
            if (dd.hidden) return;
            var r = input.getBoundingClientRect();
            dd.style.left  = r.left + 'px';
            dd.style.top   = (r.bottom + 6) + 'px';
            dd.style.width = Math.max(r.width, 200) + 'px';
        }

        function hideDD() {
            dd.hidden = true; dd.innerHTML = '';
            dd.style.left = dd.style.top = dd.style.width = '';
        }

        window.addEventListener('scroll', syncPos, true);
        window.addEventListener('resize', syncPos);

        var seq = 0;
        function runSearch() {
            var q = input.value.trim();
            if (!q) { hideDD(); return; }
            var my = ++seq;
            dd.hidden = false;
            dd.innerHTML = '<div class="search-loading">Searching…</div>';
            syncPos();
            var u = new URL(path, window.location.origin);
            u.searchParams.set('q', q);
            fetch(u.toString(), { credentials: 'same-origin' })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (my !== seq) return;
                    dd.innerHTML = '';
                    var results = data.results || [];
                    if (!results.length) {
                        dd.innerHTML = '<div class="search-empty">No products found.</div>';
                        syncPos(); return;
                    }
                    results.forEach(function (item) {
                        var row = document.createElement('a');
                        row.className = 'search-result-row';
                        row.href = '#';
                        row.innerHTML =
                            '<span class="search-result-thumb">' + (item.image ? '<img src="' + item.image + '" alt="">' : '🛍') + '</span>' +
                            '<span class="search-result-meta"><span class="search-result-name">' + (item.name || '') + '</span>' +
                            '<span class="search-result-sub">' + [item.brand, item.category].filter(Boolean).join(' · ') + '</span></span>' +
                            '<span class="search-result-price">₱' + Number(item.price || 0).toLocaleString() + '</span>';
                        row.addEventListener('click', function (e) { e.preventDefault(); hideDD(); goToSearchPage(); });
                        dd.appendChild(row);
                    });
                    var sa = document.createElement('a');
                    sa.className = 'search-see-all'; sa.href = '#'; sa.textContent = 'View all results →';
                    sa.addEventListener('click', function (e) { e.preventDefault(); hideDD(); goToSearchPage(); });
                    dd.appendChild(sa);
                    dd.hidden = false; syncPos();
                })
                .catch(function () {
                    if (my !== seq) return;
                    dd.innerHTML = '<div class="search-empty">Search unavailable.</div>';
                    dd.hidden = false; syncPos();
                });
        }

        var debTimer;
        input.addEventListener('input', function () {
            if (!input.value.trim()) { seq++; hideDD(); return; }
            clearTimeout(debTimer); debTimer = setTimeout(runSearch, 280);
        });
        input.addEventListener('focus', function () { if (input.value.trim()) runSearch(); });
        document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) hideDD(); });
        input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hideDD(); input.blur(); } });

        var form = input.closest('form');
        if (form) {
            form.addEventListener('submit', function (e) {
                if (!input.value.trim()) { e.preventDefault(); goToSearchPage(); return; }
                hideDD();
            });
        }
    })();

    // ── Profile page ──
    if (document.querySelector('.profile-layout') || document.querySelector('.profile-page')) {
        var user = JSON.parse(localStorage.getItem('sh-user') || 'null');
        if (!user) { window.location.href = '/'; return; }
        loadUserData();
        var firstTab     = document.querySelector('.profile-nav-item');
        var firstSection = document.querySelector('.profile-section');
        if (firstTab)     firstTab.classList.add('active');
        if (firstSection) firstSection.classList.add('active');
    }

    // ── Header avatar pill if logged in ──
    var _user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (_user) {
        document.querySelectorAll('.btn-login').forEach(function (btn) {
            btn.textContent = _user.username.toUpperCase();
            btn.onclick = function () { window.location.href = '/profile/'; };
        });
    }

    // ── SORT ── (called last so all cards are in DOM)
    initSort();
});

/* ══════════════════════════════════════════════════════
   THEME FUNCTIONS
══════════════════════════════════════════════════════ */
function initTheme() {
    // Theme is already applied at the top of the file to prevent FOUC
}

function toggleTheme() {
    const html = document.documentElement;
    const body = document.body;
    
    if (html.classList.contains('light')) {
        html.classList.remove('light');
        body && body.classList.remove('light');
        localStorage.setItem('sh-theme', 'dark');
    } else {
        html.classList.add('light');
        body && body.classList.add('light');
        localStorage.setItem('sh-theme', 'light');
    }
}

/* ══════════════════════════════════════════════════════
   MODAL FUNCTIONS
══════════════════════════════════════════════════════ */
function openLoginModal() {
    document.getElementById('loginModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.classList.remove('open');
    });
    document.body.style.overflow = '';
}

function loadUserData() {
    // Implementation depends on your user data structure
    const user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (user) {
        // Populate user data in profile sections
        const elements = {
            'profileUsername': user.username || '',
            'profileEmail': user.email || '',
            'profileFullName': user.full_name || '',
            'profilePhone': user.phone || '',
            'profileAddress': user.address || ''
        };
        
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
    }
}

/* ══════════════════════════════════════════════════════
   SORT — client-side, no page reload
══════════════════════════════════════════════════════ */
function initSort() {
    console.log('initSort() called');
    const selects = document.querySelectorAll('.sort-select');
    console.log('Found sort selects:', selects.length);
    
    selects.forEach(function (select, index) {
        console.log('Setting up select', index, select);
        select.addEventListener('change', function () {
            console.log('Select changed, value:', this.value);
            sortProducts(this.value);
        });
    });
}

function sortProducts(order) {
    console.log('Sorting by:', order);

    // Helper function to safely parse price from dataset
    function getPrice(card, attr) {
        const value = card.dataset[attr] || card.dataset[attr.replace(/([A-Z])/g, '-$1').toLowerCase()] || '0';
        // Remove commas and convert to number
        return parseFloat(value.toString().replace(/,/g, '')) || 0;
    }

    document.querySelectorAll('.product-grid').forEach(function (grid) {
        var cards = Array.from(grid.querySelectorAll('.product-card'));
        console.log('Found cards:', cards.length);
        
        if (!cards.length) return;

        cards.forEach(function (card, i) {
            if (!card.dataset.origIndex) card.dataset.origIndex = String(i);
        });

        // Debug first card data
        if (cards.length > 0) {
            console.log('First card data:', {
                name: cards[0].dataset.name,
                price: cards[0].dataset.price,
                oldPrice: cards[0].dataset.oldPrice,
                priceParsed: getPrice(cards[0], 'price'),
                oldPriceParsed: getPrice(cards[0], 'oldPrice')
            });
        }

        var sorted;

        switch (order) {

            case 'price-asc':
                sorted = cards.slice().sort(function (a, b) {
                    return getPrice(a, 'price') - getPrice(b, 'price');
                });
                break;

            case 'price-desc':
                sorted = cards.slice().sort(function (a, b) {
                    return getPrice(b, 'price') - getPrice(a, 'price');
                });
                break;

            case 'discount':
                sorted = cards.slice().sort(function (a, b) {
                    const oldPriceA = getPrice(a, 'oldPrice');
                    const oldPriceB = getPrice(b, 'oldPrice');
                    const priceA = getPrice(a, 'price');
                    const priceB = getPrice(b, 'price');
                    
                    // Calculate discount amount (difference between old price and current price)
                    const discountA = oldPriceA > 0 ? oldPriceA - priceA : 0;
                    const discountB = oldPriceB > 0 ? oldPriceB - priceB : 0;
                    
                    return discountB - discountA;
                });
                break;

            case 'name':
                sorted = cards.slice().sort(function (a, b) {
                    var na = (a.querySelector('.p-name') || {}).textContent || '';
                    var nb = (b.querySelector('.p-name') || {}).textContent || '';
                    return na.trim().toLowerCase().localeCompare(nb.trim().toLowerCase());
                });
                break;

            default:
                sorted = cards.slice().sort(function (a, b) {
                    return parseInt(a.dataset.origIndex) - parseInt(b.dataset.origIndex);
                });
        }

        sorted.forEach(function (card) {
            grid.appendChild(card);
        });
    });
}