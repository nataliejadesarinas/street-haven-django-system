/* ═══════════════════════════════════════════════════════════════
   STREET.HAVEN — gg.js  (shared across all pages)
   ═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   PRODUCT DATA  (used by product view modal + cart)
══════════════════════════════════════════════════════ */
const PRODUCT_DATA = {
    /* SHOES */
    'Air Force 1 Low':       { brand:'Nike',        price:4200, oldPrice:5800,  badge:'sale', sizes:[7,8,9,10,11,12], desc:'A timeless streetwear classic. The Nike Air Force 1 Low features durable leather upper, Air cushioning, and pivot circles for easy movement on court and street.', imgSrc:'static/images/air_forcelow1.jpg' },
    'Air Max 90':            { brand:'Nike',        price:5500, oldPrice:7200,  badge:'sale', sizes:[7,8,9,10,11,12], desc:'Iconic Max Air cushioning meets bold street-ready style. The Air Max 90 stays fresh with its visible Air unit and classic runner silhouette.', imgSrc:'static/images/air_max90.jpg' },
    'Dunk Low Retro':        { brand:'Nike',        price:6800, oldPrice:null,  badge:'new',  sizes:[6,7,8,9,10,11], desc:'Born on the hardwood, the Nike Dunk Low Retro brings vintage hoops style to the streets. Padded collar and herringbone traction complete the retro look.', imgSrc:'static/images/dunk_lowretro.jpg' },
    'Jordan 1 Mid':          { brand:'Jordan',      price:8900, oldPrice:10500, badge:'hot',  sizes:[8,9,10,11,12],  desc:"MJ's legacy lives on. The Air Jordan 1 Mid features premium leather, Nike Air cushioning, and the iconic Wings logo.", imgSrc:'static/images/jordan1mid.jpg' },
    'Jordan 4 Retro':        { brand:'Jordan',      price:12000,oldPrice:null,  badge:'new',  sizes:[8,9,10,11],     desc:'The Air Jordan 4 Retro brings back the visible Air sole and mesh panels from 1989. A grail for collectors.', imgSrc:'static/images/jordan4retro.jpg' },
    'Ultraboost 22':         { brand:'Adidas',      price:7200, oldPrice:9000,  badge:'sale', sizes:[7,8,9,10,11,12],desc:'Maximum energy return meets modern style. Full-length BOOST midsole and Primeknit+ upper for all-day comfort.', imgSrc:'static/images/ultraboost22.jpg' },
    'Stan Smith':            { brand:'Adidas',      price:3800, oldPrice:null,  badge:null,   sizes:[6,7,8,9,10,11,12], desc:"The original clean court shoe. Stan Smith's minimalist leather upper and punched 3-Stripes remain as fresh today as they were in the 70s.", imgSrc:'static/images/stansmith.jpg' },
    '990v5':                 { brand:'New Balance', price:8500, oldPrice:10000, badge:'sale', sizes:[7,8,9,10,11,12],desc:'Made in the USA with premium suede and mesh. The 990v5 is a dad-shoe icon with ENCAP midsole technology.', imgSrc:'static/images/990v5.jpg' },
    'Chuck Taylor All Star': { brand:'Converse',    price:2500, oldPrice:3200,  badge:'sale', sizes:[6,7,8,9,10,11,12,13], desc:'The most iconic sneaker ever made. Chuck Taylors have been worn by athletes, rebels, and legends since 1917.', imgSrc:'static/images/chucktalyor.jpg' },
    /* APPAREL */
    'Puma Essential Hoodie': { brand:'Puma',        price:2000, oldPrice:2800,  badge:'sale', sizes:['S','M','L','XL','XXL'], desc:'Soft fleece hoodie with Puma Cat branding on the chest. A comfortable everyday streetwear staple.', imgSrc:'static/images/pumaessantialhoddie.jpg' }
};

