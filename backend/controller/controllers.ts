import { NextFunction, Request, Response } from "express";
import { modelUser } from "../user.model";
import { rtdb, db } from "../db";
import bcrypt from "bcrypt";
import joi from "joi";
import { decodeToken, generateToken } from "../lib/generateToken";
import { v4 as uuidv4 } from "uuid";

const userCollection = db.collection("users");
const roomCollection = db.collection("rooms");

const schemaValidator = joi.object({
  email: joi.string().required(),
  name: joi.string().required(),
  password: joi.string().min(6).required(),
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const { value, error } = schemaValidator.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const data = { ...value };
    data.password = await bcrypt.hash(data.password, 6);
    const userCreated = await modelUser.create(data);
    return res.status(201).json({
      success: true,
      message: "Usuario creado",
      userId: userCreated._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email ya existe" });
    } else {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const authToken = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await modelUser.findOne({ email }).lean();
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No hay un usuario registrado con ese email",
    });
  } else {
    const passwordHash = await bcrypt.compare(password, user.password);
    if (!passwordHash) {
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }
    const id = user._id.toString();
    const token = generateToken(id);
    return res.status(200).json({
      success: true,
      message: "Inicio de session correctamente",
      token,
    });
  }
};

///
interface AuthRequest extends Request {
  usuario?: any;
}
export const middlewareGetMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res
      .status(404)
      .json({ success: false, message: "No hay token en el header" });
  }
  const token = req.get("Authorization").split(" ")[1];
  try {
    const data = decodeToken(token);
    req.usuario = data;
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Token invalido o expirado" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const data = req.usuario;
  if (!data) {
    return res
      .status(404)
      .json({ success: false, message: "No hay data en request" });
  }
  const user = await modelUser.findById(data.userId).select("-password");
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "user no encontrado" });
  }
  return res
    .status(200)
    .json({ success: true, message: "user validado y encontrado", data: user });
};

export const generateRoom = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = await modelUser.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "usuario no encontrado, no podras generar una sala",
    });
  }
  const chatRoomRef = rtdb.ref("/chatRooms/" + uuidv4());
  chatRoomRef.set({
    from: "",
    message: "",
  });

  const idCorto = 1000 + Math.floor(Math.random() * 999);
  const roomDoc = await roomCollection.doc(idCorto.toString());
  roomDoc.set({
    idSala: chatRoomRef.key,
  });

  return res.status(201).json({
    success: true,
    id: roomDoc.id,
  });
};

export const getToRoom = async (req: Request, res: Response) => {
  const { idRoom } = req.params;
  const { userId } = req.query;
  const user = await modelUser.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "user no encontrado" });
  }
  const roomDoc = await roomCollection.doc(idRoom).get();
  if (roomDoc.exists) {
    const data = roomDoc.data();
    return res.status(200).json({
      success: true,
      idSala: data.idSala,
    });
  }
};
