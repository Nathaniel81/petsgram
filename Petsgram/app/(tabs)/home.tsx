import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, PostCard, Category } from "@/components";
import { useAuth } from "@/context/GlobalProvider";
import { IPost } from "@/types";
import { images } from "../../constants";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [category, setCategory] = useState("All");

  const onCatChanged = (newCategory: string) => {
    console.log("Category: ", newCategory);
    setCategory(newCategory);
    setPosts([]);
    fetchPosts(newCategory);
  };

  const fetchPosts = async (selectedCategory: string) => {
    try {
      setLoading(true);
      const endpoint =
        selectedCategory === "All"
          ? "https://six-moments-drive.loca.lt/api/posts/"
          : `https://six-moments-drive.loca.lt/api/posts/?category=${selectedCategory}`;

      const response = await axios.get(endpoint);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Alert.alert("Error", "Could not fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(category);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(category);
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!refreshing && !loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      {/* Welcome Text Section */}
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {user?.username || "Guest"}
            </Text>
          </View>

          <View className="mt-1.5">
            <Image
              source={images.logoSmall}
              className="w-9 h-10"
              resizeMode="contain"
            />
          </View>
        </View>
        {/* Category Component */}
        <Category onCagtegoryChanged={onCatChanged} />
      </View>

      {/* Latest Posts Section */}
      <View className="w-full flex-1 pt-5 pb-2 px-4">
        <Text className="text-lg font-pregular text-gray-100 mb-3">
          Latest Posts
        </Text>
      </View>

      {/* Show loading indicator or posts list */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              title={item.title}
              photo={item.image}
              creator={item.creator.username}
              avatar={item.creator.profile_picture}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyState title="No Posts Found" subtitle="No Posts created yet" />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
