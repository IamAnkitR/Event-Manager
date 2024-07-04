// src/models/Ticket.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  ticketNumber: string;
  price: number;
  eventId: mongoose.Types.ObjectId;
}

const TicketSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true },
    ticketNumber: { type: String, required: true },
    price: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true }, // Reference to Event
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
