import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "../config/config";
import { generateGroupId, GUN, gundb, user } from "../lib/gun";
import { style as tw } from "../lib/tw";
import { useAppSelector } from "../store/Store";
import MessageInput from "./MessageInput";
import OptionsIcon from "./OptionsIcon";

type RootStackParamList = {
  Chat: {
    name: string;
    isGroup: boolean;
    chatRoomKey: string;
    hisPubKey: string;
  };
};

const Header = ({ name, navigation }: { name: string; navigation: any }) => {
  return (
    <View
      style={tw(
        "p-2 flex flex-row items-center w-full h-14 justify-between",
        `dark:${COLOR_SECONDARY_DARK} ${COLOR_PRIMARY}`
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

const ChatMessage = ({ item, navigation }: { item: any; navigation: any }) => {
  return (
    <View
      style={tw(
        `w-3/4 mb-2 py-2 px-3 flex flex-col ${
          item.received
            ? `rounded-t-xl rounded-br-xl self-start dark:${COLOR_SECONDARY_DARK} bg-white`
            : `rounded-t-xl rounded-bl-xl self-end dark:${COLOR_PRIMARY} bg-orange-300`
        }`
      )}
    >
      {item.received && item.isGroup && (
        <Pressable
          android_ripple={{ color: "rgb(107 114 128)" }}
          onPress={() => {
            const myPubKey = user.is?.pub;
            if (myPubKey && item.userPubKey) {
              let chatRoomKey = generateGroupId(myPubKey, item.userPubKey);
              navigation.push("Chat", {
                name: item.from,
                isGroup: false,
                chatRoomKey,
                hisPubKey: item.userPubKey,
              });
            }
          }}
        >
          <Text
            style={tw(`text-base dark:text-white text-black font-app-semi`)}
          >
            {item.from}
          </Text>
        </Pressable>
      )}
      <Text style={tw(`text-base dark:text-white text-black font-app`)}>
        {item.message}
      </Text>
      <Text
        style={tw(`text-xs dark:text-gray-300 text-black self-end font-app`)}
      >
        {new Date(item.time).toLocaleTimeString()}
      </Text>
    </View>
  );
};

const Chat = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Chat">) => {
  const colorScheme = useAppSelector((state) => state.app.colorScheme);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const {
    name = "Everyone",
    isGroup = true,
    chatRoomKey,
    hisPubKey,
  } = route.params;
  const myalias = user.is?.alias;
  const myPubKey = user.is?.pub;
  const sortedMessages = [...messages].sort((a, b) => a.time - b.time);
  const flatListRef = useRef<FlatList | null>(null);

  useEffect(() => {
    try {
      if (chatRoomKey) {
        gundb
          .get(chatRoomKey)
          .map()
          .once(async (data, id) => {
            if (data) {
              let received = false;
              if (data.from !== myalias) {
                received = true;
              }
              let timestamp = GUN.state.is(data, "message");
              setMessages((prev) => [
                ...prev,
                {
                  message: data.message,
                  time: timestamp,
                  received,
                  from: data.from,
                  id,
                  isGroup: isGroup,
                  userPubKey: data.userPubKey ? data.userPubKey : "",
                },
              ]);
            }
          });
      }
    } catch (error) {
      console.log("error while loading messages", error);
    }

    return () => {
      gundb.get(chatRoomKey).off();
    };
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={tw(`h-full dark:${COLOR_PRIMARY_DARK} bg-orange-100`)}>
      <Header name={name} navigation={navigation} />

      <FlatList
        data={sortedMessages}
        renderItem={({ item }) => (
          <ChatMessage item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => "" + item.id}
        contentContainerStyle={tw("p-2 pb-0")}
        ref={flatListRef}
      />
      <MessageInput
        onChangeMessage={(text) => setMessage(text)}
        onSendClick={() => {
          if (user.is && message) {
            if (isGroup) {
              gundb.get("chats").get(name).put({
                title: name,
                isGroup: true,
                lastMessage: message,
              });
              gundb.get(name).set({
                message,
                from: user.is.alias,
                userPubKey: user.is.pub,
              });
            } else {
              if (myPubKey && hisPubKey) {
                let myAlias = user.is.alias.toString();
                let hisAlias = name;
                let title = generateGroupId(myAlias, hisAlias);
                let chatObj = {
                  title,
                  isGroup: false,
                  lastMessage: message,
                  chatRoomKey,
                };

                gundb
                  .get(myPubKey)
                  .get("groups")
                  .put({ [chatRoomKey]: chatObj });
                gundb
                  .get(hisPubKey)
                  .get("groups")
                  .put({ [chatRoomKey]: chatObj });

                gundb
                  .get(chatRoomKey)
                  .set({ from: myAlias, to: hisAlias, message });
              }
            }
            setMessage("");
          }
        }}
        message={message}
      />
    </SafeAreaView>
  );
};

export default Chat;
