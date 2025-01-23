/*
  Warnings:

  - A unique constraint covering the columns `[uniqueID]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Certificate_uniqueID_key" ON "Certificate"("uniqueID");
