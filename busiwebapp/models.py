from django.db import models

class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
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
    image = models.ImageField(upload_to='shoes/')
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
class Apparels(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='apparels/')
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    brand = models.ForeignKey('Brand', on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
class Toys(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.IntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='toys/')
    color = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)
    def __str__(self):
        return self.name