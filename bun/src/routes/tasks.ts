import { Hono } from 'hono';
import { validateUser } from '../middlewares/validateUser';
import {
  createTask,
  getTaskById,
  getUserTasks,
  updateStatus,
  updateTask,
  deleteTask,
} from '../handlers/tasks';

const app = new Hono()
  .post('/', validateUser, createTask)
  .get('/', validateUser, getUserTasks)
  .get('/:id', validateUser, getTaskById)
  .patch('/:id', validateUser, updateStatus)
  .put('/:id', validateUser, updateTask)
  .delete('/:id', validateUser, deleteTask);

export default app;
