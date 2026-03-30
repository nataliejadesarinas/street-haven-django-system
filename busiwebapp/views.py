from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse, Http404
from .models import Brand, Category, Shoes, Apparels, Toys, UserProfile, Order
from .search_utils import combined_search_querysets, serialize_product
from .forms import ShoesForm, ApparelsForm, ToysForm

def home(request):
    featured_shoes = Shoes.objects.filter(is_available=True)[:8]
    return render(request, 'busiwebapp/home.html', {
        'featured_shoes': featured_shoes,
    })

def sale(request):
    shoes = Shoes.objects.filter(is_available=True)
    apparel = Apparels.objects.filter(is_available=True)
    toys = Toys.objects.filter(is_available=True)
    return render(request, 'busiwebapp/sale.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys
    })

def all_products(request):
    brand = request.GET.get('brand')
    shoes = Shoes.objects.filter(is_available=True)
    apparel = Apparels.objects.filter(is_available=True)
    toys = Toys.objects.filter(is_available=True)
    if brand:
        shoes = shoes.filter(brand__name=brand)
        apparel = apparel.filter(brand__name=brand)
    return render(request, 'busiwebapp/all_products.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys
    })

def apparel(request):
    apparel = Apparels.objects.filter(is_available=True)
    return render(request, 'busiwebapp/apparel.html', {'apparel': apparel})

def shoes(request):
    shoes = Shoes.objects.filter(is_available=True)
    return render(request, 'busiwebapp/shoes.html', {'shoes': shoes})

def toys(request):
    toys = Toys.objects.filter(is_available=True)
    return render(request, 'busiwebapp/toys.html', {'toys': toys})

def new(request):
    latest_shoes = Shoes.objects.filter(is_available=True).order_by('-id')[:12]
    return render(request, 'busiwebapp/new.html', {
        'latest_shoes': latest_shoes
    })

@login_required
def profile(request):
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    orders = Order.objects.filter(user=request.user).order_by('-date')[:10]
    order_count = orders.count()

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'upload_avatar' and 'avatar' in request.FILES:
            user_profile.avatar = request.FILES['avatar']
            user_profile.save()
            messages.success(request, 'Profile photo updated!')
            return redirect('profile')

    context = {
        'user_profile': user_profile,
        'orders': orders,
        'order_count': order_count,
    }
    return render(request, 'busiwebapp/profile.html', context)


def _safe_image_url(fieldfile):
    if not fieldfile or not getattr(fieldfile, 'name', None):
        return ''
    try:
        return fieldfile.url
    except (ValueError, AttributeError):
        return ''


def search_api(request):
    """Return matching products as JSON (same rules as full search page)."""
    q = (request.GET.get('q') or '').strip()[:100]
    if not q:
        return JsonResponse({'query': '', 'results': []})

    shoes_qs, apparel_qs, toys_qs = combined_search_querysets(q)
    results = []

    for p in shoes_qs[:8]:
        d = serialize_product(p, 'shoes')
        d['image'] = _safe_image_url(p.image)
        results.append(d)
    for p in apparel_qs[:8]:
        d = serialize_product(p, 'apparel')
        d['image'] = _safe_image_url(p.image)
        results.append(d)
    for p in toys_qs[:8]:
        d = serialize_product(p, 'toys')
        d['image'] = _safe_image_url(p.image)
        results.append(d)

    return JsonResponse({'query': q, 'results': results[:24]})


def search_results(request):
    """Full-page search results (brands, categories, product names, keywords like shoes/apparel/toys)."""
    q = (request.GET.get('q') or '').strip()[:100]
    combined = []
    if q:
        sq, aq, tq = combined_search_querysets(q)
        for p in sq[:150]:
            combined.append(('shoes', p))
        for p in aq[:150]:
            combined.append(('apparel', p))
        for p in tq[:150]:
            combined.append(('toys', p))

    return render(request, 'busiwebapp/search_results.html', {
        'query': q,
        'combined': combined,
        'total': len(combined),
    })


def product_detail(request, product_type, pk):
    """Product page (opened from search results and can be bookmarked)."""
    if product_type == 'shoes':
        product = get_object_or_404(Shoes, pk=pk, is_available=True)
        brand_name = product.brand.name
    elif product_type == 'apparel':
        product = get_object_or_404(Apparels, pk=pk, is_available=True)
        brand_name = product.brand.name
    elif product_type == 'toys':
        product = get_object_or_404(Toys, pk=pk, is_available=True)
        brand_name = 'Collectible'
    else:
        raise Http404

    return render(request, 'busiwebapp/product_detail.html', {
        'product': product,
        'product_type': product_type,
        'brand_name': brand_name,
    })

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
        if product_type == 'shoes':
            Shoes.objects.filter(pk=pk).delete()
        elif product_type == 'apparels':
            Apparels.objects.filter(pk=pk).delete()
        elif product_type == 'toys':
            Toys.objects.filter(pk=pk).delete()
    return redirect('admin_dashboard')

def location_api(request):
    """API for province → city/municipality dropdown"""
    import json
    import os
    from django.templatetags.static import static
    
    locations_path = static('data/ph_locations.json')
    
    try:
        with open(os.path.join('static', 'data', 'ph_locations.json'), 'r', encoding='utf-8') as f:
            data = json.load(f)
        return JsonResponse(data)
    except FileNotFoundError:
        # Fallback minimal data
        data = {
            "Metro Manila": ["Manila", "Quezon City"],
            "Bulacan": ["Malolos", "San Jose del Monte"],
        }
        return JsonResponse(data)
