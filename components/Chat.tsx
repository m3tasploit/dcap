import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "../config/config";
import { style as tw } from "../lib/tw";
import { useStore } from "../store/Store";
import OptionsIcon from "./OptionsIcon";

type RootStackParamList = {
  Chat: { id: number; name: string };
};

const chatOne = [
  {
    id: 1,
    message:
      "Hellow this is a test message from me to ichika nito to check whether the ui is working perfect",
    type: "sent",
    time: "22:40",
  },
  {
    id: 2,
    message:
      "Hellow this is a test message from ichika to m3ta nito to check whether the ui is working perfect",
    type: "received",
    time: "22:41",
  },
  {
    id: 3,
    message: "Hellow this is a test message from m3ta to ichika nito",
    type: "sent",
    time: "22:42",
  },
];

const Header = ({ name, navigation }: { name: string; navigation: any }) => {
  return (
    <View
      style={tw(
        "p-2 flex flex-row items-center w-full h-14 justify-between",
        `dark:${COLOR_PRIMARY_DARK} ${COLOR_PRIMARY}`
      )}
    >
      <View style={tw("flex flex-row items-center")}>
        <Pressable
          android_ripple={{
            color: "rgb(107 114 128)",
            borderless: true,
            radius: 40,
          }}
          style={tw("flex flex-row items-center")}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw("text-4xl text-white  font-app-thin pt-1.5")}>
            {"<"}
          </Text>
          <View style={tw("rounded-full w-9 h-9 bg-gray-500 ml-1")}></View>
        </Pressable>
        <Text style={tw("text-white font-app-semi text-base ml-3 pt-0.5")}>
          {name}
        </Text>
      </View>
      <Pressable
        android_ripple={{
          color: "rgb(107 114 128)",
          borderless: true,
          radius: 30,
        }}
        style={tw("pr-4 pl-4")}
      >
        <OptionsIcon />
      </Pressable>
    </View>
  );
};

const MessageInput = () => {
  return (
    <View style={tw("flex flex-row justify-between px-2 pb-1.5")}>
      <TextInput
        style={tw(
          `dark:${COLOR_PRIMARY_DARK} bg-white shadow h-12 grow rounded-full px-4 dark:text-white text-black`
        )}
        placeholder="Message"
        placeholderTextColor={tw("dark:text-white text-black").color + ""}
      />
      <View
        style={tw(
          `${COLOR_PRIMARY} shadow h-12 w-12 rounded-full grow-0 ml-1 flex flex-row justify-center items-center`
        )}
      >
        <Pressable
          android_ripple={{
            color: "rgb(107 114 128)",
            borderless: true,
            radius: 30,
          }}
        >
          <Image
            source={require("../assets/carbon_send-filled.png")}
            style={tw("w-7 h-7 ml-1")}
          />
        </Pressable>
      </View>
    </View>
  );
};

const Chat = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Chat">) => {
  const [state] = useStore();

  const { id, name } = route.params;
  return (
    <SafeAreaView
      style={tw(`h-full dark:${COLOR_SECONDARY_DARK} bg-orange-100`)}
    >
      <Header name={name} navigation={navigation} />
      <ScrollView>
        <Text>content</Text>
      </ScrollView>
      <MessageInput />
    </SafeAreaView>
  );
};

export default Chat;
