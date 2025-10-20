/*
  Warnings:

  - You are about to drop the column `worklowId` on the `Connection` table. All the data in the column will be lost.
  - You are about to drop the column `worklowId` on the `Node` table. All the data in the column will be lost.
  - Added the required column `workflowId` to the `Connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NodeType" ADD VALUE 'MANUAL_TRIGGER';
ALTER TYPE "NodeType" ADD VALUE 'HTTP_REQUEST';

-- DropForeignKey
ALTER TABLE "public"."Connection" DROP CONSTRAINT "Connection_worklowId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Node" DROP CONSTRAINT "Node_worklowId_fkey";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "worklowId",
ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "worklowId",
ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
