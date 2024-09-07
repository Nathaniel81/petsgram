import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { petCategories } from "@/constants/datas";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

type categoryButtonsProps = {
  onCagtegoryChanged: (category: string) => void;
};

const CategoryButtons = ({ onCagtegoryChanged }: categoryButtonsProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<TouchableOpacity[] | null[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectCategory = (index: number) => {
    setActiveIndex(index);
    onCagtegoryChanged(petCategories[index].title);
  };

  return (
    <View>
      <View className="w-full flex-1 pt-5 pb-2 px-4">
        <Text className="text-lg font-pregular text-gray-100 mb-3">
          Categories
        </Text>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 20, paddingVertical: 10, marginBottom: 10 }}
      >
        {petCategories.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            className={`flex-row items-center px-4 py-2 rounded-lg shadow ${
              activeIndex === index ? "bg-primaryColor" : "bg-white"
            }`}
          >
            <MaterialCommunityIcons
              name={item.iconName as any}
              size={20}
              // @ts-ignore
              color={activeIndex === index ? Colors.light : Colors.dark}
            />
            <Text
              className={`ml-2 ${
                activeIndex === index ? "text-white" : "text-black"
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryButtons;
