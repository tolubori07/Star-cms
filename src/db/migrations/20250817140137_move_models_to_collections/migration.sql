/*
  Warnings:

  - You are about to drop the column `projectId` on the `Model` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_projectId_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "projectId",
ADD COLUMN     "collectionId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
