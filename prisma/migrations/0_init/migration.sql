-- CreateTable
CREATE TABLE "my_hotel" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "data" JSON,
    "stream" VARCHAR(100) NOT NULL,
    "version" INTEGER NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" VARCHAR(100),
    "metadata" JSON,

    CONSTRAINT "my_hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "my_hotel_rooms" (
    "id" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20),
    "number" INTEGER,
    "price" INTEGER,
    "booked" JSON,
    "__watermark" BIGINT NOT NULL,

    CONSTRAINT "my_hotel_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "my_hotel_subscriptions" (
    "consumer" VARCHAR(100) NOT NULL,
    "watermark" BIGINT NOT NULL,
    "lease" VARCHAR(100),
    "expires" TIMESTAMPTZ(6),

    CONSTRAINT "my_hotel_subscriptions_pkey" PRIMARY KEY ("consumer")
);

-- CreateIndex
CREATE INDEX "my_hotel_actor_ix" ON "my_hotel"("actor");

-- CreateIndex
CREATE INDEX "my_hotel_created_id_ix" ON "my_hotel"("created", "id");

-- CreateIndex
CREATE INDEX "my_hotel_name_ix" ON "my_hotel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "my_hotel_stream_ix" ON "my_hotel"("stream", "version");

-- CreateIndex
CREATE INDEX "my_hotel_rooms_type_ix" ON "my_hotel_rooms"("type");

