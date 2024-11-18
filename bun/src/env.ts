import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
});

const parsedEnv = envSchema.safeParse({
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
});

export const formatErrors = (
  errors: z.ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value && Array.isArray(value._errors)) {
        return `${name}: ${value._errors.join(", ")}\n`;
      }
      return "";
    })
    .filter(Boolean);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(parsedEnv.error.format())
  );
  process.exit(1);
}

export const env = parsedEnv.data;

export default env;
