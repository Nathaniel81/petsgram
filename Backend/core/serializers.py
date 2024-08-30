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
            'creator',
            'photo',
            'created_at',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.photo:
            representation['photo'] = cloudinary_url(instance.photo.public_id, secure=True)[0]
        return representation
