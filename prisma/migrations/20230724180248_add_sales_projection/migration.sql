-- CreateTable
CREATE TABLE "my_hotel_sales" (
    "id" VARCHAR(100) NOT NULL,
    "day" VARCHAR(10),
    "total" DECIMAL(65,30) NOT NULL,
    "__watermark" BIGINT NOT NULL,

    CONSTRAINT "my_hotel_sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "my_hotel_sales_day_ix" ON "my_hotel_sales"("day");
