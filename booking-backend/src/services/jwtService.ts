// src/services/jwtService.ts

import jwt from "jsonwebtoken";
import { User } from "../models/User";

const SECRET_KEY = process.env.JWT_SECRET || "";

interface JwtPayload {
  [key: string]: any;
}

export class JwtService {
  /**
   * Generates a JWT with the provided payload and expiration time.
   * @param user - User object to generate the token for.
   * @param expiresIn - The expiration time (default is '1h').
   * @returns A signed JWT as a string.
   */
  static generateToken(user: User): string {
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return token;
  }

  /**
   * Verifies a given JWT and returns the decoded payload if valid.
   * @param token - The JWT to verify.
   * @returns The decoded payload if the token is valid, otherwise null.
   */
  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, SECRET_KEY) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
