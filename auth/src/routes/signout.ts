import express from "express";

// Returns a router object from the express library
const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

export default router;
