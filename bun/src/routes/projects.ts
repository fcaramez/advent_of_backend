import { Hono } from 'hono';
import { validateAdmin } from '../middlewares/validateAdmin';

import { createProject, getProjectById } from '../handlers/projects';

const app = new Hono()
  .get('/:id', validateAdmin, getProjectById)
  .post('/', validateAdmin, createProject);

export default app;
