import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../setting/firebase_setting.js";

export const setFortune = async (nickname, fortune) => {
  const updateUser = doc(db, `user/${nickname}`);
  await updateDoc(updateUser, { fortune: fortune });
};
