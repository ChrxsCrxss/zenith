import mongoose, { Date, Mongoose } from "mongoose";
/**
 * An interface that defines the properties required to
 * create a new user
 */
interface TicketAttrs {
  title: string;
  priority: string;
  userId: string;
  price: number;
  depatureDate: Date | null;
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
interface TicketDoc extends mongoose.Document {
  title: string;
  priority: string;
  userId: string;
  price: number;
  depatureDate: Date | null;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    depatureDate: {
      type: Date,
      required: false,
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

const Ticket = mongoose.model<TicketDoc, TicketModel>("user", ticketSchema);

export default Ticket;
