-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'FARMER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
