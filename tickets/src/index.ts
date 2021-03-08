import mongoose from "mongoose";
import { app } from "./app";
import { nats_Singleton } from "./nats-singleton";

const start = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt_key must be defined!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!");
  }
  try {
    await nats_Singleton.connect(
      process.env.CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_SRV_URL!
    );

    // This is part of the graceful client shutdown
    // whenever the the connection is closed, we attempt
    // to exit the process
    nats_Singleton.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    // This is part of the graceful client shutdown
    // When the process is interrupted or terminated,
    // we close the connection to NATS.
    process.on("SIGINT", () => nats_Singleton.client.close());
    process.on("SIGTERM", () => nats_Singleton.client.close());

    // The mongodb is avaliable via metadata value 'name', which serves as the domain name
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
