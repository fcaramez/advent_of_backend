import { Hono } from "hono";
import { loginUser, signupUser } from "../handlers/users";

const app = new Hono()
.post("/signup", signupUser)
.post("/login", loginUser);

export default app;
