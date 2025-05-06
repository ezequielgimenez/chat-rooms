import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { signInAnonymously, getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECTID,
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
