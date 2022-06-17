import React from "react";
import { View } from "react-native";
import { style as tw } from "../lib/tw";

const OptionsIcon = () => {
  return (
    <View style={tw("h-4 flex flex-col justify-between ")}>
      <View style={tw("w-1 bg-white h-1 rounded-full")}></View>
      <View style={tw("w-1 bg-white h-1 rounded-full")}></View>
      <View style={tw("w-1 bg-white h-1 rounded-full")}></View>
    </View>
  );
};

export default OptionsIcon;
