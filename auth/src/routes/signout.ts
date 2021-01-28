import express from "express";

// Returns a router object from the express library
const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  res.send("Hi there. You've hit the [/api/signout] endpoint");
});

export default router;
