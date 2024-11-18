import { Hono } from 'hono';
import users from './routes/users';
import config from './config';
const app = new Hono({ strict: true });

app.route('/', config);
app.route('/users', users);

export default {
  fetch: app.fetch,
  port: Bun.env['PORT'],
};
