import { Image, Pressable, TextInput, View } from "react-native";
import { style as tw } from "../lib/tw";
import React from "react";
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK } from "../config/config";

const MessageInput = ({
  onSendClick,
  onChangeMessage,
  message,
}: {
  onSendClick: () => void;
  onChangeMessage: (text: string) => void;
  message: string;
}) => {
  return (
    <View
      style={tw("w-full px-1 flex-row w-full justify-between items-end pb-1")}
    >
      <TextInput
        style={tw(
          `dark:${COLOR_PRIMARY_DARK} bg-white w-4/5 font-app shadow grow rounded-3xl px-4 dark:text-white text-black py-2`,
          {
            borderWidth: 0.5,
            borderColor: "transparent",
            minHeight: 48,
            maxHeight: 120,
          }
        )}
        placeholder="Message"
        placeholderTextColor={tw("dark:text-white text-black").color + ""}
        onChangeText={onChangeMessage}
        value={message}
        multiline={true}
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
          onPress={onSendClick}
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

export default MessageInput;
