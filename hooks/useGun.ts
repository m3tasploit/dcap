import "gun/lib/mobile";
import Gun from "gun/gun";
import SEA from "gun/sea";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GUN_SERVER_URL } from "../config/config";
const Store = require("gun/lib/ras.js");

const useGun = () => {
  const db = Gun({ store: Store({ AsyncStorage }), peers: [GUN_SERVER_URL] });
  //App namespace
  const user = db.user();
  return { db, user, SEA, Gun };
};

export default useGun;
