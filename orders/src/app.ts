import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUserHandler,
} from "@cczenith/common";
import { createOrdersRouter } from "./routes/new-orders";
import { showOrdersRouter } from "./routes/show-orders";
import { indexOrdersRouter } from "./routes/index-orders";
import { deleteOrdersRouter } from "./routes/delete-orders";

const app = express();
app.set("trust proxy", true); // alert express to the fact that it's behind a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // cookie won't be encrypted
    secure: process.env.NODE_ENV !== "test", // must connect over https connection
  })
);

// authentication middleware
app.use(currentUserHandler);

app.use(createOrdersRouter);
app.use(showOrdersRouter);
app.use(indexOrdersRouter);
app.use(deleteOrdersRouter);
app.get("/api/Orderss/txt", (req, res) => {
  res.status(200).send("Hit the Orders endpoint");
});
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
