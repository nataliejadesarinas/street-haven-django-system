from django.db import models

class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name

from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='profiles/', blank=True, null=True)
    contact = models.CharField(max_length=20, blank=True)
    dob = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=200)
    price = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Order {self.id} - {self.product_name}"
    
class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Shoes(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.IntegerField()
    description = models.TextField()
    image_front = models.ImageField(upload_to='shoes/', default='shoes/placeholder.jpg', verbose_name="Front Image")
    image_back = models.ImageField(upload_to='shoes/', blank=True, null=True, default='shoes/placeholder.jpg', verbose_name="Back Image")
    image_left = models.ImageField(upload_to='shoes/', blank=True, null=True, default='shoes/placeholder.jpg', verbose_name="Left Side Image")
    image_right = models.ImageField(upload_to='shoes/', blank=True, null=True, default='shoes/placeholder.jpg', verbose_name="Right Side Image")
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    old_price = models.FloatField(null=True, blank=True, verbose_name="Old Price (for discount display)")

    def __str__(self):
        return self.name
    
    @property
    def image(self):
        """Return the left image for backward compatibility, fallback to front if left doesn't exist"""
        return self.image_left or self.image_front
    
class Apparels(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.IntegerField()
    description = models.TextField()
    image_front = models.ImageField(upload_to='apparels/', default='apparels/placeholder.jpg', verbose_name="Front Image")
    image_back = models.ImageField(upload_to='apparels/', blank=True, null=True, default='apparels/placeholder.jpg', verbose_name="Back Image")
    image_left = models.ImageField(upload_to='apparels/', blank=True, null=True, default='apparels/placeholder.jpg', verbose_name="Left Side Image")
    image_right = models.ImageField(upload_to='apparels/', blank=True, null=True, default='apparels/placeholder.jpg', verbose_name="Right Side Image")
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    old_price = models.FloatField(null=True, blank=True, verbose_name="Old Price (for discount display)")

    def __str__(self):
        return self.name
    
    @property
    def image(self):
        """Return the left image for backward compatibility, fallback to front if left doesn't exist"""
        return self.image_left or self.image_front
    
class Toys(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.IntegerField()
    description = models.TextField()
    image_front = models.ImageField(upload_to='toys/', default='toys/placeholder.jpg', verbose_name="Front Image")
    image_back = models.ImageField(upload_to='toys/', blank=True, null=True, default='toys/placeholder.jpg', verbose_name="Back Image")
    image_left = models.ImageField(upload_to='toys/', blank=True, null=True, default='toys/placeholder.jpg', verbose_name="Left Side Image")
    image_right = models.ImageField(upload_to='toys/', blank=True, null=True, default='toys/placeholder.jpg', verbose_name="Right Side Image")
    color = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)
    old_price = models.FloatField(null=True, blank=True, verbose_name="Old Price (for discount display)")
    def __str__(self):
        return self.name
    
    @property
    def image(self):
        """Return left image for backward compatibility, fallback to front if left doesn't exist"""
        return self.image_left or self.image_front