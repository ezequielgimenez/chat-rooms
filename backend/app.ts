import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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

const url = process.env.URL_MONGO;

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
