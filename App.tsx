import "react-native-get-random-values";
import PolyfillCrypto from "react-native-webview-crypto";
import * as React from "react";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chats from "./components/Chats";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_100Thin,
  useFonts,
} from "@expo-google-fonts/poppins";
import { useAppDispatch } from "./store/Store";
import Navbar from "./components/Navbar";
import { style as tw, tw as twrn } from "./lib/tw";
import { StatusBar } from "expo-status-bar";
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY_DARK,
} from "./config/config";
import { useAppColorScheme, useDeviceContext } from "twrnc";
import { Alert, BackHandler, useColorScheme } from "react-native";
import { setColorScheme, SET_COLOR_SCHEME } from "./store/appReducer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Connect from "./components/Connect";
import {
  disconnectFromWifiP2pPeer,
  removeWifiP2pGroup,
  stopSearchingPeers,
} from "./lib/peer";
import { stopApp } from "react-native-stop-app";

export type RootStackParamList = {
  Connect: undefined;
  Chats: undefined;
  Profile: undefined;
  Settings: undefined;
  Login: undefined;
};
const App = () => {
  useDeviceContext(twrn, { withDeviceColorScheme: true });
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_100Thin,
  });

  // if (!fontsLoaded) {
  //   return null;
  // }
  const colorScheme = useColorScheme() + "";
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const myFunc = async () => {
      dispatch(setColorScheme(colorScheme));
    };
    myFunc();
  }, [colorScheme]);

  React.useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "YES",
          onPress: async () => {
            try {
              await stopSearchingPeers();
              await removeWifiP2pGroup();
              await disconnectFromWifiP2pPeer();
              stopApp();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const Stack = createNativeStackNavigator();
  const statusBarColor: any =
    colorScheme === "dark"
      ? tw(COLOR_SECONDARY_DARK).backgroundColor
      : tw(COLOR_PRIMARY).backgroundColor;
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <PolyfillCrypto />
        <StatusBar backgroundColor={statusBarColor} style="light" />
        <Stack.Navigator
          initialRouteName="Connect"
          screenOptions={{ header: Navbar, animation: "slide_from_right" }}
        >
          <Stack.Screen name="Connect" component={Connect} />
          <Stack.Screen name="Chats" component={Chats} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
