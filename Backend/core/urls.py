from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PostViewSet, UserPostListView

router = DefaultRouter()
router.register(r'', PostViewSet)

urlpatterns = [
    path('user/', UserPostListView.as_view(), name='user-posts'),
    path('', include(router.urls)),
]
