import type { Request, Response, NextFunction } from "express";
import {
  loadAuthedUser,
  verifyToken,
  type AuthedUser,
} from "../services/authService.js";
import { HttpError } from "../lib/httpError.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser;
      permissionSet?: Set<string>;
    }
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.header("authorization") ?? req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing bearer token");
    }
    const token = header.slice("Bearer ".length).trim();
    const { userId } = verifyToken(token);
    const user = await loadAuthedUser(userId);
    req.user = user;
    req.permissionSet = new Set(user.permissions);
    next();
  } catch (err) {
    next(err);
  }
}
