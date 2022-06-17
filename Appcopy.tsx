import "react-native-get-random-values";
import WebviewCrypto from "react-native-webview-crypto";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button, StyleSheet, Text, useColorScheme, View } from "react-native";
import {
  initialize,
  connect,
  removeGroup,
  getGroupInfo,
  getConnectionInfo,
  discoverService,
  startServiceRegistration,
  subscribeOnDnsTxtRecordAvailable,
  unsubscribeFromDnsTxtRecordAvailable,
  getPeerList,
} from "react-native-wifi-p2p-reborn";

import { Colors } from "react-native/Libraries/NewAppScreen";
import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";
import useGun from "./hooks/useGun";
import WifiManager from "react-native-wifi-reborn";

const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [wifiGranted, setWifiGranted] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [peers, setPeers] = useState({ devices: [] });
  const [connectionStatus, setConnectionStatus] = useState("");
  const [connectionInfo, setConnectionInfo] = useState("");
  const [location, setLocation] = useState(null);
  const [chatMessage, setChatMessage] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const { db, SEA, user, Gun: GUN } = useGun();

  function login(username: string, password: string) {
    user.auth(username, password, (err) => console.log(err));
  }

  function signup(username: string, password: string) {
    user.create(username, password, (err) => {
      if (err) {
        console.log(err);
      } else {
        login(username, password);
      }
    });
  }

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

      try {
        const val = await startServiceRegistration({ servicename: "dcap" });
        console.log("serviceregstatus", val);
        discoverService();
        subscribeOnDnsTxtRecordAvailable((params) => {
          console.log("dnstxtrecordavailable", params);
          if (params.record.servicename === "dcap") {
            setPeers({ devices: [...peers.devices, params.device] });
          }
        });
      } catch (error) {
        console.log("error on startServiceRegistration", error);
      }

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
      unsubscribeFromDnsTxtRecordAvailable(() => {
        console.log("unsubscribeFromDnsTxtRecordAvailable");
      });
    };
  }, []);

  const listPeers = async () => {
    try {
      // await startDiscoveringPeers();
      // const peers = await getAvailablePeers();
      // await startServiceRegistration({ servicename: "dcap" });
      // discoverService();
      // setPeers(peers);
    } catch (error) {
      console.error("listpeers failed", error);
    }
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
        getPeerList()
          .then((params) => {
            const peer = params[0];
            if (!peer.isGroupOwner) {
              db.opt({ peers: ["192.168.49.1"] });
            }
            console.log("peerlist", params);
          })
          .catch((err) => console.log("getpeerlist", err));
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
    <ScrollView>
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
              let match = {
                // lexical queries are kind of like a limited RegEx or Glob.
                ".": {
                  // property selector
                  ">": new Date(
                    +new Date() - 1 * 1000 * 60 * 60 * 3
                  ).toISOString(), // find any indexed property larger ~3 hours ago
                },
                "-": 1, // filter in reverse
              };
              db.get("chat")
                .map(match)
                .on(async (data) => {
                  const key = "#foo";
                  const message = {
                    // transform the data
                    who: await db.user(data).get("alias"), // a user might lie who they are! So let the user system detect whose data it is.
                    what: (await SEA.decrypt(data.what, key)) + "", // force decrypt as text.
                    when: GUN.state.is(data, "what"), // get the internal timestamp for the what property.
                  };
                  if (message.what)
                    setChatMessage((prev) => [...prev, message]);
                });
            }}
          />

          <TextInput
            placeholder="enter message"
            style={{ height: 50, padding: 10 }}
            onChangeText={(text) => {
              setMessageInput(text);
            }}
          />

          <Button
            title="Send message"
            onPress={async () => {
              const secret = await SEA.encrypt(messageInput, "#foo");
              const message = user.get("all").set({ what: secret });
              const index = new Date().toISOString();
              db.get("chat").get(index).put(message);
              console.log("message send", messageInput, message, secret);
            }}
          />

          <Text>{connectionStatus}</Text>
          <Text>{connectionInfo}</Text>
          <Text>{location}</Text>

          {chatMessage.map((chat) => (
            <Text>{chat.what}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
