import { Context, Next } from 'hono';
import { validateToken } from '../helpers/validateToken';
import db from '../db';

export const validateUser = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return c.json({
      message: 'Unauthorized',
      suggestion: 'Please include an Authorization header with your request',
      status: 401,
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return c.json({
      message: 'Unauthorized',
      suggestion: 'Please provide a valid Bearer token',
      status: 401,
      success: false,
    });
  }

  try {
    const isTokenValid = (await validateToken(token)) as { id: string };

    if (!isTokenValid) {
      return c.json({
        message: 'Invalid or expired token',
        suggestion: 'Please log in again or sign up for a new account',
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
        message: 'Unauthorized',
        suggestion: 'Please log in again or sign up for a new account',
        status: 401,
        success: false,
      });
    }

    c.set('user', user);
    await next();
  } catch (error) {
    console.error('Token validation error:', error);
    return c.json({
      message: 'Authentication failed',
      suggestion: 'Please try logging in again',
      status: 401,
      success: false,
    });
  }
};
