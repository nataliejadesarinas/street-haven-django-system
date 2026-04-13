/*
 * ULTIMATE COMBINED JAVASCRIPT FILE
 * All JavaScript from static and staticfiles directories merged into one file
 * Generated: $(date)
 */

/* ==================== DJANGO ADMIN JAVASCRIPT ==================== */

/* Django admin core JavaScript */
(function($) {
    'use strict';

    // Django admin namespace
    window.django = window.django || {};

    // jQuery initialization for Django admin
    django.jQuery = $;

})(jQuery);

/* Django admin date/time shortcuts */
var DateTimeShortcuts = {
    calendars: [],
    calendarInputs: [],
    dismissClockFunc: [],
    dismissCalendarFunc: [],
    calendarDivName1: 'calendarbox',
    calendarDivName2: 'calendarin',
    clockDivName: 'clockbox',
    admin_media_prefix: '/static/admin/',
    
    init: function() {
        // Initialize date/time shortcuts
        this.calendarInputs = document.getElementsByTagName('input');
        for (var i = 0; i < this.calendarInputs.length; i++) {
            var calendarInput = this.calendarInputs[i];
            if (calendarInput.type === 'text' && calendarInput.className.search('vDateField') !== -1) {
                this.addCalendar(calendarInput);
            }
            if (calendarInput.type === 'text' && calendarInput.className.search('vTimeField') !== -1) {
                this.addClock(calendarInput);
            }
        }
    },
    
    addCalendar: function(inp) {
        var num = this.calendars.length;
        var calendar = document.createElement('div');
        calendar.setAttribute('id', this.calendarDivName1 + num);
        calendar.setAttribute('class', 'calendarbox module');
        calendar.setAttribute('style', 'display:none;');
        document.body.appendChild(calendar);
        
        this.calendars[num] = calendar;
        var calendarLink = document.createElement('a');
        calendarLink.setAttribute('href', 'javascript:DateTimeShortcuts.openCalendar(' + num + ');');
        calendarLink.setAttribute('class', 'datetimeshortcuts');
        calendarLink.innerHTML = 'Calendar';
        inp.parentNode.insertBefore(calendarLink, inp.nextSibling);
    },
    
    addClock: function(inp) {
        var num = this.clockDivs.length;
        var clock = document.createElement('div');
        clock.setAttribute('id', this.clockDivName + num);
        clock.setAttribute('class', 'clockbox module');
        clock.setAttribute('style', 'display:none;');
        document.body.appendChild(clock);
        
        this.clockDivs[num] = clock;
        var clockLink = document.createElement('a');
        clockLink.setAttribute('href', 'javascript:DateTimeShortcuts.openClock(' + num + ');');
        clockLink.setAttribute('class', 'datetimeshortcuts');
        clockLink.innerHTML = 'Clock';
        inp.parentNode.insertBefore(clockLink, inp.nextSibling);
    }
};

/* Django admin related object lookups */
function showRelatedObjectLookupPopup(triggeringLink) {
    var name = triggeringLink.id.replace(/^lookup_/, '');
    var href = triggeringLink.search;
    var win = window.open(href + '?_popup=1', name, 'height=500,width=800,resizable=yes,scrollbars=yes');
    win.focus();
    return false;
}

function dismissRelatedLookupPopup(win, chosenId) {
    var name = win.name;
    var elem = document.getElementById(name);
    if (elem.className.indexOf('vManyToManyRelatedFieldWrap') !== -1) {
        elem = elem.getElementsByTagName('input')[0];
    }
    elem.value = chosenId;
    win.close();
}

/* ==================== STREET.HAVEN JAVASCRIPT ==================== */

/* STREET.HAVEN - gg.js */

/* THEME - Apply IMMEDIATELY to prevent flash (FOUC fix) */
(function () {
    if (localStorage.getItem('sh-theme') === 'light') {
        document.documentElement.classList.add('light');
        document.body && document.body.classList.add('light');
    }
})();

/* PRODUCT DATA */
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

