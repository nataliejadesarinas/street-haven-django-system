"""Shared search logic for API + full search results page."""
from django.db.models import Q

from .models import Shoes, Apparels, Toys

SHOES_KEYWORDS = frozenset({
    'shoe', 'shoes', 'sneaker', 'sneakers', 'kick', 'kicks', 'footwear',
    'trainer', 'trainers', 'boot', 'boots', 'slipper', 'slippers', 'slide', 'slides',
})

APPAREL_KEYWORDS = frozenset({
    'apparel', 'clothing', 'clothes', 'shirt', 'shirts', 'hoodie', 'hoodies',
    'jacket', 'jackets', 'pants', 'tee', 'tees', 'top', 'tops', 'shorts',
    'sweater', 'sweaters', 'polo', 'dress', 'underwear', 'jeans', 'sweatshirt',
})

TOYS_KEYWORDS = frozenset({
    'toy', 'toys', 'collectible', 'collectibles', 'figure', 'figures',
    'plush', 'doll', 'dolls', 'figurine', 'figurines', 'lego',
})


def _tokens(q):
    return [t.lower() for t in q.split() if t]


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
    other = [t for t in toks if t not in SHOES_KEYWORDS]

    if shoe_kw and not other:
        return base.order_by('brand__name', 'name')

    if shoe_kw and other:
        qf = Q()
        for w in other:
            qf |= _shoes_word_q(w)
        return base.filter(qf).distinct().order_by('brand__name', 'name')

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
    other = [t for t in toks if t not in APPAREL_KEYWORDS]

    if app_kw and not other:
        return base.order_by('brand__name', 'name')

    if app_kw and other:
        qf = Q()
        for w in other:
            qf |= _apparel_word_q(w)
        return base.filter(qf).distinct().order_by('brand__name', 'name')

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


def combined_search_querysets(q):
    """
    If the query is only category words (e.g. 'shoes', 'apparel toys'), return
    full matches per mentioned category. Otherwise run text search on each type
    (name, brand, category, color, etc.) so 'Adidas' or 'nike shoes' work.
    """
    q = (q or '').strip()
    if not q:
        return Shoes.objects.none(), Apparels.objects.none(), Toys.objects.none()

    toks = _tokens(q)
    has_shoe = any(t in SHOES_KEYWORDS for t in toks)
    has_app = any(t in APPAREL_KEYWORDS for t in toks)
    has_toy = any(t in TOYS_KEYWORDS for t in toks)

    shoes_qs = shoes_search_queryset(q)
    apparel_qs = apparel_search_queryset(q)
    toys_qs = toys_search_queryset(q)

    if _only_category_tokens(toks):
        sq = Shoes.objects.none()
        aq = Apparels.objects.none()
        tq = Toys.objects.none()
        if has_shoe:
            sq = shoes_qs
        if has_app:
            aq = apparel_qs
        if has_toy:
            tq = toys_qs
        return sq, aq, tq

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