/* ══════════════════════════════════════════════════════
   SHARED CART STATE  (localStorage-backed)
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
    const data = PRODUCT_DATA[name] || {
        brand: brand || 'Street Haven',
        price: parseFloat(price) || 0,
        imgSrc: imgSrc || ''
    };
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
                <button class="qty-btn" onclick="changeQty('${item.name.replace(/'/g,"\\'")}',-1)">−</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.name.replace(/'/g,"\\'")}',1)">+</button>
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

function openProductModal(card) {
    const nameEl = card.querySelector('.p-name');
    const imgEl  = card.querySelector('.product-thumb img');
    if (!nameEl) return;

    const name    = nameEl.textContent.trim();
    const imgSrc  = card.dataset.img || (imgEl ? imgEl.src : '');
    const brand   = card.dataset.brand || '';
    const price   = parseFloat(card.dataset.price) || 0;
    const desc    = card.dataset.desc || '';

    const data = PRODUCT_DATA[name] || {
        brand:    brand,
        price:    price,
        oldPrice: null,
        badge:    null,
        sizes:    ['S','M','L','XL','XXL'],
        desc:     desc,
        imgSrc:   imgSrc
    };

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

document.addEventListener('DOMContentLoaded', () => {
    function loadUserData() {
        const user = JSON.parse(localStorage.getItem('sh-user') || '{}');
        if (!user.id) return;

        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        setText('profileUsername', user.username || 'User');
        setText('profileEmail', user.email || '');
        setText('avatarInitial', user.username ? user.username[0].toUpperCase() : 'U');

        ['Name', 'Username', 'Email', 'Contact', 'Dob', 'Address'].forEach(field => {
            const el = document.getElementById('settings' + field);
            if (el && user[field.toLowerCase()]) el.value = user[field.toLowerCase()];
        });

        setText('settingsAvatar', user.username ? user.username[0].toUpperCase() : 'U');
        setText('settingsAvatarName', user.username || 'User');
        if (user.avatar) {
            const avatarImg = document.getElementById('avatarImg');
            const avatarInitial = document.getElementById('avatarInitial');
            if (avatarImg) {
                avatarImg.src = user.avatar;
                avatarImg.style.display = 'block';
            }
            if (avatarInitial) avatarInitial.style.display = 'none';
        }

        setText('orderCount', user.orders || 0);
        setText('favCount', user.favorites || 0);
        setText('profileHeaderName', user.username || 'User');
        setText('profileHeaderAvatar', user.username ? user.username[0].toUpperCase() : 'U');
    }

    function switchTab(tab, btn) {
        document.querySelectorAll('.profile-nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('section-' + tab).classList.add('active');
        document.getElementById('settingsSuccess')?.classList.remove('show');
        document.getElementById('passwordSuccess')?.classList.remove('show');
    }

    window.switchTab = switchTab;
    window.loadUserData = loadUserData;

    const profileElements = document.querySelectorAll('.profile-page, .profile-layout');
    if (profileElements.length > 0) {
        loadUserData();
    }

    updateCartCount();

    (function initGlobalSearch() {
        const wrap = document.querySelector('.search-wrap');
        const input = document.getElementById('globalSearchInput');
        const btn = document.getElementById('globalSearchBtn');
        const dd = document.getElementById('searchDropdown');
        if (!wrap || !input || !dd) return;

        let path = wrap.getAttribute('data-search-url') || wrap.dataset.searchUrl || '/api/search/';
        if (!path.startsWith('/')) path = '/' + path.replace(/^\/+/, '');
        let searchPage = wrap.getAttribute('data-search-page-url') || '/search/';
        if (!searchPage.startsWith('/')) searchPage = '/' + searchPage.replace(/^\/+/, '');

        function goToSearchPage() {
            const q = input.value.trim();
            if (!q) {
                window.location.href = new URL(searchPage, window.location.origin).toString();
                return;
            }
            const u = new URL(searchPage, window.location.origin);
            u.searchParams.set('q', q);
            window.location.href = u.toString();
        }

        let seq = 0;

        function syncDropdownPosition() {
            if (dd.hidden) return;
            const r = input.getBoundingClientRect();
            dd.style.left = r.left + 'px';
            dd.style.top = r.bottom + 6 + 'px';
            dd.style.width = Math.max(r.width, 200) + 'px';
        }

        function hideDropdown() {
            dd.hidden = true;
            dd.innerHTML = '';
            dd.style.left = '';
            dd.style.top = '';
            dd.style.width = '';
        }

        function showLoading() {
            dd.hidden = false;
            dd.innerHTML = '<div class="search-loading" role="status">Searching…</div>';
            syncDropdownPosition();
        }

        window.addEventListener('scroll', syncDropdownPosition, true);
        window.addEventListener('resize', syncDropdownPosition);

        function renderResults(query, results) {
            dd.innerHTML = '';
            if (!query.trim()) {
                hideDropdown();
                return;
            }
            if (!results.length) {
                dd.hidden = false;
                const empty = document.createElement('div');
                empty.className = 'search-empty';
                empty.setAttribute('role', 'status');
                empty.textContent = 'No products match your search. Try a different name, brand, or category.';
                dd.appendChild(empty);
                syncDropdownPosition();
                return;
            }
            dd.hidden = false;
            results.forEach((item) => {
                const row = document.createElement('a');
                row.className = 'search-result-row';
                row.href = '#';
                row.setAttribute('role', 'option');

                const thumb = document.createElement('span');
                thumb.className = 'search-result-thumb';
                if (item.image) {
                    const im = document.createElement('img');
                    im.src = item.image;
                    im.alt = '';
                    thumb.appendChild(im);
                } else {
                    thumb.textContent = '🛍';
                }

                const meta = document.createElement('span');
                meta.className = 'search-result-meta';
                const name = document.createElement('span');
                name.className = 'search-result-name';
                name.textContent = item.name || '';
                const sub = document.createElement('span');
                sub.className = 'search-result-sub';
                sub.textContent = [item.brand, item.category].filter(Boolean).join(' · ');
                meta.appendChild(name);
                meta.appendChild(sub);

                const price = document.createElement('span');
                price.className = 'search-result-price';
                price.textContent = '₱' + Number(item.price || 0).toLocaleString();

                row.appendChild(thumb);
                row.appendChild(meta);
                row.appendChild(price);
                row.addEventListener('click', (e) => {
                    e.preventDefault();
                    hideDropdown();
                    input.blur();
                    goToSearchPage();
                });
                dd.appendChild(row);
            });

            const seeAll = document.createElement('a');
            seeAll.className = 'search-see-all';
            seeAll.href = '#';
            seeAll.textContent = 'View all results →';
            seeAll.addEventListener('click', (e) => {
                e.preventDefault();
                hideDropdown();
                goToSearchPage();
            });
            dd.appendChild(seeAll);

            syncDropdownPosition();
        }

        function runSearch() {
            const q = input.value.trim();
            if (!q) {
                hideDropdown();
                return;
            }
            const my = ++seq;
            showLoading();
            let fetchUrl;
            try {
                const u = new URL(path, window.location.origin);
                u.searchParams.set('q', q);
                fetchUrl = u.toString();
            } catch (e) {
                fetchUrl = path + (path.includes('?') ? '&' : '?') + 'q=' + encodeURIComponent(q);
            }
            fetch(fetchUrl, { credentials: 'same-origin' })
                .then((res) => {
                    if (!res.ok) throw new Error('bad status');
                    return res.json();
                })
                .then((data) => {
                    if (my !== seq) return;
                    renderResults(data.query || q, data.results || []);
                })
                .catch(() => {
                    if (my !== seq) return;
                    dd.hidden = false;
                    dd.innerHTML = '';
                    const err = document.createElement('div');
                    err.className = 'search-empty';
                    err.setAttribute('role', 'alert');
                    err.textContent = 'Search is temporarily unavailable. Please try again.';
                    dd.appendChild(err);
                    syncDropdownPosition();
                });
        }

        const debounced = (function () {
            let t;
            return function () {
                clearTimeout(t);
                t = setTimeout(runSearch, 280);
            };
        })();

        input.addEventListener('input', () => {
            if (!input.value.trim()) {
                seq += 1;
                hideDropdown();
                return;
            }
            debounced();
        });

        input.addEventListener('focus', () => {
            if (input.value.trim()) debounced();
        });

        const searchForm = input.closest('form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                if (!input.value.trim()) {
                    e.preventDefault();
                    window.location.href = new URL(searchPage, window.location.origin).toString();
                    return;
                }
                hideDropdown();
            });
        }

        document.addEventListener('click', (e) => {
            if (!wrap.contains(e.target)) hideDropdown();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideDropdown();
                input.blur();
            }
        });
    })();

    document.querySelectorAll('.cart-btn').forEach(btn => btn.addEventListener('click', openCartSidebar));

    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.dataset.pdCart !== undefined) {
                addToCart(
                    btn.dataset.name || '',
                    btn.dataset.img || '',
                    btn.dataset.price || 0,
                    btn.dataset.brand || ''
                );
                return;
            }
            const card   = btn.closest('.product-card');
            if (!card) return;
            const nameEl = card.querySelector('.p-name');
            const imgEl  = card.querySelector('.product-thumb img');
            const name   = nameEl ? nameEl.textContent.trim() : '';
            const imgSrc = card.dataset.img || (imgEl ? imgEl.src : '');
            const price  = card.dataset.price || 0;
            const brand  = card.dataset.brand || '';
            addToCart(name, imgSrc, price, brand);
        });
    });

    document.querySelectorAll('.product-card:not(.search-result-card)').forEach(card => {
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

    window.uploadAvatar = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 2*1024*1024) { showNotif('File too large (max 2MB)'); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            const user = JSON.parse(localStorage.getItem('sh-user') || '{}');
            user.avatar = e.target.result;
            localStorage.setItem('sh-user', JSON.stringify(user));
            const img = document.getElementById('avatarImg');
            img.src = user.avatar;
            img.style.display = 'block';
            document.getElementById('avatarInitial').style.display = 'none';
            document.querySelectorAll('.avatar-big, #settingsAvatar, #profileHeaderAvatar').forEach(el => {
                el.innerHTML = '<img src="' + user.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">';
            });
            document.getElementById('settingsAvatarName').textContent = user.username || 'User';
            showNotif('Profile picture updated!');
        };
        reader.readAsDataURL(file);
    };

    window.saveSettings = function() {
        const user = JSON.parse(localStorage.getItem('sh-user') || '{}');
        const fields = {
            name: document.getElementById('settingsName').value,
            username: document.getElementById('settingsUsername').value,
            email: document.getElementById('settingsEmail').value,
            contact: document.getElementById('settingsContact').value,
            dob: document.getElementById('settingsDob').value,
            address: document.getElementById('settingsAddress').value
        };
        Object.assign(user, fields);
        localStorage.setItem('sh-user', JSON.stringify(user));
        loadUserData();
        document.getElementById('settingsSuccess').classList.add('show');
        setTimeout(() => document.getElementById('settingsSuccess').classList.remove('show'), 4000);
        showNotif('Settings saved!');
    };

    window.changePassword = function() {
        const newP    = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        if (newP !== confirm) { showNotif('Passwords do not match'); return; }
        if (newP.length < 6) { showNotif('Password must be at least 6 characters'); return; }
        showNotif('Password updated! (Demo)');
        document.getElementById('passwordSuccess').classList.add('show');
        setTimeout(() => document.getElementById('passwordSuccess').classList.remove('show'), 4000);
        ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => {
            document.getElementById(id).value = '';
        });
    };

    window.doLogout = function() {
        if (confirm('Logout?')) {
            localStorage.removeItem('sh-user');
            window.location.href = '/';
        }
    };

    window.deleteAccount = function() {
        if (confirm('Delete account PERMANENTLY? All data will be lost.')) {
            localStorage.removeItem('sh-user');
            fetch('/login/', {method: 'POST', body: JSON.stringify({logout: true})});
            showNotif('Account deleted');
            setTimeout(() => window.location.href = '/', 1500);
        }
    };

    window.openLoginModal = function() {
        document.getElementById('loginModal').classList.add('open');
        document.getElementById('signupModal').classList.remove('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeAllModals = function() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
    };

    window.openSignupModal = function() {
        document.getElementById('signupModal').classList.add('open');
        document.getElementById('loginModal').classList.remove('open');
    };

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeAllModals();
        });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = () => {
            btn.closest('.modal-overlay').classList.remove('open');
            document.body.style.overflow = '';
        };
    });

    window.doLogin = async function() {
        const email    = document.querySelector('#loginModal input[type="email"]').value;
        const password = document.querySelector('#loginModal input[type="password"]').value;
        if (!email || !password) return showNotif('Please fill all fields');
        try {
            const res  = await fetch('/login/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('sh-user', JSON.stringify(data.user));
                document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
                document.body.style.overflow = '';
                showNotif(`Welcome back, ${data.user.username}!`);
                setTimeout(() => location.reload(), 500);
            } else {
                showNotif(data.error || 'Login failed');
            }
        } catch(e) {
            showNotif('Network error');
        }
    };

    window.doRegister = async function() {
        const formData = {
            name:     document.querySelector('#signupModal input[placeholder*="Juan"]').value,
            username: document.querySelector('#signupModal input[placeholder*="juandc"]').value,
            password: document.querySelector('#signupModal input[type="password"]').value,
            email:    document.querySelector('#signupModal input[type="tel"]').closest('.form-group').previousElementSibling.querySelector('input')?.value || '',
            contact:  document.querySelector('#signupModal input[type="tel"]').value,
            address:  document.querySelector('#signupModal input[placeholder*="Street"]').value,
            dob:      getDOBString()
        };
        if (!formData.name || !formData.username || !formData.password || !formData.email) return showNotif('Please fill required fields');
        try {
            const res  = await fetch('/register/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('sh-user', JSON.stringify(data.user));
                document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
                document.body.style.overflow = '';
                showNotif(`Welcome to Haven, ${data.user.username}!`);
                setTimeout(() => location.reload(), 500);
            } else {
                showNotif(data.error || 'Registration failed');
            }
        } catch(e) {
            showNotif('Network error');
        }
    };

    function getDOBString() {
        const month = document.getElementById('dobMonth')?.selectedIndex;
        const day   = document.getElementById('dobDay')?.value;
        const year  = document.getElementById('dobYear')?.value;
        if (month && day && year) return `${year}-${String(day).padStart(2,'0')}-${String(month).padStart(2,'0')}`;
        return '';
    }
});

/* ══════════════════════════════════════════════════════
   PROFILE PAGE - Standalone
══════════════════════════════════════════════════════ */
if (document.querySelector('.profile-page')) {
    const _user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (!_user) window.location.href = '/';
    else loadUserData();
}

