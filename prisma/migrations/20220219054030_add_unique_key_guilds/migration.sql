/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");
