"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const dotenv = require("dotenv");
dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.dataBaseRTDB,
});
const firestore = admin.firestore();
exports.firestore = firestore;
const rtdb = admin.database();
exports.rtdb = rtdb;
