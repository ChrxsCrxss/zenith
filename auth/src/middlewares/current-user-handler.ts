import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// This basically tells express
// to expand the Request interface
// to accomodate a currentUser field
// that is either undefied or of type
// UserPayload
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// This middleware simply extracts the
// current user information from the session object
export const currentUserHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ! req.session?.jwt is equivalent to ! req.session || ! req.session.jwt
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.jwt_key!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    // Whether or not we err, we need to call the next function
    // We will simply leave currentUser undefined for the next
    // middleware function to handle
  }

  next();
};
