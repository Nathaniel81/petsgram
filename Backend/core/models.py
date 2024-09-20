from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField

# class Category(models.Model):
#     name = models.CharField(max_length=50, unique=True)

#     def __str__(self):
#         return self.name

class Post(models.Model):
    title = models.CharField(max_length=255)
    image = CloudinaryField('image', null=True, blank=True)
    creator = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    # category = models.ForeignKey(Category, related_name='posts', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title
