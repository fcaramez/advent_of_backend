import { TaskStatus, User } from '@prisma/client';
import { Context } from 'hono';
import { z } from 'zod';
import db from '../db';

const taskSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

export const createTask = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const body = await c.req.json();

    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        success: false,
        message: 'Please check the task information and try again',
        status: 400,
      });
    }

    const { title, description, dueDate } = parsed.data;

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
      message: 'Something went wrong. Please try again',
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
        message: 'Invalid request',
        status: 400,
      });
    }

    const task = await db.task.findUnique({
      where: { id: taskId, assigneeId: userId },
    });

    if (!task) {
      return c.json({
        success: false,
        message: 'Task not found',
        status: 404,
      });
    }

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
      message: 'Something went wrong. Please try again',
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

    if (!tasks.length) {
      return c.json({
        success: false,
        message: 'No tasks found',
        status: 404,
      });
    }

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
      message: 'Something went wrong. Please try again',
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
        message: 'Invalid request',
        status: 400,
      });
    }

    await db.task.updateMany({
      where: {
        id: taskId,
      },
      data: { status },
    });

    return c.json({
      success: true,
      message: 'Task status updated successfully',
      status: 200,
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Something went wrong. Please try again',
      status: 500,
    });
  }
};

export const updateTask = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const { id: taskId } = c.req.param();

    const { title, description, dueDate, status } = await c.req.json<{
      title: string;
      description: string;
      dueDate: string;
      status: TaskStatus;
    }>();

    if (!userId || !taskId) {
      return c.json({
        success: false,
        message: 'Invalid request',
        status: 400,
      });
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { title, description, dueDate, status },
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
      message: 'Something went wrong. Please try again',
      status: 500,
    });
  }
};

export const deleteTask = async (c: Context) => {
  try {
    const { id: userId }: User = c.get('user');

    const { id: taskId } = c.req.param();

    if (!userId || !taskId) {
      return c.json({
        success: false,
        message: 'Invalid request',
        status: 400,
      });
    }

    await db.task.delete({
      where: { id: taskId },
    });

    return c.json({
      success: true,
      message: 'Task deleted successfully',
      status: 200,
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Something went wrong. Please try again',
      status: 500,
    });
  }
};
