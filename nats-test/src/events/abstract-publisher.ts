import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"]; // Name of the channel this publisher will push
  private client: Stan; // Pre-initialized NATS client

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    // We return a new promise. On the publish callback,
    // we reject the promise if there was an error, otherwise
    // we resolve the promise
    return new Promise((resolve, reject) => {
      const subscription = this.client.publish(
        this.subject,
        JSON.stringify(data),
        (err) => {
          if (err) {
            reject(err);
          }
          console.log("Event published on subject: ", this.subject);
          resolve();
        }
      );
    });
  }
}