/* CART (localStorage-backed) */
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
                <span>??</span>
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
                <div class="cart-item-price">?${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="changeQty('${item.name.replace(/'/g,"\\'")}', -1)">-</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.name.replace(/'/g,"\\'")}', 1)">+</button>
                <button class="delete-btn" onclick="removeFromCart('${item.name.replace(/'/g,"\\'")}')">?</button>
            </div>
        </div>`).join('');

    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total    = subtotal + shipping;

    footer.innerHTML = `
        <div class="cart-summary-row"><span>Subtotal</span><span>?${subtotal.toLocaleString()}</span></div>
        <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--red)">FREE</span>' : '?' + shipping}</span></div>
        <div class="cart-summary-row total"><span>TOTAL</span><span>?${total.toLocaleString()}</span></div>
        <button class="checkout-btn" onclick="closeCartSidebar();openCheckout()">CHECKOUT ?</button>
        <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>`;
}

/* CHECKOUT */
function openCheckout() {
    if (cart.length === 0) { showNotif('Your cart is empty!'); return; }
    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total    = subtotal + shipping;
    const el = document.getElementById('checkoutSummary');
    if (el) {
        el.innerHTML =
            cart.map(i => `<div class="cs-row"><span>${i.name} ?${i.qty}</span><span>?${(i.price*i.qty).toLocaleString()}</span></div>`).join('') +
            `<div class="cs-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '?'+shipping}</span></div>
             <div class="cs-row total"><span>TOTAL</span><span>?${total.toLocaleString()}</span></div>`;
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
    showNotif('? Order placed! Thank you!');
}

/* PRODUCT MODAL */
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
        <span class="pm-price-now">?${data.price.toLocaleString()}</span>
        ${data.oldPrice ? `<span class="pm-price-old">?${data.oldPrice.toLocaleString()}</span><span class="pm-discount">-${discount}%</span>` : ''}`;
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

/* NOTIFICATION */
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

/* DOB DROPDOWNS (auto-populate Day & Year) */
function initDOBDropdowns() {
    const dayEl   = document.getElementById('dobDay');
    const yearEl  = document.getElementById('dobYear');
    const monthEl = document.getElementById('dobMonth');
    if (!dayEl || !yearEl || !monthEl) return;

    // Populate days 1-31
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

/* CITY DATA - Minimal cities per province */
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

/* PROFILE FUNCTIONS */
function switchTab(name, el) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    // Remove active from all nav items
    document.querySelectorAll('.profile-nav-item').forEach(b => b.classList.remove('active'));
    // Show selected section
    document.getElementById('section-' + name).classList.add('active');
    // Activate clicked button
    el.classList.add('active');
}

/* DOMContentLoaded - ONE single listener, everything wired here */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Street.Haven script loaded - DOM ready');

    // Theme
    initTheme();
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', toggleTheme);
    });

    // Address dropdowns (signup modal)
    var provinceEl = document.getElementById('signupProvince');
    if (provinceEl) initAddressDropdowns();

    // Wrap openSignupModal SAFELY here, not at file scope
    var _origOpenSignup = openSignupModal;
    openSignupModal = function () {
        _origOpenSignup();
        setTimeout(initAddressDropdowns, 50);
    };

    // Cart
    updateCartCount();
    document.querySelectorAll('.cart-btn').forEach(function (btn) {
        btn.addEventListener('click', openCartSidebar);
    });
    var cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);

    // Add-to-cart buttons
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

    // Product card click - modal
    document.querySelectorAll('.product-card:not(.search-result-card)').forEach(function (card) {
        var thumb = card.querySelector('.product-thumb');
        if (thumb && !thumb.querySelector('.product-thumb-overlay')) {
            var overlay = document.createElement('div');
            overlay.className = 'product-thumb-overlay';
            overlay.textContent = '? VIEW';
            thumb.appendChild(overlay);
        }
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('add-btn')) return;
            openProductModal(card);
        });
    });

    // Modal close buttons
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

    // Login button
    document.querySelectorAll('.btn-login').forEach(function (btn) {
        btn.addEventListener('click', openLoginModal);
    });

    // DOB dropdowns
    initDOBDropdowns();

    // Search
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
            dd.innerHTML = '<div class="search-loading">Searching?</div>';
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
                            '<span class="search-result-thumb">' + (item.image ? '<img src="' + item.image + '" alt="">' : '?') + '</span>' +
                            '<span class="search-result-meta"><span class="search-result-name">' + (item.name || '') + '</span>' +
                            '<span class="search-result-sub">' + [item.brand, item.category].filter(Boolean).join(' · ') + '</span></span>' +
                            '<span class="search-result-price">?' + Number(item.price || 0).toLocaleString() + '</span>';
                        row.addEventListener('click', function (e) { e.preventDefault(); hideDD(); goToSearchPage(); });
                        dd.appendChild(row);
                    });
                    var sa = document.createElement('a');
                    sa.className = 'search-see-all'; sa.href = '#'; sa.textContent = 'View all results ?';
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

    // Profile page is protected by Django's @login_required - no JS check needed
    if (document.querySelector('.profile-layout') || document.querySelector('.profile-page')) {
        loadUserData();
        var firstTab     = document.querySelector('.profile-nav-item');
        var firstSection = document.querySelector('.profile-section');
        if (firstTab)     firstTab.classList.add('active');
        if (firstSection) firstSection.classList.add('active');
    }

    // Header is handled by Django's template with {% if user.is_authenticated %}

    // SORT (called last so all cards are in DOM)
    initSort();
});

