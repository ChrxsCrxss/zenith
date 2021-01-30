import mongoose, { Mongoose } from "mongoose";
import PasswordManager from "../services/passwordManager";
/**
 * An interface that defines the properties required to
 * create a new user
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that defines the model that a model has.
 * We need this to tell TypeScript that the UserModel should
 * have a static build method that accepts a UserAttrs arg
 * and returns any
 */
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes the properites that a user
 * document has. We need these becasue mongodb adds
 * properties that typescript may not know about
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

/**
 * middleware function implmented in mongoose. It will execute
 * each time we save
 */
userSchema.pre("save", async function (done) {
  // Newly-created objects are considered modified. When we
  // create or otherwise modify the password, we want to hash
  // that password and set the password value to the hashed
  // password. Notice the getter and setter methods behing
  // used. The values are stored in a key-value pair.
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

// This is a customer factory that craetes users in a type safe
// way. The type checking on the attrs parameter ensures that new
// users are always created with the correct propertiers
//
// We are also adding it as a static method (class-wide) build method
//
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("user", userSchema);

export default User;
