import * as express from "express";

import * as cors from "cors";

import { rtdb, firestore } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

//vars env
dotenv.config();
const port = process.env.PORT || 4000;
//

//Inicializar app de express
const app = express();
app.use(express.json());

///inicializar CORS
app.use(cors());
///

app.get("/", (req, res) => {
  res.send("¡Hola, Render!");
});

const userCollection = firestore.collection("/users");
const roomCollection = firestore.collection("/rooms");

//En este endpoint para registrar personas, nos mandan un email y nombre y le devolvemos el id generado
//
//signun()
app.post("/signup", function (req, res) {
  const email = req.body.email;
  const nombre = req.body.nombre;
  userCollection
    .where("email", "==", email)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        userCollection
          .add({
            email,
            nombre,
          })
          .then((newUserReferencia) => {
            res.json({
              id: newUserReferencia.id,
              new: true,
            });
          });
      } else {
        res.json({
          message: "Ya se encuentra registrado",
        });
        console.log("Ya se encuentra registrado");
      }
    });
});

//En este endpoint en base a un email registrado nos devuelve el userId de ese user para que nosotros mismos en el state
//podamos tener ese dato y guardarloen el currentState.userId
//signin()
app.post("/signin", (req, res) => {
  const email = req.body.email;
  userCollection
    .where("email", "==", email)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: searchRes.docs[0].id,
        });
      }
    });
});

/////////////////////////-------------Rooms

//generateToRoom()
app.post("/rooms", (req, res) => {
  //Nos pide el userId que en teoria esta registrado en la base de datos, y lo buscamos en la collection "users"
  //si existe creo una ref rooms en la real time para establecerle el id del user owner y un array Messages[]
  const userId = req.body.userId;
  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + uuidv4());
        roomRef
          .push({
            messages: [],
            owner: userId,
          })
          .then(() => {
            //creamos una colectionRooms en firestore y le seteamos un id corto y uno largo
            // Y con el id corto creamos un nuevo doc de la (collection rooms de firestore) para que las personas se pasen ese id
            //y con el id largo que nos genero el uuidv4() lo usamos para comunicarnos con la sala roomRef(idlargo)
            const idRoomLong = roomRef.key; ///uuidv4()
            const idRoom = 1000 + Math.floor(Math.random() * 999);
            roomCollection
              .doc(idRoom.toString())
              .set({
                rtdbID: idRoomLong,
              })
              //Y simplemente vamos a responder con el id corto, (id del documento de la rtdb)
              // le ponemos como propiedad "id" luego en el state al momento de responder le decimos que currentState.idRoom = id
              .then(() => {
                res.json({
                  id: idRoom,
                });
              });
          });
      }
    });
});

//getToRoom()
app.get("/rooms/:idRoom", (req, res) => {
  const userId = req.query.userId;
  const idRoom = req.params.idRoom;
  //como query es el userID,  la parte de la url que esta despues del "?=" se recibe dentro de express como un objeto "query"
  //const query = new URLSearchParams();
  //query.append('userID', '21312381273sdajdsajbvP');

  //y params como : const idRoom = '1732';
  if (userId !== undefined) {
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        //Dentro de userCollection si existe el UserId como documento el entonces muestra los datos de collectionRoom de fireStore
        //Responde con el idlargo (idRtdb:) y con ese id lo usamos para entrar a una sala de la realtime roomRef(idlargo)
        if (doc.exists) {
          roomCollection
            .doc(idRoom)
            .get()
            .then((snap) => {
              const data = snap.data();
              res.json(data);
            });
        } else {
          res.status(401).json({
            message: "no existe",
          });
        }
      });
  }
});

app.post("/messages", (req, res) => {
  const idRealTime = req.body.idRealTime;
  const chatRoomRef = rtdb.ref("rooms/" + idRealTime);
  chatRoomRef.push(req.body, () => {
    res.json("Salio todo bien");
  });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log("Escuchando app en el puerto:", port);
});
