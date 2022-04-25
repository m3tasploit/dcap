import "gun/lib/mobile";
import Gun from "gun/gun";
import SEA from "gun/sea";
import Store from "gun/lib/ras.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGun = () => {
  const db = Gun({ store: Store({ AsyncStorage }) });
  //App namespace
  const user = db.user();
  return { db, user, SEA };
};

export default useGun;
