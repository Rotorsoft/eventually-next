/*
  Warnings:

  - You are about to drop the column `day` on the `my_hotel_sales` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "my_hotel_sales_day_ix";

-- AlterTable
ALTER TABLE "my_hotel_sales" DROP COLUMN "day";
