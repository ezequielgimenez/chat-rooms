import express from "express";
import mongoose from "mongoose";
import { db, rtdb } from "./db";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { routes } from "./routes/route";

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
const url = process.env.URL_MONGO;
console.log("url", URL);

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

mongoose
  .connect(url)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error));

////

app.use(routes);

app.use(express.static(path.resolve(__dirname, "../src/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../src/dist", "index.html"));
});

app.listen(port, () => {
  console.log("Escuchando app en el puerto:", port);
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
