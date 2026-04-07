# store/forms.py
from django import forms
from .models import Shoes, Apparels, Toys

GENDER_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Unisex', 'Unisex'),
]

class ShoesForm(forms.ModelForm):
    gender = forms.ChoiceField(choices=GENDER_CHOICES)
    class Meta:
        model = Shoes
        fields = ['name', 'brand', 'category', 'price', 'old_price', 'stock',
                  'description', 'image_front', 'image_back', 'image_left', 'image_right', 
                  'color', 'gender', 'is_available']

class ApparelsForm(forms.ModelForm):
    gender = forms.ChoiceField(choices=GENDER_CHOICES)
    class Meta:
        model = Apparels
        fields = ['name', 'brand', 'category', 'price', 'old_price', 'stock',
                  'description', 'image_front', 'image_back', 'image_left', 'image_right', 
                  'color', 'gender', 'is_available']

class ToysForm(forms.ModelForm):
    class Meta:
        model = Toys
        fields = ['name', 'price', 'old_price', 'stock', 'description',
                  'image_front', 'image_back', 'image_left', 'image_right', 
                  'color', 'is_available']