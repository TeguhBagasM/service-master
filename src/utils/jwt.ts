import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenPayload {
  userId: number;
  roleId: number | null;
  roleName: string | null;
  type: "access" | "refresh";
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
