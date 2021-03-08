import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUserHandler,
} from "@cczenith/common";
import { createTicketRouter } from "./routes/new-ticket";
import { showTicketRouter } from "./routes/show-ticket";
import { indexTicketRouter } from "./routes/index-ticket";
import { updateTicketRouter } from "./routes/update-ticket";

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.get("/api/tickets/txt", (req, res) => {
  res.status(200).send("Hit the ticket endpoint");
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
