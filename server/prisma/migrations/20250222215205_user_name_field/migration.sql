/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the new name column (nullable initially)
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- Update the name column with concatenated firstName and lastName
UPDATE "User" SET "name" = "firstName" || ' ' || "lastName";

-- Make the name column required
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- Drop the old columns
ALTER TABLE "User" DROP COLUMN "firstName";
ALTER TABLE "User" DROP COLUMN "lastName";
