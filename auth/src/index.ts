import mongoose from "mongoose";
import { app } from ".//app";

const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt_key must be defined!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!");
  }
  // The mongodb is avaliable via metadata value 'name', which serves as the domain name
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
