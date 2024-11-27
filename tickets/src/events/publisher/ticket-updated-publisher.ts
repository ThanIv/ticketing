import { Stan } from 'node-nats-streaming';
import { Publisher, Subjects, TicketUpdatedEvent } from "@thantickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
    
}