from rest_framework import serializers
from .models import Post
from cloudinary.utils import cloudinary_url
from accounts.serializers import UserBasicSerializer

from django.core.files.storage import default_storage
from tensorflow.keras.applications.mobilenet import MobileNet, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import tempfile

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

    def validate_image(self, image_file):
        if image_file:
            try:
                temp_image = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
                temp_image.write(image_file.read())
                temp_image.flush()
                temp_image.close()
    
                if not is_pet_image(temp_image.name):
                    raise serializers.ValidationError('Invalid image. Please upload a pet image.')
    
            except Exception as e:
                raise serializers.ValidationError({'image': f"Error during image validation: {e}"})
        return image_file


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = cloudinary_url(instance.image.public_id, secure=True)[0]
        return representation
