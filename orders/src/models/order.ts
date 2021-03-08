import mongoose, { Date, Mongoose } from "mongoose";
import { OrderStatus } from "@cczenith/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

/**
 * An interface that defines the properties required to
 * create a new user
 */
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: mongoose.Schema.Types.Date;
  ticket: TicketDoc;
}

/**
 * An interface that defines the model that a model has.
 * We need this to tell TypeScript that the UserModel should
 * have a static build method that accepts a UserAttrs arg
 * and returns any
 */
interface OrderModel extends mongoose.Model<any> {
  build(attrs: OrderAttrs): OrderDoc;
}

/**
 * An interface that describes the properites that a user
 * document has. We need these becasue mongodb adds
 * properties that typescript may not know about
 */
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderModel>("user", orderSchema);

export default Order;
