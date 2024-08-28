import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, Alert } from "react-native";
import axios from "axios";

import { images } from "../../constants";
import { PostCard, EmptyState } from "@/components";
import { useAuth } from "@/context/GlobalProvider";
import { IPost } from "@/types";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://great-rules-burn.loca.lt/api/posts/');
      // const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Alert.alert("Error", "Could not fetch posts. Please try again.");
    }
  };

  useEffect(() => {
    console.log(user?.access_token)
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            title={item.title}
            photo={item.photo}
            creator={item.creator.username}
            avatar={item.creator.profile_picture}
          />
        )}
        ListHeaderComponent={() => (
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
            {/* Search Input ... */}
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Posts
              </Text>
              {/* categories ...*/}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="No Posts created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
