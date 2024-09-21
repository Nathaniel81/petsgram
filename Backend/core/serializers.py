from rest_framework import serializers
from .models import Post
from cloudinary.utils import cloudinary_url
from accounts.serializers import UserBasicSerializer

class PostSerializer(serializers.ModelSerializer):
    creator = UserBasicSerializer(read_only=True)
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'creator',
            'image',
            'created_at',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if instance and hasattr(instance, 'image') and instance.image:
            representation['image'] = cloudinary_url(instance.image.public_id, secure=True)[0]
        
        return representation
