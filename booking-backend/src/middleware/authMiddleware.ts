import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: any;
}

interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    res.status(401).json({ message: "Access Denied. Token is empty." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