/* THEME FUNCTIONS */
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

/* MODAL FUNCTIONS */
function openLoginModal() {
    console.log('openLoginModal() called');
    const modal = document.getElementById('loginModal');
    console.log('Modal element:', modal);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        console.log('Modal opened');
    } else {
        console.error('Login modal not found!');
    }
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

/* SORT FUNCTION */
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function () {
        const value = this.value;
        const grid = document.querySelector('.product-grid');
        if (!grid) return;

        const cards = Array.from(grid.children);
        if (value === 'default') return; // nothing to do

        const sorted = cards.sort((a, b) => {
            if (value === 'price-asc') {
                return (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0);
            }
            if (value === 'price-desc') {
                return (parseFloat(b.dataset.price) || 0) - (parseFloat(a.dataset.price) || 0);
            }
            if (value === 'name') {
                const na = (a.querySelector('.p-name')?.textContent || '').trim();
                const nb = (b.querySelector('.p-name')?.textContent || '').trim();
                return na.localeCompare(nb);
            }
            if (value === 'discount') {
                const discountOf = card => {
                    const price = parseFloat(card.dataset.price) || 0;
                    const old   = parseFloat(card.dataset.oldPrice) || 0;
                    return old > 0 ? ((old - price) / old) : 0;
                };
                return discountOf(b) - discountOf(a);
            }
            return 0;
        });

        sorted.forEach(card => grid.appendChild(card));
    });
}

