-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."FieldType" ADD VALUE 'Colour';
ALTER TYPE "public"."FieldType" ADD VALUE 'File';
ALTER TYPE "public"."FieldType" ADD VALUE 'Radio';
ALTER TYPE "public"."FieldType" ADD VALUE 'Select';
ALTER TYPE "public"."FieldType" ADD VALUE 'Range';
ALTER TYPE "public"."FieldType" ADD VALUE 'Telephone';
ALTER TYPE "public"."FieldType" ADD VALUE 'Time';
