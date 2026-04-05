/* ═══════════════════════════════════════════════════════════════
   STREET.HAVEN — sidebar_filters.js
   Wires all sidebar filters: Brand · Color · Price Range
   Strategy: reads/writes URL GET params → Django does DB filtering
   All filters combine with AND logic (all active at once).
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── Read current URL params ─────────────────────────────── */
    function getParams() {
        return new URLSearchParams(window.location.search);
    }

    /* ─── Navigate to same page with updated params ───────────── */
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

    /* ─── Smooth scroll to maintain sidebar position ───────────── */
    function applyFilterWithScroll(updates) {
        // Store current scroll position
        const sidebar = document.querySelector('.sidebar');
        const scrollY = sidebar ? sidebar.scrollTop : 0;
        
        // Apply filter
        applyFilter(updates);
        
        // Restore scroll position after page loads
        setTimeout(() => {
            if (sidebar) {
                sidebar.scrollTop = scrollY;
            }
        }, 100);
    }

    /* ═══════════════════════════════════════════════════════════
       RESTORE ACTIVE STATES from URL on every page load
    ═══════════════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════════════
       ACTIVE FILTER CHIPS  — appear above the product grid
    ═══════════════════════════════════════════════════════════ */
    function renderFilterChips(params) {
        /* Find or create the chip bar */
        let bar = document.getElementById('sh-filter-chips');
        if (!bar) {
            /* Insert before the first product grid or section on the page */
            const anchor = document.querySelector(
                '.product-grid, .section, .pg-header + *, .toolbar + *'
            );
            if (!anchor) return;
            bar = document.createElement('div');
            bar.id = 'sh-filter-chips';
            bar.style.cssText = [
                'display:flex', 'flex-wrap:wrap', 'gap:8px',
                'padding:12px 36px 0',
                "font-family:'Barlow Condensed',sans-serif",
            ].join(';');
            anchor.parentNode.insertBefore(bar, anchor);
        }
        bar.innerHTML = '';

        const labelMap = { brand: 'Brand', color: 'Color', price_min: 'Min ₱', price_max: 'Max ₱' };
        let hasChip = false;

        ['brand', 'color', 'price_min', 'price_max'].forEach(key => {
            const val = params.get(key);
            if (!val) return;
            hasChip = true;

            const chip = document.createElement('span');
            chip.style.cssText = [
                'display:inline-flex', 'align-items:center', 'gap:6px',
                'background:var(--red)', 'color:#fff',
                'padding:5px 12px', 'border-radius:20px',
                'font-size:12px', 'letter-spacing:1px', 'font-weight:700',
                'cursor:pointer', 'user-select:none', 'transition:opacity .15s',
            ].join(';');
            chip.innerHTML = `${labelMap[key]}: ${val} <span style="font-size:14px;line-height:1">✕</span>`;
            chip.title = `Remove ${labelMap[key]} filter`;
            chip.addEventListener('mouseenter', () => chip.style.opacity = '.8');
            chip.addEventListener('mouseleave', () => chip.style.opacity = '1');
            chip.addEventListener('click', () => applyFilter({ [key]: null }));
            bar.appendChild(chip);
        });

        if (hasChip) {
            const clearAll = document.createElement('span');
            clearAll.style.cssText = [
                'display:inline-flex', 'align-items:center',
                'background:transparent', 'color:var(--muted)',
                'border:1px solid var(--border)',
                'padding:5px 12px', 'border-radius:20px',
                'font-size:12px', 'letter-spacing:1px', 'font-weight:700',
                'cursor:pointer', 'user-select:none',
            ].join(';');
            clearAll.textContent = 'CLEAR ALL ✕';
            clearAll.addEventListener('click', () => {
                window.location.href = window.location.pathname;
            });
            bar.appendChild(clearAll);
        }
    }

    /* ═══════════════════════════════════════════════════════════
       COLOR DOTS
    ═══════════════════════════════════════════════════════════ */
    function initColorDots() {
        document.querySelectorAll('.clr-dot').forEach(dot => {
            dot.style.cursor = 'pointer';
            const colorName = dot.dataset.color || dot.title || '';
            if (!colorName) return;

            dot.addEventListener('click', () => {
                const current = (getParams().get('color') || '').toLowerCase();
                /* Toggle off if same color */
                applyFilterWithScroll({ color: current === colorName.toLowerCase() ? null : colorName });
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       SIZE BUTTONS
    ═══════════════════════════════════════════════════════════ */
    function initSizeButtons() {
        document.querySelectorAll('.sz-btn').forEach(btn => {
            btn.style.cursor = 'pointer';
            const size = btn.textContent.trim();
            if (!size) return;

            btn.addEventListener('click', () => {
                const current = getParams().get('size') || '';
                /* Toggle off if same size */
                applyFilterWithScroll({ size: current === size ? null : size });
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       BRAND LOGOS  — intercept click, merge brand into params
    ═══════════════════════════════════════════════════════════ */
    function initBrandItems() {
        document.querySelectorAll('.brand-item').forEach(a => {
            /* Read brand from data-brand attr (reliable) */
            const brandName = a.dataset.brand || '';
            if (!brandName) return;

            a.addEventListener('click', e => {
                e.preventDefault();
                const current = (getParams().get('brand') || '').toLowerCase();
                /* Toggle off if same brand */
                applyFilter({ brand: current === brandName.toLowerCase() ? null : brandName });
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       PRICE RANGE — APPLY FILTER button
    ═══════════════════════════════════════════════════════════ */
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
                    showNotif('⚠️ Min price cannot exceed Max price');
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

    /* ═══════════════════════════════════════════════════════════
       RESULT COUNT  — updates toolbar count text if present
    ═══════════════════════════════════════════════════════════ */
    function updateResultCount() {
        const countEl = document.querySelector('.result-count');
        if (!countEl) return;
        const params = getParams();
        const hasFilter = ['brand','color','price_min','price_max'].some(k => params.get(k));
        if (!hasFilter) return;

        const cards = document.querySelectorAll('.product-card').length;
        countEl.textContent = `${cards} RESULT${cards !== 1 ? 'S' : ''}`;
    }

    /* ═══════════════════════════════════════════════════════════
       INIT
    ═══════════════════════════════════════════════════════════ */
    document.addEventListener('DOMContentLoaded', () => {
        restoreActiveStates();
        initColorDots();
        initSizeButtons();
        initBrandItems();
        initPriceFilter();
        updateResultCount();
    });

})();