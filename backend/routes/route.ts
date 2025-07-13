import { Router } from "express";
import {
  authToken,
  createUser,
  generateRoom,
  getMe,
  getToRoom,
  middlewareGetMe,
} from "../controller/controllers";

export const routes = Router();

routes.post("/users", createUser);
routes.post("/users/auth", authToken);
routes.get("/users", middlewareGetMe, getMe);
routes.post("/rooms/", generateRoom);
routes.get("/rooms/:idRoom", getToRoom);
