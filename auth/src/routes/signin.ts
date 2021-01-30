import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import BadRequestError from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";

import User from "../models/user";
import PasswordManager from "../services/passwordManager";
// Returns a router object from the express library
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Must suppy a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      return new BadRequestError("Invalid credentials");
    }

    // Generate JSON web token (jwt) and store it on the session object
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.jwt_key!
    );

    // Store new jwt on session,we are defining the session object because we
    // are using typescript
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUser);
  }
);

export default router;
