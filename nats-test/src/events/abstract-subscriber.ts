import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
/**
 * An abstract class definition for a subscriber to a NATS streaming server.
 * Notice that we have parameterized the class (i.e, made it a generic) with
 * a type T that extends the Event interface defined above. This allows us
 * to tightly bind the subject and the shape of the data to the onMessage()
 * method of the class AND the subject.
 */
export abstract class Subscriber<T extends Event> {
  abstract subject: T["subject"]; // Name of the channel this subscriber will listen to
  abstract queueGroupName: string; // Name of the queue group this subscriber will join
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan; // Pre-initialized NATS client
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    // This is how we set options for NATS streaming server: we chain arguments
    // onto a call to subscriptionOptions. The option below set manual acknowledge
    // to true. This is an important settign because it allows us to process data
    // even if something goes wrong
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  subscribe() {
    // In the NATS world, you create a subscription and add an event listener to the subscription.
    // The concept is very similiar to observables inthat you can define a custom call back
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
