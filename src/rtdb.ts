import firebase from "firebase";

import * as dotenv from "dotenv";
dotenv.config();

const app = firebase.initializeApp({
  apiKey: "wZouInOmqLlRyBfT8LVnyYKFofd3899VmfixmqtZ",
  authDomain: "prueba-apx.firebaseapp.com",
  databaseURL: process.env.dataBaseRTDB,
  projectId: "prueba-apx",
});

const rtdb = firebase.database();

export { rtdb };
