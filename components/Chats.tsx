import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOR_PRIMARY_DARK, COLOR_SECONDARY_DARK } from "../config/config";
import { GUN, gundb, user } from "../lib/gun";
import { style as tw } from "../lib/tw";
import { useAppSelector } from "../store/Store";

interface ChatRoomType {
  chatRoomKey: any;
  title: any;
  isGroup: any;
  lastMessage: any;
  timestamp: number;
}

const RenderItem = ({
  item: chat,
  navigation,
}: {
  item: ChatRoomType;
  navigation: any;
}) => (
  <Pressable
    android_ripple={{ color: "rgb(107 114 128)" }}
    style={tw("flex flex-row justify-between items-center py-2.5 px-4 w-full")}
    onPress={() => {
      let hisPubKey;
      let title = chat.title;
      if (!chat.isGroup && chat.chatRoomKey) {
        //chatroomey split
        let first = chat.chatRoomKey.split(":")[0];
        let second = chat.chatRoomKey.split(":")[1];
        let mypub = user.is?.pub;
        let myalias = user.is?.alias;
        if (mypub === first) {
          hisPubKey = second;
        } else if (mypub === second) {
          hisPubKey = first;
        }

        //name split
        first = title.split(":")[0];
        second = title.split(":")[1];
        if (myalias === first) {
          title = second;
        } else if (myalias === second) {
          title = first;
        }
      }

      navigation.push("Chat", {
        name: title,
        chatRoomKey: chat.chatRoomKey,
        isGroup: chat.isGroup,
        hisPubKey,
      });
    }}
  >
    <View style={tw("flex flex-row w-full")}>
      <View style={tw("rounded-full w-14 h-14 bg-gray-500")}></View>
      <View style={tw("flex flex-col justify-between ml-4 w-4/5")}>
        <View style={tw("flex flex-row justify-between")}>
          <Text
            style={tw("dark:text-white text-black font-app-semi text-base")}
          >
            {chat.title}
          </Text>
          <Text
            style={tw("dark:text-white text-black font-app-semi", {
              fontSize: 12,
            })}
          >
            {new Date(chat.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <View style={tw("flex flex-row justify-between")}>
          <Text
            style={tw("dark:text-white text-black font-app w-4/5")}
            ellipsizeMode="middle"
          >
            {chat.lastMessage}
          </Text>
          {new Date().getTime() - chat.timestamp < 60 * 1000 && (
            <View
              style={tw(
                "flex flex-col justify-center items-center h-5 min-w-5 max-w-14 bg-green-500 rounded-full px-1 py-0.5"
              )}
            >
              <Text style={tw("font-app-semi text-white", { fontSize: 12 })}>
                {/* 10 */}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  </Pressable>
);

const Chats = ({ navigation }: { navigation: any }) => {
  const colorScheme = useAppSelector((state) => state.app.colorScheme);
  const [everyoneGroup, setEveryOneGroup] = useState({
    chatRoomKey: "Everyone",
    title: "Everyone",
    isGroup: true,
    lastMessage: "",
    timestamp: 0,
  });
  const [chats, setChats] = useState<{ [key: string]: ChatRoomType }>({});
  const combinedChats = [
    everyoneGroup,
    ...Object.values(chats).sort((a, b) => b.timestamp - a.timestamp),
  ];
  let myPubKey = user.is?.pub;

  // console.log(combinedChats);

  useEffect(() => {
    if (user.is) {
      let myPubKey = user.is.pub;
      //everyone sub
      gundb
        .get("chats")
        .get("Everyone")
        .on((data) => {
          if (data) {
            const timestamp = GUN.state.is(data, "lastMessage");
            setEveryOneGroup((prev) => ({
              ...prev,
              lastMessage: data.lastMessage,
              timestamp,
            }));
          }
        });

      //other chat sub
      gundb
        .get(myPubKey)
        .get("groups")
        .map()
        .on((data, key) => {
          console.log("fired");

          if (data) {
            const timestamp = GUN.state.is(data, "lastMessage");
            let title = data.title;
            let myalias = user.is?.alias;

            if (!data.isGroup) {
              //name split
              let first = title.split(":")[0];
              let second = title.split(":")[1];
              if (myalias === first) {
                title = second;
              } else if (myalias === second) {
                title = first;
              }
            }

            if (chats[key]) {
              setChats((prev) => {
                let obj = { ...prev };
                obj[key] = {
                  ...obj[key],
                  lastMessage: data.lastMessage,
                  title,
                  timestamp,
                };
                return obj;
              });
            } else {
              setChats((prev) => ({
                ...prev,
                [key]: {
                  chatRoomKey: data.chatRoomKey,
                  isGroup: data.isGroup,
                  lastMessage: data.lastMessage,
                  title,
                  timestamp,
                },
              }));
            }

            // let index = chats.findIndex((val) => val.chatRoomKey === key);
            // if (index === -1) {
            //   setChats((prev) => [
            //     ...prev,
            //     {
            //       chatRoomKey: data.chatRoomKey,
            //       isGroup: data.isGroup,
            //       lastMessage: data.lastMessage,
            //       title,
            //       timestamp,
            //     },
            //   ]);
            // } else {
            //   setChats((prev) => {
            //     let arr = [...prev];
            //     arr[index] = {
            //       ...arr[index],
            //       lastMessage: data.lastMessage,
            //       title,
            //       timestamp,
            //     };
            //     return arr;
            //   });
            // }
          }
        });
    }

    return () => {
      gundb.get("chats").off();
      if (myPubKey) gundb.get(myPubKey).get("groups").off();
    };
  }, []);

  return (
    <SafeAreaView
      style={tw(`h-full dark:${COLOR_PRIMARY_DARK} bg-orange-100`)}
      edges={["right", "bottom", "left"]}
    >
      <FlatList
        data={combinedChats}
        renderItem={({ item }) => (
          <RenderItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => "" + item.timestamp + Math.random() * 100}
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
