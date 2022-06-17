import "react-native-get-random-values";
import PolyfillCrypto from "react-native-webview-crypto";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import { useStore } from "./store/Store";
import Navbar from "./components/Navbar";
import { style as tw, tw as twrn } from "./lib/tw";
import { StatusBar } from "expo-status-bar";
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK } from "./config/config";
import { useDeviceContext } from "twrnc";
import { useColorScheme } from "react-native";
import { SET_COLOR_SCHEME } from "./store/appReducer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import nodejs from "nodejs-mobile-react-native";

const App = () => {
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

  const colorScheme = useColorScheme();
  const [, dispatch] = useStore();
  React.useEffect(() => {
    dispatch({ type: SET_COLOR_SCHEME, payload: colorScheme });
    nodejs.start("main.js");
    nodejs.channel.addListener("message", (msg) => {
      // alert("From node: " + msg);
    });
  }, [colorScheme]);
  useDeviceContext(twrn);
  const Stack = createNativeStackNavigator();
  const statusBarColor: any =
    colorScheme === "dark"
      ? tw(COLOR_PRIMARY_DARK).backgroundColor
      : tw(COLOR_PRIMARY).backgroundColor;
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <PolyfillCrypto /> */}
        <StatusBar backgroundColor={statusBarColor} style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ header: Navbar, animation: "slide_from_right" }}
        >
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
