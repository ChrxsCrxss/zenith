import { Request, Response, NextFunction } from "express";
import NotAuthorizedError from "../errors/not-authorized-error";

// This middleware is assumed to be called AFTER currentUserHandler,
// where the currentUser property may be set
export const requireAuthorizationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
