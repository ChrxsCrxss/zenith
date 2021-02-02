import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
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

global.signup = async () => {
  const email = "test@test.com";
  const password = "password123";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: email,
      password: password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
