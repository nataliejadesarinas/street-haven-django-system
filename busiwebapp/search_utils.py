"""Shared search logic for API + full search results page."""
from django.db.models import Q

from .models import Shoes, Apparels, Toys

SHOES_KEYWORDS = frozenset({
    'shoe', 'shoes', 'sneaker', 'sneakers', 'kick', 'kicks', 'footwear',
    'trainer', 'trainers', 'boot', 'boots', 'slipper', 'slippers', 'slide', 'slides',
})

APPAREL_KEYWORDS = frozenset({
    'apparel', 'apparels', 'clothing', 'clothes', 'shirt', 'shirts', 'hoodie', 'hoodies',
    'jacket', 'jackets', 'pants', 'tee', 'tees', 'top', 'tops', 'shorts',
    'sweater', 'sweaters', 'polo', 'dress', 'underwear', 'jeans', 'sweatshirt',
})

TOYS_KEYWORDS = frozenset({
    'toy', 'toys', 'collectible', 'collectibles', 'figure', 'figures',
    'plush', 'doll', 'dolls', 'figurine', 'figurines', 'lego',
})

BRAND_KEYWORDS = frozenset({
    'nike', 'adidas', 'vans', 'new balance', 'newbalance', 'jordan', 
    'puma', 'converse', 'reebok', 'nb', 'nike sb', 'adidas originals',
})


def _tokens(q):
    # Handle multi-word brands first, then split the rest
    multi_word_brands = ['new balance', 'nike sb', 'adidas originals']
    tokens = []
    remaining = q.lower()
    
    # Check for multi-word brands first
    for brand in multi_word_brands:
        if brand in remaining:
            tokens.append(brand)
            remaining = remaining.replace(brand, '').strip()
    
    # Split remaining words
    if remaining:
        tokens.extend([t for t in remaining.split() if t])
    
    return tokens


def _shoes_word_q(word):
    return (
        Q(name__icontains=word)
        | Q(brand__name__icontains=word)
        | Q(category__name__icontains=word)
        | Q(color__icontains=word)
    )


def _apparel_word_q(word):
    return (
        Q(name__icontains=word)
        | Q(brand__name__icontains=word)
        | Q(category__name__icontains=word)
        | Q(color__icontains=word)
    )


def _toys_word_q(word):
    return (
        Q(name__icontains=word)
        | Q(description__icontains=word)
        | Q(color__icontains=word)
    )


def shoes_search_queryset(q):
    q = (q or '').strip()
    if not q:
        return Shoes.objects.none()
    toks = _tokens(q)
    if not toks:
        return Shoes.objects.none()

    base = Shoes.objects.filter(is_available=True).select_related('brand', 'category')
    shoe_kw = [t for t in toks if t in SHOES_KEYWORDS]
    brand_kw = [t for t in toks if t in BRAND_KEYWORDS]
    other = [t for t in toks if t not in SHOES_KEYWORDS and t not in BRAND_KEYWORDS]

    # If only brand keywords, search by brand
    if brand_kw and not other and not shoe_kw:
        qf = Q()
        for brand in brand_kw:
            if brand == 'new balance' or brand == 'newbalance':
                qf |= Q(brand__name__iexact='new balance')
                qf |= Q(brand__name__iexact='newbalance')
            elif brand == 'nike sb':
                qf |= Q(brand__name__iexact='nike sb')
            elif brand == 'adidas originals':
                qf |= Q(brand__name__iexact='adidas originals')
            elif brand == 'nb':
                qf |= Q(brand__name__iexact='new balance')
                qf |= Q(brand__name__iexact='nb')
            else:
                qf |= Q(brand__name__iexact=brand)
        return base.filter(qf).distinct().order_by('brand__name', 'name')

    # If only shoe keywords, return all shoes
    if shoe_kw and not other and not brand_kw:
        return base.order_by('brand__name', 'name')

    # Mixed search - must match BOTH brand AND shoe keywords if both present
    if shoe_kw and (other or brand_kw):
        qf = Q()
        
        # Add shoe keyword condition (always include this)
        for shoe in shoe_kw:
            qf |= Q(category__name__icontains=shoe)
            qf |= Q(name__icontains=shoe)
        
        # Add brand/other conditions with AND logic
        if brand_kw:
            brand_qf = Q()
            for brand in brand_kw:
                if brand == 'new balance' or brand == 'newbalance':
                    brand_qf |= Q(brand__name__iexact='new balance')
                    brand_qf |= Q(brand__name__iexact='newbalance')
                elif brand == 'nike sb':
                    brand_qf |= Q(brand__name__iexact='nike sb')
                elif brand == 'adidas originals':
                    brand_qf |= Q(brand__name__iexact='adidas originals')
                elif brand == 'nb':
                    brand_qf |= Q(brand__name__iexact='new balance')
                    brand_qf |= Q(brand__name__iexact='nb')
                else:
                    brand_qf |= Q(brand__name__iexact=brand)
            qf &= brand_qf
        
        # Add other word conditions
        for w in other:
            qf &= _shoes_word_q(w)
            
        return base.filter(qf).distinct().order_by('brand__name', 'name')

    # Regular phrase and word search
    phrase = (
        Q(name__icontains=q)
        | Q(brand__name__icontains=q)
        | Q(category__name__icontains=q)
        | Q(color__icontains=q)
    )
    word_q = Q()
    for w in toks:
        word_q |= _shoes_word_q(w)
    return base.filter(phrase | word_q).distinct().order_by('brand__name', 'name')


