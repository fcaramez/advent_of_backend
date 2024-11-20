import { Context, Next } from 'hono';
import { extractJWT } from '../helpers/extractJWT';
import { validateToken } from '../helpers/validateToken';
import db from '../db';

export const validateAdmin = async (c: Context, next: Next) => {
  const token = extractJWT(c);

  if (!token) {
    return c.json({
      message: 'Please log in to continue',
    });
  }

  const isTokenValid = (await validateToken(token)) as { id: string };

  if (!isTokenValid) {
    return c.json({
      message: 'Unauthorized',
    });
  }

  try {
    const user = await db.user.findFirst({
      where: {
        id: isTokenValid.id,
      },
      select: {
        role: true,
        id: true,
        email: true,
        password: false,
      },
    });

    if (!user) {
      return c.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }

    if (user?.role !== 'admin') {
      return c.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }

    c.set('user', user);
    c.set('role', user?.role);

    await next();
  } catch (error) {
    return c.json({
      message: 'Internal server error',
      status: 500,
      success: false,
    });
  }
};
