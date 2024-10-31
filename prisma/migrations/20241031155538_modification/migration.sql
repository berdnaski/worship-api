/*
  Warnings:

  - A unique constraint covering the columns `[userId,scheduleId]` on the table `schedule_participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "schedule_participants_userId_scheduleId_key" ON "schedule_participants"("userId", "scheduleId");
