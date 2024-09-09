from rest_framework import viewsets
from rest_framework.permissions import (IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.views import APIView

from .models import Post
from .serializers import PostSerializer, CategorySerializer
from rest_framework.response import Response
from django.db.models import Q

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        print(self.request.data)
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)
        
        query = self.request.query_params.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query)
            )

        return queryset

class UserPostListView(APIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print('User: ', request.user)
        user_posts = Post.objects.filter(creator=user)
        serializer = PostSerializer(user_posts, many=True)
        return Response(serializer.data)
