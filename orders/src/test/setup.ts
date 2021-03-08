import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

// Create in-memory database and connect via mongoose
// before running testing suite
let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.jwt_key = "abcd";
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// How we configure a global mock object
jest.mock("../nats-singleton");

// Empty all collections before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    // Call to delateMany() without criteria truncates collection
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});

global.signin = () => {
  // Build JWT payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create JWT!
  const token = jwt.sign(payload, process.env.jwt_key!);

  // Build Session Object.
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Encode as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Stringify cookie
  return [`express:sess=${base64}`];
};
