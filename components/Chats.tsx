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
import { COLOR_PRIMARY_DARK, COLOR_SECONDARY_DARK } from "../config/config";
import { style as tw } from "../lib/tw";
import { useAppSelector } from "../store/Store";

const chats = [
  {
    id: 1,
    name: "Everyone",
    lastMessage: "",
  },
];

const Chats = ({ navigation }: { navigation: any }) => {
  const colorScheme = useAppSelector((state) => state.app.colorScheme);

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
          {/* time */}
        </Text>
        <View
          style={tw(
            "flex flex-col justify-center items-center h-5 min-w-5 bg-green-500 rounded-full px-1 py-0.5"
          )}
        >
          <Text style={tw("font-app-semi text-white", { fontSize: 12 })}>
            {/* new messages count */}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={tw(`h-full dark:${COLOR_PRIMARY_DARK} bg-orange-100`)}
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
