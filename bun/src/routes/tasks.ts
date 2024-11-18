import { Hono } from 'hono';
import { validateUser } from '../middlewares/validateUser';
import { createTask, getTaskById, getUserTasks, updateStatus, updateTask } from '../handlers/tasks';

const app = new Hono()
  .post('/', validateUser, createTask)
  .get('/', validateUser, getUserTasks)
  .get('/:id', validateUser, getTaskById)
  .put('/status/:id', validateUser, updateStatus)
  .put('/:id', validateUser, updateTask);

export default app;
