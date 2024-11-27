import { Subjects, Publisher, PaymentCreatedEvent } from "@thantickets/common";
import { Message } from "node-nats-streaming";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}