function loadUserData() {
    const _user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (!_user) return;
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail    = document.getElementById('profileEmail');
    const avatarInitial   = document.getElementById('avatarInitial');
    if (profileUsername) profileUsername.textContent = _user.username || 'User';
    if (profileEmail)    profileEmail.textContent    = _user.email    || '';
    if (avatarInitial)   avatarInitial.textContent   = _user.username ? _user.username[0].toUpperCase() : 'U';

    ['Name', 'Username', 'Email', 'Contact', 'Dob', 'Address'].forEach(field => {
        const el = document.getElementById('settings' + field);
        if (el && _user[field.toLowerCase()]) el.value = _user[field.toLowerCase()];
    });

    const settingsAvatar     = document.getElementById('settingsAvatar');
    const settingsAvatarName = document.getElementById('settingsAvatarName');
    const orderCount         = document.getElementById('orderCount');
    const favCount           = document.getElementById('favCount');

    if (settingsAvatar)     settingsAvatar.textContent     = _user.username ? _user.username[0].toUpperCase() : 'U';
    if (settingsAvatarName) settingsAvatarName.textContent = _user.username || 'User';
    if (orderCount)         orderCount.textContent         = _user.orders   || 0;
    if (favCount)           favCount.textContent           = _user.favorites || 0;

    if (_user.avatar) {
        const img = document.getElementById('avatarImg');
        if (img) {
            img.src = _user.avatar;
            img.style.display = 'block';
            if (avatarInitial) avatarInitial.style.display = 'none';
        }
    }
}

