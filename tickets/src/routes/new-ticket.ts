import express, { Request, Response } from "express";
import { requireAuthorizationHandler, validateRequest } from "@cczenith/common";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { nats_Singleton } from "../nats-singleton";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuthorizationHandler,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      priority: "normal",
      depatureDate: null,
    });

    await ticket.save();

    // We are using the singleton design pattern to get the NATS
    // client, then awaiting a call to the publish method. of the
    // TicketCreatedPublisher instance.
    await new TicketCreatedPublisher(nats_Singleton.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
