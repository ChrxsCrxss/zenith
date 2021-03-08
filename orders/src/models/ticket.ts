import { OrderStatus } from "@cczenith/common";
import mongoose, { Date, Mongoose } from "mongoose";
import Order from "./order";
/**
 * An interface that defines the properties required to
 * create a new user
 */
interface TicketAttrs {
  title: string;
  price: number;
}

/**
 * An interface that defines the model that a model has.
 * We need this to tell TypeScript that the UserModel should
 * have a static build method that accepts a UserAttrs arg
 * and returns any
 */
interface TicketModel extends mongoose.Model<any> {
  build(attrs: TicketAttrs): TicketDoc;
}

/**
 * An interface that describes the properites that a user
 * document has. We need these becasue mongodb adds
 * properties that typescript may not know about
 */
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
    },
  },
  {
    /**
     * This is really an antipattern. This code determines how information is
     * displayed to the user, but this should be handled by the view
     */
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// This is a customer factory that craetes users in a type safe
// way. The type checking on the attrs parameter ensures that new
// users are always created with the correct propertiers
//
// We are also adding it as a static method (class-wide) build method
//
ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

ticketSchema.methods.isReserved = async function () {
  // this == the ticket document we just called isReserved() on

  // Make sure that ticket is not reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ],
    },
  });

  return existingOrder ? true : false;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("user", ticketSchema);

export default Ticket;
