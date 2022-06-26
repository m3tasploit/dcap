import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "../config/config";
import { login, signup } from "../lib/gun";
import { style as tw } from "../lib/tw";
import { useAppDispatch, useAppSelector } from "../store/Store";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const Login = ({ navigation }: Props) => {
  const colorScheme = useAppSelector((state) => state.app.colorScheme);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={tw(`h-full dark:${COLOR_SECONDARY_DARK} bg-white`)}>
      <View style={tw("w-4/5 mx-auto")}>
        <Text style={tw("mt-3 font-app text-lg dark:text-white text-black")}>
          User Auth
        </Text>
        <View
          style={tw(
            "mt-3 dark:bg-gray-700 bg-white px-4 py-6 rounded-md shadow"
          )}
        >
          <Text style={tw("font-app dark:text-white text-black")}>
            username
          </Text>
          <TextInput
            style={tw("bg-white shadow h-11 rounded mt-3 px-2")}
            onChangeText={(text) => setUsername(text)}
          />
          <Text style={tw("mt-3 font-app dark:text-white text-black")}>
            password
          </Text>
          <TextInput
            style={tw("bg-white shadow h-11 rounded mt-3 px-2")}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={tw("w-2/4")}>
            <Text style={tw("mt-3 font-app text-blue-400 underline")}>
              forgot password ?
            </Text>
          </TouchableOpacity>
          {message.length > 0 && (
            <Text style={tw("mt-2 font-app dark:text-white text-black")}>
              {message}
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              login(
                username,
                password,
                () => {
                  console.log("Login success");
                  navigation.replace("Chats");
                },
                (err) => {
                  if (err.error) {
                    setMessage(err.message);
                  }
                }
              )
            }
            style={tw(
              "mx-auto shadow rounded-md w-3/4 h-11 mt-8 mb-1 flex justify-center",
              `dark:${COLOR_PRIMARY_DARK} ${COLOR_PRIMARY}`
            )}
          >
            <Text style={tw("text-center text-white font-app text-base")}>
              login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              signup(
                username,
                password,
                () => {
                  console.log("Signup success");
                  navigation.replace("Chats");
                },
                (err) => {
                  if (err.error) {
                    setMessage(err.message);
                  }
                }
              )
            }
            style={tw(
              "mx-auto shadow rounded-md w-3/4 h-11 mt-8 mb-1 flex justify-center",
              `dark:${COLOR_PRIMARY_DARK} ${COLOR_PRIMARY}`
            )}
          >
            <Text style={tw("text-center text-white font-app text-base")}>
              signup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
