import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOR_SECONDARY_DARK } from "../config/config";
import { style as tw } from "../lib/tw";
import { useStore } from "../store/Store";

const chats = [
  {
    id: 1,
    name: "David",
    lastMessage: "Hello",
  },
  {
    id: 2,
    name: "John",
    lastMessage: "Where are you",
  },
  {
    id: 3,
    name: "Michael Jackson",
    lastMessage: "Hee hee intensifies",
  },
  {
    id: 4,
    name: "David Beckahm",
    lastMessage: "Quit football",
  },
  {
    id: 5,
    name: "Harry styles",
    lastMessage: "Watermelon",
  },
  {
    id: 6,
    name: "Liam pain",
    lastMessage: "Im still in pain",
  },
  {
    id: 7,
    name: "Tim henson",
    lastMessage: "Playing god",
  },
  {
    id: 8,
    name: "Ichika nito",
    lastMessage: "Vibing",
  },
  {
    id: 9,
    name: "Sunga jung",
    lastMessage: "New song out",
  },
  {
    id: 10,
    name: "Jacky chan",
    lastMessage: "How's the kungfu",
  },
];

const Chats = ({ navigation }: { navigation: any }) => {
  const [state] = useStore();

  const renderItem = ({ item: chat }: { item: any }) => (
    <Pressable
      android_ripple={{ color: "rgb(107 114 128)" }}
      style={tw("flex flex-row justify-between items-center py-2.5 px-4")}
      onPress={() =>
        navigation.navigate("Chat", { id: chat.id, name: chat.name })
      }
    >
      <View style={tw("flex flex-row")}>
        <View style={tw("rounded-full w-14 h-14 bg-gray-500")}></View>
        <View style={tw("flex justify-center ml-4")}>
          <Text
            style={tw("dark:text-white text-black font-app-semi text-base")}
          >
            {chat.name}
          </Text>
          <Text style={tw("dark:text-white text-black font-app")}>
            {chat.lastMessage}
          </Text>
        </View>
      </View>
      <View style={tw("flex flex-col items-end")}>
        <Text
          style={tw("dark:text-white text-black mb-2 font-app-semi", {
            fontSize: 12,
          })}
        >
          04:20 PM
        </Text>
        <View
          style={tw(
            "flex flex-col justify-center items-center h-5 min-w-5 bg-green-500 rounded-full px-1 py-0.5"
          )}
        >
          <Text style={tw("font-app-semi text-white", { fontSize: 12 })}>
            5
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={tw(`h-full dark:${COLOR_SECONDARY_DARK} bg-white`)}
      edges={["right", "bottom", "left"]}
    >
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => "" + item.id}
        ListHeaderComponent={
          <Text
            style={tw(
              `dark:text-white text-black font-app-bold text-xl text-center py-2`
            )}
          >
            Chats
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Chats;
