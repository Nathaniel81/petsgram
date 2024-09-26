import axios from "axios";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
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
import { EmptyState, PostCard, SearchInput } from "@/components";
import { useAuth } from "@/context/GlobalProvider";
import { IPost } from "@/types";
import { images, config } from "../../constants";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const endpoint = `${config.BASE_URL}/posts/`;
      const response = await axios.get(endpoint);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Alert.alert("Error", "Could not fetch posts. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
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
        <SearchInput />
      </View>

      {/* Latest Posts Section */}
      <View className="w-full flex-1 pt-5 pb-2 px-4">
        <Text className="text-lg font-pregular text-gray-100 mb-3">
          Latest Posts
        </Text>
      </View>

      {/* Show loading indicator or posts list */}
      {initialLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : posts.length === 0 ? (
        <EmptyState title="No Posts Found" subtitle="No Posts created yet" />
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
