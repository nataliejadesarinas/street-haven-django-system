from django.shortcuts import render
from .models import Brand, Category, Shoes, Apparels, Toys

def home(request):
    featured_shoes = Shoes.objects.filter(is_available=True)[:8]
    featured_apparel = Apparels.objects.filter(is_available=True)[:8]
    featured_toys = Toys.objects.filter(is_available=True)[:8]
    return render(request, 'busiwebapp/home.html', {
        'featured_shoes': featured_shoes,
        'featured_apparel': featured_apparel,
        'featured_toys': featured_toys,
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
    shoes = Shoes.objects.filter(is_available=True).order_by('-id')[:8]
    apparel = Apparels.objects.filter(is_available=True).order_by('-id')[:8]
    toys = Toys.objects.filter(is_available=True).order_by('-id')[:8]
    return render(request, 'busiwebapp/new.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys
    })