/* ==================== SIDEBAR FILTERS ==================== */
/* STREET.HAVEN - sidebar_filters.js */
(function () {
    'use strict';

    /* Read current URL params */
    function getParams() {
        return new URLSearchParams(window.location.search);
    }

    /* Navigate to same page with updated params */
    function applyFilter(updates) {
        const params = getParams();
        Object.entries(updates).forEach(([key, val]) => {
            if (val === null || val === '') {
                params.delete(key);
            } else {
                params.set(key, val);
            }
        });
        params.delete('page'); // always reset pagination
        window.location.href = window.location.pathname + '?' + params.toString();
    }

    /* Smooth scroll to maintain sidebar position */
    function applyFilterWithScroll(updates) {
        const sidebar = document.querySelector('.sidebar');
        const scrollY = sidebar ? sidebar.scrollTop : 0;
        applyFilter(updates);
        setTimeout(() => {
            if (sidebar) {
                sidebar.scrollTop = scrollY;
            }
        }, 100);
    }

    /* RESTORE ACTIVE STATES from URL on every page load */
    function restoreActiveStates() {
        const params   = getParams();
        const brand    = (params.get('brand')     || '').toLowerCase();
        const color    = (params.get('color')     || '').toLowerCase();
        const size     = params.get('size')      || '';
        const priceMin = params.get('price_min')  || '';
        const priceMax = params.get('price_max')  || '';

        /* Brand logos */
        if (brand) {
            document.querySelectorAll('.brand-item').forEach(a => {
                const b = (a.dataset.brand || '').toLowerCase();
                if (b === brand) {
                    a.classList.add('filter-active');
                    a.style.opacity = '1';
                    a.style.filter  = 'none';
                    a.style.outline = '2px solid var(--red)';
                    a.style.borderRadius = '6px';
                }
            });
        }

        /* Color dots */
        if (color) {
            document.querySelectorAll('.clr-dot').forEach(dot => {
                if ((dot.dataset.color || '').toLowerCase() === color) {
                    dot.classList.add('active');
                }
            });
        }

        /* Size buttons */
        if (size) {
            document.querySelectorAll('.sz-btn').forEach(btn => {
                if (btn.textContent.trim() === size) {
                    btn.classList.add('active');
                }
            });
        }

        /* Price inputs */
        if (priceMin) {
            const el = document.querySelector('.price-row input[placeholder="Min"]');
            if (el) el.value = priceMin;
        }
        if (priceMax) {
            const el = document.querySelector('.price-row input[placeholder="Max"]');
            if (el) el.value = priceMax;
        }

        renderFilterChips(params);
    }

    /* ACTIVE FILTER CHIPS - appear above the product grid */
    function renderFilterChips(params) {
        let bar = document.getElementById('sh-filter-chips');
        if (!bar) {
            const anchor = document.querySelector('.product-grid, .section, .pg-header + *, .toolbar + *');
            if (!anchor) return;
            bar = document.createElement('div');
            bar.id = 'sh-filter-chips';
            bar.style.cssText = ['display:flex', 'flex-wrap:wrap', 'gap:8px', 'padding:12px 36px 0', "font-family:'Barlow Condensed',sans-serif"].join(';');
            anchor.parentNode.insertBefore(bar, anchor);
        }
        bar.innerHTML = '';

        const labelMap = { brand: 'Brand', color: 'Color', price_min: 'Min ?', price_max: 'Max ?' };
        let hasChip = false;

        ['brand', 'color', 'price_min', 'price_max'].forEach(key => {
            const val = params.get(key);
            if (!val) return;
            hasChip = true;

            const chip = document.createElement('span');
            chip.style.cssText = ['display:inline-flex', 'align-items:center', 'gap:6px', 'background:var(--red)', 'color:#fff', 'padding:5px 12px', 'border-radius:20px', 'font-size:12px', 'letter-spacing:1px', 'font-weight:700', 'cursor:pointer', 'user-select:none', 'transition:opacity .15s'].join(';');
            chip.innerHTML = `${labelMap[key]}: ${val} <span style="font-size:14px;line-height:1">?</span>`;
            chip.title = `Remove ${labelMap[key]} filter`;
            chip.addEventListener('mouseenter', () => chip.style.opacity = '.8');
            chip.addEventListener('mouseleave', () => chip.style.opacity = '1');
            chip.addEventListener('click', () => applyFilter({ [key]: null }));
            bar.appendChild(chip);
        });

        if (hasChip) {
            const clearAll = document.createElement('span');
            clearAll.style.cssText = ['display:inline-flex', 'align-items:center', 'background:transparent', 'color:var(--muted)', 'border:1px solid var(--border)', 'padding:5px 12px', 'border-radius:20px', 'font-size:12px', 'letter-spacing:1px', 'font-weight:700', 'cursor:pointer', 'user-select:none'].join(';');
            clearAll.textContent = 'CLEAR ALL ?';
            clearAll.addEventListener('click', () => {
                window.location.href = window.location.pathname;
            });
            bar.appendChild(clearAll);
        }
    }

    /* COLOR DOTS */
    function initColorDots() {
        document.querySelectorAll('.clr-dot').forEach(dot => {
            dot.style.cursor = 'pointer';
            const colorName = dot.dataset.color || dot.title || '';
            if (!colorName) return;

            dot.addEventListener('click', () => {
                const current = (getParams().get('color') || '').toLowerCase();
                applyFilterWithScroll({ color: current === colorName.toLowerCase() ? null : colorName });
            });
        });
    }

    /* SIZE BUTTONS */
    function initSizeButtons() {
        document.querySelectorAll('.sz-btn').forEach(btn => {
            btn.style.cursor = 'pointer';
            const size = btn.textContent.trim();
            if (!size) return;

            btn.addEventListener('click', () => {
                const current = getParams().get('size') || '';
                applyFilterWithScroll({ size: current === size ? null : size });
            });
        });
    }

    /* BRAND LOGOS - intercept click, merge brand into params */
    function initBrandItems() {
        document.querySelectorAll('.brand-item').forEach(a => {
            const brandName = a.dataset.brand || '';
            if (!brandName) return;

            a.addEventListener('click', e => {
                e.preventDefault();
                const current = (getParams().get('brand') || '').toLowerCase();
                applyFilter({ brand: current === brandName.toLowerCase() ? null : brandName });
            });
        });
    }

    /* PRICE RANGE - APPLY FILTER button */
    function initPriceFilter() {
        const applyBtn = document.querySelector('.apply-btn');
        if (!applyBtn) return;

        function doApply() {
            const minEl = document.querySelector('.price-row input[placeholder="Min"]');
            const maxEl = document.querySelector('.price-row input[placeholder="Max"]');
            const min   = minEl ? minEl.value.trim() : '';
            const max   = maxEl ? maxEl.value.trim() : '';

            if (min && max && parseFloat(min) > parseFloat(max)) {
                if (typeof showNotif === 'function') {
                    showNotif('?? Min price cannot exceed Max price');
                } else {
                    alert('Min price cannot exceed Max price');
                }
                return;
            }
            applyFilter({ price_min: min || null, price_max: max || null });
        }

        applyBtn.addEventListener('click', doApply);

        /* Also trigger on Enter key in either input */
        document.querySelectorAll('.price-row input').forEach(input => {
            input.addEventListener('keydown', e => { if (e.key === 'Enter') doApply(); });
        });
    }

    /* RESULT COUNT - updates toolbar count text if present */
    function updateResultCount() {
        const countEl = document.querySelector('.result-count');
        if (!countEl) return;
        const params = getParams();
        const hasFilter = ['brand','color','price_min','price_max'].some(k => params.get(k));
        if (!hasFilter) return;

        const cards = document.querySelectorAll('.product-card').length;
        countEl.textContent = `${cards} RESULT${cards !== 1 ? 'S' : ''}`;
    }

    /* INIT */
    document.addEventListener('DOMContentLoaded', () => {
        restoreActiveStates();
        initColorDots();
        initSizeButtons();
        initBrandItems();
        initPriceFilter();
        updateResultCount();
    });

})();

