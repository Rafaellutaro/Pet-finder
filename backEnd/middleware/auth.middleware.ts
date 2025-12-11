import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const tokenSecret = process.env.ACCESS_TOKEN_SECRET

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, tokenSecret as string);
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
