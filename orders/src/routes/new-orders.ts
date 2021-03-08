import express, { Request, Response } from "express";
import {
  requireAuthorizationHandler,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@cczenith/common";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import Order from "../models/order";

const router = express.Router();

// The purpose of this handler is to associate orders
// with tickets
router.post(
  "/api/orders",
  requireAuthorizationHandler,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .withMessage("Valid ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.body;
    // Find target ticket in database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that ticket is not reserved
    // There is already a reservation on the ticket
    if (await ticket.isReserved()) {
      throw new BadRequestError("Ticket already reserved");
    }

    // Calculate expiration time for the date
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() +
        parseInt(process.env.EXPIRATION_WINDOMW_SECONDS!)
    );

    // Build and persist order
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      //@ts-ignore
      expiresAt: expiration,
      ticket,
    });

    // Publish order-created event
    res.status(201).send(order);
  }
);
export { router as createOrdersRouter };
