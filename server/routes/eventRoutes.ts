import express, { Router } from "express";
import {
  getAllEvents,
  createEvent,
  fetchEventWithTickets,
  updateEventWithTickets,
  deletEventwithTickets,
} from "../controller/eventController.ts";

const router: Router = express.Router();

router.get("/events", getAllEvents);
router.post("/event/create", createEvent);
router.get("/event/:eventId", fetchEventWithTickets);
router.put("/event/:eventId", updateEventWithTickets);
router.delete("/event/:eventId", deletEventwithTickets);
export default router;
