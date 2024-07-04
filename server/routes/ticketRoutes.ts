import express, { Router } from "express";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  deleteAllTicket,
} from "../controller/ticketController.ts";

const router: Router = express.Router();

// event routes
router.get("/tickets", getAllTickets);
router.post("/ticket/create/:id", createTicket);
router.put("/ticket/:id", updateTicket);
router.delete("/ticket/:id", deleteTicket);
router.get("/ticket/:id", getTicketById);
router.delete("/ticket", deleteAllTicket);

export default router;
