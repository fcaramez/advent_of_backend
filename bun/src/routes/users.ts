import { Hono } from 'hono';
import { deleteUser, getUser, loginUser, signupUser, updateUser } from '../handlers/users';
import { validateUser } from '../middlewares/validateUser';

const app = new Hono()
  .get('/', validateUser, getUser)
  .post('/signup', signupUser)
  .post('/login', loginUser)
  .put('/', validateUser, updateUser)
  .delete('/', validateUser, deleteUser);

export default app;
