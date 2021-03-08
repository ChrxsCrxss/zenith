import { Publisher, Subjects, TicketCreatedEvent } from "@cczenith/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
