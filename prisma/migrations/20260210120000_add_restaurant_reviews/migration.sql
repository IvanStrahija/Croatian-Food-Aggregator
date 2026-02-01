-- Add optional restaurant reviews
ALTER TABLE "reviews" ADD COLUMN "restaurantId" TEXT;
ALTER TABLE "reviews" ALTER COLUMN "dishId" DROP NOT NULL;

CREATE UNIQUE INDEX "reviews_userId_restaurantId_key" ON "reviews"("userId", "restaurantId");
CREATE INDEX "reviews_restaurantId_idx" ON "reviews"("restaurantId");

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
