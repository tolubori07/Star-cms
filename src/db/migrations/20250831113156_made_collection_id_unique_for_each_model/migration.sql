/*
  Warnings:

  - A unique constraint covering the columns `[collectionId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Model_collectionId_key" ON "public"."Model"("collectionId");