def apparel_search_queryset(q):
    q = (q or '').strip()
    if not q:
        return Apparels.objects.none()
    toks = _tokens(q)
    if not toks:
        return Apparels.objects.none()

    base = Apparels.objects.filter(is_available=True).select_related('brand', 'category')
    app_kw = [t for t in toks if t in APPAREL_KEYWORDS]
    brand_kw = [t for t in toks if t in BRAND_KEYWORDS]
    other = [t for t in toks if t not in APPAREL_KEYWORDS and t not in BRAND_KEYWORDS]

    # If only brand keywords, search by brand
    if brand_kw and not other and not app_kw:
        qf = Q()
        for brand in brand_kw:
            if brand == 'new balance' or brand == 'newbalance':
                qf |= Q(brand__name__iexact='new balance')
                qf |= Q(brand__name__iexact='newbalance')
            elif brand == 'nike sb':
                qf |= Q(brand__name__iexact='nike sb')
            elif brand == 'adidas originals':
                qf |= Q(brand__name__iexact='adidas originals')
            elif brand == 'nb':
                qf |= Q(brand__name__iexact='new balance')
                qf |= Q(brand__name__iexact='nb')
            else:
                qf |= Q(brand__name__iexact=brand)
        return base.filter(qf).distinct().order_by('brand__name', 'name')

    # If only apparel keywords, return all apparel
    if app_kw and not other and not brand_kw:
        return base.order_by('brand__name', 'name')

    # Mixed search - must match BOTH brand AND apparel keywords if both present
    if app_kw and (other or brand_kw):
        qf = Q()
        
        # Add apparel keyword condition (always include this)
        for app in app_kw:
            qf |= Q(category__name__icontains=app)
            qf |= Q(name__icontains=app)
        
        # Add brand/other conditions with AND logic
        if brand_kw:
            brand_qf = Q()
            for brand in brand_kw:
                if brand == 'new balance' or brand == 'newbalance':
                    brand_qf |= Q(brand__name__iexact='new balance')
                    brand_qf |= Q(brand__name__iexact='newbalance')
                elif brand == 'nike sb':
                    brand_qf |= Q(brand__name__iexact='nike sb')
                elif brand == 'adidas originals':
                    brand_qf |= Q(brand__name__iexact='adidas originals')
                elif brand == 'nb':
                    brand_qf |= Q(brand__name__iexact='new balance')
                    brand_qf |= Q(brand__name__iexact='nb')
                else:
                    brand_qf |= Q(brand__name__iexact=brand)
            qf &= brand_qf
        
        # Add other word conditions
        for w in other:
            qf &= _apparel_word_q(w)
            
        return base.filter(qf).distinct().order_by('brand__name', 'name')

    # Regular phrase and word search
    phrase = (
        Q(name__icontains=q)
        | Q(brand__name__icontains=q)
        | Q(category__name__icontains=q)
        | Q(color__icontains=q)
    )
    word_q = Q()
    for w in toks:
        word_q |= _apparel_word_q(w)
    return base.filter(phrase | word_q).distinct().order_by('brand__name', 'name')


def toys_search_queryset(q):
    q = (q or '').strip()
    if not q:
        return Toys.objects.none()
    toks = _tokens(q)
    if not toks:
        return Toys.objects.none()

    base = Toys.objects.filter(is_available=True)
    toy_kw = [t for t in toks if t in TOYS_KEYWORDS]
    other = [t for t in toks if t not in TOYS_KEYWORDS]

    if toy_kw and not other:
        return base.order_by('name')

    if toy_kw and other:
        qf = Q()
        for w in other:
            qf |= _toys_word_q(w)
        return base.filter(qf).distinct().order_by('name')

    phrase = Q(name__icontains=q) | Q(description__icontains=q) | Q(color__icontains=q)
    word_q = Q()
    for w in toks:
        word_q |= _toys_word_q(w)
    return base.filter(phrase | word_q).distinct().order_by('name')


def _only_category_tokens(toks):
    if not toks:
        return False
    return all(
        t in SHOES_KEYWORDS or t in APPAREL_KEYWORDS or t in TOYS_KEYWORDS
        for t in toks
    )


def _only_brand_tokens(toks):
    if not toks:
        return False
    return all(t in BRAND_KEYWORDS for t in toks)


