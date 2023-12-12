"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = void 0;
const firebase_1 = require("firebase");
const dotenv = require("dotenv");
dotenv.config();
const app = firebase_1.default.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.databaseURL,
    databaseURL: process.env.dataBaseRTDB,
    projectId: process.env.projectId,
});
const rtdb = firebase_1.default.database();
exports.rtdb = rtdb;
