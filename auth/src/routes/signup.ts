import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import BadRequestError from "../errors/bad-request-error";
import User from "../models/user";
import { validateRequest } from "../middlewares/validate-request";

// Returns a router object from the express library
const router = express.Router();

// The array is middleware. express-validator allows us to check the response
// body (among other things).
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Destructuring
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // Create the new user
    const user = User.build({ email, password });
    // Persist the new user
    await user.save();

    // Generate JSON web token (jwt) and store it on the session object
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.jwt_key!
    );

    // Store new jwt on session,we are defining the session object because we
    // are using typescript
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export default router;
