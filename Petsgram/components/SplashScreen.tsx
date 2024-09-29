import React, { useEffect } from "react";
import { Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FC } from "react";
import { images } from "@/constants";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeAreaView className="flex-1 bg-[#161622] justify-center items-center">
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
      <Image
        source={images.logo_3}
        className="w-40 h-40"
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
