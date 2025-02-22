/*
  Warnings:

  - You are about to alter the column `rating` on the `BorrowingRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,1)` to `Decimal(3,2)`.

*/
-- AlterTable
ALTER TABLE "BorrowingRecord" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,2);
