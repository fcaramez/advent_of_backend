import { TaskStatus, User } from '@prisma/client';
import { Context } from 'hono';
import { z } from 'zod';
import db from '../db';

const taskSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

export const createTask = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const { title, description, dueDate } = await c.req.json();

    const parsed = taskSchema.safeParse({ title, description });

    if (!parsed.success) {
      return c.json({
        success: false,
        message: 'Invalid task data',
        status: 400,
      });
    }

    const newTask = await db.task.create({
      data: {
        title,
        description: description || '',
        assigneeId: userId,
        dueDate: dueDate || '',
      },
    });

    return c.json({
      success: true,
      message: 'Task created successfully',
      status: 201,
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to create task',
      suggestion: 'Please try again later or contact support if the problem persists',
      status: 500,
    });
  }
};

export const getTaskById = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const { id: taskId } = c.req.param();

    if (!userId || !taskId) {
      return c.json({
        success: false,
        message: 'Invalid query',
        status: 400,
      });
    }

    const task = await db.task.findUnique({
      where: { id: taskId, assigneeId: userId },
    });

    return c.json({
      success: true,
      message: 'Task fetched successfully',
      status: 200,
      data: {
        task,
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get task',
      suggestion: 'Please try again later or contact support if the problem persists',
      status: 500,
    });
  }
};

export const getUserTasks = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const tasks = await db.task.findMany({
      where: { assigneeId: userId },
    });

    return c.json({
      success: true,
      message: 'Tasks fetched successfully',
      status: 200,
      data: {
        tasks,
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get tasks',
      suggestion: 'Please try again later or contact support if the problem persists',
      status: 500,
    });
  }
};

export const updateStatus = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const { id: taskId } = c.req.param();

    const { status } = await c.req.json<{ status: TaskStatus }>();

    if (!userId || !taskId) {
      return c.json({
        success: false,
        message: 'Invalid query',
        status: 400,
      });
    }

    const updatedTask = await db.task.update({
      where: { id: taskId, assigneeId: userId },
      data: { status },
    });

    return c.json({
      success: true,
      message: 'Task status updated successfully',
      status: 200,
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to update task status',
      suggestion: 'Please try again later or contact support if the problem persists',
      status: 500,
    });
  }
};

export const updateTask = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const { id: taskId } = c.req.param();

    const { title, description, dueDate } = await c.req.json();

    if (!userId || !taskId) {
      return c.json({
        success: false,
        message: 'Invalid query',
        status: 400,
      });
    }

    const updatedTask = await db.task.update({
      where: { id: taskId, assigneeId: userId },
      data: { title, description, dueDate },
    });

    return c.json({
      success: true,
      message: 'Task updated successfully',
      status: 200,
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to update task',
      suggestion: 'Please try again later or contact support if the problem persists',
      status: 500,
    });
  }
};
