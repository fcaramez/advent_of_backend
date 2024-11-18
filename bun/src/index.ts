import { Hono } from "hono";
import users from "./routes/users";

const app = new Hono({ strict: true });

app.all("/ping", (c) => {
  return c.json({
    message: "OK",
    status: 200,
    success: true,
  });
});

app.notFound((c) => {
  return c.json({
    message: "Not Found",
    status: 404,
    success: false,
  });
});

app.onError((err, c) => {
  console.log(`Error @ ${c.req.url}:`, err);
  return c.json({
    message: err.message,
    status: 500,
    success: false,
  });
});

app.route("/users", users);

export default {
  fetch: app.fetch,
  port: Bun.env.PORT,
};
