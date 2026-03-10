/* ═══════════════════════════════════════════════════════════════
   STREET.HAVEN — gg.js  (shared across all pages)
   ═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   PRODUCT DATA  (used by product view modal + cart)
══════════════════════════════════════════════════════ */
const PRODUCT_DATA = {
    /* SHOES */
    'Air Force 1 Low':       { brand:'Nike',        price:4200, oldPrice:5800,  badge:'sale', sizes:[7,8,9,10,11,12], desc:'A timeless streetwear classic. The Nike Air Force 1 Low features durable leather upper, Air cushioning, and pivot circles for easy movement on court and street.', imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211d-1769-4f37-9409-30adc7db9229/air-force-1-07-shoes-WnZjD2.png' },
    'Air Max 90':            { brand:'Nike',        price:5500, oldPrice:7200,  badge:'sale', sizes:[7,8,9,10,11,12], desc:'Iconic Max Air cushioning meets bold street-ready style. The Air Max 90 stays fresh with its visible Air unit and classic runner silhouette.', imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-f94c1cd8-d336-4b14-8e23-04e4a7be9b95/air-max-90-shoes-kRsBnD.png' },
    'Dunk Low Retro':        { brand:'Nike',        price:6800, oldPrice:null,  badge:'new',  sizes:[6,7,8,9,10,11], desc:'Born on the hardwood, the Nike Dunk Low Retro brings vintage hoops style to the streets. Padded collar and herringbone traction complete the retro look.', imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3cc96f66-00b9-4e78-ba55-2f53a24d1aa3/dunk-low-retro-shoes-p2T8bM.png' },
    'Jordan 1 Mid':          { brand:'Jordan',      price:8900, oldPrice:10500, badge:'hot',  sizes:[8,9,10,11,12],  desc:"MJ's legacy lives on. The Air Jordan 1 Mid features premium leather, Nike Air cushioning, and the iconic Wings logo.", imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0de4f354-95b4-4b3d-a50a-16ea5ce00a80/air-jordan-1-mid-shoes-BpARGV.png' },
    'Jordan 4 Retro':        { brand:'Jordan',      price:12000,oldPrice:null,  badge:'new',  sizes:[8,9,10,11],     desc:'The Air Jordan 4 Retro brings back the visible Air sole and mesh panels from 1989. A grail for collectors.', imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/de4b99ee-4af7-4e55-be75-9c0697b35d77/air-jordan-4-retro-shoes-j2TG5M.png' },
    'Ultraboost 22':         { brand:'Adidas',      price:7200, oldPrice:9000,  badge:'sale', sizes:[7,8,9,10,11,12],desc:'Maximum energy return meets modern style. Full-length BOOST midsole and Primeknit+ upper for all-day comfort.', imgSrc:'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a1f4c38840de45e59fc9ae2e010e0228_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg' },
    'Stan Smith':            { brand:'Adidas',      price:3800, oldPrice:null,  badge:null,   sizes:[6,7,8,9,10,11,12], desc:"The original clean court shoe. Stan Smith's minimalist leather upper and punched 3-Stripes remain as fresh today as they were in the 70s.", imgSrc:'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/60db7d9955e44d0d8f39ac9200d2973f_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg' },
    '990v5':                 { brand:'New Balance', price:8500, oldPrice:10000, badge:'sale', sizes:[7,8,9,10,11,12],desc:'Made in the USA with premium suede and mesh. The 990v5 is a dad-shoe icon with ENCAP midsole technology.', imgSrc:'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440' },
    '574 Classic':           { brand:'New Balance', price:4500, oldPrice:null,  badge:'new',  sizes:[6,7,8,9,10,11,12], desc:"The 574 is the sneaker that built New Balance's streetwear reputation. EVA midsole and durable suede upper.", imgSrc:'https://nb.scene7.com/is/image/NB/u574lgg_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440' },
    'Suede Classic':         { brand:'Puma',        price:3200, oldPrice:4500,  badge:'sale', sizes:[7,8,9,10,11],   desc:'The Puma Suede has been a street cornerstone since 1968. Soft suede upper and a cupsole construction give it unmistakable retro character.', imgSrc:'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/374915/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Sneakers' },
    'Old Skool':             { brand:'Vans',        price:2800, oldPrice:null,  badge:null,   sizes:[6,7,8,9,10,11,12], desc:'The first Vans shoe to feature the iconic side stripe. Canvas and suede upper with waffle outsole.', imgSrc:'https://images.vans.com/is/image/VansUS/VN000D3HY28-HERO?$583x583$' },
    'Chuck Taylor All Star': { brand:'Converse',    price:2500, oldPrice:3200,  badge:'sale', sizes:[6,7,8,9,10,11,12,13], desc:'The most iconic sneaker ever made. Chuck Taylors have been worn by athletes, rebels, and legends since 1917.', imgSrc:'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw92f48dca/images/a_107/M9166_A_107X1.jpg?sw=440&sh=440&sm=fit&sfrm=png' },
    'Club C 85':             { brand:'Reebok',      price:3600, oldPrice:null,  badge:'new',  sizes:[7,8,9,10,11,12], desc:'Since 1985 the Club C has been winning on and off the tennis court. Clean leather upper and EVA foam midsole.', imgSrc:'https://www.reebok.com/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-reebok-products/default/dw35cc91a5/images/H68765_1.png?sw=440&sh=440&sm=fit&sfrm=png' },
    /* APPAREL */
    'Graphic Tee Vol.1':     { brand:'Nike',        price:1200, oldPrice:1800,  badge:'sale', sizes:['XS','S','M','L','XL','XXL'], desc:'Premium cotton Dri-FIT tee with bold Nike graphic print. Lightweight fabric keeps you cool.', imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a6dba7e4-78f3-42ab-90d2-f15ce4dc9f84/sportswear-graphic-t-shirt-FnKZkt.png' },
    'Fleece Hoodie':         { brand:'Nike',        price:2800, oldPrice:null,  badge:'new',  sizes:['S','M','L','XL','XXL'], desc:'Heavyweight fleece hoodie with kangaroo pocket and adjustable drawcord hood.', imgSrc:'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1ffc5a83-4b3d-4b68-ba3a-0c98c2a04ffd/club-fleece-pullover-hoodie-0xLHs6.png' },
    'Track Jacket':          { brand:'Adidas',      price:2200, oldPrice:3000,  badge:'sale', sizes:['S','M','L','XL'], desc:'Classic 3-Stripes track jacket in recycled polyester. Full zip front and ribbed cuffs.', imgSrc:'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a3e694c36e45499abf49acd2012f7f7f_9366/Track_Jacket_Black_H46099_21_model.jpg' },
    'Trefoil Tee':           { brand:'Adidas',      price:1100, oldPrice:null,  badge:null,   sizes:['XS','S','M','L','XL','XXL'], desc:'Simple, iconic, essential. The Adidas Trefoil Tee on soft cotton jersey — a wardrobe must-have.', imgSrc:'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4d23e047b87a4e39b75bac4900b41d79_9366/Trefoil_T-Shirt_White_IC9534_21_model.jpg' },
    'Puma Essential Hoodie': { brand:'Puma',        price:2000, oldPrice:2800,  badge:'sale', sizes:['S','M','L','XL','XXL'], desc:'Soft fleece hoodie with Puma Cat branding on the chest. A comfortable everyday streetwear staple.', imgSrc:'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/586686/01/mod01/fnd/PNA/fmt/png/PUMA-SQUAD-Men\'s-Hoodie' },
    'Checkerboard Tee':      { brand:'Vans',        price:900,  oldPrice:null,  badge:'new',  sizes:['XS','S','M','L','XL'], desc:'The Vans Checkerboard pattern on a relaxed fit tee. 100% cotton fabric with drop shoulder silhouette.', imgSrc:'https://images.vans.com/is/image/VansUS/VN0A5HMP9YT-HERO?$583x583$' },
    'Jogger Pants':          { brand:'New Balance', price:1800, oldPrice:2500,  badge:'sale', sizes:['S','M','L','XL','XXL'], desc:'French terry jogger with elastic waistband and tapered leg. NB Athletics logo detail with zippered pockets.', imgSrc:'https://nb.scene7.com/is/image/NB/mp41g0t_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440' },
    /* TOYS */
    'Dunks Action Figure':   { brand:'Jordan',      price:3500, oldPrice:null,  badge:'new',  sizes:['One Size'], desc:'Limited-edition Jordan Dunks collectible action figure. Highly detailed 1:6 scale with 20 points of articulation.', imgSrc:'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-Found-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1677262707' },
    'Sneaker Keychain Set':  { brand:'Nike',        price:450,  oldPrice:800,   badge:'sale', sizes:['One Size'], desc:'Set of 4 miniature Nike sneaker keychains including AF1, Air Max, Dunk, and Cortez. Premium rubber with metal hardware.', imgSrc:'https://images.stockx.com/images/Nike-Air-Force-1-Low-White-07-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1635259529' },
    'Mini Kicks Box':        { brand:'Adidas',      price:2200, oldPrice:null,  badge:'new',  sizes:['One Size'], desc:'Mystery box featuring 1 of 8 ultra-detailed Adidas mini sneaker replicas. Each comes in a collectible shoebox with display stand.', imgSrc:'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/60db7d9955e44d0d8f39ac9200d2973f_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg' },
    'Sneaker Care Kit':      { brand:'Vans',        price:780,  oldPrice:1100,  badge:'sale', sizes:['One Size'], desc:'Complete sneaker care kit including premium cleaner, brush set, and protective spray. Keep your kicks fresh.', imgSrc:'https://images.vans.com/is/image/VansUS/VN000D3HY28-HERO?$583x583$' },
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

function addToCart(name, imgSrc) {
    const data = PRODUCT_DATA[name];
    if (!data) return;
    const existing = cart.find(x => x.name === name);
    if (existing) { existing.qty += 1; }
    else { cart.push({ name, brand: data.brand, price: data.price, imgSrc: imgSrc || data.imgSrc, qty: 1 }); }
    saveCart(cart);
    updateCartCount();
    showNotif(`${name} added to cart!`);
    refreshCartSidebar();
    // bounce cart button
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

/* ══════════════════════════════════════════════════════
   CART SIDEBAR
══════════════════════════════════════════════════════ */
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
                <button class="qty-btn" onclick="changeQty('${esc(item.name)}',-1)">−</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${esc(item.name)}',1)">+</button>
                <button class="delete-btn" onclick="removeFromCart('${esc(item.name)}')">🗑</button>
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

function esc(str) { return str.replace(/'/g,"&#39;"); }

/* ══════════════════════════════════════════════════════
   CHECKOUT MODAL
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
function closeCheckout() { document.getElementById('checkoutModal').classList.remove('open'); }
function placeOrder() {
    closeCheckout();
    clearCart();
    showNotif('🎉 Order placed! Thank you!');
}

/* ══════════════════════════════════════════════════════
   PRODUCT VIEW MODAL
══════════════════════════════════════════════════════ */
function openProductModal(card) {
    const nameEl = card.querySelector('.p-name');
    const imgEl  = card.querySelector('.product-thumb img');
    if (!nameEl) return;

    const name = nameEl.textContent.trim();
    const data = PRODUCT_DATA[name];
    if (!data) return;

    const imgSrc = imgEl ? imgEl.src : data.imgSrc;

    // Discount
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

    // Sizes
    document.getElementById('pmSizes').innerHTML = `
        <div class="pm-sizes-label">SELECT SIZE</div>
        <div class="pm-size-grid">
            ${data.sizes.map((s,i) => `<div class="pm-sz${i===0?' active':''}" onclick="selectPmSize(this)">${s}</div>`).join('')}
        </div>`;

    // Gallery — main image + angle thumbnails
    document.getElementById('pmMainImg').innerHTML = `<img src="${imgSrc}" alt="${name}" onerror="this.style.display='none'">`;

    const angles = ['Front','Side','Back','Top','Detail'];
    const overlays = ['','↩️ ','📐 ','🔆 ','✨ '];
    document.getElementById('pmThumbs').innerHTML = angles.map((angle, i) => `
        <div class="pm-thumb ${i===0?'active':''}" onclick="switchAngle(this,'${imgSrc}','${angle}','${overlays[i]}')">
            ${i === 0 ? `<img src="${imgSrc}" alt="${angle}" onerror="this.style.display='none'">` : `<span style="font-size:26px">${['👟','🔄','📐','🔆','✨'][i]}</span>`}
        </div>`).join('');

    // Add to cart button
    document.getElementById('pmAddBtn').onclick = () => {
        addToCart(name, imgSrc);
        closeProductModal();
    };

    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function switchAngle(el, baseImgSrc, angle, overlay) {
    document.querySelectorAll('.pm-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const main = document.getElementById('pmMainImg');
    main.style.opacity = '0';
    main.style.transform = 'scale(0.85)';
    setTimeout(() => {
        if (angle === 'Front') {
            main.innerHTML = `<img src="${baseImgSrc}" alt="${angle}" onerror="this.style.display='none'">`;
        } else {
            main.innerHTML = `<div style="text-align:center">
                <div style="font-size:80px">${overlay}</div>
                <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:2px;color:var(--muted);margin-top:8px">${angle.toUpperCase()} VIEW</div>
            </div>`;
        }
        main.style.opacity = '1';
        main.style.transform = '';
    }, 180);
    main.style.transition = 'all 0.18s ease';
}

function selectPmSize(el) {
    document.querySelectorAll('.pm-sz').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════
   WIRE UP PRODUCT CARDS  (called after DOM ready)
══════════════════════════════════════════════════════ */
function wireUpCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        // Add VIEW overlay if missing
        const thumb = card.querySelector('.product-thumb');
        if (thumb && !thumb.querySelector('.product-thumb-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'product-thumb-overlay';
            overlay.textContent = '👁 VIEW';
            thumb.appendChild(overlay);
        }

        // Click card → open product modal
        card.addEventListener('click', e => {
            if (e.target.classList.contains('add-btn')) return;
            openProductModal(card);
        });

        // Click add-btn → add to cart
        const addBtn = card.querySelector('.add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', e => {
                e.stopPropagation();
                const nameEl  = card.querySelector('.p-name');
                const imgEl   = card.querySelector('.product-thumb img');
                const name    = nameEl ? nameEl.textContent.trim() : '';
                const imgSrc  = imgEl  ? imgEl.src : '';
                addToCart(name, imgSrc);
            });
        }
    });
}

/* ══════════════════════════════════════════════════════
   LOGIN / SIGNUP MODALS
══════════════════════════════════════════════════════ */
function openLoginModal() {
    document.getElementById('loginModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function openSignupModal() {
    closeAllModals();
    const el = document.getElementById('signupModal');
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════════════ */
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
    showNotif(isLight ? '☀️ Light mode on' : '🌙 Dark mode on');
}
function updateThemeBtn() {
    const isLight = document.body.classList.contains('light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.textContent = isLight ? '🌙 Dark' : '☀️ Light';
    });
}

/* ══════════════════════════════════════════════════════
   NOTIFICATION
══════════════════════════════════════════════════════ */
function showNotif(msg) {
    const n = document.getElementById('notif');
    if (!n) return;
    n.textContent = msg;
    n.classList.add('show');
    clearTimeout(n._t);
    n._t = setTimeout(() => n.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════════════════════
   SIZE / COLOR FILTER TOGGLES
══════════════════════════════════════════════════════ */
function initSidebarFilters() {
    document.querySelectorAll('.sz-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active'));
    });
    document.querySelectorAll('.clr-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.clr-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
}

/* ══════════════════════════════════════════════════════
   CAROUSEL (home page)
══════════════════════════════════════════════════════ */
function initCarousel() {
    const track  = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-track > *');
    const nextBtn = document.querySelector('.cb.next');
    const prevBtn = document.querySelector('.cb.prev');
    if (!track || !slides.length) return;

    let idx = 0;
    const slideWidth = 420;
    function go() { track.style.transform = `translateX(-${idx * slideWidth}px)`; }

    if (nextBtn) nextBtn.addEventListener('click', () => { idx = (idx+1) % slides.length; go(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { idx = (idx-1+slides.length) % slides.length; go(); });
    setInterval(() => { idx = (idx+1) % slides.length; go(); }, 3500);
}

/* ══════════════════════════════════════════════════════
   DOM READY — build shared UI elements & wire events
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartCount();
    initSidebarFilters();
    initCarousel();
    wireUpCards();

    // Inject cart sidebar HTML if not present
    if (!document.getElementById('cartSidebar')) {
        document.body.insertAdjacentHTML('beforeend', `
        <!-- CART OVERLAY -->
        <div class="cart-overlay" id="cartOverlay" onclick="closeCartSidebar()"></div>

        <!-- CART SIDEBAR -->
        <div class="cart-sidebar" id="cartSidebar">
            <div class="cart-sidebar-header">
                <div class="cart-sidebar-title">🛒 YOUR CART</div>
                <button class="cart-sidebar-close" onclick="closeCartSidebar()">✕</button>
            </div>
            <div class="cart-items-wrap" id="cartItemsWrap"></div>
            <div class="cart-sidebar-footer" id="cartFooter"></div>
        </div>

        <!-- PRODUCT VIEW MODAL -->
        <div class="modal-overlay" id="productModal" onclick="if(event.target===this)closeProductModal()">
            <div class="product-modal">
                <button class="modal-close" onclick="closeProductModal()">✕</button>
                <div class="pm-gallery">
                    <div class="pm-main-img" id="pmMainImg"></div>
                    <div class="pm-thumbs" id="pmThumbs"></div>
                </div>
                <div class="pm-info">
                    <div class="pm-badge-row" id="pmBadge"></div>
                    <div class="pm-brand" id="pmBrand"></div>
                    <div class="pm-name" id="pmName"></div>
                    <div class="pm-price-row" id="pmPrice"></div>
                    <div class="pm-desc" id="pmDesc"></div>
                    <div id="pmSizes"></div>
                    <button class="pm-add-btn" id="pmAddBtn">+ ADD TO CART</button>
                </div>
            </div>
        </div>

        <!-- CHECKOUT MODAL -->
        <div class="modal-overlay" id="checkoutModal" onclick="if(event.target===this)closeCheckout()">
            <div class="modal checkout-modal">
                <button class="modal-close" onclick="closeCheckout()">✕</button>
                <div class="modal-title">CHECKOUT</div>
                <div class="modal-sub">Complete your order</div>
                <div class="form-group"><label>FULL NAME</label><input type="text" placeholder="Juan dela Cruz"></div>
                <div class="form-group"><label>EMAIL</label><input type="email" placeholder="you@email.com"></div>
                <div class="form-group"><label>PHONE</label><input type="tel" placeholder="+63 9XX XXX XXXX"></div>
                <div class="form-group"><label>DELIVERY ADDRESS</label><input type="text" placeholder="Street, City, Province"></div>
                <div class="form-group"><label>PAYMENT METHOD</label>
                    <select>
                        <option>Cash on Delivery</option>
                        <option>GCash</option>
                        <option>Maya</option>
                        <option>Bank Transfer</option>
                    </select>
                </div>
                <div class="checkout-summary" id="checkoutSummary"></div>
                <button class="modal-btn" onclick="placeOrder()">PLACE ORDER 🎉</button>
            </div>
        </div>`);
    }

    // Wire cart button(s)
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', openCartSidebar);
    });

    // Wire login button(s)
    document.querySelectorAll('.btn-login').forEach(btn => {
        btn.addEventListener('click', openLoginModal);
    });

    // Wire modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Wire login overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeAllModals();
        });
    });

    // Wire signup link in login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        const switchLink = loginModal.querySelector('.modal-switch a');
        if (switchLink) switchLink.addEventListener('click', openSignupModal);
    }

    // Keyboard ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeAllModals();
            closeProductModal();
            closeCartSidebar();
        }
    });
});