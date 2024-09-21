from rest_framework import viewsets
from rest_framework.permissions import (IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.views import APIView

from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response
from django.db.models import Q

import tempfile
from rest_framework import status
from django.core.files.storage import default_storage
from tensorflow.keras.applications.mobilenet import MobileNet, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the pre-trained MobileNet model
mobilenet_model = MobileNet(weights='imagenet')

def is_pet_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    
    preds = mobilenet_model.predict(x)
    decoded_preds = decode_predictions(preds, top=3)[0]

    pet_keywords = ['dog', 'cat', 'puppy', 'kitten', 'animal']
    for _, label, _ in decoded_preds:
        if any(keyword in label for keyword in pet_keywords):
            return True
    return False

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        image_file = self.request.FILES.get('image')

        if image_file:
            print("Image file received:", image_file.name)
            try:
                temp_image = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
                temp_image.write(image_file.read())
                temp_image.flush()
                temp_image.close()

                if not is_pet_image(temp_image.name):
                    print("Image validation failed.")
                    return Response({'error': 'Invalid image. Please upload a pet image.'}, status=status.HTTP_400_BAD_REQUEST)

                print("Image validation successful.")
            except Exception as e:
                print(f"Error during image handling or validation: {e}")
                return Response({'error': 'An error occurred during image processing.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
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