import express from "express";

import { currentUserHandler } from "../middlewares/current-user-handler";
// Returns a router object from the express library
const router = express.Router();

router.get("/api/users/currentuser", currentUserHandler, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export default router;
