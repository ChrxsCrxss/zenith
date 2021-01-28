import express from "express";

// Returns a router object from the express library
const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send("Hi there. You've hit the [/api/sigin] endpoint");
});

export default router;
