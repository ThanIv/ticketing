import { Subjects, Publisher, ExpirationCompleteEvent } from "@thantickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject =  Subjects.ExpirationComplete;
}