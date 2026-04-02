import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const tokenSecret = process.env.ACCESS_TOKEN_SECRET

  if (!authHeader) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, tokenSecret as string);
    console.log("DECODED", decoded)
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(403).json({ message: "Faça login antes de tentar essa ação" });
  }
};

export interface AuthSocket extends Socket {
  user?: any;
}

export function verifySocketJWT(socket: AuthSocket, next: any) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    const tokenSecret = process.env.ACCESS_TOKEN_SECRET

    const payload = jwt.verify(token, tokenSecret as string);

    socket.user = payload; // same idea as req.user
    console.log("socket token verified")
    next();
  } catch {
    next(new Error("Invalid token"));
  }
}

