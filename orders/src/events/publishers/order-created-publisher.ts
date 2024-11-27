import { Publisher,OrderCreatedEvent ,Subjects } from "@thantickets/common";

export class OrderCreatedPublisher extends Publisher <OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}