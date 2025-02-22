/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the new columns (nullable initially)
ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT;

-- Split name into firstName and lastName
UPDATE "User" 
SET 
  "firstName" = SPLIT_PART("name", ' ', 1),
  "lastName" = SUBSTRING("name" FROM POSITION(' ' IN "name") + 1);

-- Make the columns required
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;

-- Drop the name column
ALTER TABLE "User" DROP COLUMN "name";
