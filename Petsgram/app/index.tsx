import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { SplashScreen } from "@/components";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/GlobalProvider";
import { useState } from "react";

const Welcome = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();

  if (user) return <Redirect href="/" />;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={false} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          {/* logo */}
          <Image
            source={images.logo_3}
            className="max-w-[380px] w-1/3 h-[198px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Share Unforgettable Moments with{"\n"}
              Your Furry Friends on{" "}
              <Text className="text-secondary-200">Petsgram</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 right-20"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Pets Shine and Memories Live On: Join the Ultimate Community
            for Pet Lovers on Petsgram
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/(auth)/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