function switchTab(tab, btn) {
    document.querySelectorAll('.profile-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('section-' + tab).classList.add('active');
    document.getElementById('settingsSuccess')?.classList.remove('show');
    document.getElementById('passwordSuccess')?.classList.remove('show');
}

function uploadAvatar(event) {
    const file = event.target.files[0];
    if (!file || file.size > 2*1024*1024) return alert('Max 2MB image');
    const reader = new FileReader();
    reader.onload = function(e) {
        const _user = JSON.parse(localStorage.getItem('sh-user') || 'null');
        if (!_user) return;
        _user.avatar = e.target.result;
        localStorage.setItem('sh-user', JSON.stringify(_user));
        const img = document.getElementById('avatarImg');
        img.src = _user.avatar;
        img.style.display = 'block';
        document.getElementById('avatarInitial').style.display = 'none';
        alert('Avatar updated!');
        loadUserData();
    };
    reader.readAsDataURL(file);
}

function saveSettings() {
    const _user = JSON.parse(localStorage.getItem('sh-user') || 'null');
    if (!_user) return;
    const fields = {
        name:     document.getElementById('settingsName').value,
        username: document.getElementById('settingsUsername').value,
        email:    document.getElementById('settingsEmail').value,
        contact:  document.getElementById('settingsContact').value,
        dob:      document.getElementById('settingsDob').value,
        address:  document.getElementById('settingsAddress').value
    };
    Object.assign(_user, fields);
    localStorage.setItem('sh-user', JSON.stringify(_user));
    loadUserData();
    document.getElementById('settingsSuccess').style.display = 'block';
    setTimeout(() => document.getElementById('settingsSuccess').style.display = 'none', 3000);
}

function changePassword() {
    const newP    = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newP !== confirm || newP.length < 6) return alert('Password mismatch or too short');
    alert('Password changed!');
    ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => document.getElementById(id).value = '');
}

function doLogout() {
    if (confirm('Logout?')) {
        localStorage.removeItem('sh-user');
        window.location.href = '/';
    }
}