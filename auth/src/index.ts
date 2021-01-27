import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.get("/api/users/test", (req, res) => {
  console.log("hit [/api/test]");
  res.send("Test successful");
});

app.get("/api/users/currentuser", (req, res) => {
  console.log("hit [/api/users/currentuser]");
  res.send("Hi there!");
});

app.listen(3000, () => {
  console.log("listening on port 3000 !!!");
});
