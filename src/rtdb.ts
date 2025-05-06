import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { signInAnonymously, getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyAhAIGRfNvEY9dQS_xLAU4u-OaXOAnh9xE",
  authDomain: "prueba-apx.firebaseapp.com",
  databaseURL: "https://prueba-apx-default-rtdb.firebaseio.com",
  projectId: "prueba-apx",
});

const rtdb = getDatabase(app);
const auth = getAuth(app);
export { rtdb };

async function signInAnon() {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.log("error al logueo anonimo", error);
  }
}
signInAnon();
