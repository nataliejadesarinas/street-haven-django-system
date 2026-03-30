from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from .models import Brand, Category, Shoes, Apparels, Toys
from .forms import ShoesForm, ApparelsForm, ToysForm
from django.db.models import Q


# ─────────────────────────────────────────────
#  SHARED FILTER HELPER
# ─────────────────────────────────────────────
def _apply_filters(request, shoes_qs=None, apparel_qs=None, toys_qs=None):
    """
    Reads brand, color, price_min, price_max from GET params
    and applies them as AND logic to whichever querysets are passed in.
    Size is intentionally omitted — no size field exists on the models yet.
    Returns (shoes_qs, apparel_qs, toys_qs, active_filters).
    """
    brand     = request.GET.get('brand',     '').strip()
    color     = request.GET.get('color',     '').strip()
    price_min = request.GET.get('price_min', '').strip()
    price_max = request.GET.get('price_max', '').strip()

    active_filters = {
        'brand':     brand,
        'color':     color,
        'price_min': price_min,
        'price_max': price_max,
    }

    # BRAND
    if brand:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(brand__name__iexact=brand)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(brand__name__iexact=brand)
        # Toys have no brand field — skip

    # COLOR  (icontains so "Black" matches "Black & White" etc.)
    if color:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(color__icontains=color)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(color__icontains=color)
        if toys_qs    is not None: toys_qs    = toys_qs.filter(color__icontains=color)

    # PRICE RANGE
    try:    pmin = float(price_min) if price_min else None
    except: pmin = None
    try:    pmax = float(price_max) if price_max else None
    except: pmax = None

    if pmin is not None:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(price__gte=pmin)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(price__gte=pmin)
        if toys_qs    is not None: toys_qs    = toys_qs.filter(price__gte=pmin)

    if pmax is not None:
        if shoes_qs   is not None: shoes_qs   = shoes_qs.filter(price__lte=pmax)
        if apparel_qs is not None: apparel_qs = apparel_qs.filter(price__lte=pmax)
        if toys_qs    is not None: toys_qs    = toys_qs.filter(price__lte=pmax)

    return shoes_qs, apparel_qs, toys_qs, active_filters


# ─────────────────────────────────────────────
#  VIEWS
# ─────────────────────────────────────────────
def home(request):
    featured_shoes = Shoes.objects.filter(is_available=True)[:8]
    return render(request, 'busiwebapp/home.html', {
        'featured_shoes': featured_shoes,
    })


def sale(request):
    shoes   = Shoes.objects.filter(is_available=True)
    apparel = Apparels.objects.filter(is_available=True)
    toys    = Toys.objects.filter(is_available=True)
    shoes, apparel, toys, active_filters = _apply_filters(request, shoes, apparel, toys)
    return render(request, 'busiwebapp/sale.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys,
        'active_filters': active_filters,
    })


def all_products(request):
    shoes   = Shoes.objects.filter(is_available=True)
    apparel = Apparels.objects.filter(is_available=True)
    toys    = Toys.objects.filter(is_available=True)
    shoes, apparel, toys, active_filters = _apply_filters(request, shoes, apparel, toys)
    return render(request, 'busiwebapp/all_products.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys,
        'active_filters': active_filters,
    })


def apparel(request):
    apparel = Apparels.objects.filter(is_available=True)
    _, apparel, _, active_filters = _apply_filters(request, apparel_qs=apparel)
    return render(request, 'busiwebapp/apparel.html', {
        'apparel': apparel,
        'active_filters': active_filters,
    })


def shoes(request):
    shoes = Shoes.objects.filter(is_available=True)
    shoes, _, _, active_filters = _apply_filters(request, shoes_qs=shoes)
    return render(request, 'busiwebapp/shoes.html', {
        'shoes': shoes,
        'active_filters': active_filters,
    })


def toys(request):
    toys = Toys.objects.filter(is_available=True)
    _, _, toys, active_filters = _apply_filters(request, toys_qs=toys)
    return render(request, 'busiwebapp/toys.html', {
        'toys': toys,
        'active_filters': active_filters,
    })


def new(request):
    # Change the dictionary key to 'latest_shoes' to match your template
    latest_shoes = Shoes.objects.filter(is_available=True).order_by('-id')[:8]
    
    return render(request, 'busiwebapp/new.html', {
        'latest_shoes': latest_shoes, # Now this matches {% for product in latest_shoes %}
    })


def profile(request):
    return render(request, 'busiwebapp/profile.html')


