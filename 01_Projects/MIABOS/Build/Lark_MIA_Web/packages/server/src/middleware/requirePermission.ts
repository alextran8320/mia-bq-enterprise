import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/httpError.js";

/**
 * Guard a route by permission code(s).
 *
 * - Pass a single code → user must have it.
 * - Pass an array → user must have at least one of them (OR semantics).
 *
 * Must be used AFTER requireAuth.
 */
export function requirePermission(code: string | string[]) {
  const required = Array.isArray(code) ? code : [code];
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.permissionSet) {
      return next(new HttpError(401, "Authentication required"));
    }
    const ok = required.some((c) => req.permissionSet!.has(c));
    if (!ok) {
      return next(
        new HttpError(403, "Bạn không có quyền thực hiện thao tác này", {
          required,
        }),
      );
    }
    next();
  };
}
