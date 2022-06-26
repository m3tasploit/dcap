// import { useEffect, useRef } from "react";
// import { PermissionsAndroid } from "react-native";
// import {
//   connect,
//   createGroup,
//   discoverService,
//   getGroupInfo,
//   initialize,
//   removeGroup,
//   startDiscoveringPeers,
//   startServiceRegistration,
//   subscribeOnDnsTxtRecordAvailable,
//   subscribeOnPeersUpdates,
//   unsubscribeFromDnsTxtRecordAvailable,
// } from "react-native-wifi-p2p-reborn";
// import {
//   SET_ADD_PEERS,
//   SET_CONNECT_SCREEN_MESSAGE,
//   SET_IS_FOUND_PEERS,
//   SET_IS_INITIALISED,
//   SET_IS_LOCATION_GRANTED,
//   SET_IS_SEARCH_PEERS_DONE,
//   SET_IS_SERVER,
//   SET_PEERS,
// } from "../store/appReducer";
// import { useAppDispatch, useAppSelector } from "../store/Store";
// import "gun/lib/mobile.js"; // most important!
// import Gun from "gun/gun";
// import SEA from "gun/sea";
// import "gun/lib/radix.js";
// import "gun/lib/radisk.js";
// import "gun/lib/store.js";
// const asyncStore = require("gun/lib/ras.js");
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { GUN_SERVER_URL } from "../config/config";
// import { IGunInstance, IGunUserInstance } from "gun";
// import nodejs from "nodejs-mobile-react-native";
// import WifiManager from "react-native-wifi-reborn";

// const usePeer = () => {
//   const isInitialised = useAppSelector((state) => state.app?.isInitialised);
//   const isFoundPeers = useAppSelector((state) => state.app?.isFoundPeers);
//   const peers: WifiP2pDeviceType[] = useAppSelector(
//     (state) => state.app?.peers
//   );
//   const isSearchPeersDone = useAppSelector(
//     (state) => state.app?.isSearchPeersDone
//   );

//   const gundb = useRef<IGunInstanceNew>();
//   const user = useRef<IGunUserInstance>();
//   const searchPeersTimer = useRef<any>();

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     (async () => {
//       if (!isInitialised) {
//         console.log("initialising");
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: "Location permission is required for WiFi connections",
//             message:
//               "This app needs location permission as this is required  " +
//               "to scan for wifi networks.",
//             buttonNegative: "DENY",
//             buttonPositive: "ALLOW",
//           }
//         );
//         dispatch({ type: SET_IS_LOCATION_GRANTED, payload: granted });
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("location granted");

//           try {
//             await initialize();
//           } catch (error) {
//             console.log("error on initializing", error);
//           }

//           // try {
//           //   const val = await startServiceRegistration({
//           //     servicename: "dcap",
//           //     // passphrase: groupInfo.passphrase,
//           //     // networkName: groupInfo.networkName,
//           //   });
//           //   console.log("serviceregstatus", val);

//           //   subscribeOnDnsTxtRecordAvailable((params: any) => {
//           //     console.log("dnstxtrecordavailable", params);
//           //     if (params.record.servicename === "dcap") {
//           //       if (!isFoundPeers)
//           //         dispatch({ type: SET_IS_FOUND_PEERS, payload: true });
//           //       dispatch({
//           //         type: SET_ADD_PEERS,
//           //         payload: {
//           //           device: params.device,
//           //           passphrase: params.record.passphrase,
//           //           networkName: params.record.networkName,
//           //         },
//           //       });
//           //     }
//           //   });

//           //   // searchPeersTimer.current = setTimeout(() => {
//           //   //   // unsubscribeFromDnsTxtRecordAvailable(() => {});
//           //   //   if (!isFoundPeers) {
//           //   //     dispatch({ type: SET_IS_FOUND_PEERS, payload: false });
//           //   //     dispatch({ type: SET_IS_SEARCH_PEERS_DONE, payload: true });
//           //   //     //start a server
//           //   //   }
//           //   // }, 1000 * 60);
//           // } catch (error) {
//           //   console.log("error on discover service", error);
//           // }
//         }
//         dispatch({ type: SET_IS_INITIALISED, payload: true });
//       }
//     })();

//     //cleanup
//     return () => {
//       // unsubscribeFromDnsTxtRecordAvailable(() => {});
//       // clearTimeout(searchPeersTimer.current);
//       removeGroup()
//         .then(() => {})
//         .catch(() => {});
//     };
//   }, []);

//   //effect for connecting to each client
//   useEffect(() => {
//     // const fn = async () => {
//     //   if (isSearchPeersDone && isFoundPeers) {
//     //     for (const peer of peers) {
//     //       //attempt connect to wifi group
//     //       try {
//     //         await WifiManager.connectToProtectedSSID(
//     //           peer.networkName,
//     //           peer.passphrase,
//     //           false
//     //         );
//     //         const status = "connected"; // relay, server
//     //         if (status === "connected") {
//     //           //successfully connected, engage gun
//     //           gundb.current = Gun({
//     //             store: Store({ AsyncStorage }),
//     //             peers: [GUN_SERVER_URL],
//     //           });
//     //           user.current = gundb.current.user();
//     //         } else if (status === "server") {
//     //           // be a server
//     //         } else if (status === "relay") {
//     //           //be a relay peer
//     //         }
//     //       } catch (error) {
//     //         console.log("error while connecting to client", error);
//     //       }
//     //     }
//     //   }
//     // };
//     // fn();
//   }, [isSearchPeersDone, peers]);

//   const searchPeers = async () => {
//     await startDiscoveringPeers();
//     subscribeOnPeersUpdates(
//       ({ devices }: { devices: WifiP2pDeviceType[] | undefined }) => {
//         if (devices) {
//           const arr = devices.map((device) => ({
//             deviceAddress: device.deviceAddress,
//             deviceName: device.deviceName,
//           }));
//           dispatch({ type: SET_PEERS, payload: arr });
//         }
//       }
//     );
//   };

//   const connectToPeer = async (device: WifiP2pDeviceType) => {
//     try {
//       await connect(device.deviceAddress);
//       return true;
//     } catch (error) {
//       console.log("failed to connect to", device.deviceAddress);
//       return false;
//     }
//   };

//   const createServer = async () => {
//     try {
//       // //create p2p group
//       if (await getGroupInfo()) await removeGroup();
//       await createGroup();
//       // let groupInfo: { passphrase: string; networkName: string };
//       // do {
//       //   await sleep(3000);
//       //   groupInfo = await getGroupInfo();
//       // } while (!groupInfo);
//       // console.log(groupInfo, "group info");
//       //successfully created wifip2p group
//       //broadcast group info

//       // await startDiscoveringPeers();

//       // discoverService();

//       //fire up the node server
//       nodejs.start("main.js");
//       nodejs.channel.addListener("message", (msg) => {
//         console.log("From node: " + msg);
//       });
//       dispatch({
//         type: SET_CONNECT_SCREEN_MESSAGE,
//         payload: "Group created successfully",
//       });
//       dispatch({
//         type: SET_IS_SERVER,
//         payload: true,
//       });
//     } catch (error) {
//       console.log(error, "error in creategroup");
//       dispatch({
//         type: SET_CONNECT_SCREEN_MESSAGE,
//         payload: "Group creation failed",
//       });
//       dispatch({
//         type: SET_IS_SERVER,
//         payload: false,
//       });
//     }
//   };

//   return {
//     gundb: gundb.current,
//     user: user.current,
//     SEA,
//     Gun,
//     createServer,
//     searchPeers,
//     connectToPeer,
//   };
// };

// export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// export default usePeer;
