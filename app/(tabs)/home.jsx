import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { images } from "../../constants/images";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetchLatest } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = async () => {
    setRefreshing(true);

    // Run both refetch and refetchLatest in parallel
    await Promise.all([refetch(), refetchLatest()]);

    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={() => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-4">
            <View className="justify-between items-start flex-row mb-6">
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                DanMecha
              </Text>
            </View>
            <View className="mt-1.5">
              <Image
                resizeMode="contain"
                source={images.logoSmall}
                className="w-9 h-10"
              />
            </View>

            <SearchInput />

            <View className="w-fullnflex-1 pt-5 pb-8  ">
              <Text className="text-gray-100 font-pregular text-lg mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => {
          <Text>
            <EmptyState
              title="No Videos Found"
              subTitle="Be the first one to upload a video"
            />
          </Text>;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefreshing={setRefreshing}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
