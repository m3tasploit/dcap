import "react-native-get-random-values";
import WebviewCrypto from "react-native-webview-crypto";
import * as React from "react";
import { useEffect, useState } from "react";
import { PermissionsAndroid, ScrollView, TouchableOpacity } from "react-native";
import { Button, StyleSheet, Text, useColorScheme, View } from "react-native";
import {
  initialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  subscribeOnPeersUpdates,
  unsubscribeFromPeersUpdates,
  connect,
  removeGroup,
  getAvailablePeers,
  getGroupInfo,
  getConnectionInfo,
  discoverService,
  startServiceRegistration,
} from "react-native-wifi-p2p-reborn";

import { Colors } from "react-native/Libraries/NewAppScreen";
import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";
import useGun from "./hooks/useGun";
import WifiManager from "react-native-wifi-reborn";

function login(username: string, password: string) {
  user.auth(username, password, ({ err }: { err: any }) => console.log(err));
}

function signup(username: string, password: string) {
  user.create(username, password, ({ err }: { err: any }) => {
    if (err) {
      console.log(err);
    } else {
      login(username, password);
    }
  });
}

const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [wifiGranted, setWifiGranted] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [peers, setPeers] = useState({ devices: [] });
  const [connectionStatus, setConnectionStatus] = useState("");
  const [connectionInfo, setConnectionInfo] = useState("");
  const [location, setLocation] = useState(null);
  const [chatMessage, setChatMessage] = useState("no chats");
  const { db, SEA, user } = useGun();

  const init = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location permission is required for WiFi connections",
        message:
          "This app needs location permission as this is required  " +
          "to scan for wifi networks.",
        buttonNegative: "DENY",
        buttonPositive: "ALLOW",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // You can now use react-native-wifi-reborn
      setWifiGranted(true);

      try {
        await initialize();
      } catch (error) {
        console.log("error on initializing", error);
      }

      // try {
      //   await startDiscoveringPeers();
      // } catch (error) {
      //   console.log("error on startdiscover", error);
      // }

      try {
        await startServiceRegistration({ servicename: "dcap" });
      } catch (error) {
        console.log("error on startServiceRegistration", error);
      }

      discoverService((prop) => {
        console.log("device", prop);
      });

      // subscribeOnPeersUpdates(({ devices }) => {
      //   console.log(`New devices available: ${devices}`);
      //   setPeers({ devices });
      // });
    }
  };

  useEffect(() => {
    init();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission to access location was denied");
        return;
      }
    })();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const enabled = await WifiManager.isEnabled();
      setWifiEnabled(enabled);
    });
    return function () {
      unsubscribe();
      stopDiscoveringPeers();
      unsubscribeFromPeersUpdates();
    };
  }, []);

  const listPeers = async () => {
    try {
      // await startDiscoveringPeers();
      // const peers = await getAvailablePeers();
      discoverService((prop) => {
        console.log("device", prop);
      });
      // setPeers(peers);
    } catch (error) {
      console.error("listpeers failed", error);
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const PeerItem: React.FC<{
    peer: { deviceName: string };
    onPress: (peer: any) => void;
  }> = ({ peer, onPress }) => {
    return (
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text>{JSON.stringify(peer)}</Text>
      </TouchableOpacity>
    );
  };

  const handleConnectPress = (device: {
    deviceAddress: string;
    deviceName: string;
  }) => {
    setConnectionStatus(`connecting to ${device.deviceAddress}`);
    connect(device.deviceAddress)
      .then(() => {
        setConnectionStatus(`Connected to ${device.deviceName}`);
      })
      .catch((err: any) => {
        console.log(err);
        setConnectionStatus(`Failed connecting to ${device.deviceName}`);
      });
  };

  const disconnectPeers = () => {
    getGroupInfo()
      .then(() => removeGroup())
      .then(() => {
        console.log("Succesfully disconnected!");
        setConnectionStatus("Disconnected");
        setPeers({ devices: [] });
      })
      .catch((err: any) =>
        console.error("Something gone wrong. Details: ", err)
      );
  };

  const showConnectionInfo = () => {
    getConnectionInfo()
      .then((info) => setConnectionInfo(JSON.stringify(info)))
      .catch((err) => console.error(err));
  };

  return (
    <ScrollView style={backgroundStyle}>
      <WebviewCrypto />
      {!wifiEnabled ? (
        <Text>Please enable wifi</Text>
      ) : (
        <View>
          <Button title="List peers" onPress={listPeers} />
          <Button
            title="Disconnect"
            onPress={() => {
              disconnectPeers();
            }}
          />
          <Button
            title="Connection info"
            onPress={() => {
              showConnectionInfo();
            }}
          />
          <View style={{ marginTop: 20 }}>
            {peers.devices.map((peer, index) => (
              <PeerItem
                peer={peer}
                key={index}
                onPress={() => {
                  handleConnectPress(peer);
                }}
              />
            ))}
          </View>
          <Text>{connectionStatus}</Text>
          <Text>{connectionInfo}</Text>
          <Text>{location}</Text>
          <Button
            title="Create gun 1"
            onPress={() => signup("junu", "12345678")}
          />
          <Button
            title="Create gun 2"
            onPress={() => signup("munu", "12345678")}
          />
          <Button
            title="Login gun 1"
            onPress={() => login("junu", "12345678")}
          />
          <Button
            title="Login gun 2"
            onPress={() => login("munu", "12345678")}
          />
          <Button
            title="Load db"
            onPress={() => {
              db.get("chat")
                .map()
                .on(async (data) => {
                  const key = "#foo";
                  const message = await SEA.decrypt(data.what, key);
                  if (message) setChatMessage(message);
                });
            }}
          />
          <Button
            title="Send message"
            onPress={async () => {
              const secret = await SEA.encrypt("Hello", "#foo");
              const message = user.get("all").set({ what: secret });
              db.get("chat").put(message);
            }}
          />
          <Text>{chatMessage}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "blue",
    height: 50,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
