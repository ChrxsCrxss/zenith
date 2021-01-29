import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import BadRequestError from "../errors/bad-request-error";
import User from "../models/user";
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
  async (req: Request, res: Response) => {
    // This will get the request object after it has passed through
    // the validation middleware. If there were errors, they would be
    // appendd to the request object.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("there were errors associated with the request");
      throw new RequestValidationError(errors.array());
    }

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

    res.status(200).send(user);
  }
);

export default router;
