import { verify } from "hono/jwt";
import env from "../env";

export const validateToken = (token: string) => {
  return verify(token, env.JWT_SECRET);
};
