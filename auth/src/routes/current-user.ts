import express from "express";

// Returns a router object from the express library
const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  res.send("Hi there. You've hit the [/api/user/currentuser] endpoint");
});

export default router;
