import { useAuth } from "@/context/GlobalProvider";
import { IPost } from "@/types";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { 
  Alert, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, InfoBox, PostCard } from "../../components";
import { icons, images, config } from "../../constants";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/posts/user/`, {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      });
      setUserPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Alert.alert("Error", "Could not fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            title={item.title}
            photo={item.image}
            creator={item.creator.username}
            avatar={item.creator.profile_picture}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={user?.profile_picture ? { uri: user?.profile_picture } : images.profilePlaceholder}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={userPosts.length.toString()}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
      />
      )}
    </SafeAreaView>
  );
};

export default Profile;
