import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import currentUserRouter from "./routes/current-user";
import signUpRouter from "./routes/signup";
import signInRouter from "./routes/signin";
import signOutRouter from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import NotFoundError from "./errors/not-found-error";

const app = express();
app.use(json());
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  // The mongodb is avaliable via

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log("listening on port 3000 !!!");
});

start();
