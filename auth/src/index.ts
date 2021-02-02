import mongoose from "mongoose";
import { app } from ".//app";

const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt_key must be defined!");
  }
  // The mongodb is avaliable via metadata value 'name', which serves as the domain name
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
