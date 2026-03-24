-- AlterEnum
ALTER TYPE "FieldType" ADD VALUE 'Reference';

-- AlterTable
ALTER TABLE "FieldDefinition" ADD COLUMN     "multiple" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "referenceCollectionId" UUID;

-- AddForeignKey
ALTER TABLE "FieldDefinition" ADD CONSTRAINT "FieldDefinition_referenceCollectionId_fkey" FOREIGN KEY ("referenceCollectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
