import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import { icons, config } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { useAuth } from "@/context/GlobalProvider";
import axios from "axios";

type FormState = {
  title: string;
  image: ImagePicker.ImagePickerAsset | null;
};

const Create = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    image: null,
  });

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        image: result.assets[0],
      });
    } else {
      setTimeout(() => {
        Alert.alert("No image selected", "Please select an image to upload.");
      }, 100);
    }
  };

  const submit = async () => {
    if (form.title === "" || !form.image) {
      return Alert.alert("Please provide all fields");
    }
  
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
  
      const localUri = form.image.uri;
      const filename = localUri.split('/').pop() || "default-filename.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
  
      // @ts-ignore
      formData.append("image", { uri: localUri, name: filename, type });
      console.log("Form Data:", formData);
  
      const uploadResponse = await axios.post(`${config.BASE_URL}/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${user?.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (uploadResponse.status === 201) {
        Alert.alert("Success", "Post uploaded successfully");
        router.push("/home");
      }
    } catch (error: any) {
      console.error("Upload Error:", error.response?.data);
  
      // Extracting and cleaning the error message
      let errorMessage = "An error occurred.";
      
      if (error.response?.data?.image?.image) {
        const rawErrorMessage = error.response.data.image.image;
  
        // Clean the error message: remove ErrorDetail wrapper and brackets
        errorMessage = rawErrorMessage.replace(/ErrorDetail\(string='(.+?)',.*\)/, '$1').replace(/[\[\]]/g, '');
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      Alert.alert("Error", errorMessage);
    } finally {
      setForm({
        title: "",
        image: null,
      });
      setUploading(false);
    }
  };  
          
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <View
          className="w-full flex justify-center h-full px-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-2xl text-white font-psemibold">Upload Photo</Text>

          <FormField
            title="Photo Title"
            value={form.title}
            placeholder="Give your post a catchy title..."
            handleChangeText={(e: string) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
          />

          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">Image</Text>

            <TouchableOpacity onPress={openImagePicker}>
              {form.image ? (
                <Image
                  source={{ uri: form.image.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
