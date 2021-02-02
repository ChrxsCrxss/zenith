import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import currentUserRouter from "./routes/current-user";
import signUpRouter from "./routes/signup";
import signInRouter from "./routes/signin";
import signOutRouter from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import NotFoundError from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // alert express to the fact that it's behind a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // cookie won't be encrypted
    secure: process.env.NODE_ENV !== "test", // must connect over https connection
  })
);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };

/**
 * Notice that we are seperating the configuration logic (written here)
 * from the initialization logic (written in index.ts). This allows
 * faciliates testing of the application
 */
