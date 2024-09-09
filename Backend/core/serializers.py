from rest_framework import serializers
from .models import Post, Category
from cloudinary.utils import cloudinary_url
from accounts.serializers import UserBasicSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class PostSerializer(serializers.ModelSerializer):
    creator = UserBasicSerializer(read_only=True)
    category = CategorySerializer()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'creator',
            'image',
            'category',
            'created_at',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = cloudinary_url(instance.image.public_id, secure=True)[0]
        return representation
