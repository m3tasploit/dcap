import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "../config/config";
import {
  attemptPeerConnection,
  beTheServer,
  createWifiP2pGroup,
  discoverWifiP2pPeers,
  searchPeers,
  stopSearchingPeers,
  WifiP2pDeviceType,
} from "../lib/peer";
import { style as tw } from "../lib/tw";
import { useAppDispatch, useAppSelector } from "../store/Store";
import WifiManager from "react-native-wifi-reborn";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const Connect = ({ navigation }: Props) => {
  const colorScheme = useAppSelector((state) => state.app.colorScheme);
  const peers: WifiP2pDeviceType[] = useAppSelector((state) => state.app.peers);

  const [message, setMessage] = useState("");
  const [showBtn, setShowBtn] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fn = async () => {
      const isWifiEnabled = await WifiManager.isEnabled();
      if (isWifiEnabled) {
        timer = setTimeout(async () => {
          await stopSearchingPeers();
          if (peers.length === 0) {
            setMessage(
              "No nearby DCAP networks found, please create one by pressing create group"
            );
            setShowBtn(true);
          }
        }, 60 * 1000);
        setMessage("Please wait, connecting to DCAP network...");
        //start searching peers
        await searchPeers(dispatch);
      } else {
        setMessage("Please enable Wi-Fi, otherwise app won't work");
      }
    };

    fn();

    return () => {
      //cleanup
      clearTimeout(timer);
      stopSearchingPeers();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (peers.length > 0) {
          let status;
          console.log(peers);

          for (let peer of peers) {
            status = await attemptPeerConnection(peer);
            if (status === "client") {
              break;
            }
          }
          if (status === "client") {
            //navigate to login
            navigation.replace("Login");
          } else if (status === "failed") {
          }
          // else if (status === "server") {
          // }
        }
      } catch (error) {
        console.log("error in peers change useffect", error);
      }
    })();

    return () => {};
  }, [peers]);

  const handleCreateGroupClick = async () => {
    //create group be a server
    const bool = await createWifiP2pGroup();
    if (bool) {
      await beTheServer();
      navigation.replace("Login");
    }
  };

  return (
    <SafeAreaView
      style={tw(`h-full dark:${COLOR_SECONDARY_DARK} bg-white px-2`)}
    >
      <View style={tw(`h-full w-full flex flex-col justify-between`)}>
        <Text
          style={tw("text-center font-app text-lg dark:text-white text-black")}
        >
          Connect
        </Text>
        <Text
          style={tw(
            "text-center dark:text-white text-black font-app text-sm px-4"
          )}
        >
          {message}
        </Text>
        <TouchableOpacity
          onPress={handleCreateGroupClick}
          style={tw(
            "mx-auto shadow rounded-md w-4/5 h-14  mt-8 mb-5 flex justify-center",
            `dark:${COLOR_PRIMARY_DARK} ${COLOR_PRIMARY}`,
            { opacity: showBtn ? 1 : 0 }
          )}
          disabled={!showBtn}
        >
          <Text style={tw("text-center text-white font-app text-base")}>
            create group
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Connect;
