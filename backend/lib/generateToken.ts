import jwt from "jsonwebtoken";

const secret = "123456789";

export function generateToken(id: string) {
  return jwt.sign({ userId: id }, secret);
}

export function decodeToken(token: string) {
  return jwt.verify(token, secret);
}
