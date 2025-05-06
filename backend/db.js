"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore"); //el /firestore es de la firestore
const database_1 = require("firebase-admin/database"); // el /database es de la Real Time
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_ACCOUNT);
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
});
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const rtdb = (0, database_1.getDatabase)(app);
exports.rtdb = rtdb;
