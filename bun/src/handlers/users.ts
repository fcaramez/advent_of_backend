import { Context } from 'hono';
import db from '../db';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import env from '../env';
import { User } from '@prisma/client';

const authSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const updateSchema = z.object({
  email: z.string().email('Please provide a valid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
});

export const signupUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const parsed = authSchema.safeParse({ email, password });

    if (!parsed.success) {
      return c.json({
        message: 'Validation failed',
        errors: parsed.error.errors.map((err) => err.message),
        status: 400,
        success: false,
      });
    }

    const userToFind = await db.user.findFirst({
      where: { email },
    });

    if (userToFind) {
      return c.json({
        message: 'This email is already registered',
        status: 400,
        success: false,
      });
    }

    const hashedPassword = Bun.password.hashSync(password);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const jwt = await sign(
      {
        id: user.id,
        email: user.email,
      },
      env.JWT_SECRET
    );

    return c.json({
      message: 'User created successfully',
      status: 201,
      success: true,
      data: {
        jwt,
      },
    });
  } catch (error) {
    return c.json({
      message: 'Something went wrong. Please try again',
      status: 500,
      success: false,
    });
  }
};

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const parsed = authSchema.safeParse({ email, password });

    if (!parsed.success) {
      return c.json({
        message: 'Validation failed',
        errors: parsed.error.errors.map((err) => err.message),
        status: 400,
        success: false,
      });
    }

    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) {
      return c.json({
        message: 'Invalid email or password',
        status: 401,
        success: false,
      });
    }

    const isPasswordValid = Bun.password.verifySync(password, user.password);

    if (!isPasswordValid) {
      return c.json({
        message: 'Invalid email or password',
        status: 401,
        success: false,
      });
    }

    const jwt = await sign(
      {
        id: user.id,
        email: user.email,
      },
      env.JWT_SECRET
    );

    return c.json({
      message: `Welcome back, ${user.email}!`,
      status: 200,
      success: true,
      data: {
        jwt,
      },
    });
  } catch (error) {
    return c.json({
      message: 'Something went wrong. Please try again',
      status: 500,
      success: false,
    });
  }
};

export const getUser = async (c: Context) => {
  const user: User = c.get('user');

  return c.json({
    message: 'User fetched successfully',
    status: 200,
    success: true,
    data: {
      user,
    },
  });
};

export const updateUser = async (c: Context) => {
  try {
    const user: User = c.get('user');
    const body = await c.req.json();

    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        message: 'Validation failed',
        errors: parsed.error.errors.map((err) => err.message),
        status: 400,
        success: false,
      });
    }

    const { email: newEmail, password: newPassword } = parsed.data;

    if (newPassword && user.password) {
      const isMatch = await Bun.password.verify(newPassword, user.password);
      if (isMatch) {
        return c.json({
          message: 'New password must be different from current password',
          status: 400,
          success: false,
        });
      }
    }

    const hashedPassword = newPassword ? await Bun.password.hash(newPassword) : user.password;
    const email = newEmail || user.email;

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
        password: hashedPassword,
      },
    });

    const jwt = await sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
      },
      env.JWT_SECRET
    );

    return c.json({
      message: 'User updated successfully',
      status: 200,
      success: true,
      data: {
        jwt,
      },
    });
  } catch (error) {
    return c.json({
      message: 'Something went wrong. Please try again',
      status: 500,
      success: false,
    });
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const user: User = c.get('user');

    await db.user.delete({
      where: {
        id: user.id,
      },
    });

    return c.json({
      message: 'User deleted successfully',
      status: 200,
      success: true,
    });
  } catch (error) {
    return c.json({
      message: 'Internal server error',
      status: 500,
      success: false,
    });
  }
};
