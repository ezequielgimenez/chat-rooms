import * as admin from "firebase-admin";

// import * as serviceAccount from "./serviceAccount.json";
import * as dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS as any
  ),
  databaseURL: process.env.dataBaseRTDB,
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
