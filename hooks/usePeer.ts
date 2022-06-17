import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import {
  discoverService,
  initialize,
  subscribeOnDnsTxtRecordAvailable,
  unsubscribeFromDnsTxtRecordAvailable,
} from "react-native-wifi-p2p-reborn";
import {
  SET_ADD_PEERS,
  SET_IS_FOUND_PEERS,
  SET_IS_INITIALISED,
  SET_IS_LOCATION_GRANTED,
  SET_IS_SEARCH_PEERS_DONE,
} from "../store/appReducer";
import { useAppDispatch, useAppSelector } from "../store/Store";

const usePeer = () => {
  const isInitialised = useAppSelector((state) => state.app?.isInitialised);
  const isFoundPeers = useAppSelector((state) => state.app?.isFoundPeers);
  const peers: [] = useAppSelector((state) => state.app?.peers);
  const isSearchPeersDone = useAppSelector(
    (state) => state.app?.isSearchPeersDone
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    (async () => {
      if (!isInitialised) {
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
        dispatch({ type: SET_IS_LOCATION_GRANTED, payload: granted });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          try {
            await initialize();
          } catch (error) {
            console.log("error on initializing", error);
          }

          try {
            discoverService();
            subscribeOnDnsTxtRecordAvailable((params: any) => {
              console.log("dnstxtrecordavailable", params);
              if (params.record.servicename === "dcap" && !isFoundPeers) {
                dispatch({ type: SET_IS_FOUND_PEERS, payload: true });
                dispatch({ type: SET_ADD_PEERS, payload: params.device });
              }
            });
            timer = setTimeout(() => {
              unsubscribeFromDnsTxtRecordAvailable(() => {});
              if (!isFoundPeers) {
                dispatch({ type: SET_IS_FOUND_PEERS, payload: false });
                dispatch({ type: SET_IS_SEARCH_PEERS_DONE, payload: true });
                //start a server
              }
            }, 1000 * 60);
          } catch (error) {
            console.log("error on discover service", error);
          }
        }
        dispatch({ type: SET_IS_INITIALISED, payload: true });
      }
    })();

    //cleanup
    return () => {
      unsubscribeFromDnsTxtRecordAvailable(() => {});
      clearTimeout(timer);
    };
  }, []);

  //effect for connecting to each client
  useEffect(() => {
    if (isSearchPeersDone) {
      peers.forEach((peer) => {
        //attempt connect
        const status = "connected"; // relay, server

        if (status === "connected") {
          //successfully connected, engage gun
        } else if (status === "server") {
          // be a server
        } else if (status === "relay") {
          //be a relay peer
        }
      });
    }
  }, [isSearchPeersDone, peers]);

  return {};
};

export default usePeer;
