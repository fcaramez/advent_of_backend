import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();

app.all('/ping', (c) => {
  return c.json({
    message: 'OK',
    status: 200,
    success: true,
  });
});

app.notFound((c) => {
  return c.json({
    message: 'Resource not found',
    suggestion: 'Please check the URL and try again',
    status: 404,
    success: false,
  });
});

app.onError((err, c) => {
  console.error(`Error @ ${c.req.url}:`, err);

  if (err instanceof TypeError) {
    return c.json({
      message: 'Invalid request data',
      suggestion: 'Please check your request format and try again',
      status: 400,
      success: false,
    });
  }

  if (err instanceof z.ZodError) {
    return c.json({
      message: 'Validation failed',
      errors: err.errors.map((e) => e.message),
      status: 400,
      success: false,
    });
  }

  return c.json({
    message: 'An unexpected error occurred',
    suggestion: 'Please try again later or contact support if the problem persists',
    status: 500,
    success: false,
  });
});

export default app;
