from django.shortcuts import render, redirect
from django.contrib.admin.views.decorators import staff_member_required
from .models import Brand, Category, Shoes, Apparels, Toys
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
    shoes = Shoes.objects.filter(is_available=True).order_by('-id')[:8]
    apparel = Apparels.objects.filter(is_available=True).order_by('-id')[:8]
    toys = Toys.objects.filter(is_available=True).order_by('-id')[:8]
    return render(request, 'busiwebapp/new.html', {
        'shoes': shoes, 'apparel': apparel, 'toys': toys
    })

def profile(request):
    return render(request, 'busiwebapp/profile.html')

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