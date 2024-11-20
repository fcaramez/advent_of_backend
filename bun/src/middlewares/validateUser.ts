import { Context, Next } from 'hono';
import { validateToken } from '../helpers/validateToken';
import db from '../db';
import { extractJWT } from '../helpers/extractJWT';

export const validateUser = async (c: Context, next: Next) => {
  const token = extractJWT(c);

  if (!token) {
    return c.json({
      message: 'Please log in to continue',
      status: 401,
      success: false,
    });
  }

  try {
    const isTokenValid = (await validateToken(token)) as { id: string };

    if (!isTokenValid) {
      return c.json({
        message: 'Your session has expired. Please log in again',
        status: 401,
        success: false,
      });
    }

    const user = await db.user.findFirst({
      where: {
        id: isTokenValid['id'],
      },
    });

    if (!user) {
      return c.json({
        message: 'Please log in to continue',
        status: 401,
        success: false,
      });
    }

    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({
      message: 'Please log in to continue',
      status: 401,
      success: false,
    });
  }
};
