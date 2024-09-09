from rest_framework import viewsets
from rest_framework.permissions import (IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.views import APIView

from .models import Post
from .serializers import PostSerializer, CategorySerializer
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        print(self.request.data)
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        category = self.request.query_params.get('category')
        if category:
            return Post.objects.filter(category__name=category)
        return super().get_queryset()

class UserPostListView(APIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print('User: ', request.user)
        user_posts = Post.objects.filter(creator=user)
        serializer = PostSerializer(user_posts, many=True)
        return Response(serializer.data)
