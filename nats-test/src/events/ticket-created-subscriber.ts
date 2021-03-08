import { Subscriber } from "./abstract-subscriber";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  // In Java using the final keyword would achieve the same result,
  // but we are in TypeScript, so we get the readonly keyword
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data: ", data);

    msg.ack();
  }
}
