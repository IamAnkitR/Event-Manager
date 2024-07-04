import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { Event } from "../models/event";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { id: eventId } = req.params;
    const { ticketNumber, price } = req.body;

    if (!eventId || !ticketNumber || !price) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (isNaN(ticketNumber) || isNaN(price)) {
      return res
        .status(400)
        .json({ message: "Ticket number and price must be a number" });
    }

    const event: any = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticket = await Ticket.create({
      ticketNumber,
      price,
      eventId,
    });

    await ticket.save();

    // Update the event's tickets array
    event.tickets.push(ticket._id);
    await event.save();

    return res.status(201).json(ticket);
  } catch (error: any) {
    console.log(
      "Error creating ticket :: ",
      error?.stack ? error.stack : error?.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find();
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    return res.status(200).json(tickets);
  } catch (error: any) {
    console.error("Error fetching ticket :: ", error.stack || error.message);
    return res.status(500).send("Error fetching ticket");
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json(ticket);
  } catch (error: any) {
    console.error("Error fetching ticket :: ", error.stack || error.message);
    return res.status(500).send("Error fetching ticket");
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json(ticket);
  } catch (error: any) {
    console.log(
      "Error updating event :: ",
      error?.stack ? error.stack : error?.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error: any) {
    console.log(
      "Error deleting ticket :: ",
      error?.stack ? error.stack : error?.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAllTicket = async (_req: Request, res: Response) => {
  try {
    await Ticket.deleteMany({});
    return res
      .status(200)
      .json({ message: "All tickets deleted successfully" });
  } catch (error: any) {
    console.error(
      "Error deleting all tickets :: ",
      error.stack || error.message
    );
    return res.status(500).send("Error deleting all tickets");
  }
};
