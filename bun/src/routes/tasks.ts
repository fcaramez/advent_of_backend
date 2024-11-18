import { Hono } from 'hono';
import { createTask, getTaskById, getUserTasks, updateStatus, updateTask } from '../handlers/tasks';

const app = new Hono()
  .post('/', createTask)
  .get('/', getUserTasks)
  .get('/:id', getTaskById)
  .put('/status/:id', updateStatus)
  .put('/:id', updateTask);

export default app;