def _search_brands_in_category(toks, model_class):
    """Search for products matching brand keywords in a specific category"""
    if not toks or model_class in [Toys]:  # Toys don't have brands
        return model_class.objects.none()
    
    base = model_class.objects.filter(is_available=True).select_related('brand', 'category')
    qf = Q()
    
    for token in toks:
        if token in BRAND_KEYWORDS:
            # Handle multi-word brands like "new balance"
            if token == 'new balance' or token == 'newbalance':
                qf |= Q(brand__name__icontains='new balance')
                qf |= Q(brand__name__icontains='newbalance')
            elif token == 'nike sb':
                qf |= Q(brand__name__icontains='nike sb')
            elif token == 'adidas originals':
                qf |= Q(brand__name__icontains='adidas originals')
            elif token == 'nb':
                qf |= Q(brand__name__icontains='new balance')
                qf |= Q(brand__name__icontains='nb')
            else:
                qf |= Q(brand__name__icontains=token)
        else:
            # Also check if individual words match part of brand names
            qf |= Q(brand__name__icontains=token)
    
    return base.filter(qf).distinct().order_by('brand__name', 'name')


def combined_search_querysets(q):
    """
    Enhanced search that handles brands, categories, and mixed queries.
    """
    q = (q or '').strip()
    if not q:
        return Shoes.objects.none(), Apparels.objects.none(), Toys.objects.none()

    toks = _tokens(q)
    has_shoe = any(t in SHOES_KEYWORDS for t in toks)
    has_app = any(t in APPAREL_KEYWORDS for t in toks)
    has_toy = any(t in TOYS_KEYWORDS for t in toks)
    has_brand = any(t in BRAND_KEYWORDS for t in toks)

    # Special handling for category-only searches
    if _only_category_tokens(toks):
        sq = Shoes.objects.none()
        aq = Apparels.objects.none()
        tq = Toys.objects.none()
        if has_shoe:
            sq = Shoes.objects.filter(is_available=True).select_related('brand', 'category')
        if has_app:
            aq = Apparels.objects.filter(is_available=True).select_related('brand', 'category')
        if has_toy:
            tq = Toys.objects.filter(is_available=True)
        return sq, aq, tq

    # Special handling for brand + category mixed searches
    if has_brand and (has_shoe or has_app or has_toy):
        return _handle_mixed_brand_category_search(toks, has_shoe, has_app, has_toy)

    # For all other searches, use the individual search functions
    shoes_qs = shoes_search_queryset(q)
    apparel_qs = apparel_search_queryset(q)
    toys_qs = toys_search_queryset(q)

    return shoes_qs, apparel_qs, toys_qs


def _handle_mixed_brand_category_search(toks, has_shoe, has_app, has_toy):
    """Handle searches that combine brands with categories"""
    brand_kw = [t for t in toks if t in BRAND_KEYWORDS]
    shoe_kw = [t for t in toks if t in SHOES_KEYWORDS]
    app_kw = [t for t in toks if t in APPAREL_KEYWORDS]
    toy_kw = [t for t in toks if t in TOYS_KEYWORDS]
    
    # Build brand filter (case-insensitive)
    brand_qf = Q()
    for brand in brand_kw:
        if brand == 'new balance' or brand == 'newbalance':
            brand_qf |= Q(brand__name__iexact='new balance')
            brand_qf |= Q(brand__name__iexact='newbalance')
        elif brand == 'nike sb':
            brand_qf |= Q(brand__name__iexact='nike sb')
        elif brand == 'adidas originals':
            brand_qf |= Q(brand__name__iexact='adidas originals')
        elif brand == 'nb':
            brand_qf |= Q(brand__name__iexact='new balance')
            brand_qf |= Q(brand__name__iexact='nb')
        else:
            brand_qf |= Q(brand__name__iexact=brand)
    
    # Apply to appropriate categories
    shoes_qs = Shoes.objects.none()
    apparel_qs = Apparels.objects.none()
    toys_qs = Toys.objects.none()
    
    if has_shoe:
        shoes_qs = Shoes.objects.filter(is_available=True).filter(brand_qf).select_related('brand', 'category')
    
    if has_app:
        apparel_qs = Apparels.objects.filter(is_available=True).filter(brand_qf).select_related('brand', 'category')
    
    if has_toy:
        toys_qs = Toys.objects.filter(is_available=True)  # Toys don't have brands
    
    return shoes_qs, apparel_qs, toys_qs


def serialize_product(p, ptype):
    if ptype == 'shoes':
        return {
            'type': 'shoes',
            'id': p.id,
            'name': p.name,
            'brand': p.brand.name,
            'category': p.category.name,
            'price': float(p.price),
            'description': p.description,
            'stock': p.stock,
        }
    if ptype == 'apparel':
        return {
            'type': 'apparel',
            'id': p.id,
            'name': p.name,
            'brand': p.brand.name,
            'category': p.category.name,
            'price': float(p.price),
            'description': p.description,
            'stock': p.stock,
        }
    return {
        'type': 'toys',
        'id': p.id,
        'name': p.name,
        'brand': 'Collectible',
        'category': 'Toys',
        'price': float(p.price),
        'description': p.description,
        'stock': p.stock,
    }
