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

def all(request):
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
def admin_dashboard(request):
    return render(request, 'busiwebapp/admin_dashboard.html')

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import uuid

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        # Simple demo auth
        if email and password:
            request.session['user'] = {
                'id': str(uuid.uuid4()),
                'email': email,
                'username': email.split('@')[0],
                'name': email.split('@')[0].title()
            }
            return JsonResponse({'success': True, 'user': request.session['user']})
    return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=400)

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        if name and username and password and email:
            request.session['user'] = {
                'id': str(uuid.uuid4()),
                'name': name,
                'username': username,
                'email': email,
                'dob': data.get('dob'),
                'contact': data.get('contact'),
                'address': data.get('address')
            }
            return JsonResponse({'success': True, 'user': request.session['user']})
    return JsonResponse({'success': False, 'error': 'Missing fields'}, status=400)

def profile_view(request):
    if not request.session.get('user'):
        return redirect('home')  # or login page
    return render(request, 'busiwebapp/profile.html', {'user': request.session['user']})

def get_user_session(request):
    """Helper for JS to check login state"""
    return JsonResponse({'logged_in': bool(request.session.get('user')), 'user': request.session.get('user', {})})

from django.shortcuts import redirect
