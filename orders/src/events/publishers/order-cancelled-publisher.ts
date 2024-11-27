import { Publisher, OrderCancelledEvent, Subjects } from "@thantickets/common";

export class OrderCancelledPublisher extends Publisher <OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}