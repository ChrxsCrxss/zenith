import request from "supertest";
import { app } from "../../app";

it("should return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password!!!",
    })
    .expect(201);
});

it("should return a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "deffonotavalidemail",
      password: "password!!!",
    })
    .expect(400);
});

it("should return a 400 on missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password!!!",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("should return a 400 on duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password!!!",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "oajfdkls;fsd",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password!!!",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
