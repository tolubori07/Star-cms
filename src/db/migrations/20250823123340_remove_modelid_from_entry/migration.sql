/*
  Warnings:

  - You are about to drop the column `modelId` on the `Entry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_modelId_fkey";

-- AlterTable
ALTER TABLE "public"."Entry" DROP COLUMN "modelId";
