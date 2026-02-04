-- Add osmId and openingHours to restaurants
ALTER TABLE "restaurants" ADD COLUMN "osmId" TEXT;
ALTER TABLE "restaurants" ADD COLUMN "openingHours" TEXT;

-- Backfill osmId for existing rows using the existing id to satisfy uniqueness.
UPDATE "restaurants"
SET "osmId" = "id"
WHERE "osmId" IS NULL;

-- Enforce constraints
ALTER TABLE "restaurants" ALTER COLUMN "osmId" SET NOT NULL;
CREATE UNIQUE INDEX "restaurants_osmId_key" ON "restaurants"("osmId");
