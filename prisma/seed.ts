import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { z } from 'zod';

const prisma = new PrismaClient();
async function main() {
  const envSchema = z.object({
    FIRST_NAME: z.string().min(1, 'First name is required'),
    LAST_NAME: z.string().min(1, 'Last name is required'),
    EMAIL: z.string().email('Invalid email format'),
    PASSWORD: z.string().min(6, 'Password must be at least 6 characters'),
    PHONE_NUMBER: z.string(),
  });

  const env = {
    FIRST_NAME: process.env.SUPER_ADMIN_FIRST_NAME,
    LAST_NAME: process.env.SUPER_ADMIN_LAST_NAME,
    EMAIL: process.env.SUPER_ADMIN_EMAIL,
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    PHONE_NUMBER: process.env.SUPER_ADMIN_PHONE_NUMBER,
  };

    const parsedEnv = envSchema.safeParse(env);
    console.log('Parsed environment variables:', parsedEnv);

  if (!parsedEnv.success) {
    console.error('Environment variable validation failed:', parsedEnv.error.format());
    process.exit(1);
  }
  const existing = await prisma.user.findUnique({
    where: { phoneNumber: parsedEnv.data.PHONE_NUMBER },
  });

  if (existing) {
    console.log('Super admin already exists.');
    return;
  }

  const superAdmin = await prisma.user.create({
    data: {
      firstName: parsedEnv.data.FIRST_NAME,
      lastName: parsedEnv.data.LAST_NAME,
      email: parsedEnv.data.EMAIL || '',
      password: await hash(parsedEnv.data.PASSWORD),
      phoneNumber: parsedEnv.data.PHONE_NUMBER || '',
    },
  });
  console.log('Super admin created:', superAdmin);
  await prisma.$disconnect();
}

main()
  .then(() => {
    console.log('Seeding completed successfully.');
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });
