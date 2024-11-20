import { Context } from 'hono';

export const extractJWT = (c: Context) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];

  return token;
};