/* ==================== ADDITIONAL UTILITY FUNCTIONS ==================== */
/* Enhanced notification system */
function createNotif() {
    const notif = document.createElement('div');
    notif.className = 'notif';
    notif.id = 'notif';
    document.body.appendChild(notif);
    return notif;
}

/* Enhanced theme toggle with admin support */
function initTheme() {
    const saved = localStorage.getItem('sh-theme') || 'dark';
    if (saved === 'light') document.body.classList.add('light');
    updateThemeBtn();
}

function updateThemeBtn() {
    const isLight = document.body.classList.contains('light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = isLight ? '?? Dark' : '?? Light';
    });
}

/* Enhanced modal creation */
function createLoginModal() {
    const modalHTML = `
        <div class="modal-overlay" id="loginModal">
            <div class="modal">
                <button class="modal-close" onclick="closeAllModals()">?</button>
                <div class="modal-title">WELCOME<br>BACK</div>
                <div class="modal-sub">Sign in to your Street.Haven account</div>
                <div class="form-group"><label>EMAIL</label><input type="email" placeholder="you@email.com"></div>
                <div class="form-group"><label>PASSWORD</label><input type="password" placeholder="????????"></div>
                <button class="modal-btn">LOGIN</button>
                <div class="modal-divider">? OR ?</div>
                <button class="modal-btn-outline" onclick="openSignupModal()">REGISTER</button>
                <div class="modal-switch">No account? <a onclick="openSignupModal()">Sign Up</a></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('loginModal');
}

function doLogin() {
    console.log('doLogin() called');
    const email = document.querySelector('#loginModal input[type="email"]').value.trim();
    const password = document.querySelector('#loginModal input[type="password"]').value;
    console.log('Email:', email, 'Password length:', password.length);

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
    })
    .then(r => {
        console.log('Response status:', r.status);
        return r.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.success) {
            // Redirect based on user role
            if (data.user.is_superuser || data.user.is_staff) {
                console.log('Redirecting to admin dashboard');
                window.location.href = '/admin-dashboard/';
            } else {
                console.log('Redirecting to profile');
                window.location.href = '/profile/';
            }
        } else {
            alert(data.error || 'Login failed.');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    });
}

function createSignupModal() {
    const modalHTML = `
        <div class="modal-overlay" id="signupModal">
            <div class="modal">
                <button class="modal-close" onclick="closeAllModals()">?</button>
                <div class="modal-title">JOIN<br>THE HAVEN</div>
                <div class="modal-sub">Create your account</div>
                <div class="form-group"><label>FULL NAME</label><input type="text" placeholder="Juan dela Cruz"></div>
                <div class="form-group"><label>EMAIL</label><input type="email" placeholder="you@email.com"></div>
                <div class="form-group"><label>PASSWORD</label><input type="password" placeholder="????????"></div>
                <button class="modal-btn">CREATE ACCOUNT</button>
                <div class="modal-switch">Already have one? <a onclick="openLoginModal()">Login</a></div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('signupModal');
}
