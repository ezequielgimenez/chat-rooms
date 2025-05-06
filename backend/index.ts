import express from "express";
import { db, rtdb } from "./db";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const port = process.env.PORT || 4000;
//

//
const app = express();
app.use(express.json());
app.use(cors());
///

const userCollection = db.collection("users");
const roomCollection = db.collection("rooms");

app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const nombre = req.body.nombre;
  try {
    const userRefDoc = await userCollection.where("email", "==", email).get();
    if (userRefDoc.empty) {
      const docUser = await userCollection.add({
        email,
        nombre,
      });
      res.status(201).json({
        success: true,
        id: docUser.id,
      });
    } else {
      res.json({
        success: false,
        message: "User already exist",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/auth", async (req, res) => {
  try {
    const email = req.body.email;
    const userRefDoc = await userCollection.where("email", "==", email).get();
    if (userRefDoc.empty) {
      res.status(401).json({
        success: false,
        message: "User no existe con ese email",
      });
    } else {
      res.status(200).json({
        success: true,
        id: userRefDoc.docs[0].id,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

/////////////////////////-------------Rooms

//generateToRoom()
app.post("/rooms", async (req, res) => {
  const userId = req.body.userId;
  try {
    if (userId) {
      const userDoc = await userCollection.doc(userId).get();
      if (userDoc.exists) {
        const chatRoomRef = rtdb.ref("/chatRooms/" + uuidv4());
        chatRoomRef.push({
          from: "",
          message: "",
        });
        const idCorto = 1000 + Math.floor(Math.random() * 999);
        const roomDoc = await roomCollection.doc(idCorto.toString());
        roomDoc.set({
          idSala: chatRoomRef.key,
        });
        res.json({
          success: true,
          id: roomDoc.id,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } else {
      res.json({
        success: false,
        message: "User no contained userId",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

//getToRoom()
app.get("/rooms/:idRoom", async (req, res) => {
  const { idRoom } = req.params;
  const { userId } = req.query;
  if (userId) {
    const docUser = await userCollection.doc(userId.toString()).get();
    if (docUser.exists) {
      const docRoomRef = await roomCollection.doc(idRoom).get();
      if (docRoomRef.exists) {
        const dataDoc = await docRoomRef.data();
        res.json({
          success: true,
          message: "Chat Encontrado",
          id: dataDoc.idSala,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Chat room not found",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } else {
    res.json({
      success: false,
      message: "No hay un userId, logueate o registrate",
    });
  }
});

app.use(express.static(path.resolve(__dirname, "../src/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../src/dist", "index.html"));
});

app.listen(port, () => {
  console.log("Escuchando app en el puerto:", port);
});
