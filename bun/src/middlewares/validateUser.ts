import { Context, Next } from "hono";
import { validateToken } from "../helpers/validateToken";
import db from "../db";

export const validateUser = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return c.json({
      message: "Unauthorized",
      status: 401,
      success: false,
    });
  }

  const isTokenValid = await validateToken(token);

  if (!isTokenValid) {
    return c.json({
      message: "Unauthorized",
      status: 401,
      success: false,
    });
  }

  const user = await db.user.findFirst({
    where: {
      id: isTokenValid.id as string,
    },
  });

  if (!user) {
    return c.json({
      message: "Unauthorized",
      status: 401,
      success: false,
    });
  }

  c.set("user", user);

  await next();
};
