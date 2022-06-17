import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "../config/config";
import { style as tw } from "../lib/tw";
import { useStore } from "../store/Store";
const Login = ({ navigation }: { navigation: any }) => {
  const [state] = useStore();
  return (
    <SafeAreaView style={tw(`h-full dark:${COLOR_SECONDARY_DARK}`)}>
      <View style={tw("w-4/5 mx-auto")}>
        <Text style={tw("mt-3 font-app text-lg dark:text-white text-black")}>
          User Login
        </Text>
        <View
          style={tw(
            "mt-3 dark:bg-gray-700 bg-white px-4 py-6 rounded-md shadow"
          )}
        >
          <Text style={tw("font-app dark:text-white text-black")}>
            username
          </Text>
          <TextInput style={tw("bg-white shadow h-11 rounded mt-3")} />
          <Text style={tw("mt-3 font-app dark:text-white text-black")}>
            password
          </Text>
          <TextInput style={tw("bg-white shadow h-11 rounded mt-3")} />
          <TouchableOpacity style={tw("w-2/4")}>
            <Text style={tw("mt-3 font-app text-blue-400 underline")}>
              forgot password ?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chats")}
            style={tw(
              "mx-auto shadow rounded-md w-3/4 h-11 mt-8 mb-1 flex justify-center",
              `dark:${COLOR_PRIMARY_DARK} ${COLOR_PRIMARY}`
            )}
          >
            <Text style={tw("text-center text-white font-app text-base")}>
              login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
