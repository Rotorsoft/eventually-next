/*
  Warnings:

  - You are about to drop the column `total` on the `my_hotel_sales` table. All the data in the column will be lost.
  - Added the required column `totals` to the `my_hotel_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "my_hotel_sales" DROP COLUMN "total",
ADD COLUMN     "totals" JSON NOT NULL;
