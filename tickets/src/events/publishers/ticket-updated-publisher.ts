import { Publisher, Subjects, TicketUpdatedEvent } from "@cczenith/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
