import { Hono } from 'hono';
import users from './routes/users';
import tasks from './routes/tasks';
import projects from './routes/projects';
import config from './config';

const app = new Hono({ strict: true });

app.route('/', config);
app.route('/users', users);
app.route('/tasks', tasks);
app.route('/projects', projects);

export default {
  fetch: app.fetch,
  port: Bun.env['PORT'],
};
