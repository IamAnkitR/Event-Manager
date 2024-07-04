// src/models/Event.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  organizer: string;
  tickets: mongoose.Types.ObjectId[];
}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    organizer: { type: String, required: true },
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }], // Referencing Ticket IDs
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model<IEvent>("Event", EventSchema);
