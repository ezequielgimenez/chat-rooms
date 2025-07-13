import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"; //el /firestore es de la firestore
import { getDatabase } from "firebase-admin/database"; // el /database es de la Real Time

import dotenv from "dotenv";
dotenv.config();



const serviceAccount = JSON.parse(process.env.FIREBASE_ACCOUNT);

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb };
