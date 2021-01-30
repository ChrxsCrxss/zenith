import { Request, Response, NextFunction, response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

/**
 * Request validation middleware, we will insert this into every
 * routerhandler in the application
 * @param req
 * @param res
 * @param next
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This will get the request object after it has passed through
  // the validation middleware. If there were errors, they would be
  // appendd to the request object.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("there were errors associated with the request");
    throw new RequestValidationError(errors.array());
  }

  // The call to next will move the process along
  next();
};
