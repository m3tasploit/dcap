import "gun/lib/mobile.js"; // most important!
import Gun from "gun/gun";
import sea from "gun/sea";
import "gun/lib/radix.js";
import "gun/lib/radisk.js";
import "gun/lib/store.js";
const asyncStore = require("gun/lib/ras.js");
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GUN_SERVER_URL } from "../config/config";
import { GunUser, IGunInstance, IGunUserInstance, ISEAPair } from "gun";
import { WifiP2pDeviceType } from "./peer";
import { AppDispatch } from "../store/Store";

export interface PeerType {
  device: WifiP2pDeviceType;
  passphrase: string;
  networkName: string;
}

export interface IGunInstanceNew extends IGunInstance {
  user(): IGunUserInstance;
  user(pub: string): IGunUserInstance;
}

export type UserCreateResponse = { ok: 0; pub: string } | { err: string };
export type UserAuthResponse =
  | {
      ack: 2;
      /** ~publicKeyOfUser */
      soul: string;
      /** ~publicKeyOfUser */
      get: string;
      put: GunUser;
      sea: ISEAPair;
    }
  | { err: string };

export const gundb: IGunInstanceNew = Gun({
  store: asyncStore({ AsyncStorage }),
});
export let user = gundb.user();
export const SEA = sea;
export const GUN = Gun;

export const fireGun = () => {
  try {
    gundb.opt({ peers: [GUN_SERVER_URL] });
    user = gundb.user();
  } catch (error) {
    console.log("error while init gun", error);
  }
};

export const login = (
  username: string,
  password: string,
  cb: () => void,
  ecb: (err: { error: boolean; message: string }) => void = () => {},
  attempt = 0
) => {
  user.auth(username, password, (ack) => {
    if ("err" in ack) {
      if (attempt === 0) {
        login(username, password, cb, ecb, 1);
      } else {
        ecb({ error: true, message: ack.err });
      }
    } else {
      cb();
    }
  });
};

export const signup = (
  username: string,
  password: string,
  cb: () => void,
  ecb: (err: { error: boolean; message: string }) => void
) => {
  user.create(username, password, (ack) => {
    if ("err" in ack) {
      ecb({ error: true, message: ack.err });
    } else {
      login(username, password, cb);
    }
  });
};
