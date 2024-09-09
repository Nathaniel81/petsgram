import { useEffect, useState } from "react";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, SearchInput, PostCard } from "../../components";
import { IPost } from "@/types";
import { config } from "@/constants";

const Search = () => {
  const { query } = useLocalSearchParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/posts/?q=${searchQuery}`);
      setPosts(response.data);  // Adjust based on the response structure
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchPosts(query as string);
    }
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
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
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4">
            <Text className="font-pmedium text-gray-100 text-sm">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white mt-1">
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query as string} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          !loading && (
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for this search query"
            />
          )
        )}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" color="#fff" />}
      />
    </SafeAreaView>
  );
};
export default Search;
