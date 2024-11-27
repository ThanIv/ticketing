import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@thantickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    //create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    //ceate and save ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    //create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: '123'
    }

    //create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all of this staff
    return {msg, data, ticket, listener};
}

it('find, updates, and save a ticket', async () => {
    const {msg, data, ticket, listener} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('ack the message', async () => {
    const {data, listener, msg} = await setup();
    
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it('it does not call the ack if the event has skipped version number',async () => {
    const {msg, data, ticket, listener} = await setup();

    data.version = 10;

    try{
        await listener.onMessage(data, msg);
    }catch(err){

    }

    expect(msg.ack).not.toHaveBeenCalled();
});