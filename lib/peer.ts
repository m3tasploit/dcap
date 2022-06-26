import {
  cancelConnect,
  connect,
  createGroup,
  getGroupInfo,
  initialize,
  removeGroup,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  subscribeOnPeersUpdates,
  unsubscribeFromPeersUpdates,
} from "react-native-wifi-p2p-reborn";
import { AppDispatch } from "../store/Store";
import nodejs from "nodejs-mobile-react-native";
import { setPeers } from "../store/appReducer";
import { fireGun } from "./gun";
import { PermissionsAndroid } from "react-native";

export interface WifiP2pDeviceType {
  deviceAddress: string;
  deviceName: string;
  isGroupOwner: boolean;
}

export const requestPerms = async () => {
  const grantedLocation = await PermissionsAndroid.request(
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
  const grantedStorageResults = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ]);

  if (
    grantedLocation === "granted" &&
    grantedStorageResults["android.permission.READ_EXTERNAL_STORAGE"] ===
      "granted" &&
    grantedStorageResults["android.permission.WRITE_EXTERNAL_STORAGE"] ===
      "granted"
  ) {
    return true;
  } else return false;
};

export const initializeWifiP2p = async () => {
  try {
    await initialize();
    await requestPerms();
  } catch (error) {
    console.log("error in initializeWifiP2pand requestPerms", error);
  }
};

initializeWifiP2p();

export const connectToWifiP2pPeer = async (device: WifiP2pDeviceType) => {
  return connect(device.deviceAddress);
};

export const attemptPeerConnection = async (device: WifiP2pDeviceType) => {
  //respons from server tells the client what to be
  let toBeStatus: "client" | "failed" | "server";
  try {
    //connect to wifi p2p
    await connectToWifiP2pPeer(device);
    fireGun();
    //check eligibilty
    toBeStatus = "client";

    return toBeStatus;
  } catch (error) {
    console.log("failed to attemptPeerConnection", error);
    toBeStatus = "failed";
    return toBeStatus;
  }
};

export const beTheServer = async () => {
  startNodeServer();
  await sleep(2000);
  fireGun();
};
export const searchPeers = async (dispatch: AppDispatch) => {
  try {
    await startDiscoveringPeers();
    subscribeOnPeersUpdates(
      ({ devices }: { devices: WifiP2pDeviceType[] | undefined }) => {
        if (devices) {
          const arr: WifiP2pDeviceType[] = devices
            .map((device) => ({
              deviceAddress: device.deviceAddress,
              deviceName: device.deviceName,
              isGroupOwner: device.isGroupOwner,
            }))
            .filter((device) => device.isGroupOwner);
          dispatch(setPeers(arr));
        }
      }
    );
  } catch (error) {
    console.log("failed to search peers", error);
  }
};

export const stopSearchingPeers = async () => {
  try {
    await stopDiscoveringPeers();
    unsubscribeFromPeersUpdates(() => {});
  } catch (error) {
    console.log("failed to stopSearchingPeers", error);
  }
};

export const createWifiP2pGroup = async () => {
  // //create p2p group
  try {
    await stopDiscoveringPeers();
    unsubscribeFromPeersUpdates(() => {});
    if (await getGroupInfo()) await removeGroup();
    await createGroup();
    setTimeout(async () => {
      console.log(await getGroupInfo());
    }, 3000);
    return true;
    //save group info in state
  } catch (error) {
    console.log("failed to createWifiP2pGroup", error);
    return false;
  }
};

export const removeWifiP2pGroup = async () => {
  // //create p2p group
  try {
    if (await getGroupInfo()) await removeGroup();
    return true;
    //save group info in state
  } catch (error) {
    console.log("failed to removeWifiP2pGroup", error);
    return false;
  }
};

export const startNodeServer = () => {
  try {
    nodejs.start("main.js");
    nodejs.channel.addListener("message", (msg) => {
      console.log("From node: " + msg);
    });
  } catch (error) {
    console.log("failed to startNodesrver", error);
  }
};

export const discoverWifiP2pPeers = async () => {
  try {
    await startDiscoveringPeers();
  } catch (error) {
    console.log("error in discoverWifiP2pPeers");
  }
};

export const disconnectFromWifiP2pPeer = async () => {
  try {
    await cancelConnect();
  } catch (error) {
    console.log("failed to disconnectFromWifiP2pPeer", error);
  }
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
