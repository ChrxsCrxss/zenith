import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedSubscriber } from "./events/ticket-created-subscriber";
console.clear();

// stan is nats backwards, is a community convention for naming the client
const stan = nats.connect("zenith", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("subscribed to nats");

  // This is part of the graceful client shutdown
  // whenever the the connection is closed, we attempt
  // to exit the process
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedSubscriber(stan).subscribe();
});

// This is part of the graceful client shutdown
// When the process is interrupted or terminated,
// we close the connection to NATS.
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