def search_api(request):
    q = request.GET.get('q', '').strip()
    results = []
    if q:
        for item in Shoes.objects.filter(is_available=True, name__icontains=q)[:5]:
            results.append({
                'name': item.name, 'brand': item.brand.name if item.brand else '',
                'category': 'Shoes', 'price': float(item.price),
                'image': item.image.url if item.image else '',
            })
        for item in Apparels.objects.filter(is_available=True, name__icontains=q)[:5]:
            results.append({
                'name': item.name, 'brand': item.brand.name if item.brand else '',
                'category': 'Apparel', 'price': float(item.price),
                'image': item.image.url if item.image else '',
            })
        for item in Toys.objects.filter(is_available=True, name__icontains=q)[:5]:
            results.append({
                'name': item.name, 'brand': '', 'category': 'Toys',
                'price': float(item.price),
                'image': item.image.url if item.image else '',
            })
    return JsonResponse({'query': q, 'results': results})


def search(request):
    # Get the search query and make it lowercase
    q = request.GET.get('q', '').strip().lower()
    combined = []
    
    if not q:
        # Note: Using 'search.html' because your screenshot shows 
        # it is NOT inside a 'busiwebapp' subfolder
        return render(request, 'search.html', {'total': 0, 'query': ''})

    # 1. Fetch by Name or Brand Name
    # We use brand__name__icontains to reach into the Brand model
    shoes_qs = Shoes.objects.filter(
        Q(is_available=True) & 
        (Q(name__icontains=q) | Q(brand__name__icontains=q))
    ).distinct()

    apparel_qs = Apparels.objects.filter(
        Q(is_available=True) & 
        (Q(name__icontains=q) | Q(brand__name__icontains=q))
    ).distinct()

    toys_qs = Toys.objects.filter(is_available=True, name__icontains=q)

    # 2. Category Keyword Logic
    # If the user types 'shoes', show all available shoes regardless of name
    if "shoe" in q:
        shoes_qs = Shoes.objects.filter(is_available=True)
    if "apparel" in q or "shirt" in q or "clothing" in q:
        apparel_qs = Apparels.objects.filter(is_available=True)
    if "toy" in q or "collect" in q:
        toys_qs = Toys.objects.filter(is_available=True)

    # 3. Combine into the list format your template expects: (kind, product)
    for item in shoes_qs:
        combined.append(('shoes', item))
    for item in apparel_qs:
        combined.append(('apparels', item))
    for item in toys_qs:
        combined.append(('toys', item))

    return render(request, 'busiwebapp/search.html', {
        'query': q,
        'combined': combined,
        'total': len(combined),
    })


def product_detail(request, product_type, pk):
    """Handles /product/shoes/2/, /product/apparels/3/, /product/toys/1/"""
    from django.shortcuts import get_object_or_404
    if product_type == 'shoes':
        product = get_object_or_404(Shoes, pk=pk)
    elif product_type == 'apparels':
        product = get_object_or_404(Apparels, pk=pk)
    elif product_type == 'toys':
        product = get_object_or_404(Toys, pk=pk)
    else:
        return redirect('home')
    return render(request, 'busiwebapp/product_detail.html', {
        'product': product,
        'product_type': product_type,
    })


# ─────────────────────────────────────────────
#  ADMIN
# ─────────────────────────────────────────────
@staff_member_required
def admin_dashboard(request):
    shoes_form    = ShoesForm()
    apparels_form = ApparelsForm()
    toys_form     = ToysForm()

    if request.method == 'POST':
        product_type = request.POST.get('product_type')
        if product_type == 'shoes':
            shoes_form = ShoesForm(request.POST, request.FILES)
            if shoes_form.is_valid():
                shoes_form.save()
                return redirect('admin_dashboard')
        elif product_type == 'apparels':
            apparels_form = ApparelsForm(request.POST, request.FILES)
            if apparels_form.is_valid():
                apparels_form.save()
                return redirect('admin_dashboard')
        elif product_type == 'toys':
            toys_form = ToysForm(request.POST, request.FILES)
            if toys_form.is_valid():
                toys_form.save()
                return redirect('admin_dashboard')

    context = {
        'shoes_form':    shoes_form,
        'apparels_form': apparels_form,
        'toys_form':     toys_form,
        'shoes':         Shoes.objects.all().order_by('-id'),
        'apparels':      Apparels.objects.all().order_by('-id'),
        'toys':          Toys.objects.all().order_by('-id'),
        'shoes_count':   Shoes.objects.count(),
        'apparel_count': Apparels.objects.count(),
        'toys_count':    Toys.objects.count(),
    }
    return render(request, 'busiwebapp/admin_dashboard.html', context)


@staff_member_required
def delete_product(request, product_type, pk):
    if request.method == 'POST':
        if product_type == 'shoes':    Shoes.objects.filter(pk=pk).delete()
        elif product_type == 'apparels': Apparels.objects.filter(pk=pk).delete()
        elif product_type == 'toys':   Toys.objects.filter(pk=pk).delete()
    return redirect('admin_dashboard')