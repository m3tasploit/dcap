import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  APP_NAME,
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "../config/config";
import { style as tw } from "../lib/tw";

const Navbar = () => {
  return (
    <SafeAreaView
      style={tw(`pb-3 dark:${COLOR_PRIMARY_DARK} ${COLOR_PRIMARY}`)}
    >
      <Text style={tw("font-app-semi text-xl ml-3 mt-3 text-white")}>
        {APP_NAME}
      </Text>
    </SafeAreaView>
  );
};

export default Navbar;
