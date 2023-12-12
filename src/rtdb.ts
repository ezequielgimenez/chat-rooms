import firebase from "firebase";

import * as dotenv from "dotenv";
dotenv.config();

const app = firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.databaseURL,
  databaseURL: process.env.dataBaseRTDB,
  projectId: process.env.projectId,
});

const rtdb = firebase.database();

export { rtdb };
