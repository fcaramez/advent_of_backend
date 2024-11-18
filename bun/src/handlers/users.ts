import { Context } from "hono";
import db from "../db";
import { sign } from "hono/jwt";
import { z } from "zod";
import env from "../env";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const { success: validBody } = authSchema.safeParse({ email, password });

    if (!validBody) {
      return c.json({
        message: "All fields are required",
        status: 400,
        success: false,
      });
    }

    const userToFind = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (userToFind) {
      return c.json({
        message: `User with email ${email} already exists`,
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
      message: "User created successfully",
      status: 201,
      success: true,
      data: {
        jwt,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return c.json({
      message: "Internal server error",
      status: 500,
      success: false,
      error: errorMessage,
    });
  }
};

export const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const { success: validBody } = authSchema.safeParse({ email, password });

    if (!validBody) {
      return c.json({
        message: "All fields are required",
        status: 400,
        success: false,
      });
    }

    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return c.json({
        message: `User with email ${email} does not exist`,
        status: 400,
        success: false,
      });
    }

    const isPasswordValid = Bun.password.verifySync(password, user.password);

    if (!isPasswordValid) {
      return c.json({
        message: "Invalid password",
        status: 400,
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
      message: "User logged in successfully",
      status: 200,
      success: true,
      data: {
        jwt,
      },
    });
  } catch (error) {
    return c.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
