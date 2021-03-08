import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

// stan is nats backwards, is a community convention for naming the client
const stan = nats.connect("zenith", "abc", {
  url: "http://localhost:4222",
});

// Nats is an event-driven library, so we must listen for an event and
// provide a callback. No async/await :(
stan.on("connect", async () => {
  console.log("Publisher connected to nats");

  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish({ id: "ijfsfs", title: "irjasfd", price: 43.434324 });
});
