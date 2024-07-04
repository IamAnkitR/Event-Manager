import { Request, Response } from "express";
import { Ticket } from "../models/Ticket";
import { Event } from "../models/Event";

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find();
    if (!events) {
      return res.status(200).json({ message: "No events found", events: [] });
    }
    return res.status(200).json(events);
  } catch (error: any) {
    console.error("Error fetching events :: ", error.stack || error.message);
    return res.status(500).send("Error fetching events");
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, organizer } = req.body;
    if (!name || !description || !startDate || !endDate || !organizer) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const event = new Event({
      name,
      description,
      startDate,
      endDate,
      organizer,
      tickets: [],
    });
    await event.save();

    return res.status(201).json(event);
  } catch (error: any) {
    console.log(
      "Error creating event :: ",
      error?.stack ? error.stack : error?.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchEventWithTickets = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("tickets");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error: any) {
    console.error("Error fetching event :: ", error.stack || error.message);
    return res.status(500).send("Error fetching event");
  }
};

export const updateEventWithTickets = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { _id, name, description, startDate, endDate, organizer, tickets } =
      req.body;
    //save tickets to tickets collection
    const savedTickets: any[] = [];
    for (const ticket of tickets) {
      const newTicket = new Ticket({
        ...ticket,
      });
      await newTicket.save();
      savedTickets.push(newTicket._id);
    }
    const eventTemp: any = await Event.findById(eventId);
    const allTickets = [...eventTemp?.tickets, ...savedTickets];
    // update event with tickets
    await Event.findByIdAndUpdate(
      eventId,
      {
        _id,
        name,
        description,
        startDate,
        endDate,
        organizer,
        tickets: allTickets,
      },
      { new: true }
    ).populate("tickets");

    const event = await Event.findById(eventId).populate("tickets");

    return res
      .status(200)
      .json(event ? event : { message: "Event  not found" });
  } catch (error: any) {
    console.error("Error updating event:", error.stack || error.message);
    return res.status(500).send("Error updating event");
  }
};

export const deletEventwithTickets = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await Event.findByIdAndDelete(eventId);
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting event :: ", error.stack || error.message);
    return res.status(500).send("Error deleting event");
  }
};
