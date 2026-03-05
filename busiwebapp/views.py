from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'busiwebapp/home.html')

def sale(request):
    return render(request, 'busiwebapp/sale.html')

def all(request):
    return render(request, 'busiwebapp/all.html')

def apparel(request):
    return render(request, 'busiwebapp/apparel.html')

def shoes(request):
    return render(request, 'busiwebapp/shoes.html')

def toys(request):
    return render(request, 'busiwebapp/toys.html')

def new(request):
    return render(request, 'busiwebapp/new.html')