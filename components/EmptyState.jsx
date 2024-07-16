import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants/images";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const EmptyState = ({title, subtitle}) => {
  return (
    <View className="justify-center items-center px-4">
      <Text className="font-pmedium text-sm text-gray-100">{title}</Text>
      <Text className="text-2xl font-psemibold text-white">{subtitle}</Text>
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <CustomButton 
        title={'Create Video'}
        handlePress={() => {
            router.push('/create')
        }}
        containerStyles={'w-full my-5'}
      />
    </View>
  );
};

export default EmptyState;
