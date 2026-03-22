from django.shortcuts import render\nfrom .models import Brand, Category, Shoes, Apparels, Toys\n\ndef home(request):\n    featured_shoes = Shoes.objects.filter(is_available=True)[:8]\n    featured_apparel = Apparels.objects.filter(is_available=True)[:8]\n    featured_toys = Toys.objects.filter(is_available=True)[:8]\n    return render(request, 'busiwebapp/home.html', {\n        'featured_shoes': featured_shoes,\n        'featured_apparel': featured_apparel,\n        'featured_toys': featured_toys,\n    })\n\n\ndef sale(request):\n    shoes = Shoes.objects.filter(is_available=True)\n    apparel = Apparels.objects.filter(is_available=True)\n    toys = Toys.objects.filter(is_available=True)\n    return render(request, 'busiwebapp/sale.html', {\n        'shoes': shoes, 'apparel': apparel, 'toys': toys\n    })\n\n\ndef all(request):\n    brand = request.GET.get('brand')\n    shoes = Shoes.objects.filter(is_available=True)\n    apparel = Apparels.objects.filter(is_available=True)\n    toys = Toys.objects.filter(is_available=True)\n    if brand:\n        shoes = shoes.filter(brand__name=brand)\n        apparel = apparel.filter(brand__name=brand)\n    return render(request, 'busiwebapp/all_products.html', {\n        'shoes': shoes, 'apparel': apparel, 'toys': toys\n    })\n\n\n\ndef all_products(request):\n    brand = request.GET.get('brand')\n    shoes = Shoes.objects.filter(is_available=True)\n    apparel = Apparels.objects.filter(is_available=True)\n    toys = Toys.objects.filter(is_available=True)\n    if brand:\n        shoes = shoes.filter(brand__name=brand)\n        apparel = apparel.filter(brand__name=brand)\n    return render(request, 'busiwebapp/all_products.html', {\n        'shoes': shoes, 'apparel': apparel, 'toys': toys\n    })\n\n\ndef apparel(request):\n    apparel = Apparels.objects.filter(is_available=True)\n    return render(request, 'busiwebapp/apparel.html', {'apparel': apparel})\n\n\ndef shoes(request):\n    shoes = Shoes.objects.filter(is_available=True)\n    return render(request, 'busiwebapp/shoes.html', {'shoes': shoes})\n\n\ndef toys(request):\n    toys = Toys.objects.filter(is_available=True)\n    return render(request, 'busiwebapp/toys.html', {'toys': toys})\n\n\ndef new(request):\n    shoes = Shoes.objects.filter(is_available=True).order_by('-id')[:8]\n    apparel = Apparels.objects.filter(is_available=True).order_by('-id')[:8]\n    toys = Toys.objects.filter(is_available=True).order_by('-id')[:8]\n    return render(request, 'busiwebapp/new.html', {\n        'shoes': shoes, 'apparel': apparel, 'toys': toys\n    })\ndef admin_dashboard(request):\n    return render(request, 'busiwebapp/admin_dashboard.html')

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
