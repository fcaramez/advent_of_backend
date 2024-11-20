import { User, UserRole } from '@prisma/client';
import { Context } from 'hono';
import { z } from 'zod';
import db from '../db';

const newProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const createProject = async (c: Context) => {
  try {
    const body = await c.req.json();

    const user: Omit<User, 'password'> = await c.get('user');

    const parsedBody = newProjectSchema.safeParse(body);

    if (!parsedBody.success) {
      return c.json({
        message: 'Invalid request body',
        status: 400,
        success: false,
      });
    }

    const { name, description } = parsedBody.data;

    const newProject = await db.project.create({
      data: {
        name,
        description: description || '',
        ownerId: user.id,
      },
    });

    return c.json({
      message: 'Project created successfully',
      status: 201,
      success: true,
      data: {
        newProject,
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

export const getProjectById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const user: User = c.get('user');

    if (!id) {
      return c.json({
        status: 404,
        message: 'Bad request, invalid project ID',
        success: false,
      });
    }

    const project = await db.project.findFirst({
      where: {
        AND: [
          {
            id,
          },
          {
            ownerId: user.id,
          },
        ],
      },
    });

    if (!project) {
      return c.json({
        message: 'Project not found',
        status: 400,
        success: false,
      });
    }

    return c.json({
      message: '',
      success: true,
      status: 201,
      data: {
        project,
      },
    });
  } catch (error) {
    return c.json({
      message: 'Error retrieving project.',
      success: false,
      status: 500,
    });
  }
};
